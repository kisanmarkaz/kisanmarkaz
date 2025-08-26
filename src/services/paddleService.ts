import { initializePaddle, Paddle } from '@paddle/paddle-js';
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
  private paddle: Paddle | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized && this.paddle) {
      return;
    }

    try {
      if (!PADDLE_CONFIG.clientSideToken) {
        throw new Error('Paddle client side token is not configured');
      }

      console.log('Initializing Paddle with config:', {
        environment: PADDLE_CONFIG.environment,
        tokenLength: PADDLE_CONFIG.clientSideToken.length,
        vendorId: PADDLE_CONFIG.vendorId
      });

      this.paddle = await initializePaddle({
        environment: PADDLE_CONFIG.environment,
        token: PADDLE_CONFIG.clientSideToken,
      });

      this.initialized = true;
      console.log('Paddle initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Paddle:', error);
      throw error;
    }
  }

  async createFeaturedListingCheckout(
    paymentData: PaymentData,
    options: CheckoutOptions = {}
  ): Promise<string> {
    await this.initialize();

    if (!this.paddle) {
      throw new Error('Paddle is not initialized');
    }

    const price = getFeaturedPrice(paymentData.duration);
    const endDate = calculateFeaturedEndDate(paymentData.duration);

    // First create a payment record in our database
    const paymentRecord = await this.createPaymentRecord(paymentData, price);

    try {
      const priceId = this.getPriceIdForDuration(paymentData.duration);
      console.log('Creating checkout with price ID:', priceId);
      console.log('Payment data:', paymentData);
      
      const checkoutConfig = {
        items: [
          {
            priceId: priceId,
            quantity: 1,
          }
        ],
        customer: {
          email: paymentData.userEmail,
        },
        customData: {
          listingId: paymentData.listingId,
          userId: paymentData.userId,
          duration: paymentData.duration,
          paymentId: paymentRecord.id,
          listingTitle: paymentData.listingTitle,
          featuredUntil: endDate.toISOString(),
          ...options.customData,
        },
        settings: {
          successUrl: options.successUrl || `${window.location.origin}/payment/success?listing_id=${paymentData.listingId}`,
          cancelUrl: options.cancelUrl || `${window.location.origin}/payment/cancelled?listing_id=${paymentData.listingId}`,
          theme: 'light',
          locale: 'en',
        },
      };
      
      console.log('Checkout config:', checkoutConfig);
      const checkout = await this.paddle.Checkout.open(checkoutConfig);

      // Update payment record with checkout ID
      await supabase
        .from('payments')
        .update({ paddle_checkout_id: checkout.id })
        .eq('id', paymentRecord.id);

      return checkout.id;
    } catch (error) {
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
    // In a real implementation, you would create products in Paddle dashboard
    // and return the actual price IDs. For now, we'll use placeholder IDs
    // that you'll need to replace with real ones from your Paddle dashboard
    const priceIds = {
      day: import.meta.env.VITE_PADDLE_PRICE_ID_DAY || 'pri_day_placeholder',
      week: import.meta.env.VITE_PADDLE_PRICE_ID_WEEK || 'pri_week_placeholder',
      month: import.meta.env.VITE_PADDLE_PRICE_ID_MONTH || 'pri_month_placeholder',
    };

    console.log('Environment variables for Paddle:', {
      day: import.meta.env.VITE_PADDLE_PRICE_ID_DAY,
      week: import.meta.env.VITE_PADDLE_PRICE_ID_WEEK,
      month: import.meta.env.VITE_PADDLE_PRICE_ID_MONTH
    });
    
    console.log(`Getting price ID for duration '${duration}':`, priceIds[duration]);
    return priceIds[duration];
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
}

export const paddleService = new PaddleService();
