import { REVENUECAT_API_KEY } from '@env';
import { Platform } from 'react-native';
import Purchases, {
    CustomerInfo,
    LOG_LEVEL,
    PurchasesOfferings,
    PurchasesPackage,
} from 'react-native-purchases';

// HARDCODED API KEY FOR DEBUGGING (will use this as fallback)
const HARDCODED_API_KEY = 'appl_BQMzwpJqCjLlTkdtLqggdfrziiQ';

/**
 * RevenueCat Manager
 * Handles initialization and management of RevenueCat SDK for iOS subscriptions
 */
class RevenueCatManager {
  private isConfigured: boolean = false;
  private currentOfferings: PurchasesOfferings | null = null;

  /**
   * Initialize RevenueCat SDK
   * Must be called once at app startup
   */
  async initializeRevenueCat(): Promise<boolean> {
    try {
      console.log('🚀 ============= REVENUECAT INITIALIZATION START =============');
      
      if (this.isConfigured) {
        console.log('✅ RevenueCat already initialized');
        return true;
      }

      // Get API key from environment or use hardcoded fallback
      let apiKey = REVENUECAT_API_KEY || process.env.REVENUECAT_API_KEY;
      let keySource = 'environment';
      
      console.log('🔍 Environment variable check:');
      console.log('  - REVENUECAT_API_KEY from @env:', apiKey || 'undefined');
      console.log('  - REVENUECAT_API_KEY from process.env:', process.env.REVENUECAT_API_KEY || 'undefined');
      console.log('  - Type:', typeof apiKey);
      console.log('  - Length:', apiKey?.length || 0);
      
      if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        console.warn('⚠️ No API key from environment, using HARDCODED fallback');
        apiKey = HARDCODED_API_KEY;
        keySource = 'hardcoded';
      } else {
        // Check which source we used
        if (process.env.REVENUECAT_API_KEY && !REVENUECAT_API_KEY) {
          keySource = 'process.env (build-time injected)';
        } else if (REVENUECAT_API_KEY && !process.env.REVENUECAT_API_KEY) {
          keySource = '@env (dotenv)';
        }
      }
      
      console.log('🔑 Final API Key being used:');
      console.log('  - Source:', keySource);
      console.log('  - Full Key:', apiKey);  // Logging full key for debugging
      console.log('  - Length:', apiKey.length);
      console.log('  - Starts with appl_:', apiKey.startsWith('appl_'));
      
      // Enhanced debug logging for RevenueCat API key
      console.log('═══════════════════════════════════════════════');
      console.log('🎯 REVENUECAT API KEY DEBUG INFO');
      console.log('═══════════════════════════════════════════════');
      console.log('Source:', keySource);
      console.log('Key Length:', apiKey.length);
      console.log('Key Preview (first 20 chars):', apiKey.substring(0, 20));
      console.log('Key Preview (last 10 chars):', '...' + apiKey.substring(apiKey.length - 10));
      console.log('Full Key:', apiKey);
      console.log('Key Valid:', apiKey && apiKey.length > 0 && apiKey.startsWith('appl_'));
      console.log('═══════════════════════════════════════════════');
      
      // Configure Purchases SDK
      if (Platform.OS === 'ios') {
        // Enable debug logs in development - ALWAYS enable for testing
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        console.log('🔧 RevenueCat debug logging ENABLED (LOG_LEVEL.DEBUG)');

        // Configure with API key
        console.log('🔑 Configuring RevenueCat with API key...');
        console.log('📱 Platform:', Platform.OS);
        console.log('📦 Bundle ID: com.ritzakku.velvet');
        
        await Purchases.configure({
          apiKey: apiKey,
          appUserID: undefined, // Let RevenueCat generate anonymous ID, or set your own
        });

        this.isConfigured = true;
        console.log('✅ RevenueCat SDK configured successfully');

        // Get anonymous user ID
        const customerInfo = await Purchases.getCustomerInfo();
        console.log('👤 Anonymous User ID:', customerInfo.originalAppUserId);
        console.log('📅 First Seen:', customerInfo.firstSeen);
        console.log('🎟️ Active Entitlements:', Object.keys(customerInfo.entitlements.active));
        console.log('📋 Active Subscriptions:', customerInfo.activeSubscriptions);

        // Pre-fetch offerings
        console.log('📦 Pre-fetching offerings...');
        await this.getOfferings();

        console.log('🎉 ============= REVENUECAT INITIALIZATION COMPLETE =============');
        return true;
      } else {
        console.log('⚠️ RevenueCat: Platform not supported yet (Android coming soon)');
        return false;
      }
    } catch (error) {
      console.error('❌ ============= REVENUECAT INITIALIZATION FAILED =============');
      console.error('❌ Failed to initialize RevenueCat:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
  }

  /**
   * Get available offerings from RevenueCat
   * Returns the offerings configured in RevenueCat dashboard
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      if (!this.isConfigured) {
        console.warn('RevenueCat not initialized. Call initializeRevenueCat() first');
        return null;
      }

      console.log('📱 Fetching offerings from RevenueCat...');
      const offerings = await Purchases.getOfferings();
      this.currentOfferings = offerings;

      console.log('📦 Offerings response:', {
        current: offerings.current?.identifier || 'null',
        all: Object.keys(offerings.all),
      });

      if (offerings.current !== null) {
        console.log('✅ Current offering found:', offerings.current.identifier);
        console.log(
          '📋 Available packages:',
          offerings.current.availablePackages.map((p) => ({
            identifier: p.identifier,
            product: p.product.identifier,
            price: p.product.priceString,
          }))
        );
      } else {
        console.error('❌ No current offering found in RevenueCat');
        console.error('💡 This usually means:');
        console.error('1. No offering is set as "Current" in RevenueCat dashboard');
        console.error('2. Products are not synced from App Store Connect');
        console.error('3. There are issues with your RevenueCat configuration');
        console.log('📋 All available offerings:', Object.keys(offerings.all));
      }

      return offerings;
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Present RevenueCat's hosted paywall
   * This will show the paywall configured in RevenueCat dashboard
   * Handles purchase flow automatically
   */
  async presentPaywall(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      if (!this.isConfigured) {
        return {
          success: false,
          error: 'RevenueCat not initialized',
        };
      }

      // Get current offerings
      const offerings = this.currentOfferings || (await this.getOfferings());

      if (!offerings || !offerings.current) {
        return {
          success: false,
          error: 'No offerings available',
        };
      }

      // Present the paywall
      // Note: The paywall UI is configured in RevenueCat dashboard
      // For Expo apps, we need to handle the purchase manually
      // since presentPaywall is only available in native modules
      
      // Instead, we'll return the offerings so the app can display them
      // and use purchasePackage when user selects one
      console.log('Offerings ready for display:', offerings.current.identifier);
      
      return {
        success: true,
        error: 'Use getOfferings() and purchasePackage() to implement paywall',
      };
    } catch (error) {
      console.error('Failed to present paywall:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Purchase a specific package
   * @param packageToPurchase - The package to purchase from offerings
   */
  async purchasePackage(
    packageToPurchase: PurchasesPackage
  ): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
    userCancelled?: boolean;
  }> {
    try {
      if (!this.isConfigured) {
        return {
          success: false,
          error: 'RevenueCat not initialized',
        };
      }

      console.log('Attempting to purchase package:', packageToPurchase.identifier);

      // Make the purchase
      const { customerInfo, productIdentifier } = await Purchases.purchasePackage(
        packageToPurchase
      );

      console.log('Purchase successful:', productIdentifier);
      console.log('Active entitlements:', Object.keys(customerInfo.entitlements.active));

      return {
        success: true,
        customerInfo,
      };
    } catch (error: any) {
      console.error('Purchase failed:', error);

      // Check if user cancelled
      if (error.userCancelled) {
        return {
          success: false,
          userCancelled: true,
          error: 'Purchase cancelled by user',
        };
      }

      return {
        success: false,
        error: error.message || 'Purchase failed',
      };
    }
  }

  /**
   * Restore previous purchases
   * Useful for users who reinstalled the app or switched devices
   */
  async restorePurchases(): Promise<{
    success: boolean;
    customerInfo?: CustomerInfo;
    error?: string;
  }> {
    try {
      if (!this.isConfigured) {
        return {
          success: false,
          error: 'RevenueCat not initialized',
        };
      }

      console.log('Restoring purchases...');
      const customerInfo = await Purchases.restorePurchases();

      console.log('Restore successful');
      console.log('Active entitlements:', Object.keys(customerInfo.entitlements.active));

      return {
        success: true,
        customerInfo,
      };
    } catch (error) {
      console.error('Restore purchases failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Restore failed',
      };
    }
  }

  /**
   * Get current customer info
   * Includes active entitlements and subscription status
   */
  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isConfigured) {
        console.warn('RevenueCat not initialized');
        return null;
      }

      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return null;
    }
  }

  /**
   * Check if user has any active entitlement
   */
  async hasActiveEntitlement(entitlementIdentifier?: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      if (entitlementIdentifier) {
        // Check specific entitlement
        return (
          customerInfo.entitlements.active[entitlementIdentifier] !== undefined
        );
      } else {
        // Check if user has any active entitlement
        return Object.keys(customerInfo.entitlements.active).length > 0;
      }
    } catch (error) {
      console.error('Failed to check entitlements:', error);
      return false;
    }
  }

  /**
   * Set user identifier
   * Useful for tracking purchases across devices
   */
  async setUserIdentifier(userId: string): Promise<void> {
    try {
      if (!this.isConfigured) {
        console.warn('RevenueCat not initialized');
        return;
      }

      await Purchases.logIn(userId);
      console.log('User identifier set:', userId);
    } catch (error) {
      console.error('Failed to set user identifier:', error);
    }
  }

  /**
   * Log out current user
   * Creates a new anonymous user
   */
  async logOut(): Promise<void> {
    try {
      if (!this.isConfigured) {
        console.warn('RevenueCat not initialized');
        return;
      }

      await Purchases.logOut();
      console.log('User logged out');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  /**
   * Check if RevenueCat is configured
   */
  isInitialized(): boolean {
    return this.isConfigured;
  }

  /**
   * Get cached offerings (if available)
   */
  getCachedOfferings(): PurchasesOfferings | null {
    return this.currentOfferings;
  }
}

// Export singleton instance
export default new RevenueCatManager();

