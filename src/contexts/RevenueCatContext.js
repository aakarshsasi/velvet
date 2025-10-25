import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import RevenueCatManager from '../lib/RevenueCatManager';
import { useAuth } from './AuthContext';

const RevenueCatContext = createContext({
  offerings: null,
  isLoading: false,
  isInitialized: false,
  purchasePackage: () => {},
  restorePurchases: () => {},
  hasActiveSubscription: () => {},
  customerInfo: null,
  error: null,
});

export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};

export const RevenueCatProvider = ({ children }) => {
  const [offerings, setOfferings] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const { upgradeToPremium, user } = useAuth();

  useEffect(() => {
    initializeRevenueCat();
  }, []);

  useEffect(() => {
    // Set user identifier when user logs in
    if (user && user.uid && isInitialized) {
      RevenueCatManager.setUserIdentifier(user.uid);
    }
  }, [user, isInitialized]);

  const initializeRevenueCat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const initialized = await RevenueCatManager.initializeRevenueCat();
      if (initialized) {
        setIsInitialized(true);
        await loadOfferings();
        await checkExistingPurchases();
      } else {
        setError('In-app purchases are not available on this device');
      }
    } catch (error) {
      console.error('RevenueCat initialization error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOfferings = async () => {
    try {
      const availableOfferings = await RevenueCatManager.getOfferings();
      setOfferings(availableOfferings);
    } catch (error) {
      console.error('Error loading offerings:', error);
      setError(error.message);
    }
  };

  const checkExistingPurchases = async () => {
    try {
      const hasSubscription = await RevenueCatManager.hasActiveEntitlement();
      if (hasSubscription) {
        // User has an active subscription, upgrade to premium
        const info = await RevenueCatManager.getCustomerInfo();
        setCustomerInfo(info);
        await upgradeToPremium();
      }
    } catch (error) {
      console.error('Error checking existing purchases:', error);
    }
  };

  const purchasePackage = async (packageToPurchase) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Purchasing package:', packageToPurchase.identifier);

      const result = await RevenueCatManager.purchasePackage(packageToPurchase);

      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);

        // Check if user now has active entitlements
        const hasActiveEntitlement = await RevenueCatManager.hasActiveEntitlement();

        if (hasActiveEntitlement) {
          // Upgrade user to premium
          await upgradeToPremium({
            productId: packageToPurchase.product.identifier,
            purchaseDate: new Date().toISOString(),
          });

          Alert.alert(
            'Purchase Successful! 🎉',
            'Welcome to Velvet Premium! You now have access to all exclusive content.',
            [{ text: 'Start Exploring' }]
          );

          return { success: true };
        } else {
          throw new Error('Purchase completed but no active entitlement found');
        }
      } else if (result.userCancelled) {
        // User cancelled - don't show error
        return { success: false, cancelled: true };
      } else {
        throw new Error(result.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setError(error.message);

      Alert.alert(
        'Purchase Failed',
        error.message || 'Purchase failed. Please try again.'
      );

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
      const result = await RevenueCatManager.restorePurchases();

      if (result.success && result.customerInfo) {
        setCustomerInfo(result.customerInfo);

        // Check if user has active entitlements after restore
        const hasActiveEntitlement = await RevenueCatManager.hasActiveEntitlement();

        if (hasActiveEntitlement) {
          await upgradeToPremium();
          Alert.alert(
            'Purchases Restored! 🎉',
            'Your premium subscription has been restored.',
            [{ text: 'OK' }]
          );
          return { success: true };
        } else {
          Alert.alert(
            'Purchases Restored',
            'No active subscriptions found to restore.',
            [{ text: 'OK' }]
          );
          return { success: false, message: 'No active subscriptions' };
        }
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK' }]
        );
        return { success: false };
      }
    } catch (error) {
      console.error('Restore purchases error:', error);
      setError(error.message);
      Alert.alert(
        'Restore Failed',
        'Failed to restore purchases. Please try again.'
      );
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveSubscription = async () => {
    try {
      return await RevenueCatManager.hasActiveEntitlement();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  };

  const value = {
    offerings,
    customerInfo,
    isLoading,
    isInitialized,
    purchasePackage,
    restorePurchases,
    hasActiveSubscription,
    error,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

