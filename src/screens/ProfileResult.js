import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useAuth } from '../contexts/AuthContext';
import useAnalytics from '../hooks/useAnalytics';
import { generateComprehensiveAnalysis } from '../utils/ProfileAnalysis';

// SVG content as string constant with app theme colors
const sexualPositionSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="1812.7008056640625 1549.800048828125 176.599609375 120.6998291015625" width="176.599609375" height="120.6998291015625" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="velvetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC143C;stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:#FF1493;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:0.4" />
    </linearGradient>
  </defs>
  <path fill="url(#velvetGradient)" d="M1850.8,1647.7c-0.2,1.8-0.4,3.5-0.6,5.3c-0.6,3.5-0.9,6.8-1.6,10c-0.4,1.6-0.9,4.7-1.8,5.5c-2.4,2-8.5,1.5-12.7,1.5c-1.5,0-3.1,0-4.6-0.1c-0.7-0.2-1.2-0.8-2-1c-2.3-0.6-8,0.2-9.4-1.2c0.1-0.4,0.1-0.9,0.2-1.3c0.4-0.2,0.7-0.5,1.1-0.7c3.2-1.4,7.3-1.7,11.3-2.4c2.2-0.4,8.8-0.1,9.7-1.2c2.2-2.5,2.1-7.5,2.1-12.2c0-1.4,0-2.8,0.1-4.3c0.6-4.3,1.3-8.5,1.9-12.8c0.3-1.5,1.1-4.1,0.8-5.8c-0.9-5.3-1.2-10.1-2.2-15.2c-0.5-2.3-1-4.6-1.5-6.9c-0.6-3-0.5-6.6-0.5-9.9c0,0-0.1,0-0.1,0.1c-0.2,0.3-0.4,0.6-0.6,1c0,0.7,0,1.4-0.1,2.1c-1.3,6.2,0.7,11.3,1.8,16.4c0.6,3.2-0.3,6.2-0.8,8.5c0.1,0.9,0.2,1.7,0.3,2.6c0.1,1.3,0.3,2.6,0.4,3.9c0.3,1.6,0.6,3.1,0.9,4.6c0,0,0,0-0.1,0c0,0,0-0.1,0-0.1c-1.3-1.9-1.9-4.3-2.5-6.8c-0.1-1.1-0.1-2.2-0.2-3.4c-0.2,3-0.5,5.1,0.3,7.9c0.4,1.4,1.3,3.1,1.3,5c-0.1,0-0.1-0.1-0.2-0.1c-0.7-1.2-1-2-1.7-3.2c-0.2-2-0.5-1.3-0.7,1.3c0.1,0.8,0.4,2.1,0.1,3c-0.5,0.7-1,1.5-1.5,2.2c-0.4,1.3-0.2,5.1,0.4,6.4c-0.3-1-2.4-2.2-2-5c0.4-2.7,0.3-4,0.5-6c-0.6-0.9-1.1-1.9-1.7-2.8c0.3,0.8,0.7,1.7,1,2.5c0.5,2-0.8,4.1-1.3,5.7c0,0-0.1,0-0.1-0.1c-0.4-1.1-1.1-2.1-1.5-3.4c0,0,0,0-0.1,0c0,0,0,0.1,0,0.1c-1.1,1.7-1.4,3.7-2.3,5.7c-0.5,0.7-1.1,1.4-1.6,2.2c-0.3,0.6-0.6,1.1-0.9,1.7c-0.2-1.4-1.2-3.5-1.2-5.5c0-2,1.8-8.7-0.7-12c0.4,1.4,0.8,2.8,1.1,4.4c0.3,2.1-1.2,5.4-1.5,7.3c-0.3,2,1.2,3.9,0.4,5.9c0,0,0-0.1,0-0.1c-1.5-1.4-4-6-4-7.6c0-1.6-0.3-2.4-0.2-3.6c0,0,0,0-0.1,0c-0.2,1.3-1,2.9-0.7,4.5c0.2,1,0.4,2,0.6,3c0,0,0,0-0.1,0c0,0,0-0.1,0-0.1c-1.6-1.6-2.2-5.6-1.6-9.2c0.4-2.1,2.2-3.9,0.3-7.9c0,2.3-0.5,3.7-1,5.5c-0.8,1.2-0.7,4-0.4,6.4c-0.2-0.8-1.4-1.6-1.5-4c0.2-2,1.3-4.2,1-6.4c-0.4-1.9-0.9-3.8-1.3-5.7c-1.1-6.8,2.3-6.1,0.8-17.4c-0.5-2.8-1-5-0.3-8.2c1.2-5-3.7-4.5-0.3-13.2c-1,1.2-2,3.8-2.2,5.9c-0.1,1.9,1.5,4.2,1.2,5.9c-1.1,7.6,1.9,13.3-0.8,23.6c-0.3,1.2,0.2,3.6,0.3,5.3c-0.2-0.9-1.7-4.3-0.5-12.4c-0.1-0.6-0.3-10.9-0.8-14.6c-0.4-3.7-1.9-7.2-1.4-10.1c0.2-1,0.4-2,0.6-2.9c-0.1-2.8-0.3-5.6-0.4-8.3c-0.1-3.3,1.7-11.8,8-16.7c1.9-1.5,2.6-2.5,5-2.5c2.5,0,5.2-0.3,6.2,1.2c1.4-0.6,5.3-3.8,7.3-1.8c-0.1,0.6-0.2,1.1-0.3,1.7c0.9,0.2,1.7,0.5,2.5,0.7c0.3,0.3,0.5,0.7,0.8,1c0,0,0.1-0.1,0.1-0.1c0.2-0.1,0.5-0.3,0.7-0.4c0.5,0.1,0.6,0.4,1,0.6c1.3,0.6,2.7,0.2,3.4,1.3c1,1.9-0.4,3.7-0.8,5.3c-0.5,2,0.7,4.9,1.2,6.4c0.7,2.2,3.2,5.6,4.9,6.9c0.7,0.5,1.7,0.7,2.4,1.1c0.5,0.3,1,0.6,1.5,1c1.2,0.1,2.5,0.2,3.7,0.3c1.7,0.4,3.2,1.1,5,1.5c0.8,0.1,1.5,0.3,2.3,0.4c1.6,0.3,3.6-0.3,4.9,0.3c-0.6-0.6-1.2-1.3-1.8-1.9c-0.7,0-2.1,0.2-2.5,0c-0.5-0.4-1-0.8-1.5-1.3c-1.5-0.9-3-1.7-4.5-2.5c0.5,1.2,1,2.2,1.7,3.2c-1.2-0.5-2.3-1.7-2.9-2.8c0,0-0.1,0-0.1,0.1c0,0.2-0.1,0.4-0.1,0.6c-0.1,0-0.1,0-0.2-0.1c-0.6-0.7-1.6-1.1-2.2-1.8c-0.4-0.7-0.8-1.4-1.2-2.1c-0.2,0.8-0.3,1.7-0.5,2.5c0,0,0,0-0.1,0c-0.1-1-0.2-2-0.3-3.1c0.3-1.2,1-2.7,0.6-4.5c-0.2-0.9-1.5-2.9-1.3-3.9c0.6-3.5,2.9-7.2,4.7-9.7c1.2-0.9,2.4-1.8,3.6-2.7c1.6-1.4,4.6-3.9,8.1-3.2c5.7,1.1,10.7,2.9,16.8,3.5c0,0-0.1,0-0.1,0.1c-0.5,0.2-1,0.4-1.5,0.6c0,0,0,0,0,0.1c1.5,0.5,3.4,1.7,4.1,3c0,0,0,0-0.1,0.1c-0.7-0.4-1.4-1.1-2.2-1.3c0.5,0.7,0.9,1,1.3,1.9c-0.9-0.2-1.8-0.3-2.7-0.5c0,0,0,0,0,0.1c0.4,1.2,1.6,2.3,2.9,2.6c1,0,2,0,3.1,0c0.7,0,1.4,0,2.2,0.1c1.6-0.1,3.1-0.3,4.7-0.4c0.9-0.3,1.8-0.5,2.7-0.8c1.4-0.3,3.3,0,4.4,0.3c1.3,0.2,2.6,0.3,3.9,0.5c2.6,0.8,5.2,1.6,7.8,2.4c1,0.5,2,1,3,1.5c7.9,3.5,15.3,10.9,20.4,17.2c1.7,2.3,3.4,4.6,5.1,6.9c0.6,0.8,1.3,2.6,2.2,3c1.5-0.6,3.1-1.2,4.6-1.8c3.6-0.9,7.8-0.2,10,1.4c0.7,0.5,2.2,3.1,2.5,4c0.5,1.5,0.4,3.4,0.4,5.2c0,1.3,0,2.5,0,3.8c-1,5.4-2.1,10.7-3.2,15.7c-0.6,2.4-0.4,4.9-0.8,7.6c-0.6,3.6-0.5,9.4,0.7,12.3c0.5,0.7,1,1.5,1.5,2.2c3.1,5,7.7,5.7,14.5,6.9c2.9,0.5,6.8-0.6,8,1.6c0.2,0.4,0.4,0.6,0.2,1c-0.5,0.4-1,0.7-1.5,1.1c-3.1,1.2-7.2,0.3-10.9,0.9c-1,0-2,0.1-3.1,0.1c-2.7-0.5-5.4-1.2-8-1.7c-1.2,0.1-2.5,0.1-3.7,0.2c-2,0.3-4.3-0.1-6,0.2c-1.2,0.2-1.9-0.9-3.2-0.6c-5.8,1-11.8,1.6-17.1,3.2c-5.9,1.8-11.8,3.6-17.6,5.4c-3.6,0.8-7.1,1.5-10.7,2.3c-6.5,1.7-19.4,2.3-22.7-2.5c0.2-1.9,0.5-4.6,1.3-6c0.4-0.8,2.1-2.5,1.8-3.4c-0.5-0.2-1.4-0.7-1.6-1.1c-0.6-1.3-0.6-4.6,0-5.9c1.5-3.2,7.5-7,10.6-9c-1.4-1.8-4.5-3-4.5-6.1c-3.1-1.6-6.3-3.1-9.4-4.7c-4.6-2.3-9.8-3.9-14.8-5.9c-2.9-1.2-5.8-2.4-8.7-3.6c-0.2,2.2-0.8,5.4-0.3,8.2c0,1.9,0.1,3.8,0.1,5.7c-0.3,1.1-0.7,2.2-1,3.4c-0.9,3.1-1.2,7.5-1,11.2c2.1-1,2.9,1.5,1.9,3.1C1857.9,1647.9,1854.4,1647.8,1850.8,1647.7z"/>
</svg>`;

const { width, height } = Dimensions.get('window');

export default function ProfileResultScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const analytics = useAnalytics();
  const [userProfile, setUserProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    loadUserProfile();
    startEnhancedAnimations();
    // Track screen view
    analytics.trackScreen('profile_result', 'ProfileResultScreen');
    analytics.trackFunnelStep('onboarding_funnel', 'profile_result_viewed', 5, 5);
  }, []);

  // Prevent any back navigation from profile result
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Prevent any back navigation - users can only go forward to signup
        return true; // Return true to prevent default back behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        subscription.remove();
      };
    }, [])
  );

  const startEnhancedAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      })
    ).start();
  };

  const loadUserProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('userProfile');
      const answersData = await AsyncStorage.getItem('onboardingAnswers');
      
      if (profileData && answersData) {
        const profile = JSON.parse(profileData);
        const answers = JSON.parse(answersData);
        
        setUserProfile(profile);
        
        // Generate comprehensive analysis
        const comprehensiveAnalysis = generateComprehensiveAnalysis(answers);
        setAnalysis(comprehensiveAnalysis);
        
        // Save analysis to AsyncStorage for later use
        await AsyncStorage.setItem('analysisData', JSON.stringify(comprehensiveAnalysis));
        
        console.log('Generated comprehensive analysis:', comprehensiveAnalysis);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsLoading(false);
    }
  };

  const handleContinueToSignup = () => {
    // Track signup continuation
    analytics.trackJourney('signup_continue_clicked', { source: 'profile_result' });
    analytics.trackFunnelStep('signup_funnel', 'profile_result_continue', 2, 3);
    // Navigate to signup-details using replace to clear the stack
    router.replace('/signup-details');
  };

  const handleStartExploring = () => {
    // Track exploration start
    analytics.trackJourney('start_exploring_clicked', { source: 'profile_result' });
    analytics.trackFunnelConversion('onboarding_funnel', 'exploration_started', {
      persona: analysis?.persona?.name || 'Unknown',
      user_authenticated: !!user
    });
    // Navigate to home page for logged-in users
    router.replace('/home');
  };

  // Loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        <LinearGradient
          colors={['#000000', '#1A0000', '#330000', '#4D0000']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Analyzing Your Profile</Text>
          <Text style={styles.loadingSubtitle}>Discovering your unique desires...</Text>
          
          <View style={styles.sparkleContainer}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>💫</Text>
            <Text style={styles.sparkle}>🌟</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={[styles.floatingCircle, { top: height * 0.6, left: width * 0.7 }]} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <Animated.View 
          style={[
            styles.heroHeader, 
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.heroContent}>
            <Animated.Text 
              style={[
                styles.heroTitle,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              Your Intimacy Profile ✨
            </Animated.Text>
            <Text style={styles.heroSubtitle}>Discover your unique desires</Text>
            
            {/* Sexual Position SVG Illustration */}
            <View style={styles.svgContainer}>
              <SvgXml
                xml={sexualPositionSvg}
                width="200"
                height="120"
                style={styles.heroSvg}
              />
            </View>
            
            <View style={styles.sparkleContainer}>
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>💫</Text>
              <Text style={styles.sparkle}>🌟</Text>
            </View>
          </View>
        </Animated.View>

        {/* Persona Card */}
        {analysis?.persona && (
          <Animated.View 
            style={[
              styles.personaCard, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Your Intimacy Persona</Text>
              <Text style={styles.cardSubtitle}>Based on your unique responses</Text>
            </View>

            <View style={styles.personaContent}>
              <Text style={styles.personaName}>{analysis.persona.name}</Text>
              <Text style={styles.personaDescription}>{analysis.persona.description}</Text>
              
              <View style={styles.traitsContainer}>
                {analysis.traits.slice(0, 5).map((trait, index) => (
                  <View key={index} style={styles.traitTag}>
                    <Text style={styles.traitText}>{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Insights Section */}
        {analysis?.insights && analysis.insights.length > 0 && (
          <Animated.View 
            style={[
              styles.insightsSection, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>What We Discovered About You</Text>
            </View>

            {analysis.insights.slice(0, 3).map((insight, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.insightCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, index % 2 === 0 ? 10 : -10]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.insightHeader}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                </View>
                
                <Text style={styles.insightText}>{insight.insight}</Text>
                
                {insight.tips && insight.tips.length > 0 && (
                  <View style={styles.tipsContainer}>
                    {insight.tips.slice(0, 2).map((tip, tipIndex) => (
                      <Text key={tipIndex} style={styles.tipText}>• {tip}</Text>
                    ))}
                  </View>
                )}
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {/* Recommendations Section */}
        {analysis?.recommendations && analysis.recommendations.length > 0 && (
          <Animated.View 
            style={[
              styles.recommendationsSection, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You ✨</Text>
            </View>

            <View style={styles.recommendationsGrid}>
              {analysis.recommendations.slice(0, 6).map((recommendation, index) => (
                <Animated.View 
                  key={index}
                  style={[
                    styles.recommendationCard,
                    {
                      opacity: fadeAnim,
                      transform: [{
                        translateX: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, index % 2 === 0 ? 15 : -15]
                        })
                      }]
                    }
                  ]}
                >
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Personalized Message */}
        {analysis?.personalizedMessage && (
          <Animated.View 
            style={[
              styles.messageSection, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.messageCard,
                {
                  transform: [{
                    translateY: pulseAnim.interpolate({
                      inputRange: [1, 1.05],
                      outputRange: [0, -5]
                    })
                  }]
                }
              ]}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageTitle}>Your Personalized Insight</Text>
              </View>
              
              <Text style={styles.messageText}>
                {analysis.personalizedMessage}
              </Text>
            </Animated.View>
          </Animated.View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Button */}
      <Animated.View 
        style={[
          styles.stickyButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={user ? handleStartExploring : handleContinueToSignup}
        >
          <LinearGradient
            colors={['#DC143C', '#B22222', '#8B0000']}
            style={styles.continueButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ 
                    translateX: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-200, 250],
                    }) 
                  }],
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
            
            <Text style={styles.continueButtonText}>
              {user ? 'Start Exploring 🚀' : 'Continue to Create Account ✨'}
            </Text>
            <Text style={styles.arrowIcon}>→</Text>
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
  },
  floatingElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  
  // Hero Header
  heroHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#CD5C5C',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  sparkleContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  sparkle: {
    fontSize: 24,
    opacity: 0.8,
  },
  svgContainer: {
    marginBottom: 20,
  },
  heroSvg: {
    width: '100%',
    height: '100%',
  },

  // Persona Card
  personaCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#CD5C5C',
    opacity: 0.8,
  },
  personaContent: {
    alignItems: 'center',
  },
  personaName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#DC143C',
    marginBottom: 12,
    textAlign: 'center',
  },
  personaDescription: {
    fontSize: 16,
    color: '#CD5C5C',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  traitTag: {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.4)',
  },
  traitText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Insights Section
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  insightCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.2)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  insightHeader: {
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC143C',
  },
  insightText: {
    fontSize: 16,
    color: '#CD5C5C',
    lineHeight: 24,
    marginBottom: 12,
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    marginBottom: 4,
  },

  // Recommendations Section
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  recommendationCard: {
    width: '48%',
    padding: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    elevation: 6,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Message Section
  messageSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  messageCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  messageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#CD5C5C',
    lineHeight: 24,
    textAlign: 'center',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 200,
  },

  // Sticky Button
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  continueButton: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
    shadowOpacity: 0.6,
    minWidth: 280,
  },
  continueButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
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
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  loadingSubtitle: {
    fontSize: 20,
    color: '#CD5C5C',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 30,
  },
});