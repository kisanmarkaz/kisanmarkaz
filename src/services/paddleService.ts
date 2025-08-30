import { supabase } from '@/integrations/supabase/client';
import { PADDLE_CONFIG, getFeaturedPrice, calculateFeaturedEndDate, type FeaturedDuration } from '@/constants/featuredListing';

export interface PaymentData {
  listingId: string;
  userId: string;
  duration: FeaturedDuration;
  userEmail: string;
  listingTitle: string;
}

export interface CheckoutOptions {
  customData?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
}

class PaddleService {
  // Paddle price IDs from your dashboard
  private readonly PRICE_IDS = {
    day: 'pri_01k3keg923y3tjdt9qssz5ych6',
    week: 'pri_01k3kegtft7zw2wpfdr6spaxzs', 
    month: 'pri_01k3keh61xp92zf8brym62a09k'
  };

  async createFeaturedListingCheckout(
    paymentData: PaymentData,
    options: CheckoutOptions = {}
  ): Promise<{ checkoutUrl: string; paymentId: string }> {
    const price = getFeaturedPrice(paymentData.duration);
    const endDate = calculateFeaturedEndDate(paymentData.duration);

    // First create a payment record in our database
    const paymentRecord = await this.createPaymentRecord(paymentData, price);

    try {
      const priceId = this.getPriceIdForDuration(paymentData.duration);
      console.log('Creating checkout with price ID:', priceId);
      console.log('Payment data:', paymentData);
      
      // Call Supabase Edge Function to create Paddle checkout
      const { data, error } = await supabase.functions.invoke('create-paddle-checkout', {
        body: {
          priceId: priceId,
          customerEmail: paymentData.userEmail,
          customData: {
            listingId: paymentData.listingId,
            userId: paymentData.userId,
            duration: paymentData.duration,
            paymentId: paymentRecord.id,
            listingTitle: paymentData.listingTitle,
            featuredUntil: endDate.toISOString(),
            ...options.customData,
          },
          successUrl: options.successUrl || `${window.location.origin}/payment/success?listing_id=${paymentData.listingId}&payment_id=${paymentRecord.id}`,
          cancelUrl: options.cancelUrl || `${window.location.origin}/payment/cancelled?listing_id=${paymentData.listingId}&payment_id=${paymentRecord.id}`,
        },
      });

      if (error) {
        console.error('Error creating checkout:', error);
        throw new Error('Failed to create checkout session');
      }

      console.log('Checkout created successfully:', data);
      
      // Update payment record with checkout ID
      await supabase
        .from('payments')
        .update({ paddle_checkout_id: data.checkoutId })
        .eq('id', paymentRecord.id);
      
      return {
        checkoutUrl: data.checkoutUrl,
        paymentId: paymentRecord.id
      };
    } catch (error) {
      console.error('Failed to create checkout:', error);
      // If checkout creation fails, mark payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentRecord.id);

      throw error;
    }
  }

  private async createPaymentRecord(paymentData: PaymentData, amount: number) {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: paymentData.userId,
        listing_id: paymentData.listingId,
        amount: amount,
        currency: 'USD',
        status: 'pending',
        metadata: {
          duration: paymentData.duration,
          listingTitle: paymentData.listingTitle,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create payment record:', error);
      throw new Error('Failed to create payment record');
    }

    return payment;
  }

  private getPriceIdForDuration(duration: FeaturedDuration): string {
    const priceId = this.PRICE_IDS[duration];
    console.log(`Getting price ID for duration '${duration}':`, priceId);
    return priceId;
  }


  async createFeaturedListingRecord(
    listingId: string,
    userId: string,
    duration: FeaturedDuration,
    transactionId: string
  ): Promise<void> {
    const startDate = new Date();
    const endDate = calculateFeaturedEndDate(duration, startDate);
    const price = getFeaturedPrice(duration);

    const { error } = await supabase.from('featured_listings').insert({
      listing_id: listingId,
      user_id: userId,
      featured_from: startDate.toISOString(),
      featured_until: endDate.toISOString(),
      duration_type: duration,
      price: price,
      status: 'active',
      paddle_transaction_id: transactionId,
    });

    if (error) {
      console.error('Failed to create featured listing record:', error);
      throw new Error('Failed to create featured listing record');
    }
  }

  async updatePaymentStatus(
    transactionId: string,
    status: 'completed' | 'failed' | 'cancelled'
  ): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({
        paddle_transaction_id: transactionId,
        status: status,
      })
      .eq('paddle_transaction_id', transactionId);

    if (error) {
      console.error('Failed to update payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  async handlePaymentSuccess(transactionId: string, customData: any): Promise<void> {
    try {
      // Update payment status
      await this.updatePaymentStatus(transactionId, 'completed');

      // Create featured listing record
      await this.createFeaturedListingRecord(
        customData.listingId,
        customData.userId,
        customData.duration,
        transactionId
      );

      console.log('Payment success handled successfully');
    } catch (error) {
      console.error('Failed to handle payment success:', error);
      throw error;
    }
  }

  async handlePaymentFailure(transactionId: string): Promise<void> {
    try {
      await this.updatePaymentStatus(transactionId, 'failed');
      console.log('Payment failure handled successfully');
    } catch (error) {
      console.error('Failed to handle payment failure:', error);
      throw error;
    }
  }

  async getFeaturedListings(userId: string) {
    const { data, error } = await supabase
      .from('featured_listings')
      .select(`
        *,
        listings (
          id,
          title,
          price,
          images
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch featured listings:', error);
      throw new Error('Failed to fetch featured listings');
    }

    return data;
  }

  async getPaymentHistory(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch payment history:', error);
      throw new Error('Failed to fetch payment history');
    }

    return data;
  }

  // Test method that doesn't create database records
  async testCheckoutConfiguration(): Promise<string> {
    // Test price ID availability
    const priceId = this.getPriceIdForDuration('day');
    if (!priceId) {
      throw new Error('Price IDs not configured properly');
    }

    console.log('Price IDs configured correctly:', this.PRICE_IDS);
    return 'Configuration test passed';
  }

  // Method to redirect to Paddle checkout
  redirectToCheckout(checkoutUrl: string): void {
    window.location.href = checkoutUrl;
  }
}

export const paddleService = new PaddleService();
