import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
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
import { useIAP } from '../contexts/IAPContext';
import useAnalytics from '../hooks/useAnalytics';

const { width, height } = Dimensions.get('window');

export default function PaymentScreen() {
  const router = useRouter();
  const { upgradeToPremium } = useAuth();
  const { products, isLoading: iapLoading, purchaseProduct, restorePurchases, isInitialized } = useIAP();
  const analytics = useAnalytics();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('iap');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    startAnimations();
    // Track screen view
    analytics.trackScreen('payment', 'PaymentScreen');
    analytics.trackJourney('payment_screen_viewed', { 
      selected_plan: selectedPlan,
      selected_payment_method: selectedPaymentMethod
    });
    // Track feature interest for premium upgrade
    analytics.trackFeatureInterest('premium_upgrade', 'payment_screen_view');
  }, []);

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

  // Get plans from IAP products or use defaults
  const getPlans = () => {
    if (products && products.length > 0) {
      return products.map(product => {
        const isYearly = product.productId.includes('yearly');
        return {
          id: isYearly ? 'yearly' : 'monthly',
          productId: product.productId,
          name: isYearly ? 'Yearly' : 'Monthly',
          price: product.price,
          period: isYearly ? '/year' : '/month',
          description: isYearly ? 'Best value - Save 17%' : 'Perfect for exploring',
          features: isYearly 
            ? ['Everything in Monthly', 'Exclusive content', 'Early access']
            : ['Unlimited access', 'Premium content', 'Priority support'],
          popular: isYearly,
        };
      });
    }
    
    // Fallback plans if IAP products not loaded
    return [
      {
        id: 'monthly',
        productId: 'com.velvet.premium.monthly',
        name: 'Monthly',
        price: '₹299',
        period: '/month',
        description: 'Perfect for exploring',
        features: ['Unlimited access', 'Premium content', 'Priority support'],
        popular: false,
      },
      {
        id: 'yearly',
        productId: 'com.velvet.premium.yearly',
        name: 'Yearly',
        price: '₹2,999',
        period: '/year',
        description: 'Best value - Save 17%',
        features: ['Everything in Monthly', 'Exclusive content', 'Early access'],
        popular: true,
      },
    ];
  };

  const plans = getPlans();

  // Enhanced features and benefits
  const premiumBenefits = [
    {
      icon: '🔥',
      title: 'Unlimited Access',
      description: 'Explore all intimate content without restrictions'
    },
    {
      icon: '💎',
      title: 'Exclusive Content',
      description: 'Premium games, challenges, and experiences'
    },
    {
      icon: '🎯',
      title: 'Personalized Experience',
      description: 'AI-powered recommendations just for you'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your data is encrypted and secure'
    }
  ];

  // FOMO hooks about intimacy importance
  const intimacyHooks = {
    stats: [
      {
        number: '67%',
        label: 'of couples report intimacy issues',
        description: 'Don\'t become another statistic'
      },
      {
        number: '3x',
        label: 'more likely to stay together',
        description: 'Couples who prioritize intimacy'
      },
      {
        number: '89%',
        label: 'wish they started earlier',
        description: 'Couples who improved their intimacy'
      }
    ],
    fomoMessages: [
      {
        icon: '⏰',
        title: 'Every Day You Wait',
        message: 'Your relationship grows more distant. The longer you wait, the harder it becomes to reconnect.'
      },
      {
        icon: '💔',
        title: 'The Cost of Inaction',
        message: 'Studies show that intimacy issues are the #1 cause of relationship breakdowns. Don\'t let this be you.'
      },
      {
        icon: '🔥',
        title: 'The Passion Gap',
        message: 'Without effort, passion fades. The couples who thrive are those who actively work on their intimacy.'
      }
    ]
  };

  // Urgency and scarcity elements
  const urgencyData = {
    limitedTime: true,
    discountEnds: "48 hours",
    usersOnline: "127",
    lastPurchase: "12 minutes ago"
  };

  const paymentMethods = [
    {
      id: 'iap',
      name: 'In-App Purchase',
      icon: '📱',
      description: 'Secure payment via App Store/Google Play',
      color: '#DC143C',
    },
    {
      id: 'restore',
      name: 'Restore Purchases',
      icon: '🔄',
      description: 'Restore previous purchases',
      color: '#059669',
    },
  ];

  const handlePayment = async () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a plan and payment method');
      return;
    }

    // Handle restore purchases
    if (selectedPaymentMethod === 'restore') {
      setIsProcessing(true);
      analytics.trackFunnelStep('premium_conversion_funnel', 'restore_attempted', 2, 3);
      
      try {
        const result = await restorePurchases();
        if (result.success) {
          analytics.trackFunnelConversion('premium_conversion_funnel', 'restore_success', {
            plan: selectedPlan,
            payment_method: selectedPaymentMethod
          });
        } else {
          analytics.trackFunnelStep('premium_conversion_funnel', 'restore_failed', 3, 3);
        }
      } catch (error) {
        analytics.trackError(error, 'restore_purchases', 'error');
        console.error('Restore error:', error);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Handle IAP purchase
    if (selectedPaymentMethod === 'iap') {
      if (!isInitialized) {
        Alert.alert('Error', 'In-app purchases are not available. Please try again later.');
        return;
      }

      setIsProcessing(true);
      analytics.trackFunnelStep('premium_conversion_funnel', 'payment_attempted', 2, 3);

      try {
        const selectedPlanData = plans.find(p => p.id === selectedPlan);
        if (!selectedPlanData) {
          throw new Error('Selected plan not found');
        }

        const result = await purchaseProduct(selectedPlanData.productId);
        
        if (result.success) {
          // Track successful payment
          const planValue = selectedPlan === 'monthly' ? 9.99 : 99.99;
          analytics.trackPremiumUpgradeSuccess('payment_screen', selectedPaymentMethod, planValue, 'USD');
          analytics.trackFunnelConversion('premium_conversion_funnel', 'payment_success', {
            plan: selectedPlan,
            payment_method: selectedPaymentMethod,
            value: planValue
          });
          
          // Navigate to home after successful purchase
          setTimeout(() => {
            router.replace('/home');
          }, 2000);
        } else {
          throw new Error(result.error || 'Purchase failed');
        }
      } catch (error) {
        analytics.trackPremiumUpgradeFailure('payment_screen', selectedPaymentMethod, error);
        analytics.trackFunnelStep('premium_conversion_funnel', 'payment_failed', 3, 3);
        analytics.trackError(error, 'payment_processing', 'error');
        console.error('Payment error:', error);
        
        // Error alert is handled in IAP context
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Render premium benefits section
  const renderBenefitsSection = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>Why Choose Velvet Premium?</Text>
      <Text style={styles.sectionSubtitle}>Join thousands of couples who&apos;ve transformed their intimacy</Text>
      
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
  );

  // Render intimacy importance section
  const renderIntimacyImportance = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.sectionTitle}>The Truth About Intimacy</Text>
      <Text style={styles.sectionSubtitle}>Don&apos;t let your relationship become another statistic</Text>
      
      <View style={styles.intimacyStatsContainer}>
        {intimacyHooks.stats.map((stat, index) => (
          <View key={index} style={styles.intimacyStatCard}>
            <View style={styles.statNumberContainer}>
              <Text style={styles.intimacyStatNumber}>{stat.number}</Text>
            </View>
            <View style={styles.statContentContainer}>
              <Text style={styles.intimacyStatLabel}>{stat.label}</Text>
              <Text style={styles.intimacyStatDescription}>{stat.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.fomoMessagesContainer}>
        {intimacyHooks.fomoMessages.map((message, index) => (
          <View key={index} style={styles.fomoMessageCard}>
            <Text style={styles.fomoMessageIcon}>{message.icon}</Text>
            <View style={styles.fomoMessageContent}>
              <Text style={styles.fomoMessageTitle}>{message.title}</Text>
              <Text style={styles.fomoMessageText}>{message.message}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  // Render urgency section
  const renderUrgencySection = () => (
    <Animated.View 
      style={[
        styles.urgencySection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['rgba(220, 20, 60, 0.2)', 'rgba(178, 34, 34, 0.1)']}
        style={styles.urgencyGradient}
      >
        <View style={styles.urgencyContent}>
          <Text style={styles.urgencyTitle}>⚡ Limited Time Offer</Text>
          <Text style={styles.urgencyText}>
            Join {urgencyData.usersOnline} couples online right now
          </Text>
          <Text style={styles.urgencySubtext}>
            Last purchase: {urgencyData.lastPurchase}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderPlanCard = (plan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.planCardSelected,
        plan.popular && styles.popularPlan,
      ]}
      onPress={() => {
        analytics.trackContentInteraction('payment_plan', plan.id, 'select', {
          plan_name: plan.name,
          plan_price: plan.price,
          plan_popular: plan.popular || false
        });
        setSelectedPlan(plan.id);
      }}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      <LinearGradient
        colors={
          selectedPlan === plan.id
            ? ['rgba(220, 20, 60, 0.2)', 'rgba(178, 34, 34, 0.1)']
            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
        }
        style={styles.planGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.planContent}>
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.planPriceContainer}>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planPeriod}>{plan.period}</Text>
          </View>
        </View>
        
        <Text style={styles.planDescription}>{plan.description}</Text>
        
        <View style={styles.planFeatures}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method.id && styles.paymentMethodSelected,
      ]}
      onPress={() => {
        analytics.trackContentInteraction('payment_method', method.id, 'select', {
          method_name: method.name,
          method_type: method.type
        });
        setSelectedPaymentMethod(method.id);
      }}
    >
      <LinearGradient
        colors={
          selectedPaymentMethod === method.id
            ? ['rgba(220, 20, 60, 0.2)', 'rgba(178, 34, 34, 0.1)']
            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
        }
        style={styles.paymentMethodGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.paymentMethodContent}>
        <View style={styles.paymentMethodIcon}>
          <Text style={styles.paymentMethodEmoji}>{method.icon}</Text>
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodName}>{method.name}</Text>
          <Text style={styles.paymentMethodDescription}>{method.description}</Text>
        </View>
        {selectedPaymentMethod === method.id && (
          <View style={styles.paymentMethodCheck}>
            <Text style={styles.paymentMethodCheckIcon}>✓</Text>
          </View>
        )}
      </View>
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
              transform: [{ scale: pulseAnim }]
            }
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
                outputRange: [0.2, 0.6]
              }),
              transform: [{ scale: pulseAnim.interpolate({
                inputRange: [1, 1.05],
                outputRange: [0.8, 1.2]
              })}]
            }
          ]} 
        />
      </View>

      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
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
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.heroTitle}>Unlock Your Intimate Journey</Text>
          <Text style={styles.heroSubtitle}>
            Join thousands of couples who&apos;ve discovered deeper connection through Velvet Premium
          </Text>
        </Animated.View>

        {/* Urgency Section */}
        {renderUrgencySection()}

        {/* Benefits Section */}
        {renderBenefitsSection()}

        {/* Intimacy Importance Section */}
        {renderIntimacyImportance()}

        {/* Plans Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <Text style={styles.sectionSubtitle}>Select the perfect plan for your journey</Text>
          
          <View style={styles.plansContainer}>
            {plans.map(renderPlanCard)}
          </View>
        </Animated.View>

        {/* Payment Methods Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.sectionSubtitle}>How would you like to pay?</Text>
          
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map(renderPaymentMethod)}
          </View>
        </Animated.View>


        {/* Security Notice */}
        <Animated.View 
          style={[
            styles.securityNotice,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Your payment is secure and encrypted. We never store your payment details.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Payment Button */}
      <Animated.View 
        style={[
          styles.paymentButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.paymentButton, (isProcessing || iapLoading) && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing || iapLoading || !isInitialized}
        >
          <LinearGradient
            colors={(isProcessing || iapLoading) ? ['#6B7280', '#4B5563'] : ['#DC143C', '#B22222', '#8B0000']}
            style={styles.paymentButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.paymentButtonText}>
              {iapLoading ? 'Loading...' : 
               isProcessing ? 'Processing...' : 
               selectedPaymentMethod === 'restore' ? 'Restore Purchases' :
               `Start My Premium Journey - ${plans.find(p => p.id === selectedPlan)?.price}`}
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
  headerSubtitle: {
    fontSize: 14,
    color: '#CD5C5C',
    opacity: 0.8,
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
    paddingRight: 50, // Add extra padding on right to avoid overlap with selected indicator
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
  paymentMethodsContainer: {
    gap: 12,
  },
  paymentMethodCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  paymentMethodSelected: {
    borderColor: '#DC143C',
  },
  paymentMethodGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodEmoji: {
    fontSize: 20,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  paymentMethodCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodCheckIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
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
  // Hero Section
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
  // Benefits Section
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
  // Intimacy Importance Section
  intimacyStatsContainer: {
    marginVertical: 20,
    gap: 16,
  },
  intimacyStatCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 20, 147, 0.12)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 20, 147, 0.3)',
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  statNumberContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 20, 147, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#FF1493',
    flexShrink: 0,
  },
  statContentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 4,
  },
  intimacyStatNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF1493',
    textShadowColor: 'rgba(255, 20, 147, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.3,
    textAlign: 'center',
    lineHeight: 28,
  },
  intimacyStatLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 20,
  },
  intimacyStatDescription: {
    fontSize: 13,
    color: '#FFB6C1',
    lineHeight: 18,
    fontWeight: '500',
  },
  fomoMessagesContainer: {
    marginTop: 20,
  },
  fomoMessageCard: {
    backgroundColor: 'rgba(255, 20, 147, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: '#FF1493',
    shadowColor: '#FF1493',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fomoMessageIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  fomoMessageContent: {
    flex: 1,
  },
  fomoMessageTitle: {
    fontSize: 16,
    color: '#FFB6C1',
    fontWeight: '700',
    marginBottom: 4,
  },
  fomoMessageText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
  },
  // Urgency Section
  urgencySection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  urgencyGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 69, 0, 0.4)',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  urgencyContent: {
    alignItems: 'center',
  },
  urgencyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF4500',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 69, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  urgencyText: {
    fontSize: 14,
    color: '#FFB6C1',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  urgencySubtext: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
    fontWeight: '500',
  },
});
