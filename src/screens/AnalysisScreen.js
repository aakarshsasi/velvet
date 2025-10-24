import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useAnalytics from '../hooks/useAnalytics';

const { width, height } = Dimensions.get('window');

export default function AnalysisScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current; // Start visible
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const analysisMessages = [
    'Analyzing your responses...',
    'Calculating compatibility matrix...',
    'Generating personalized insights...',
    'Creating your intimacy profile...',
    'Almost ready...',
  ];

  useEffect(() => {
    loadUserProfile();
    startAnalysisAnimation();
    // Track screen view
    analytics.trackScreen('analysis', 'AnalysisScreen');
    analytics.trackProfileAnalysisStart();
    analytics.trackFunnelStep('onboarding_funnel', 'analysis_started', 3, 5);
  }, []);

  // Prevent any back navigation from analysis screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Prevent any back navigation - users should only go forward
        return true; // Return true to prevent default back behavior
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        subscription.remove();
      };
    }, [])
  );

  const loadUserProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const startAnalysisAnimation = () => {
    const analysisSteps = [
      { progress: 15, messageIndex: 0, delay: 0 },
      { progress: 35, messageIndex: 1, delay: 2000 },
      { progress: 55, messageIndex: 2, delay: 2000 },
      { progress: 75, messageIndex: 3, delay: 2000 },
      { progress: 90, messageIndex: 4, delay: 2000 },
      { progress: 100, messageIndex: 4, delay: 1500 },
    ];

    let currentStep = 0;

    const animateProgress = () => {
      if (currentStep < analysisSteps.length) {
        const step = analysisSteps[currentStep];

        Animated.timing(progressAnim, {
          toValue: step.progress,
          duration: 2000,
          useNativeDriver: false,
        }).start();

        setProgress(step.progress);

        // Only fade the message text, not the entire screen
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentMessageIndex(step.messageIndex);

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });

        currentStep++;

        if (currentStep < analysisSteps.length) {
          setTimeout(animateProgress, step.delay);
        } else {
          setTimeout(() => {
            // Track analysis completion
            analytics.trackProfileAnalysisComplete(userProfile, 15); // Assuming 15 seconds analysis time
            analytics.trackFunnelStep(
              'onboarding_funnel',
              'analysis_completed',
              4,
              5
            );
            router.replace('/profile-result');
          }, 2000);
        }
      }
    };

    animateProgress();
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
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              top: height * 0.15,
              left: width * 0.1,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              top: height * 0.3,
              right: width * 0.15,
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
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              bottom: height * 0.25,
              left: width * 0.2,
              opacity: glowAnim.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.3, 0.7],
              }),
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.05],
                    outputRange: [0.9, 1.1],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analyzing Your Profile</Text>
          <Text style={styles.subtitle}>
            Discovering your unique desires...
          </Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>

          <View style={styles.messageContainer}>
            <Animated.Text
              style={[
                styles.message,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {analysisMessages[currentMessageIndex]}
            </Animated.Text>
          </View>
        </View>

        {/* Sparkle Effects */}
        <View style={styles.sparkleContainer}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.sparkle}>💫</Text>
          <Text style={styles.sparkle}>🌟</Text>
        </View>
      </View>
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
    zIndex: 0,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#CD5C5C',
    fontWeight: '300',
    textAlign: 'center',
    opacity: 0.9,
  },
  progressSection: {
    alignItems: 'center',
    width: '100%',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderRadius: 4,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DC143C',
    borderRadius: 4,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.8,
    elevation: 5,
  },
  progressText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#DC143C',
  },
  messageContainer: {
    marginBottom: 40,
  },
  message: {
    fontSize: 18,
    color: '#CD5C5C',
    textAlign: 'center',
    marginBottom: 10,
  },
  sparkleContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  sparkle: {
    fontSize: 24,
    opacity: 0.8,
  },
});
