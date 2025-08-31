import AsyncStorage from '@react-native-async-storage/async-storage';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, markOnboardingCompleted } = useAuth();
  
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              Complete Your Profile ✨
            </Animated.Text>
            <Text style={styles.subtitle}>
              We've captured your preferences. Now let's create your account to save them permanently.
            </Text>
          </View>

          {/* Onboarding Summary */}
          {onboardingData && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your Preferences Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Desire Level:</Text>
                <Text style={styles.summaryValue}>
                  {onboardingData.profile.desireLevel?.charAt(0).toUpperCase() + onboardingData.profile.desireLevel?.slice(1)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Relationship:</Text>
                <Text style={styles.summaryValue}>
                  {onboardingData.profile.relationshipStatus?.charAt(0).toUpperCase() + onboardingData.profile.relationshipStatus?.slice(1)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Frequency:</Text>
                <Text style={styles.summaryValue}>
                  {onboardingData.profile.intimacyFrequency?.charAt(0).toUpperCase() + onboardingData.profile.intimacyFrequency?.slice(1)}
                </Text>
              </View>
            </View>
          )}

          {/* Sign Up Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(205, 92, 92, 0.6)"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="rgba(205, 92, 92, 0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                placeholderTextColor="rgba(205, 92, 92, 0.6)"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="rgba(205, 92, 92, 0.6)"
                secureTextEntry
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#6B7280', '#4B5563'] : ['#DC143C', '#B22222', '#8B0000']}
                style={styles.signUpButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account & Save Preferences'}
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
  scrollView: {
    flex: 1,
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
  summaryCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '600',
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
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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
