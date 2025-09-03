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
    day:
      (import.meta as any)?.env?.VITE_PADDLE_PRICE_ID_DAY ||
      'pri_01k3keg923y3tjdt9qssz5ych6',
    week:
      (import.meta as any)?.env?.VITE_PADDLE_PRICE_ID_WEEK ||
      'pri_01k3kegtft7zw2wpfdr6spaxzs',
    month:
      (import.meta as any)?.env?.VITE_PADDLE_PRICE_ID_MONTH ||
      'pri_01k3keh61xp92zf8brym62a09k'
  };

  private isValidUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  async createFeaturedListingCheckout(
    paymentData: PaymentData,
    options: CheckoutOptions = {}
  ): Promise<{ checkoutUrl: string; paymentId: string }> {
    console.log('🔄 Starting featured listing checkout creation...', paymentData);
    
    const price = getFeaturedPrice(paymentData.duration);
    const endDate = calculateFeaturedEndDate(paymentData.duration);

    // First create a payment record in our database
    console.log('📝 Creating payment record...');
    const paymentRecord = await this.createPaymentRecord(paymentData, price);
    console.log('✅ Payment record created:', paymentRecord.id);

    try {
      const priceId = this.getPriceIdForDuration(paymentData.duration);
      console.log('💰 Using price ID:', priceId);
      console.log('📧 Customer email:', paymentData.userEmail);
      
      // Call Supabase Edge Function to create Paddle checkout
      console.log('🚀 Calling create-paddle-checkout Edge Function...');
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

      console.log('📡 Edge Function response:', { data, error });

      if (error) {
        console.error('❌ Edge Function error:', error);
        throw new Error(`Edge Function error: ${error.message}`);
      }

      if (!data || !data.checkoutUrl) {
        console.error('❌ Invalid response from Edge Function:', data);
        throw new Error('Invalid response from checkout service');
      }

      console.log('✅ Checkout created successfully:', data.checkoutUrl);
      
      // Update payment record with checkout ID
      if (data.checkoutId) {
        await supabase
          .from('payments')
          .update({ paddle_checkout_id: data.checkoutId })
          .eq('id', paymentRecord.id);
        console.log('✅ Payment record updated with checkout ID');
      }
      
      return {
        checkoutUrl: data.checkoutUrl,
        paymentId: paymentRecord.id
      };
    } catch (error) {
      console.error('❌ Failed to create checkout:', error);
      // If checkout creation fails, mark payment as failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('id', paymentRecord.id);

      throw error;
    }
  }

  private async createPaymentRecord(paymentData: PaymentData, amount: number) {
    const listingIdValue = this.isValidUuid(paymentData.listingId) ? paymentData.listingId : null;
    if (!listingIdValue) {
      console.warn('createPaymentRecord: Provided listingId is not a valid UUID. Storing as NULL.', paymentData.listingId);
    }
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: paymentData.userId,
        listing_id: listingIdValue,
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
      console.error('Failed to create payment record:', {
        message: error.message,
        details: (error as any)?.details,
        hint: (error as any)?.hint,
        code: (error as any)?.code,
      });
      const enrichedMessage = `Failed to create payment record: ${error.message || 'unknown error'}`;
      throw new Error(enrichedMessage);
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

  async updatePaymentStatusById(
    paymentId: string,
    transactionId: string,
    status: 'completed' | 'failed' | 'cancelled'
  ): Promise<void> {
    const { error } = await supabase
      .from('payments')
      .update({
        paddle_transaction_id: transactionId,
        status: status,
      })
      .eq('id', paymentId);

    if (error) {
      console.error('Failed to update payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  async handlePaymentSuccess(transactionId: string, customData: any): Promise<void> {
    try {
      // Update payment status using the known payment ID from custom data
      if (!customData?.paymentId) {
        throw new Error('Missing paymentId in customData');
      }
      await this.updatePaymentStatusById(customData.paymentId, transactionId, 'completed');

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
