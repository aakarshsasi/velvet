import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRevenueCat } from '../contexts/RevenueCatContext';
import useAnalytics from '../hooks/useAnalytics';

const { width, height } = Dimensions.get('window');

export default function PaymentScreenRevenueCat() {
  const router = useRouter();
  const { upgradeToPremium } = useAuth();
  const {
    offerings,
    isLoading: revenueCatLoading,
    purchasePackage,
    restorePurchases,
    isInitialized,
  } = useRevenueCat();
  const analytics = useAnalytics();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    startAnimations();
    analytics.trackScreen('payment', 'PaymentScreenRevenueCat');
    analytics.trackJourney('payment_screen_viewed', {
      offerings_available: offerings?.current !== null,
    });
    analytics.trackFeatureInterest('premium_upgrade', 'payment_screen_view');
  }, []);

  // Auto-select most popular package (or first package)
  useEffect(() => {
    if (offerings?.current && !selectedPackage) {
      const packages = offerings.current.availablePackages;
      if (packages.length > 0) {
        // Try to select annual package by default, or first package
        const annualPackage = packages.find(
          (p) =>
            p.identifier === '$rc_annual' ||
            p.product.identifier.toLowerCase().includes('annual')
        );
        setSelectedPackage(annualPackage || packages[0]);
      }
    }
  }, [offerings]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      return;
    }

    setIsProcessing(true);
    analytics.trackFunnelStep(
      'premium_conversion_funnel',
      'payment_attempted',
      2,
      3
    );

    try {
      const result = await purchasePackage(selectedPackage);

      if (result.success) {
        analytics.trackPremiumUpgradeSuccess(
          'payment_screen',
          'revenuecat',
          selectedPackage.product.price,
          selectedPackage.product.currencyCode
        );
        analytics.trackFunnelConversion('premium_conversion_funnel', 'payment_success', {
          package: selectedPackage.identifier,
          product: selectedPackage.product.identifier,
        });

        // Navigate to home after successful purchase
        setTimeout(() => {
          router.replace('/home');
        }, 2000);
      } else if (!result.cancelled) {
        throw new Error(result.error || 'Purchase failed');
      }
    } catch (error) {
      analytics.trackPremiumUpgradeFailure('payment_screen', 'revenuecat', error);
      analytics.trackFunnelStep('premium_conversion_funnel', 'payment_failed', 3, 3);
      analytics.trackError(error, 'payment_processing', 'error');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    analytics.trackFunnelStep(
      'premium_conversion_funnel',
      'restore_attempted',
      2,
      3
    );

    try {
      const result = await restorePurchases();
      if (result.success) {
        analytics.trackFunnelConversion(
          'premium_conversion_funnel',
          'restore_success',
          {}
        );
        // Navigate to home after successful restore
        setTimeout(() => {
          router.replace('/home');
        }, 2000);
      }
    } catch (error) {
      analytics.trackFunnelStep('premium_conversion_funnel', 'restore_failed', 3, 3);
      analytics.trackError(error, 'restore_purchases', 'error');
      console.error('Restore error:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  const getPackageDisplayName = (pkg) => {
    if (pkg.identifier === '$rc_monthly') return 'Monthly';
    if (pkg.identifier === '$rc_annual') return 'Annual';
    if (pkg.identifier === '$rc_lifetime') return 'Lifetime';
    return pkg.packageType || 'Subscription';
  };

  const getPackageDescription = (pkg) => {
    if (pkg.identifier === '$rc_monthly') return 'Perfect for exploring';
    if (pkg.identifier === '$rc_annual') return 'Best value - Save money!';
    if (pkg.identifier === '$rc_lifetime') return 'One-time purchase - Forever access';
    return 'Premium access';
  };

  const isPopular = (pkg) => {
    return pkg.identifier === '$rc_annual';
  };

  // Premium benefits
  const premiumBenefits = [
    {
      icon: '🔥',
      title: 'Unlimited Access',
      description: 'Explore all intimate content without restrictions',
    },
    {
      icon: '💎',
      title: 'Exclusive Content',
      description: 'Premium games, challenges, and experiences',
    },
    {
      icon: '🎯',
      title: 'Personalized Experience',
      description: 'AI-powered recommendations just for you',
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is encrypted and secure',
    },
  ];

  const renderPackageCard = (pkg) => (
    <TouchableOpacity
      key={pkg.identifier}
      style={[
        styles.planCard,
        selectedPackage?.identifier === pkg.identifier && styles.planCardSelected,
        isPopular(pkg) && styles.popularPlan,
      ]}
      onPress={() => {
        analytics.trackContentInteraction('payment_plan', pkg.identifier, 'select', {
          plan_name: getPackageDisplayName(pkg),
          plan_price: pkg.product.priceString,
        });
        setSelectedPackage(pkg);
      }}
    >
      {isPopular(pkg) && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}

      <LinearGradient
        colors={
          selectedPackage?.identifier === pkg.identifier
            ? ['rgba(220, 20, 60, 0.2)', 'rgba(178, 34, 34, 0.1)']
            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
        }
        style={styles.planGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.planContent}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{getPackageDisplayName(pkg)}</Text>
          <View style={styles.planPriceContainer}>
            <Text style={styles.planPrice}>{pkg.product.priceString}</Text>
            {pkg.identifier !== '$rc_lifetime' && (
              <Text style={styles.planPeriod}>
                /{pkg.identifier === '$rc_monthly' ? 'month' : 'year'}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.planDescription}>{getPackageDescription(pkg)}</Text>

        <View style={styles.planFeatures}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>All premium features</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Exclusive content</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>Priority support</Text>
          </View>
        </View>
      </View>

      {selectedPackage?.identifier === pkg.identifier && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000', '#4D0000', '#660000']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              top: 100,
              left: 50,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              top: 300,
              right: 60,
              opacity: glowAnim.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.2, 0.6],
              }),
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.05],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Upgrade to Premium</Text>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.heroTitle}>Unlock Your Intimate Journey</Text>
          <Text style={styles.heroSubtitle}>
            Join thousands of couples who&apos;ve discovered deeper connection through Velvet
            Premium
          </Text>
        </Animated.View>

        {/* Benefits Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Why Choose Velvet Premium?</Text>
          <Text style={styles.sectionSubtitle}>
            Transform your intimacy with exclusive features
          </Text>

          <View style={styles.benefitsGrid}>
            {premiumBenefits.map((benefit, index) => (
              <View key={index} style={styles.benefitCard}>
                <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Plans Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <Text style={styles.sectionSubtitle}>
            Select the perfect plan for your journey
          </Text>

          {!isInitialized || revenueCatLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
          ) : offerings?.current ? (
            <View style={styles.plansContainer}>
              {offerings.current.availablePackages.map(renderPackageCard)}
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>
                No plans available. Please try again later.
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Restore Purchases Button */}
        <Animated.View
          style={[
            styles.restoreContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isRestoring || !isInitialized}
          >
            <Text style={styles.restoreButtonText}>
              {isRestoring ? 'Restoring...' : '🔄 Restore Purchases'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Security Notice */}
        <Animated.View
          style={[
            styles.securityNotice,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your payment is secure and encrypted. Managed by Apple App Store.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Payment Button */}
      <Animated.View
        style={[
          styles.paymentButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.paymentButton,
            (isProcessing || revenueCatLoading || !selectedPackage || !isInitialized) &&
              styles.paymentButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={
            isProcessing || revenueCatLoading || !selectedPackage || !isInitialized
          }
        >
          <LinearGradient
            colors={
              isProcessing || revenueCatLoading || !selectedPackage
                ? ['#6B7280', '#4B5563']
                : ['#DC143C', '#B22222', '#8B0000']
            }
            style={styles.paymentButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.paymentButtonText}>
              {revenueCatLoading
                ? 'Loading...'
                : isProcessing
                  ? 'Processing...'
                  : selectedPackage
                    ? `Start Premium - ${selectedPackage.product.priceString}`
                    : 'Select a Plan'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  floatingElements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(220, 20, 60, 0.12)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  popularPlan: {
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  planCardSelected: {
    borderColor: '#DC143C',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#DC143C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
    zIndex: 2,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  planContent: {
    padding: 20,
    paddingRight: 50,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#DC143C',
  },
  planPeriod: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#CD5C5C',
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureIcon: {
    fontSize: 14,
    color: '#10B981',
    marginRight: 10,
    fontWeight: '700',
    marginTop: 2,
    minWidth: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#D1D5DB',
    flex: 1,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  selectedIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  restoreContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  restoreButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 16,
  },
  paymentButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(220, 20, 60, 0.3)',
    zIndex: 1000,
    elevation: 10,
  },
  paymentButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  paymentButtonDisabled: {
    opacity: 0.6,
  },
  paymentButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
    textShadowColor: 'rgba(220, 20, 60, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFB6C1',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
    fontWeight: '500',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  benefitCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 193, 0.3)',
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFB6C1',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 12,
    color: '#E5E7EB',
    lineHeight: 16,
  },
});

