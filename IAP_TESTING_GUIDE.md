# IAP Testing Guide - No Build Minutes Required

This guide shows you how to test IAP functionality without consuming EAS build minutes.

## Method 1: Expo Go with Mock IAP (Recommended for Development)

### 1. Create a Mock IAP Service

Let me create a mock version of the IAP service for testing:

```javascript
// src/services/MockIAPService.js
class MockIAPService {
  constructor() {
    this.isInitialized = false;
    this.products = [];
    this.purchases = [];
    this.listeners = [];
  }

  async initialize() {
    console.log('Mock IAP Service initialized');
    this.isInitialized = true;
    return true;
  }

  async getProducts() {
    // Mock products for testing
    this.products = [
      {
        productId: 'com.velvet.premium.monthly',
        title: 'Monthly Premium',
        price: '₹299',
        description: 'Monthly subscription to Velvet Premium',
        type: 'subscription',
      },
      {
        productId: 'com.velvet.premium.yearly',
        title: 'Yearly Premium',
        price: '₹2,999',
        description: 'Yearly subscription to Velvet Premium',
        type: 'subscription',
      },
    ];
    return this.products;
  }

  async purchaseProduct(productId) {
    console.log('Mock purchase:', productId);

    // Simulate purchase delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock successful purchase
    const mockPurchase = {
      productId,
      transactionId: `mock_${Date.now()}`,
      purchaseTime: Date.now(),
      purchaseToken: `mock_token_${Date.now()}`,
      orderId: `mock_order_${Date.now()}`,
      responseCode: 0, // OK
    };

    this.purchases.push(mockPurchase);

    // Notify listeners
    this.listeners.forEach((listener) => listener(mockPurchase));

    return mockPurchase;
  }

  async restorePurchases() {
    console.log('Mock restore purchases');
    return this.purchases;
  }

  async hasActiveSubscription() {
    return this.purchases.length > 0;
  }

  async validatePurchase(purchase) {
    return { isValid: true, purchase };
  }

  addPurchaseListener(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  async isProductPurchased(productId) {
    return this.purchases.some((p) => p.productId === productId);
  }

  async disconnect() {
    this.isInitialized = false;
  }
}

export default new MockIAPService();
```

### 2. Create Environment-Based Service Selection

```javascript
// src/services/IAPServiceFactory.js
import IAPService from './IAPService';
import MockIAPService from './MockIAPService';
import Constants from 'expo-constants';

const isDevelopment = __DEV__ || Constants.appOwnership === 'expo';

export default isDevelopment ? MockIAPService : IAPService;
```

### 3. Update IAP Context to Use Factory

```javascript
// Update src/contexts/IAPContext.js
import IAPService from '../services/IAPServiceFactory'; // Instead of direct import
```

## Method 2: Local Development with Expo Go

### 1. Start Development Server

```bash
npx expo start
```

### 2. Test on Physical Device

- Install Expo Go on your device
- Scan QR code to open app
- Test IAP flow with mock service

### 3. Test on Simulator/Emulator

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Test IAP flow with mock service

## Method 3: Web Testing (Limited IAP Support)

### 1. Start Web Development

```bash
npx expo start --web
```

### 2. Test UI Flow

- Test payment screen UI
- Test plan selection
- Test mock purchase flow
- Test error handling

## Method 4: Unit Testing

### 1. Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react-native
```

### 2. Create Test Files

```javascript
// __tests__/IAPService.test.js
import MockIAPService from '../src/services/MockIAPService';

describe('IAP Service', () => {
  test('should initialize mock service', async () => {
    const result = await MockIAPService.initialize();
    expect(result).toBe(true);
  });

  test('should get mock products', async () => {
    const products = await MockIAPService.getProducts();
    expect(products).toHaveLength(2);
    expect(products[0].productId).toBe('com.velvet.premium.monthly');
  });

  test('should handle mock purchase', async () => {
    const purchase = await MockIAPService.purchaseProduct(
      'com.velvet.premium.monthly'
    );
    expect(purchase.productId).toBe('com.velvet.premium.monthly');
    expect(purchase.responseCode).toBe(0);
  });
});
```

## Method 5: Integration Testing with Expo Go

### 1. Add Test Mode Toggle

```javascript
// src/components/IAPTestComponent.js - Add this to your existing component
const [testMode, setTestMode] = useState(true);

const toggleTestMode = () => {
  setTestMode(!testMode);
  // Reload the app to switch services
  window.location.reload();
};

// Add to your component's render:
<TouchableOpacity style={styles.testModeButton} onPress={toggleTestMode}>
  <Text style={styles.buttonText}>
    {testMode ? 'Switch to Real IAP' : 'Switch to Mock IAP'}
  </Text>
</TouchableOpacity>;
```

## Method 6: Debug Console Testing

### 1. Add Debug Commands

```javascript
// Add to your IAP context
const debugCommands = {
  simulatePurchase: async (productId) => {
    console.log('Simulating purchase:', productId);
    // Add your simulation logic
  },
  clearPurchases: () => {
    console.log('Clearing all purchases');
    // Clear local storage
  },
  setPremiumStatus: (status) => {
    console.log('Setting premium status:', status);
    // Update premium status
  },
};

// Expose to global for console access
if (__DEV__) {
  global.iapDebug = debugCommands;
}
```

### 2. Use in Console

```javascript
// In your app's console:
iapDebug.simulatePurchase('com.velvet.premium.monthly');
iapDebug.clearPurchases();
iapDebug.setPremiumStatus(true);
```

## Testing Checklist

### UI Testing

- [ ] Payment screen loads correctly
- [ ] Plan selection works
- [ ] Payment method selection works
- [ ] Loading states display properly
- [ ] Error messages show correctly
- [ ] Success messages display
- [ ] Navigation works after purchase

### Flow Testing

- [ ] Mock purchase completes successfully
- [ ] User gets upgraded to premium
- [ ] Premium features unlock
- [ ] Restore purchases works
- [ ] Error handling works
- [ ] Analytics events fire

### Edge Cases

- [ ] Network errors
- [ ] Invalid product IDs
- [ ] Purchase cancellation
- [ ] Already purchased products
- [ ] App backgrounding during purchase

## Production Testing (When Ready)

### 1. TestFlight (iOS)

- Upload to TestFlight
- Use sandbox Apple ID
- Test real IAP in sandbox

### 2. Internal Testing (Android)

- Upload to Google Play Console
- Add test accounts
- Test real IAP in test environment

## Mock Service Features

The mock service should simulate:

- ✅ Product loading
- ✅ Purchase flow
- ✅ Purchase validation
- ✅ Restore purchases
- ✅ Error scenarios
- ✅ Network delays
- ✅ User cancellation

## Benefits of Mock Testing

1. **No Build Minutes**: Test without consuming EAS build credits
2. **Fast Iteration**: Instant testing and debugging
3. **Controlled Scenarios**: Test edge cases easily
4. **Cost Effective**: No need for sandbox accounts initially
5. **Team Testing**: Easy to share and test with team

## Next Steps

1. Implement the mock service
2. Test the complete flow
3. Fix any issues found
4. When ready, create a single build for real IAP testing
5. Test with sandbox/test accounts
6. Deploy to production

This approach lets you thoroughly test your IAP integration without any build minutes!
