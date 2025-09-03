#!/usr/bin/env node

// Payment System Diagnostic Script
console.log('🔍 KisanMarkaz Payment System Diagnostic');
console.log('=========================================');

// Check environment variables
console.log('\n📋 Environment Variables Check:');
console.log('VITE_PADDLE_CLIENT_TOKEN:', process.env.VITE_PADDLE_CLIENT_TOKEN ? '✅ Set' : '❌ Missing');
console.log('VITE_PADDLE_API_KEY:', process.env.VITE_PADDLE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('VITE_PADDLE_PRICE_ID_DAY:', process.env.VITE_PADDLE_PRICE_ID_DAY || '❌ Missing');
console.log('VITE_PADDLE_PRICE_ID_WEEK:', process.env.VITE_PADDLE_PRICE_ID_WEEK || '❌ Missing');
console.log('VITE_PADDLE_PRICE_ID_MONTH:', process.env.VITE_PADDLE_PRICE_ID_MONTH || '❌ Missing');

console.log('\n🚨 IMPORTANT:');
console.log('- Frontend env vars (VITE_*) are set in .env file');
console.log('- Edge Function env vars must be set in Supabase Dashboard');
console.log('- PADDLE_API_KEY (without VITE_) must be set for Edge Functions');

console.log('\n📍 Next Steps:');
console.log('1. Test payment flow at http://localhost:5173/payment-debug');
console.log('2. If Edge Function fails, set PADDLE_API_KEY in Supabase Dashboard');
console.log('3. Redeploy Edge Functions after setting environment variables');

console.log('\n🔗 Supabase Dashboard Link:');
console.log('Go to: Project Settings → Edge Functions → Environment Variables');

console.log('\n✅ Diagnostic Complete!');