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

const { width, height } = Dimensions.get('window');

export default function PaymentScreen() {
  const router = useRouter();
  const { upgradeToPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    startAnimations();
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

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '₹299',
      period: '/month',
      description: 'Perfect for exploring',
      features: ['Unlimited access', 'Premium content', 'Priority support'],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '₹2,999',
      period: '/year',
      description: 'Best value - Save 17%',
      features: ['Everything in Monthly', 'Exclusive content', 'Early access'],
      popular: true,
    },
  ];

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '💳',
      description: 'Pay with UPI apps',
      color: '#4F46E5',
    },
    {
      id: 'card',
      name: 'Card',
      icon: '💎',
      description: 'Credit/Debit Card',
      color: '#DC143C',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Bank transfer',
      color: '#059669',
    },
  ];

  const handlePayment = async () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a plan and payment method');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the actual upgrade function
      await upgradeToPremium();
      
      Alert.alert(
        'Payment Successful! 🎉',
        'Welcome to Velvet Premium! You now have access to all exclusive content.',
        [
          {
            text: 'Start Exploring',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Failed',
        'There was an issue processing your payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPlanCard = (plan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.planCardSelected,
        plan.popular && styles.popularPlan,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
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
      onPress={() => setSelectedPaymentMethod(method.id)}
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
          style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={isProcessing ? ['#6B7280', '#4B5563'] : ['#DC143C', '#B22222', '#8B0000']}
            style={styles.paymentButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.paymentButtonText}>
              {isProcessing ? 'Processing...' : `Pay ${plans.find(p => p.id === selectedPlan)?.price}`}
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
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 14,
    color: '#10B981',
    marginRight: 8,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
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
});
