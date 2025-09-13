import Constants from 'expo-constants';
import MockIAPService from './MockIAPService';

// Determine if we should use mock service
const isDevelopment = __DEV__ || Constants.appOwnership === 'expo';
const useMockService = isDevelopment;

// Only import real IAP service in production builds
let IAPService = null;
if (!useMockService) {
  try {
    // Dynamic import to avoid loading the module at parse time
    IAPService = require('./IAPService.prod').default;
  } catch (error) {
    console.warn('Real IAP service not available, falling back to mock:', error.message);
    // Fall back to mock service if real service can't be loaded
  }
} else {
  // In development, always use mock service
  console.log('🎭 Using Mock IAP Service for development');
}

// Export the appropriate service
const IAPServiceInstance = (useMockService || !IAPService) ? MockIAPService : IAPService;

// Add debug info
if (__DEV__) {
  console.log('🔧 IAP Service Factory:', {
    isDevelopment,
    useMockService,
    serviceType: (useMockService || !IAPService) ? 'Mock' : 'Real',
    appOwnership: Constants.appOwnership,
    realServiceAvailable: !!IAPService,
    fallbackReason: !IAPService ? 'Real IAP service not available in Expo Go' : 'Using configured service'
  });
}

export default IAPServiceInstance;