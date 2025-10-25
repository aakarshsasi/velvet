# RevenueCat Integration for Velvet

This document explains the RevenueCat integration setup for iOS subscriptions in the Velvet app.

## Overview

The app uses RevenueCat's SDK to handle iOS subscriptions with a data-driven approach. The paywall UI is built in the app but fetches products dynamically from RevenueCat, which syncs with App Store Connect.

## Architecture

### Key Components

1. **RevenueCatManager** (`src/lib/RevenueCatManager.ts`)
   - Singleton manager handling all RevenueCat operations
   - Initializes SDK with API key from environment
   - Manages offerings, purchases, and entitlements

2. **RevenueCatContext** (`src/contexts/RevenueCatContext.js`)
   - React context providing RevenueCat state and functions
   - Manages loading states and error handling
   - Integrates with AuthContext for premium upgrades

3. **PaymentScreenRevenueCat** (`src/screens/PaymentScreenRevenueCat.js`)
   - UI for displaying subscription options
   - Fetches packages from RevenueCat offerings
   - Handles purchase and restore flows

4. **App Layout** (`app/_layout.tsx`)
   - Wraps app with RevenueCatProvider
   - Initializes RevenueCat on app launch

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
REVENUECAT_API_KEY=appl_BQMzwpJqCjLlTkdtLqggdfrziiQ
```

**Note:** This file is gitignored for security.

### Product IDs

Configured in App Store Connect:
- `com.ritzakku.velvet.Monthly` - Monthly subscription
- `com.ritzakku.velvet.Annual` - Annual subscription
- `com.ritzakku.velvet.Lifetime` - Lifetime purchase

### RevenueCat Offering

**Offering ID:** `default` (ofrng57e389d845)

**Packages:**
- Monthly: `$rc_monthly` → `com.ritzakku.velvet.Monthly`
- Annual: `$rc_annual` → `com.ritzakku.velvet.Annual`
- Lifetime: `$rc_lifetime` → `com.ritzakku.velvet.Lifetime`

## Usage

### Initializing RevenueCat

RevenueCat is automatically initialized when the app launches via the `RevenueCatProvider` in `app/_layout.tsx`.

```javascript
// No manual initialization needed - handled by context
import { useRevenueCat } from '../contexts/RevenueCatContext';

const { offerings, isLoading, purchasePackage } = useRevenueCat();
```

### Checking Subscription Status

```javascript
import { useRevenueCat } from '../contexts/RevenueCatContext';

const { hasActiveSubscription } = useRevenueCat();

// Check if user has any active subscription
const isSubscribed = await hasActiveSubscription();
```

### Making a Purchase

```javascript
import { useRevenueCat } from '../contexts/RevenueCatContext';

const { offerings, purchasePackage } = useRevenueCat();

// Get a package to purchase
const monthlyPackage = offerings?.current?.availablePackages.find(
  pkg => pkg.identifier === '$rc_monthly'
);

// Purchase it
const result = await purchasePackage(monthlyPackage);

if (result.success) {
  // User now has premium access
  // App automatically calls upgradeToPremium()
}
```

### Restoring Purchases

```javascript
import { useRevenueCat } from '../contexts/RevenueCatContext';

const { restorePurchases } = useRevenueCat();

const result = await restorePurchases();

if (result.success) {
  // Purchases restored successfully
}
```

## Data Flow

1. **App Launch:**
   - RevenueCatProvider initializes SDK
   - Fetches offerings from RevenueCat
   - Checks for existing purchases
   - If active subscription found → upgrades to premium

2. **Payment Screen:**
   - Displays packages from offerings
   - User selects a package
   - Calls `purchasePackage()`
   - RevenueCat handles Apple payment flow
   - On success → updates entitlements → upgrades to premium

3. **Restore:**
   - User taps "Restore Purchases"
   - RevenueCat checks Apple receipt
   - Restores any valid purchases
   - Updates entitlements → upgrades to premium

## Key Features

### ✅ Automatic Entitlement Management
- RevenueCat handles receipt validation
- Automatically tracks subscription status
- Syncs across devices

### ✅ Analytics Integration
- Tracks purchase attempts, successes, and failures
- Integrates with existing analytics service
- Monitors conversion funnel

### ✅ User-Friendly Error Handling
- Clear error messages for users
- Handles cancelled purchases gracefully
- Retry logic for network issues

### ✅ Premium Access Control
- Integrates with AuthContext
- Updates Firebase user profile
- Persists premium status

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions.

**Quick Start:**
1. Create sandbox tester in App Store Connect
2. Build app with EAS: `eas build --profile development --platform ios`
3. Install on device via TestFlight
4. Sign out of App Store in device settings
5. Make test purchase with sandbox account

## Files Modified/Created

### New Files
- `src/lib/RevenueCatManager.ts` - Core RevenueCat logic
- `src/contexts/RevenueCatContext.js` - React context
- `src/screens/PaymentScreenRevenueCat.js` - New payment screen
- `.env` - Environment variables (gitignored)
- `env.d.ts` - TypeScript definitions for env vars
- `REVENUECAT_SETUP.md` - This file
- `TESTING.md` - Testing guide

### Modified Files
- `package.json` - Added react-native-purchases
- `babel.config.js` - Added react-native-dotenv plugin
- `app/_layout.tsx` - Added RevenueCatProvider
- `app/payment.tsx` - Updated to use new payment screen
- `.gitignore` - Added .env

### Legacy Files (Kept for Backward Compatibility)
- `src/contexts/IAPContext.js` - Old IAP context (can be removed if not used elsewhere)
- `src/screens/PaymentScreen.js` - Old payment screen (can be removed)
- `src/services/IAPService.prod.js` - Old IAP service (can be removed)

## Future Enhancements

### Android Support
When ready for Android, add to `.env`:
```env
REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxxxxxx
```

Update `RevenueCatManager.ts`:
```typescript
if (Platform.OS === 'ios') {
  apiKey = REVENUECAT_API_KEY;
} else if (Platform.OS === 'android') {
  apiKey = REVENUECAT_API_KEY_ANDROID;
}
```

### Promotional Offers
RevenueCat supports:
- Introductory prices
- Free trials
- Promotional offers
- Subscription groups

Configure these in App Store Connect and RevenueCat will automatically use them.

### Advanced Features
- **Customer attributes:** Track custom user properties
- **Experiments:** A/B test different paywalls
- **Webhooks:** Server-side subscription events
- **Charts & Analytics:** Built-in RevenueCat dashboard

## Security Best Practices

✅ API key stored in .env (gitignored)  
✅ Receipt validation handled by RevenueCat  
✅ No sensitive data logged  
✅ Secure HTTPS communication  
✅ Apple App Store handles payments  

**Never:**
- ❌ Commit .env to git
- ❌ Expose API keys in client code
- ❌ Store payment info in app
- ❌ Skip receipt validation

## Troubleshooting

### Issue: "RevenueCat not initialized"
**Solution:** Ensure `.env` file exists with correct API key

### Issue: "No offerings available"
**Solution:** 
- Check RevenueCat dashboard - offerings configured?
- Verify product IDs match App Store Connect
- Wait a few hours after creating products

### Issue: "Purchase failed"
**Solution:**
- Check console logs for detailed error
- Verify product is "Ready to Submit" in App Store Connect
- Test with different sandbox account

### Issue: "Already purchased"
**Solution:**
- In sandbox, manage subscriptions in Settings → App Store → Sandbox Account
- Or create new sandbox tester

## Support

- **RevenueCat Docs:** https://docs.revenuecat.com/
- **Dashboard:** https://app.revenuecat.com/
- **Support:** support@revenuecat.com

## Migration Notes

This integration replaces the previous `expo-in-app-purchases` implementation. The old files are kept for reference but should not be used for new features.

**Benefits of RevenueCat:**
- Better subscription management
- Server-side receipt validation
- Cross-platform support
- Built-in analytics
- Webhook support
- Customer history tracking

---

**Last Updated:** October 25, 2025  
**RevenueCat SDK Version:** 8.x  
**Minimum iOS Version:** 13.0

