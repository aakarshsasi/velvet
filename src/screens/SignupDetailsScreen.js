import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SignupDetailsScreen() {
  const router = useRouter();
  const { signUp, markOnboardingCompleted } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Refs for text inputs
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const displayNameInputRef = useRef(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
    loadOnboardingData();
  }, []);

  // Handle back button to go to profile-result with cleared stack
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Navigate to profile-result using replace
        router.replace('/profile-result');

        return true; // Return true to prevent default back behavior
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        subscription.remove();
      };
    }, [router])
  );

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

    // Shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadOnboardingData = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      const onboardingAnswers = await AsyncStorage.getItem('onboardingAnswers');

      if (userProfile && onboardingAnswers) {
        setOnboardingData({
          profile: JSON.parse(userProfile),
          answers: JSON.parse(onboardingAnswers),
        });
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
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

        // Navigate to home page after successful signup
        router.replace('/home');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Smart email validation and auto-focus
  const validateAndFocusNext = (email) => {
    setEmail(email);

    // More comprehensive email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(email);

    // Check if email has proper structure and is complete
    const hasAtSymbol = email.includes('@');
    const hasDotAfterAt = email.includes('.', email.indexOf('@'));

    // Get the domain part after @
    const domainPart = email.split('@')[1] || '';
    const domainParts = domainPart.split('.');

    // Define valid domain extensions (major ones)
    const validExtensions = [
      'com',
      'org',
      'net',
      'edu',
      'gov',
      'mil',
      'int',
      'in',
      'uk',
      'ca',
      'au',
      'de',
      'fr',
      'jp',
      'cn',
      'ru',
      'br',
      'mx',
      'es',
      'it',
      'nl',
      'se',
      'no',
      'dk',
      'fi',
      'pl',
      'cz',
      'hu',
      'gr',
      'pt',
      'ie',
      'be',
      'at',
      'ch',
      'lu',
      'is',
      'li',
      'mt',
      'mc',
      'sm',
      'va',
      'ad',
      'ac',
      'me',
      'info',
      'biz',
      'name',
      'pro',
      'aero',
      'coop',
      'museum',
      'travel',
      'jobs',
      'mobi',
      'asia',
      'tel',
      'cat',
      'post',
      'xxx',
      'arpa',
    ];

    // Check for multi-part extensions like co.uk, com.au, etc.
    const multiPartExtensions = [
      'co.uk',
      'com.au',
      'co.in',
      'co.jp',
      'co.kr',
      'co.za',
      'co.nz',
      'co.il',
      'co.th',
      'co.id',
      'co.my',
      'co.sg',
      'co.ph',
      'co.vn',
      'co.tw',
      'co.hk',
      'co.mo',
      'co.ke',
      'co.ug',
      'co.tz',
      'co.zw',
      'co.bw',
      'co.sz',
      'co.ls',
      'co.mw',
      'co.mz',
      'co.na',
      'co.ao',
      'co.mg',
      'co.mu',
      'co.sc',
      'co.km',
      'co.dj',
      'co.so',
      'co.et',
      'co.sd',
      'co.ss',
      'co.cf',
      'co.td',
      'co.cm',
      'co.ga',
      'co.cg',
      'co.cd',
      'co.st',
      'co.gq',
      'co.gm',
      'co.gw',
      'co.gn',
      'co.sl',
      'co.lr',
      'co.ci',
      'co.gh',
      'co.tg',
      'co.bj',
      'co.ne',
      'co.bf',
      'co.ml',
      'co.sn',
    ];

    // Check if the domain extension is valid and complete
    let hasValidExtension = false;

    if (domainParts.length >= 2) {
      const lastTwoParts = domainParts.slice(-2).join('.');
      const lastPart = domainParts[domainParts.length - 1];

      // Check for multi-part extensions first
      if (multiPartExtensions.includes(lastTwoParts.toLowerCase())) {
        hasValidExtension = true;
      } else if (validExtensions.includes(lastPart.toLowerCase())) {
        hasValidExtension = true;
      }
    }
    const isCompleteEmail =
      isValidEmail && hasAtSymbol && hasDotAfterAt && hasValidExtension;

    setIsEmailValid(isCompleteEmail);

    if (isCompleteEmail) {
      // Auto-focus to password field
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
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
        <View
          style={[
            styles.floatingCircle,
            { top: height * 0.1, left: width * 0.1 },
          ]}
        />
        <View
          style={[
            styles.floatingCircle,
            { top: height * 0.3, right: width * 0.15 },
          ]}
        />
        <View
          style={[
            styles.floatingCircle,
            { bottom: height * 0.2, left: width * 0.2 },
          ]}
        />
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
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Animated.Text
                style={[
                  styles.title,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              >
                Create Your Account ✨
              </Animated.Text>
              <Text style={styles.subtitle}>
                Just a few quick details to personalize your Velvet experience
              </Text>
            </View>

            {/* Profile Preview */}
            {onboardingData && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Your Profile Preview</Text>
                <View style={styles.previewContent}>
                  <Text style={styles.previewText}>
                    <Text style={styles.previewHighlight}>
                      {onboardingData.profile.persona}
                    </Text>{' '}
                    •
                    <Text style={styles.previewHighlight}>
                      {' '}
                      {onboardingData.profile.desireLevel
                        ?.charAt(0)
                        .toUpperCase() +
                        onboardingData.profile.desireLevel?.slice(1)}
                    </Text>{' '}
                    •
                    <Text style={styles.previewHighlight}>
                      {' '}
                      {onboardingData.profile.relationshipStatus
                        ?.charAt(0)
                        .toUpperCase() +
                        onboardingData.profile.relationshipStatus?.slice(1)}
                    </Text>
                  </Text>
                </View>
              </View>
            )}

            {/* Sign Up Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  What should we call you? 💫
                </Text>
                <TextInput
                  ref={displayNameInputRef}
                  style={styles.textInput}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  placeholderTextColor="rgba(205, 92, 92, 0.6)"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address 📧</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    ref={emailInputRef}
                    style={[
                      styles.textInput,
                      isEmailValid && styles.textInputValid,
                    ]}
                    value={email}
                    onChangeText={validateAndFocusNext}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(205, 92, 92, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />
                  {isEmailValid && (
                    <View style={styles.validIcon}>
                      <Text style={styles.validIconText}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Create a Password 🔐</Text>
                <TextInput
                  ref={passwordInputRef}
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Choose a secure password"
                  placeholderTextColor="rgba(205, 92, 92, 0.6)"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                <Text style={styles.passwordHint}>
                  Must be at least 6 characters
                </Text>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  isLoading && styles.signUpButtonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={
                    isLoading
                      ? ['#6B7280', '#4B5563']
                      : ['#DC143C', '#B22222', '#8B0000']
                  }
                  style={styles.signUpButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {/* Shimmer Effect */}
                  <Animated.View
                    style={[
                      styles.shimmer,
                      {
                        transform: [
                          {
                            translateX: shimmerAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-200, 250],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        'transparent',
                        'rgba(255, 255, 255, 0.3)',
                        'transparent',
                      ]}
                      style={styles.shimmerGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>

                  <Text style={styles.signUpButtonText}>
                    {isLoading
                      ? 'Creating Your Account...'
                      : 'Start My Velvet Journey 🚀'}
                  </Text>
                  <Text style={styles.signUpButtonSubtext}>
                    {isLoading
                      ? 'Please wait...'
                      : 'Unlock your personalized experience'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
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
  previewCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  previewHighlight: {
    color: '#FF6B9D',
    fontWeight: '700',
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    flex: 1,
  },
  textInputValid: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  validIcon: {
    position: 'absolute',
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  validIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  passwordHint: {
    fontSize: 12,
    color: '#CD5C5C',
    opacity: 0.7,
    marginLeft: 4,
  },
  signUpButton: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 16,
    elevation: 15,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
    shadowOpacity: 0.6,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  shimmerGradient: {
    width: 200,
    height: '100%',
    transform: [{ skewX: '-20deg' }],
    borderRadius: 0,
    position: 'absolute',
    left: 0,
    backfaceVisibility: 'hidden',
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  signUpButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
