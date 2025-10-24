# In-App Purchase (IAP) Integration Guide

This document explains the IAP integration implemented in the Velvet app using Expo's `expo-in-app-purchases` library.

## Overview

The IAP integration provides:

- Monthly and yearly premium subscriptions
- Secure payment processing through App Store/Google Play
- Purchase validation and receipt verification
- Purchase restoration functionality
- Comprehensive error handling
- Analytics tracking

## Architecture

### Components

1. **IAPService** (`src/services/IAPService.js`)
   - Core service handling all IAP operations
   - Product fetching and purchase processing
   - Purchase validation and storage
   - Error handling and user feedback

2. **IAPContext** (`src/contexts/IAPContext.js`)
   - React context for IAP state management
   - Provides IAP functions to components
   - Handles purchase callbacks and updates
   - Integrates with AuthContext for premium upgrades

3. **IAPConfig** (`src/config/iapConfig.js`)
   - Configuration for product IDs and settings
   - Error and success messages
   - Product definitions and features

4. **PaymentScreen** (Updated)
   - UI for selecting plans and payment methods
   - Integration with IAP service
   - Purchase and restore functionality

## Setup Instructions

### 1. App Store Connect / Google Play Console Setup

#### iOS (App Store Connect)

1. Create your app in App Store Connect
2. Go to Features > In-App Purchases
3. Create the following products:
   - **Product ID**: `com.velvet.premium.monthly`
     - Type: Auto-Renewable Subscription
     - Duration: 1 Month
     - Price: ₹299
   - **Product ID**: `com.velvet.premium.yearly`
     - Type: Auto-Renewable Subscription
     - Duration: 1 Year
     - Price: ₹2,999

#### Android (Google Play Console)

1. Create your app in Google Play Console
2. Go to Monetize > Products > Subscriptions
3. Create the following subscriptions:
   - **Product ID**: `com.velvet.premium.monthly`
     - Billing period: 1 month
     - Price: ₹299
   - **Product ID**: `com.velvet.premium.yearly`
     - Billing period: 1 year
     - Price: ₹2,999

### 2. Environment Configuration

The IAP service will automatically detect the platform and use the appropriate store. No additional configuration is needed for the basic setup.

### 3. Testing

#### iOS Testing

1. Use TestFlight or Xcode with sandbox accounts
2. Create sandbox test accounts in App Store Connect
3. Sign in with sandbox account on device
4. Test purchases will be processed in sandbox mode

#### Android Testing

1. Upload a signed APK/AAB to Google Play Console (Internal Testing)
2. Add test accounts in Google Play Console
3. Install the app from Play Console
4. Test purchases will be processed in test mode

## Usage

### Basic Usage

```javascript
import { useIAP } from '../contexts/IAPContext';

function MyComponent() {
  const {
    products,
    isLoading,
    purchaseProduct,
    restorePurchases
  } = useIAP();

  const handlePurchase = async (productId) => {
    try {
      const result = await purchaseProduct(productId);
      if (result.success) {
        console.log('Purchase successful!');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handleRestore = async () => {
    try {
      const result = await restorePurchases();
      if (result.success) {
        console.log('Purchases restored!');
      }
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  return (
    // Your UI components
  );
}
```

### Product Configuration

Update product IDs in `src/config/iapConfig.js`:

```javascript
export const IAP_CONFIG = {
  PRODUCT_IDS: {
    MONTHLY: 'com.velvet.premium.monthly',
    YEARLY: 'com.velvet.premium.yearly',
  },
  // ... other configuration
};
```

## Features

### 1. Purchase Flow

- User selects a plan (Monthly/Yearly)
- Payment method defaults to "In-App Purchase"
- Purchase is processed through App Store/Google Play
- Purchase is validated and stored locally
- User is upgraded to premium status

### 2. Restore Purchases

- Users can restore previous purchases
- Useful when switching devices or reinstalling app
- Automatically upgrades user if valid subscription found

### 3. Error Handling

- Comprehensive error messages for different scenarios
- User-friendly error dialogs
- Detailed logging for debugging

### 4. Analytics Integration

- Tracks purchase attempts and successes
- Monitors conversion funnels
- Records error events for analysis

## Security Considerations

### 1. Purchase Validation

- Basic local validation is implemented
- For production, implement server-side validation
- Validate receipts with Apple/Google servers

### 2. Data Storage

- Purchase data is stored locally using AsyncStorage
- Sensitive data should be encrypted in production
- Consider using secure storage solutions

### 3. Receipt Verification

- Current implementation uses basic validation
- Implement proper receipt verification for production
- Use Apple's and Google's validation endpoints

## Troubleshooting

### Common Issues

1. **"In-app purchases are not available"**
   - Ensure device supports IAP
   - Check if user is signed in to App Store/Google Play
   - Verify app is properly configured in stores

2. **"Product not found"**
   - Check product IDs match store configuration
   - Ensure products are approved and available
   - Verify app bundle ID matches store configuration

3. **Purchase fails silently**
   - Check network connectivity
   - Verify user is signed in to correct account
   - Check store configuration and product status

### Debug Mode

Use the `IAPTestComponent` for debugging:

```javascript
import IAPTestComponent from '../src/components/IAPTestComponent';

// Add to your app for testing
<IAPTestComponent />;
```

## Production Checklist

- [ ] Products created in both App Store Connect and Google Play Console
- [ ] Product IDs match configuration
- [ ] App is properly signed and uploaded
- [ ] Test purchases work in sandbox/test environment
- [ ] Receipt validation is implemented (server-side)
- [ ] Error handling covers all edge cases
- [ ] Analytics tracking is working
- [ ] Purchase restoration works correctly

## Support

For issues with IAP integration:

1. Check the console logs for detailed error messages
2. Verify store configuration matches app configuration
3. Test with sandbox/test accounts first
4. Review Apple/Google documentation for platform-specific issues

## Dependencies

- `expo-in-app-purchases`: ^14.5.0
- `@react-native-async-storage/async-storage`: 2.2.0
- `expo`: ~54.0.0

## Files Modified/Created

### New Files

- `src/services/IAPService.js` - Core IAP service
- `src/contexts/IAPContext.js` - React context for IAP
- `src/config/iapConfig.js` - IAP configuration
- `src/components/IAPTestComponent.js` - Testing component
- `IAP_INTEGRATION.md` - This documentation

### Modified Files

- `app/_layout.tsx` - Added IAPProvider
- `src/screens/PaymentScreen.js` - Integrated IAP functionality
- `src/contexts/AuthContext.js` - Updated for IAP purchase data

## Next Steps

1. Set up products in App Store Connect and Google Play Console
2. Test the integration with sandbox/test accounts
3. Implement server-side receipt validation
4. Add subscription status checking
5. Implement subscription management features
6. Add subscription renewal notifications
