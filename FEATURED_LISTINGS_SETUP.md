# Featured Listings with Paddle Payment Gateway Setup

This guide will help you set up the featured listing system with Paddle payment integration for your KisanMarkaz marketplace.

## Overview

The featured listing system allows users to pay to feature their listings for increased visibility. It includes:

- **Pricing**: $3/day, $15/week, $30/month
- **Payment processing** via Paddle
- **Automatic expiration** handling
- **User management** interface
- **Featured listing display** with special styling

## 🛠️ Setup Instructions

### 1. Database Migration

First, run the database migrations to create the required tables:

```sql
-- Run these migrations in your Supabase SQL editor:
-- supabase/migrations/20240825000001_create_featured_listings.sql
-- supabase/migrations/20240825000002_featured_listing_expiration.sql
```

This will create:
- `featured_listings` table
- `payments` table  
- Proper RLS policies
- Expiration function
- Active featured listings view

### 2. Paddle Account Setup

1. **Create Paddle Account**
   - Go to [paddle.com](https://paddle.com/) and create an account
   - Choose the appropriate plan for your business

2. **Get Authentication Credentials**
   - Navigate to Developer Tools → Authentication
   - Copy your Vendor ID, Client Side Token, and Server Side Token

3. **Create Products**
   Create three products in Paddle Catalog → Products:
   
   **Product 1: Featured Listing - 1 Day**
   - Name: "Featured Listing - 1 Day"
   - Price: $3.00 USD
   - Type: One-time purchase
   - Copy the Price ID (starts with `pri_`)

   **Product 2: Featured Listing - 1 Week**
   - Name: "Featured Listing - 1 Week"  
   - Price: $15.00 USD
   - Type: One-time purchase
   - Copy the Price ID

   **Product 3: Featured Listing - 1 Month**
   - Name: "Featured Listing - 1 Month"
   - Price: $30.00 USD
   - Type: One-time purchase
   - Copy the Price ID

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Paddle credentials:

```bash
# Paddle Configuration
VITE_PADDLE_ENVIRONMENT=sandbox  # Change to 'production' for live
VITE_PADDLE_VENDOR_ID=your_vendor_id_here
VITE_PADDLE_CLIENT_TOKEN=your_client_token_here
VITE_PADDLE_SERVER_TOKEN=your_server_token_here

# Paddle Product Price IDs
VITE_PADDLE_PRICE_ID_DAY=pri_your_day_price_id
VITE_PADDLE_PRICE_ID_WEEK=pri_your_week_price_id
VITE_PADDLE_PRICE_ID_MONTH=pri_your_month_price_id
```

### 4. Add Route Configuration

Add the new payment routes to your router configuration:

```tsx
// In your main App.tsx or router configuration
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancelled from './pages/PaymentCancelled';

// Add these routes:
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/cancelled" element={<PaymentCancelled />} />
```

### 5. Update Navigation (Optional)

Add featured listing management to your user dashboard navigation:

```tsx
import FeaturedListingManagement from './components/FeaturedListingManagement';

// Add to your dashboard/profile pages
<FeaturedListingManagement />
```

## 🎯 Features

### For Users (Sellers)

1. **Create Featured Listings**
   - Select featured duration when creating a listing
   - Choose from 1 day, 1 week, or 1 month options  
   - Complete payment via Paddle checkout

2. **Manage Featured Listings**
   - View all featured listings and their status
   - See payment history
   - Track featured period duration

3. **Visual Benefits**
   - Featured listings appear with special badges
   - Higher positioning in search results
   - Enhanced styling and visibility

### For Administrators

1. **Revenue Tracking**
   - Monitor featured listing purchases
   - Track payment success/failure rates
   - View featured listing analytics

2. **Management Tools**
   - Handle customer support issues
   - Process refunds if needed
   - Monitor system health

## 🔧 Technical Implementation

### Key Components

1. **`FeaturedListingSelector`** - Payment option selection during listing creation
2. **`FeaturedListingManagement`** - User dashboard for managing featured listings  
3. **`FeaturedListingBadge`** - Visual components for displaying featured status
4. **`paddleService`** - Payment processing integration
5. **Payment pages** - Success/failure handling

### Database Schema

```sql
-- Featured Listings
CREATE TABLE featured_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    featured_from TIMESTAMP WITH TIME ZONE NOT NULL,
    featured_until TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_type TEXT NOT NULL CHECK (duration_type IN ('day', 'week', 'month')),
    price DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    paddle_transaction_id TEXT
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    listing_id UUID REFERENCES listings(id),
    featured_listing_id UUID REFERENCES featured_listings(id),
    paddle_transaction_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending'
);
```

### Usage Example

```tsx
// In your listing creation form
import FeaturedListingSelector from '@/components/FeaturedListingSelector';

const [selectedFeaturedDuration, setSelectedFeaturedDuration] = useState(null);

<FeaturedListingSelector
  onSelectionChange={setSelectedFeaturedDuration}
  selectedDuration={selectedFeaturedDuration}
/>

// In your listings display
import { FeaturedListingCardWrapper } from '@/components/FeaturedListingBadge';

<FeaturedListingCardWrapper isFeatured={listing.isFeatured}>
  <ListingCard listing={listing} />
</FeaturedListingCardWrapper>
```

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Set up Paddle webhooks for payment confirmation
- [ ] Test payment flow in sandbox mode
- [ ] Configure featured listing expiration cron job  
- [ ] Set up monitoring for payment failures
- [ ] Test featured listing display logic
- [ ] Verify database permissions and RLS policies

### Production Setup

- [ ] Change `VITE_PADDLE_ENVIRONMENT` to `production`
- [ ] Use production Paddle credentials
- [ ] Set up proper error monitoring (Sentry, etc.)
- [ ] Configure backup systems for payment data
- [ ] Set up customer support processes

## 🐛 Troubleshooting

### Common Issues

1. **Paddle Checkout Not Loading**
   - Check your client side token is correct
   - Verify environment configuration
   - Check browser console for errors

2. **Payment Success Not Updating Database**
   - Verify webhook endpoints are configured
   - Check server logs for webhook processing errors
   - Ensure database permissions are correct

3. **Featured Listings Not Displaying**
   - Check the `active_featured_listings` view
   - Verify featured status logic
   - Run the expiration function manually to test

### Debug Commands

```sql
-- Check featured listings status
SELECT * FROM featured_listings WHERE user_id = 'user-uuid';

-- Check active featured listings
SELECT * FROM active_featured_listings;

-- Manually expire old listings
SELECT expire_featured_listings();

-- Check payment history
SELECT * FROM payments WHERE user_id = 'user-uuid' ORDER BY created_at DESC;
```

## 📞 Support

For technical support or questions about implementation:

1. Check the component documentation in the source files
2. Review Paddle's official documentation
3. Test in sandbox mode before going live
4. Monitor error logs and payment webhooks

## 🔐 Security Considerations

- All payment processing happens via Paddle (PCI compliant)
- Database uses Row Level Security (RLS)
- No credit card data is stored locally
- Webhook verification recommended for production
- Regular security audits of payment flow

## 📈 Analytics & Monitoring

Track these metrics for business insights:

- Featured listing conversion rate
- Average revenue per featured listing
- Featured listing performance vs. regular listings
- Payment success/failure rates
- Customer lifetime value from featured listings

---

**Note**: This is a complete implementation ready for production use. Make sure to test thoroughly in Paddle's sandbox environment before enabling live payments.
