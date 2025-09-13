import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import useAnalytics from '../hooks/useAnalytics';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, markOnboardingCompleted } = useAuth();
  const analytics = useAnalytics();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnimations();
    loadOnboardingData();
    checkAuthStatus();
    
    // Track signup screen view
    analytics.trackScreen('signup', 'SignupScreen');
    analytics.trackSignupAttempt('email');
  }, []);

  // Track when user leaves signup screen (abandon tracking)
  useEffect(() => {
    return () => {
      // This runs when component unmounts (user leaves screen)
      analytics.trackSignupAbandon('signup_form', 'screen_exit');
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (hasCompletedOnboarding === 'true') {
        // User has already completed onboarding and is signed in, go to home
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

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
  };

  const loadOnboardingData = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      const onboardingAnswers = await AsyncStorage.getItem('onboardingAnswers');
      
      if (userProfile && onboardingAnswers) {
        setOnboardingData({
          profile: JSON.parse(userProfile),
          answers: JSON.parse(onboardingAnswers)
        });
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up the user
      const user = await signUp(email, password, displayName);
      
      if (user && onboardingData) {
        // Now save the onboarding data to Firebase
        await markOnboardingCompleted();
        
        // Clear AsyncStorage
        await AsyncStorage.removeItem('onboardingAnswers');
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        
        // Navigate to profile result
        router.replace('/profile-result');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000', '#4D0000']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <View style={[styles.floatingCircle, { top: height * 0.1, left: width * 0.1 }]} />
        <View style={[styles.floatingCircle, { top: height * 0.3, right: width * 0.15 }]} />
        <View style={[styles.floatingCircle, { bottom: height * 0.2, left: width * 0.2 }]} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
          {/* Header */}
          <View style={styles.header}>
            <Animated.Text 
              style={[
                styles.title,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              Your Intimacy Profile ✨
            </Animated.Text>
            <Text style={styles.subtitle}>
              We've analyzed your responses and created a personalized profile just for you. Ready to unlock your intimate potential?
            </Text>
          </View>

          {/* Personalized Insights */}
          {onboardingData && (
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>Your Personalized Insights</Text>
              
              {/* Profile Summary */}
              <View style={styles.profileCard}>
                <Text style={styles.profileTitle}>Your Intimacy Profile</Text>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Desire Level:</Text>
                  <Text style={styles.profileValue}>
                    {onboardingData.profile.desireLevel?.charAt(0).toUpperCase() + onboardingData.profile.desireLevel?.slice(1)}
                  </Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Relationship:</Text>
                  <Text style={styles.profileValue}>
                    {onboardingData.profile.relationshipStatus?.charAt(0).toUpperCase() + onboardingData.profile.relationshipStatus?.slice(1)}
                  </Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Frequency:</Text>
                  <Text style={styles.profileValue}>
                    {onboardingData.profile.intimacyFrequency?.charAt(0).toUpperCase() + onboardingData.profile.intimacyFrequency?.slice(1)}
                  </Text>
                </View>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>Persona:</Text>
                  <Text style={styles.profileValue}>
                    {onboardingData.profile.persona}
                  </Text>
                </View>
              </View>

              {/* Key Insights */}
              <View style={styles.insightsCard}>
                <Text style={styles.insightsCardTitle}>What We Discovered About You</Text>
                <View style={styles.insightItem}>
                  <Text style={styles.insightIcon}>🔥</Text>
                  <Text style={styles.insightText}>
                    You're a {onboardingData.profile.persona} who loves {onboardingData.profile.turnOns?.join(', ')} experiences
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <Text style={styles.insightIcon}>💫</Text>
                  <Text style={styles.insightText}>
                    Your biggest challenge is {onboardingData.profile.biggestChallenge?.replace('-', ' ')} - we'll help you overcome it
                  </Text>
                </View>
                <View style={styles.insightItem}>
                  <Text style={styles.insightIcon}>✨</Text>
                  <Text style={styles.insightText}>
                    You want to focus on {onboardingData.profile.improvementGoal?.replace('-', ' ')} - perfect for your journey
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Call to Action */}
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaTitle}>Ready to Begin Your Journey? 🚀</Text>
            <Text style={styles.ctaSubtitle}>
              Create your account to save your personalized profile and unlock exclusive content tailored just for you.
            </Text>

            {/* Continue Button */}
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => router.push('/signup-details')}
            >
              <LinearGradient
                colors={['#DC143C', '#B22222', '#8B0000']}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>
                  Continue to Create Account
                </Text>
                <Text style={styles.continueButtonSubtext}>
                  It only takes 30 seconds
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  floatingElements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(220, 20, 60, 0.8)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#CD5C5C',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  insightsContainer: {
    marginBottom: 40,
  },
  insightsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.4)',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 12,
  },
  profileLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '700',
  },
  insightsCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  insightsCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    flex: 1,
    lineHeight: 22,
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#CD5C5C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    opacity: 0.9,
  },
  continueButton: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 15,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
    shadowOpacity: 0.6,
  },
  continueButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  continueButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    fontSize: 16,
    color: '#CD5C5C',
    opacity: 0.8,
  },
  signInLink: {
    fontSize: 16,
    color: '#DC143C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
