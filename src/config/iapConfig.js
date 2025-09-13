// IAP Configuration
export const IAP_CONFIG = {
  // Product IDs - these must match your App Store Connect / Google Play Console
  PRODUCT_IDS: {
    MONTHLY: 'com.velvet.premium.monthly',
    YEARLY: 'com.velvet.premium.yearly'
  },
  
  // Product configurations
  PRODUCTS: {
    'com.velvet.premium.monthly': {
      id: 'com.velvet.premium.monthly',
      name: 'Monthly Premium',
      type: 'subscription',
      duration: 'monthly',
      price: '₹299',
      currency: 'INR',
      features: [
        'Unlimited access to all content',
        'Premium dice games',
        'Exclusive categories',
        'Priority support'
      ]
    },
    'com.velvet.premium.yearly': {
      id: 'com.velvet.premium.yearly',
      name: 'Yearly Premium',
      type: 'subscription',
      duration: 'yearly',
      price: '₹2,999',
      currency: 'INR',
      features: [
        'Everything in Monthly',
        'Exclusive yearly content',
        'Early access to new features',
        'Premium support'
      ]
    }
  },
  
  // Validation settings
  VALIDATION: {
    // Enable server-side validation (recommended for production)
    ENABLE_SERVER_VALIDATION: false,
    
    // Server validation endpoint (if enabled)
    VALIDATION_ENDPOINT: 'https://your-server.com/validate-purchase',
    
    // Local validation settings
    ENABLE_LOCAL_VALIDATION: true,
    
    // Cache validation results
    CACHE_VALIDATION: true,
    
    // Validation timeout (ms)
    VALIDATION_TIMEOUT: 10000
  },
  
  // Error messages
  ERROR_MESSAGES: {
    PRODUCT_NOT_FOUND: 'Product not found. Please try again later.',
    PURCHASE_FAILED: 'Purchase failed. Please try again.',
    PURCHASE_CANCELLED: 'Purchase was cancelled.',
    PURCHASE_ALREADY_OWNED: 'You already own this product.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    VALIDATION_FAILED: 'Purchase validation failed.',
    RESTORE_FAILED: 'Failed to restore purchases.',
    NO_PURCHASES_FOUND: 'No previous purchases found.',
    IAP_NOT_AVAILABLE: 'In-app purchases are not available on this device.'
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    PURCHASE_SUCCESS: 'Purchase successful! Welcome to Premium!',
    RESTORE_SUCCESS: 'Purchases restored successfully!',
    VALIDATION_SUCCESS: 'Purchase validated successfully!'
  }
};

// Helper functions
export const getProductById = (productId) => {
  return IAP_CONFIG.PRODUCTS[productId] || null;
};

export const getProductIds = () => {
  return Object.values(IAP_CONFIG.PRODUCT_IDS);
};

export const isSubscription = (productId) => {
  const product = getProductById(productId);
  return product && product.type === 'subscription';
};

export const getErrorMessage = (errorCode) => {
  return IAP_CONFIG.ERROR_MESSAGES[errorCode] || 'An unknown error occurred.';
};

export const getSuccessMessage = (messageCode) => {
  return IAP_CONFIG.SUCCESS_MESSAGES[messageCode] || 'Operation completed successfully!';
};
