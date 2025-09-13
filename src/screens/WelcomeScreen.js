import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useAuth } from '../contexts/AuthContext';
import useAnalytics from '../hooks/useAnalytics';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const analytics = useAnalytics();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
    // Track screen view for anonymous users
    analytics.trackWelcomeScreenView();
    analytics.trackScreen('welcome', 'WelcomeScreen');
    analytics.trackJourney('welcome_screen_viewed', { user_authenticated: !!user });
  }, []);

  // Welcome screen should only show for non-authenticated users
  // Routing is handled by index.tsx

  const startAnimations = () => {
    // Fade in and slide up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
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

    // Shimmer effect - optimized for cross-device compatibility
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000, // Slightly slower for better performance
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

  const handleGetStarted = () => {
    analytics.trackJourney('get_started_clicked', { source: 'welcome_screen' });
    analytics.trackFunnelStep('onboarding_funnel', 'get_started', 1, 5);
    analytics.trackOnboardingStart();
    router.push('/onboarding');
  };

  const handleSignIn = () => {
    analytics.trackJourney('sign_in_clicked', { source: 'welcome_screen' });
    analytics.trackSignupAttempt('email');
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background Gradient */}
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
        <View style={[styles.floatingCircle, { top: height * 0.6, left: width * 0.7 }]} />
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          {/* Brand Title with Heart V */}
          <Animated.View
            style={[
              styles.brandTitleContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.brandTitleRow}>
              {/* Heart V Symbol */}
              <Animated.View
                style={[
                  styles.heartV,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ]}
              >
                <Svg width="56" height="76" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="none"
                    stroke="#DC143C"
                    strokeWidth="2.5"
                  />
                </Svg>
              </Animated.View>
              
              {/* Rest of the text */}
              <Text style={styles.brandTitleRest}>elvet</Text>
            </View>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text
            style={[
              styles.tagline,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            Play deeper. Love bolder.
          </Animated.Text>
        </View>

        {/* Elegant Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* Feature Preview */}
        <View style={styles.featurePreview}>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>💋</Text>
              </View>
              <Text style={styles.featureText}>Unlock your desires</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>🔥</Text>
              </View>
              <Text style={styles.featureText}>Ignite the flame</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>✨</Text>
              </View>
              <Text style={styles.featureText}>Explore fantasies</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>💫</Text>
              </View>
              <Text style={styles.featureText}>Deepen intimacy</Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {/* Shimmer Effect */}
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{ translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-200, 250],
                    }) }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
                  style={styles.shimmerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
              
              <Text style={styles.buttonText}>Begin Your Journey</Text>
              <Text style={styles.buttonSubtext}>Discover what awaits</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Elegant Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Your intimate adventure starts here</Text>
        </View>

        {/* Existing Member Sign In */}
        <View style={styles.signInContainer}>
          <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
            <Text style={styles.signInText}>Existing Member? </Text>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
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
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingCircle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(220, 20, 60, 0.6)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandTitleContainer: {
    marginBottom: 16,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  heartV: {
    width: 56,
    height: 76,
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  brandTitleRest: {
    fontSize: 64,
    fontWeight: '900',
    color: '#DC143C',
    letterSpacing: 4,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tagline: {
    fontSize: 20,
    color: '#CD5C5C',
    fontWeight: '300',
    letterSpacing: 1,
    textAlign: 'center',
    opacity: 0.9,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: 200,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC143C',
    marginHorizontal: 16,
  },
  featurePreview: {
    width: '100%',
    marginVertical: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 14,
    color: '#CD5C5C',
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 20,
  },
  button: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
    shadowOpacity: 0.6,
  },
  buttonGradient: {
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
    // Ensure compatibility across different device densities
    zIndex: 1,
  },
  shimmerGradient: {
    width: 200,
    height: '100%',
    transform: [{ skewX: '-20deg' }],
    borderRadius: 0,
    position: 'absolute',
    left: 0,
    // Ensure smooth rendering on all devices
    backfaceVisibility: 'hidden',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(205, 92, 92, 0.8)',
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  signInContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signInText: {
    fontSize: 16,
    color: 'rgba(205, 92, 92, 0.8)',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  signInLink: {
    fontSize: 16,
    color: '#DC143C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
