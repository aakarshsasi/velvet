import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import IAPService from '../services/IAPServiceFactory';
import { useAuth } from './AuthContext';

const IAPContext = createContext({
  products: [],
  isLoading: false,
  isInitialized: false,
  purchaseProduct: () => {},
  restorePurchases: () => {},
  hasActiveSubscription: () => {},
  isProductPurchased: () => {},
  error: null
});

export const useIAP = () => {
  return useContext(IAPContext);
};

export const IAPProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const { upgradeToPremium } = useAuth();

  useEffect(() => {
    initializeIAP();
    
    // Set up purchase listener
    const unsubscribe = IAPService.addPurchaseListener(handlePurchaseUpdate);
    
    return () => {
      unsubscribe();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const initialized = await IAPService.initialize();
      if (initialized) {
        setIsInitialized(true);
        await loadProducts();
        await checkExistingPurchases();
      } else {
        setError('In-app purchases are not available on this device');
      }
    } catch (error) {
      console.error('IAP initialization error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const availableProducts = await IAPService.getProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.message);
    }
  };

  const checkExistingPurchases = async () => {
    try {
      const hasSubscription = await IAPService.hasActiveSubscription();
      if (hasSubscription) {
        // User has an active subscription, upgrade to premium
        await upgradeToPremium();
      }
    } catch (error) {
      console.error('Error checking existing purchases:', error);
    }
  };

  const purchaseProduct = async (productId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Purchasing product:', productId);
      
      // Find the product to get display info
      const product = products.find(p => p.productId === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Make the purchase
      const purchase = await IAPService.purchaseProduct(productId);
      
      if (purchase) {
        // Validate the purchase
        const validation = await IAPService.validatePurchase(purchase);
        
        if (validation.isValid) {
          // Upgrade user to premium with purchase data
          await upgradeToPremium(purchase);
          
          Alert.alert(
            'Purchase Successful! 🎉',
            `Welcome to Velvet Premium! You now have access to all exclusive content.`,
            [{ text: 'Start Exploring' }]
          );
          
          return { success: true, purchase };
        } else {
          throw new Error('Purchase validation failed');
        }
      } else {
        throw new Error('Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setError(error.message);
      
      // Show user-friendly error message
      let errorMessage = 'Purchase failed. Please try again.';
      
      if (error.message.includes('User cancelled')) {
        errorMessage = 'Purchase was cancelled.';
      } else if (error.message.includes('not available')) {
        errorMessage = 'This product is not available for purchase.';
      } else if (error.message.includes('already purchased')) {
        errorMessage = 'You have already purchased this product.';
      }
      
      Alert.alert('Purchase Failed', errorMessage);
      
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Restoring purchases...');
      const purchases = await IAPService.restorePurchases();
      
      if (purchases && purchases.length > 0) {
        // Check if any of the restored purchases are premium subscriptions
        const hasPremiumSubscription = purchases.some(purchase => 
          purchase.productId.includes('premium') || 
          purchase.productId.includes('monthly') || 
          purchase.productId.includes('yearly')
        );
        
        if (hasPremiumSubscription) {
          // Find the most recent premium purchase
          const premiumPurchase = purchases.find(purchase => 
            purchase.productId.includes('premium') || 
            purchase.productId.includes('monthly') || 
            purchase.productId.includes('yearly')
          );
          
          await upgradeToPremium(premiumPurchase);
          Alert.alert(
            'Purchases Restored! 🎉',
            'Your premium subscription has been restored.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Purchases Restored',
            'No premium subscriptions found to restore.',
            [{ text: 'OK' }]
          );
        }
        
        return { success: true, purchases };
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK' }]
        );
        return { success: false, purchases: [] };
      }
    } catch (error) {
      console.error('Restore purchases error:', error);
      setError(error.message);
      Alert.alert('Restore Failed', 'Failed to restore purchases. Please try again.');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveSubscription = async () => {
    try {
      return await IAPService.hasActiveSubscription();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  };

  const isProductPurchased = async (productId) => {
    try {
      return await IAPService.isProductPurchased(productId);
    } catch (error) {
      console.error('Error checking if product is purchased:', error);
      return false;
    }
  };

  const handlePurchaseUpdate = (purchase) => {
    console.log('Purchase update received in context:', purchase);
    
    // Handle the purchase update
    if (purchase.responseCode === 0) { // OK response code
      // Validate and process the purchase
      IAPService.validatePurchase(purchase).then(validation => {
        if (validation.isValid) {
          upgradeToPremium(purchase);
        }
      });
    }
  };

  const value = {
    products,
    isLoading,
    isInitialized,
    purchaseProduct,
    restorePurchases,
    hasActiveSubscription,
    isProductPurchased,
    error
  };

  return (
    <IAPContext.Provider value={value}>
      {children}
    </IAPContext.Provider>
  );
};
