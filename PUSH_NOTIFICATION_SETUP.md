# Push Notification Setup Guide

## VAPID Keys Generated ✅
Your VAPID keys have been successfully generated:

**Public Key:** `BHKTcDLAYUnM_aSql0hSIdPYmJtSC97zXaxbckL2WDLrijNVKsXCxwB55xXa-_xOqS5-912YrixXGyMo95j8ZtQ`

**Private Key:** `XWfIY0gd7intmajHWaymizAXAqYlJAjyI58EClhYpsc`

## Required Configuration Steps

### 1. Create Environment File
Create a `.env` file in your project root with:

```env
# VAPID Keys for Push Notifications
VITE_VAPID_PUBLIC_KEY=BHKTcDLAYUnM_aSql0hSIdPYmJtSC97zXaxbckL2WDLrijNVKsXCxwB55xXa-_xOqS5-912YrixXGyMo95j8ZtQ
VAPID_PUBLIC_KEY=BHKTcDLAYUnM_aSql0hSIdPYmJtSC97zXaxbckL2WDLrijNVKsXCxwB55xXa-_xOqS5-912YrixXGyMo95j8ZtQ
VAPID_PRIVATE_KEY=XWfIY0gd7intmajHWaymizAXAqYlJAjyI58EClhYpsc

# Add your existing Supabase configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Configure Supabase Edge Function
1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** → **send-push-notification**
3. Go to **Settings** → **Environment Variables**
4. Add these environment variables:
   - `VAPID_PUBLIC_KEY` = `BHKTcDLAYUnM_aSql0hSIdPYmJtSC97zXaxbckL2WDLrijNVKsXCxwB55xXa-_xOqS5-912YrixXGyMo95j8ZtQ`
   - `VAPID_PRIVATE_KEY` = `XWfIY0gd7intmajHWaymizAXAqYlJAjyI58EClhYpsc`

### 3. Update Email in Edge Function
In `supabase/functions/send-push-notification/index.ts`, replace:
```typescript
'mailto:your-email@example.com'
```
with your actual email address.

## Testing the System

### 1. Start your development server
```bash
npm run dev
```

### 2. Test in browser console
Open browser console and run:
```javascript
// Copy and paste the content of test-push-notifications.js
```

### 3. Test the UI
- Look for the bell icon in your app (PushNotificationToggle component)
- Click to enable/disable notifications
- Grant permission when prompted

### 4. Test sending notifications
- Send a message in your chat system
- The recipient should receive a push notification

## Troubleshooting

### If notifications don't work:
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure service worker is registered (check Application tab in DevTools)
4. Check that notification permissions are granted
5. Verify Supabase Edge Function environment variables

### Common Issues:
- **"Missing VAPID public key"**: Environment variable not set
- **"Service Worker registration failed"**: Check if service-worker.js exists
- **"Notification permission denied"**: User needs to enable notifications in browser settings
- **"No subscriptions found"**: User hasn't subscribed to notifications yet

## System Status
✅ VAPID Keys Generated  
✅ Service Worker Fixed  
✅ Code Issues Resolved  
⏳ Environment Configuration (in progress)  
⏳ Supabase Configuration (pending)  
⏳ End-to-End Testing (pending)
