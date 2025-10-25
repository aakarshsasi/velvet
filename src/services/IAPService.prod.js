/**
 * LEGACY FILE - DEPRECATED
 * 
 * This service uses expo-in-app-purchases and is kept for backward compatibility.
 * For new implementations, use RevenueCatManager instead.
 * 
 * See: src/lib/RevenueCatManager.ts
 * Documentation: REVENUECAT_SETUP.md
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-in-app-purchases';
import { getErrorMessage, getProductIds } from '../config/iapConfig';

class IAPService {
  constructor() {
    this.isInitialized = false;
    this.products = [];
    this.purchases = [];
    this.listeners = [];
  }

  // Initialize IAP service
  async initialize() {
    try {
      if (this.isInitialized) {
        return true;
      }

      // Connect to the store
      await InAppPurchases.connectAsync();

      // Set up purchase listener
      InAppPurchases.setPurchaseListener(this.handlePurchaseUpdate.bind(this));

      this.isInitialized = true;
      console.log('IAP Service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize IAP service:', error);
      return false;
    }
  }

  // Get available products
  async getProducts() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get product IDs from configuration
      const productIds = getProductIds();

      const products = await InAppPurchases.getProductsAsync(productIds);
      this.products = products;

      console.log('Available products:', products);
      return products;
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  }

  // Purchase a product
  async purchaseProduct(productId) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Attempting to purchase product:', productId);

      // Find the product
      const product = this.products.find((p) => p.productId === productId);
      if (!product) {
        throw new Error(getErrorMessage('PRODUCT_NOT_FOUND'));
      }

      // Make the purchase
      const result = await InAppPurchases.purchaseItemAsync(productId);

      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        console.log('Purchase successful:', result);
        return result;
      } else {
        // Handle specific error codes
        let errorMessage = getErrorMessage('PURCHASE_FAILED');

        switch (result.responseCode) {
          case InAppPurchases.IAPResponseCode.USER_CANCELED:
            errorMessage = getErrorMessage('PURCHASE_CANCELLED');
            break;
          case InAppPurchases.IAPResponseCode.ITEM_ALREADY_OWNED:
            errorMessage = getErrorMessage('PURCHASE_ALREADY_OWNED');
            break;
          case InAppPurchases.IAPResponseCode.NETWORK_ERROR:
            errorMessage = getErrorMessage('NETWORK_ERROR');
            break;
          default:
            errorMessage = `${getErrorMessage('PURCHASE_FAILED')} (Code: ${result.responseCode})`;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  }

  // Restore purchases
  async restorePurchases() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Restoring purchases...');
      const result = await InAppPurchases.getPurchaseHistoryAsync();

      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        this.purchases = result.results || [];
        console.log('Restored purchases:', this.purchases);
        return this.purchases;
      } else {
        throw new Error(`Restore failed with code: ${result.responseCode}`);
      }
    } catch (error) {
      console.error('Restore purchases error:', error);
      throw error;
    }
  }

  // Handle purchase updates
  handlePurchaseUpdate(purchase) {
    console.log('Purchase update received:', purchase);

    if (purchase.responseCode === InAppPurchases.IAPResponseCode.OK) {
      this.purchases.push(purchase);

      // Notify listeners
      this.listeners.forEach((listener) => {
        listener(purchase);
      });
    }
  }

  // Add purchase listener
  addPurchaseListener(listener) {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Check if user has active subscription
  async hasActiveSubscription() {
    try {
      const purchases = await this.restorePurchases();

      // Check for active subscriptions
      const activeSubscriptions = purchases.filter((purchase) => {
        // For subscriptions, check if they're still valid
        if (
          purchase.productId.includes('monthly') ||
          purchase.productId.includes('yearly')
        ) {
          // You might want to add more sophisticated validation here
          // For now, we'll assume all restored purchases are active
          return true;
        }
        return false;
      });

      return activeSubscriptions.length > 0;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  // Validate purchase with receipt (for server-side validation)
  async validatePurchase(purchase) {
    try {
      // This is a basic validation - in production, you should validate with your server
      // or with Apple/Google's validation endpoints

      const receipt = purchase.transactionReceipt;
      if (!receipt) {
        throw new Error('No receipt found');
      }

      // Store purchase locally for offline validation
      await this.storePurchaseLocally(purchase);

      return {
        isValid: true,
        purchase: purchase,
      };
    } catch (error) {
      console.error('Purchase validation error:', error);
      return {
        isValid: false,
        error: error.message,
      };
    }
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
      });

      await AsyncStorage.setItem('userPurchases', JSON.stringify(purchases));
    } catch (error) {
      console.error('Error storing purchase locally:', error);
    }
  }

  // Get local purchases
  async getLocalPurchases() {
    try {
      const purchases = await AsyncStorage.getItem('userPurchases');
      return purchases ? JSON.parse(purchases) : [];
    } catch (error) {
      console.error('Error getting local purchases:', error);
      return [];
    }
  }

  // Disconnect from store
  async disconnect() {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
        console.log('IAP Service disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting IAP service:', error);
    }
  }

  // Get product by ID
  getProductById(productId) {
    return this.products.find((product) => product.productId === productId);
  }

  // Check if product is purchased
  async isProductPurchased(productId) {
    try {
      const localPurchases = await this.getLocalPurchases();
      return localPurchases.some(
        (purchase) => purchase.productId === productId && purchase.validated
      );
    } catch (error) {
      console.error('Error checking if product is purchased:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new IAPService();
