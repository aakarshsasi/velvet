import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage } from '../config/iapConfig';

class MockIAPService {
  constructor() {
    this.isInitialized = false;
    this.products = [];
    this.purchases = [];
    this.listeners = [];
    this.simulateErrors = false;
    this.simulateDelay = true;
  }

  // Initialize mock service
  async initialize() {
    try {
      console.log('🎭 Mock IAP Service initializing...');
      
      // Simulate initialization delay
      if (this.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      this.isInitialized = true;
      console.log('✅ Mock IAP Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Mock IAP Service initialization failed:', error);
      return false;
    }
  }

  // Get mock products
  async getProducts() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Simulate network delay
      if (this.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Mock products for testing
      this.products = [
        {
          productId: 'com.velvet.premium.monthly',
          title: 'Monthly Premium',
          price: '₹299',
          description: 'Monthly subscription to Velvet Premium',
          type: 'subscription',
          localizedPrice: '₹299',
          currency: 'INR'
        },
        {
          productId: 'com.velvet.premium.yearly',
          title: 'Yearly Premium',
          price: '₹2,999',
          description: 'Yearly subscription to Velvet Premium',
          type: 'subscription',
          localizedPrice: '₹2,999',
          currency: 'INR'
        }
      ];
      
      console.log('📦 Mock products loaded:', this.products);
      return this.products;
    } catch (error) {
      console.error('❌ Error loading mock products:', error);
      throw error;
    }
  }

  // Mock purchase
  async purchaseProduct(productId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('🛒 Mock purchase attempt:', productId);
      
      // Simulate purchase delay
      if (this.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Simulate errors if enabled
      if (this.simulateErrors) {
        const shouldError = Math.random() < 0.3; // 30% chance of error
        if (shouldError) {
          throw new Error('Mock purchase failed - simulated error');
        }
      }

      // Find the product
      const product = this.products.find(p => p.productId === productId);
      if (!product) {
        throw new Error(getErrorMessage('PRODUCT_NOT_FOUND'));
      }

      // Check if already purchased
      const alreadyPurchased = this.purchases.some(p => p.productId === productId);
      if (alreadyPurchased) {
        throw new Error(getErrorMessage('PURCHASE_ALREADY_OWNED'));
      }

      // Mock successful purchase
      const mockPurchase = {
        productId,
        transactionId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        purchaseTime: Date.now(),
        purchaseToken: `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId: `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        responseCode: 0, // OK
        title: product.title,
        price: product.price,
        currency: product.currency
      };
      
      this.purchases.push(mockPurchase);
      
      // Store locally
      await this.storePurchaseLocally(mockPurchase);
      
      // Notify listeners
      this.listeners.forEach(listener => listener(mockPurchase));
      
      console.log('✅ Mock purchase successful:', mockPurchase);
      return mockPurchase;
    } catch (error) {
      console.error('❌ Mock purchase error:', error);
      throw error;
    }
  }

  // Mock restore purchases
  async restorePurchases() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('🔄 Mock restore purchases...');
      
      // Simulate network delay
      if (this.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Load from local storage
      const localPurchases = await this.getLocalPurchases();
      this.purchases = localPurchases;
      
      console.log('✅ Mock restore completed:', this.purchases);
      return this.purchases;
    } catch (error) {
      console.error('❌ Mock restore error:', error);
      throw error;
    }
  }

  // Check for active subscription
  async hasActiveSubscription() {
    try {
      const purchases = await this.restorePurchases();
      
      // Check for active subscriptions
      const activeSubscriptions = purchases.filter(purchase => {
        return purchase.productId.includes('premium') || 
               purchase.productId.includes('monthly') || 
               purchase.productId.includes('yearly');
      });

      const hasActive = activeSubscriptions.length > 0;
      console.log('🔍 Active subscription check:', hasActive);
      return hasActive;
    } catch (error) {
      console.error('❌ Error checking subscription status:', error);
      return false;
    }
  }

  // Mock purchase validation
  async validatePurchase(purchase) {
    try {
      console.log('🔍 Mock validating purchase:', purchase.productId);
      
      // Simulate validation delay
      if (this.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Mock validation - always valid for testing
      const isValid = purchase && purchase.productId && purchase.transactionId;
      
      if (isValid) {
        console.log('✅ Mock purchase validation successful');
        return { isValid: true, purchase };
      } else {
        console.log('❌ Mock purchase validation failed');
        return { isValid: false, error: 'Invalid purchase data' };
      }
    } catch (error) {
      console.error('❌ Mock validation error:', error);
      return { isValid: false, error: error.message };
    }
  }

  // Add purchase listener
  addPurchaseListener(listener) {
    this.listeners.push(listener);
    console.log('👂 Mock purchase listener added');
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
        console.log('👂 Mock purchase listener removed');
      }
    };
  }

  // Store purchase locally
  async storePurchaseLocally(purchase) {
    try {
      const existingPurchases = await AsyncStorage.getItem('userPurchases');
      const purchases = existingPurchases ? JSON.parse(existingPurchases) : [];
      
      // Add new purchase
      purchases.push({
        ...purchase,
        purchaseDate: new Date().toISOString(),
        validated: true,
        mock: true // Mark as mock purchase
      });
      
      await AsyncStorage.setItem('userPurchases', JSON.stringify(purchases));
      console.log('💾 Mock purchase stored locally');
    } catch (error) {
      console.error('❌ Error storing mock purchase locally:', error);
    }
  }

  // Get local purchases
  async getLocalPurchases() {
    try {
      const purchases = await AsyncStorage.getItem('userPurchases');
      return purchases ? JSON.parse(purchases) : [];
    } catch (error) {
      console.error('❌ Error getting local purchases:', error);
      return [];
    }
  }

  // Check if product is purchased
  async isProductPurchased(productId) {
    try {
      const localPurchases = await this.getLocalPurchases();
      return localPurchases.some(purchase => 
        purchase.productId === productId && purchase.validated
      );
    } catch (error) {
      console.error('❌ Error checking if product is purchased:', error);
      return false;
    }
  }

  // Disconnect mock service
  async disconnect() {
    try {
      this.isInitialized = false;
      this.listeners = [];
      console.log('🔌 Mock IAP Service disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting mock IAP service:', error);
    }
  }

  // Get product by ID
  getProductById(productId) {
    return this.products.find(product => product.productId === productId);
  }

  // Debug methods for testing
  enableErrorSimulation() {
    this.simulateErrors = true;
    console.log('🎭 Error simulation enabled');
  }

  disableErrorSimulation() {
    this.simulateErrors = false;
    console.log('🎭 Error simulation disabled');
  }

  enableDelaySimulation() {
    this.simulateDelay = true;
    console.log('⏱️ Delay simulation enabled');
  }

  disableDelaySimulation() {
    this.simulateDelay = false;
    console.log('⏱️ Delay simulation disabled');
  }

  clearAllPurchases() {
    this.purchases = [];
    AsyncStorage.removeItem('userPurchases');
    console.log('🗑️ All mock purchases cleared');
  }

  // Get debug info
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      productsCount: this.products.length,
      purchasesCount: this.purchases.length,
      listenersCount: this.listeners.length,
      simulateErrors: this.simulateErrors,
      simulateDelay: this.simulateDelay
    };
  }
}

// Export singleton instance
export default new MockIAPService();
