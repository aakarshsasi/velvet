import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, hasCompletedOnboarding, loading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1+ = quiz steps
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [glowAnim] = useState(new Animated.Value(0));
  const [showIntro, setShowIntro] = useState(true);
  const [progressAnim] = useState(new Animated.Value(0));
  const [progressGlowAnim] = useState(new Animated.Value(0));

  // Check if user has already completed onboarding
  useEffect(() => {
    if (!loading && user && hasCompletedOnboarding) {
      // User has already completed onboarding, redirect to home
      router.replace('/home');
    }
  }, [user, hasCompletedOnboarding, loading, router]);

  const onboardingSteps = [
    {
      id: 'relationshipStatus',
      title: "What's Your Relationship Status? 💕",
      subtitle: "Help us understand your partnership journey",
      type: 'single',
      options: [
        { value: 'dating', label: 'Dating', description: 'Getting to know each other', color: '#10B981' },
        { value: 'committed', label: 'Committed', description: 'Exclusive relationship', color: '#EC4899' },
        { value: 'engaged', label: 'Engaged', description: 'Planning our future', color: '#8B5CF6' },
        { value: 'married', label: 'Married', description: 'Long-term partnership', color: '#F59E0B' },
        { value: 'long-term', label: 'Long-term Partners', description: 'Established relationship', color: '#EF4444' }
      ]
    },
    {
      id: 'intimacyFrequency',
      title: "How Often Are You Intimate? 🔥",
      subtitle: "Be honest about your current rhythm",
      type: 'single',
      options: [
        { value: 'daily', label: 'Daily', description: 'Very active', color: '#EF4444' },
        { value: 'weekly', label: 'Weekly', description: 'Regular connection', color: '#F59E0B' },
        { value: 'monthly', label: 'Monthly', description: 'Occasional', color: '#8B5CF6' },
        { value: 'rarely', label: 'Rarely', description: 'In a dry spell', color: '#6B7280' }
      ]
    },
    {
      id: 'biggestChallenge',
      title: "What's Your Biggest Intimacy Challenge? 🎯",
      subtitle: "We're here to help you overcome it",
      type: 'single',
      options: [
        { value: 'communication', label: 'Communication', description: 'Hard to talk about needs', color: '#10B981' },
        { value: 'time', label: 'Time & Stress', description: 'Life gets in the way', color: '#F59E0B' },
        { value: 'desire-mismatch', label: 'Desire Mismatch', description: 'Different libidos', color: '#EC4899' },
        { value: 'routine', label: 'Getting Stuck in Routine', description: 'Need more variety', color: '#8B5CF6' },
        { value: 'emotional-connection', label: 'Emotional Connection', description: 'Missing intimacy', color: '#06B6D4' }
      ]
    },
    {
      id: 'comfortLevel',
      title: "How Comfortable Are You Discussing Intimate Needs? 💬",
      subtitle: "Rate your communication comfort",
      type: 'slider',
      minValue: 0,
      maxValue: 10,
      defaultValue: 5,
      labels: {
        min: "Very Uncomfortable",
        max: "Very Comfortable"
      }
    },
    {
      id: 'desire',
      title: "What's Your Desire Level? 🔥",
      subtitle: "Help us understand your comfort zone",
      type: 'single',
      options: [
        { value: 'mild', label: 'Mild & Playful', description: 'Gentle exploration', color: '#10B981' },
        { value: 'spicy', label: 'Spicy & Adventurous', description: 'Push boundaries', color: '#F59E0B' },
        { value: 'extreme', label: 'Extreme & Wild', description: 'No limits', color: '#EF4444' }
      ]
    },
    {
      id: 'turnOns',
      title: "What Turns You Both On? 💋",
      subtitle: "Select all that excite you as a couple",
      type: 'multiple',
      options: [
        { value: 'dirty-talk', label: 'Dirty Talk', icon: '💬', color: '#EC4899' },
        { value: 'roleplay', label: 'Roleplay', icon: '🎭', color: '#8B5CF6' },
        { value: 'foreplay', label: 'Extended Foreplay', icon: '🔥', color: '#F97316' },
        { value: 'sensory', label: 'Sensory Play', icon: '✨', color: '#06B6D4' },
        { value: 'power-play', label: 'Power Dynamics', icon: '👑', color: '#8B5CF6' },
        { value: 'public-play', label: 'Public Fantasy', icon: '🌆', color: '#10B981' },
        { value: 'bondage', label: 'Light Bondage', icon: '🔗', color: '#EF4444' },
        { value: 'teasing', label: 'Teasing & Denial', icon: '😈', color: '#F59E0B' }
      ]
    },
    {
      id: 'fantasy',
      title: "Your Fantasy Settings Together 🌟",
      subtitle: "Where do your wildest dreams take place?",
      type: 'multiple',
      options: [
        { value: 'bedroom', label: 'Bedroom', icon: '🛏️', color: '#8B5CF6' },
        { value: 'kitchen', label: 'Kitchen', icon: '🍳', color: '#F59E0B' },
        { value: 'shower', label: 'Shower', icon: '🚿', color: '#06B6D4' },
        { value: 'office', label: 'Office', icon: '💼', color: '#6B7280' },
        { value: 'outdoors', label: 'Outdoors', icon: '🌳', color: '#10B981' },
        { value: 'luxury-hotel', label: 'Luxury Hotel', icon: '🏨', color: '#EC4899' },
        { value: 'car', label: 'Car', icon: '🚗', color: '#F97316' },
        { value: 'public-place', label: 'Public Place', icon: '🎭', color: '#EF4444' }
      ]
    },
    {
      id: 'improvementGoal',
      title: "What Would You Like to Improve Most? 🎯",
      subtitle: "Your main goal for better intimacy",
      type: 'single',
      options: [
        { value: 'communication', label: 'Better Communication', description: 'Talk openly about needs', color: '#10B981' },
        { value: 'variety', label: 'More Variety', description: 'Break out of routine', color: '#F59E0B' },
        { value: 'emotional-connection', label: 'Emotional Connection', description: 'Deeper intimacy', color: '#EC4899' },
        { value: 'frequency', label: 'Increase Frequency', description: 'More intimate time', color: '#8B5CF6' },
        { value: 'quality', label: 'Better Quality', description: 'More satisfying experiences', color: '#EF4444' }
      ]
    },
    {
      id: 'enhancement',
      title: "How Much Do You Want to Enhance Your Intimacy? 🔥",
      subtitle: "Your commitment to improvement",
      type: 'slider',
      minValue: 0,
      maxValue: 100,
      defaultValue: 50,
      labels: {
        min: "Just a Little",
        max: "Completely Transform"
      }
    }
  ];

  useEffect(() => {
    if (showIntro) {
      // Show intro screen
      setProgress(0);
    } else {
      // Calculate progress based on quiz steps and answers
      let answeredSteps = 0;
      onboardingSteps.forEach(step => {
        if (step.type === 'toggle' && currentStep >= onboardingSteps.indexOf(step)) {
          // Count toggle questions only when user reaches that page
          answeredSteps++;
        } else if (step.type === 'slider' && currentStep >= onboardingSteps.indexOf(step)) {
          // Count slider questions when user reaches that page
          answeredSteps++;
        } else if (answers[step.id] !== undefined) {
          if (step.type === 'multiple' && answers[step.id].length > 0) {
            answeredSteps++;
          } else if (step.type === 'single') {
            answeredSteps++;
          }
        }
      });
      const progressValue = (answeredSteps / onboardingSteps.length) * 100;
      setProgress(progressValue);
      
      // Animate progress bar update
      Animated.timing(progressAnim, {
        toValue: progressValue,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
    
    // Animate fade in and slide up
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

    // Continuous glow effect for the header
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
  }, [currentStep, showIntro, answers, onboardingSteps.length]);

  const handleStartQuiz = () => {
    setShowIntro(false);
    setCurrentStep(0);
    fadeAnim.setValue(0);
  };



  const handleAnswer = (stepId, value, isMultiple = false) => {
    if (isMultiple) {
      setAnswers(prev => ({
        ...prev,
        [stepId]: prev[stepId] 
          ? prev[stepId].includes(value)
            ? prev[stepId].filter(v => v !== value)
            : [...prev[stepId], value]
          : [value]
      }));
    } else if (typeof value === 'boolean') {
      // Handle toggle type questions
      setAnswers(prev => ({ ...prev, [stepId]: value }));
    } else if (typeof value === 'number') {
      // Handle slider type questions
      setAnswers(prev => ({ ...prev, [stepId]: value }));
    } else {
      setAnswers(prev => ({ ...prev, [stepId]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      fadeAnim.setValue(0);
      setCurrentStep(currentStep + 1);
        } else {
      generateIntimacyProfile();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      fadeAnim.setValue(0);
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (showIntro) return true;
    
    const currentStepData = onboardingSteps[currentStep];
    if (currentStepData.type === 'multiple') {
      return answers[currentStepData.id] && answers[currentStepData.id].length > 0;
    } else if (currentStepData.type === 'toggle') {
      return true; // Toggle questions are always considered answered (defaults to Yes)
    } else if (currentStepData.type === 'slider') {
      return answers[currentStepData.id] !== undefined;
    }
    return answers[currentStepData.id];
  };

  const generateIntimacyProfile = async () => {
    try {
      // Generate profile based on answers
      const profile = {
        relationshipStatus: answers.relationshipStatus || 'dating',
        intimacyFrequency: answers.intimacyFrequency || 'daily',
        biggestChallenge: answers.biggestChallenge || 'communication',
        comfortLevel: answers.comfortLevel || 5,
        desireLevel: answers.desire || 'mild',
        turnOns: answers.turnOns || [],
        fantasySettings: answers.fantasy || [],
        improvementGoal: answers.improvementGoal || 'communication',
        enhancement: answers.enhancement !== undefined ? answers.enhancement : 50,
        persona: generatePersona(answers),
        premiumSuggestions: generatePremiumSuggestions(answers)
      };
      
      // Store profile in AsyncStorage (will be saved to Firebase after sign up)
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await AsyncStorage.setItem('onboardingAnswers', JSON.stringify(answers));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'false'); // Will be true after sign up
      
      console.log('Generated Profile:', profile);
      console.log('Profile saved to AsyncStorage. User needs to sign up to save to Firebase.');
      
      // Navigate to analysis screen
      router.replace('/analysis');
    } catch (error) {
      console.error('Error saving profile:', error);
      // Still navigate to profile result even if saving fails
      router.replace('/profile-result');
    }
  };

  const generatePersona = (answers) => {
    const personas = {
      'seductive-explorer': 'Seductive Explorer',
      'passionate-adventurer': 'Passionate Adventurer',
      'mysterious-seductress': 'Mysterious Seductress',
      'wild-dreamer': 'Wild Dreamer',
      'sensual-master': 'Sensual Master'
    };
    
    // Logic to determine persona based on answers
    if (answers.desire === 'extreme' && answers.relationshipStatus === 'married') {
      return personas['wild-dreamer'];
    } else if (answers.desire === 'spicy' && answers.turnOns?.includes('roleplay')) {
      return personas['passionate-adventurer'];
    } else if (answers.desire === 'mild' && answers.turnOns?.includes('sensory')) {
      return personas['seductive-explorer'];
    }
    
    return personas['seductive-explorer'];
  };

  const generatePremiumSuggestions = (answers) => {
    const suggestions = [];
    
    if (answers.desire === 'extreme') {
      suggestions.push('Premium Extreme Fantasy Decks');
      suggestions.push('Advanced BDSM Tutorials');
    }
    
    if (answers.turnOns?.includes('roleplay')) {
      suggestions.push('Custom Roleplay Scenarios');
      suggestions.push('Professional Scripts');
    }
    
    if (answers.relationshipStatus === 'married') {
      suggestions.push("Couples' Intimacy Workbook");
      suggestions.push("Advanced Couples' Communication Techniques");
    }
    
    return suggestions;
  };

  // Show intro screen
  if (showIntro) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        <LinearGradient
          colors={['#000000', '#1A0000', '#330000', '#4D0000']}
          style={styles.background}
        />
        
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
            {/* Header with Enticing Illustration */}
            <View style={styles.header}>
              {/* Integrated Image Section */}
              <View style={styles.imageSection}>
                {/* Background gradient that flows with the page */}
                <LinearGradient
                  colors={['rgba(220, 20, 60, 0.05)', 'rgba(178, 34, 34, 0.08)', 'rgba(139, 0, 0, 0.12)']}
                  style={styles.sectionBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                
                {/* Background hearts integrated into the design */}
                <View style={styles.backgroundHeart1}>
                  <Svg width="48" height="48" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(220, 20, 60, 0.12)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart2}>
                  <Svg width="22" height="22" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(205, 92, 92, 0.15)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart3}>
                  <Svg width="36" height="36" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(178, 34, 34, 0.08)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart4}>
                  <Svg width="18" height="18" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(220, 20, 60, 0.18)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart5}>
                  <Svg width="44" height="44" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(205, 92, 92, 0.06)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart6}>
                  <Svg width="30" height="30" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(178, 34, 34, 0.14)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart7}>
                  <Svg width="26" height="26" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(220, 20, 60, 0.09)"
                    />
                  </Svg>
                </View>
                <View style={styles.backgroundHeart8}>
                  <Svg width="40" height="40" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="rgba(205, 92, 92, 0.11)"
                    />
                  </Svg>
                </View>
                
                {/* Hearts positioned around the image container */}
                <View style={styles.heartAroundTopLeft}>
                  <Svg width="26" height="26" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#DC143C"
                    />
                  </Svg>
                </View>
                <View style={styles.heartAroundTopRight}>
                  <Svg width="18" height="18" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#CD5C5C"
                    />
                  </Svg>
                </View>
                <View style={styles.heartAroundBottomLeft}>
                  <Svg width="28" height="28" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#B22222"
                    />
                  </Svg>
                </View>
                <View style={styles.heartAroundBottomRight}>
                  <Svg width="20" height="20" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#DC143C"
                    />
                  </Svg>
                </View>
                <View style={styles.heartAroundLeft}>
                  <Svg width="14" height="14" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#CD5C5C"
                    />
                  </Svg>
                </View>
                <View style={styles.heartAroundRight}>
                  <Svg width="22" height="22" viewBox="0 0 24 24">
                    <Path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="#B22222"
                    />
                  </Svg>
                </View>
                
                {/* Main image integrated into the page flow */}
                <View style={styles.integratedImageContainer}>
                  {/* Enhanced glow effect behind image */}
                  <View style={styles.imageGlowEffect} />
                  
                  <Image
                    source={require('../../assets/images/intimatepose.jpg')}
                    style={styles.integratedImage}
                    resizeMode="cover"
                  />
                  
                  {/* Subtle overlay for better text readability */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.2)']}
                    style={styles.imageOverlay}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                  
                  {/* Subtle border glow */}
                  <View style={styles.imageBorderGlow} />
                </View>
              </View>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>
                Let's Turn Up the Heat! 🔥
              </Text>
              <Text style={styles.heroSubtitle}>
                Your journey to unforgettable passion starts here, tell us what truly excites you.
              </Text>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Why Take This Quiz?</Text>
              <View style={styles.infoPoints}>
                <View style={styles.infoPointRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.infoPoint}>Uncover Your Desires, discover fantasies that will ignite your wildest dreams</Text>
                </View>
                <View style={styles.infoPointRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.infoPoint}>Trust Your Instincts, your gut feeling knows what truly excites you</Text>
                </View>
                <View style={styles.infoPointRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.infoPoint}>Expertly Crafted, designed by intimacy specialists to unlock your full potential</Text>
                </View>
              </View>
            </View>

            {/* Start Quiz Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
                <LinearGradient
                  colors={['#DC143C', '#B22222', '#8B0000']}
                  style={styles.startButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.startButtonText}>Begin the Adventure</Text>
                  <Text style={styles.startButtonSubtext}>Your fantasy awaits…</Text>
                </LinearGradient>
              </TouchableOpacity>
              

            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show quiz steps
  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000', '#4D0000']}
        style={styles.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandSection}>
          <Animated.Text style={[styles.brandTitle, { opacity: glowAnim }]}>Velvet</Animated.Text>
          <Text style={styles.tagline}>
            Play deeper. Love <Text style={styles.boldText}>bolder</Text>.
          </Text>
        </View>
        

      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={['rgba(220, 20, 60, 0.08)', 'rgba(178, 34, 34, 0.06)', 'rgba(139, 0, 0, 0.12)']}
          style={styles.progressBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.progressHeader}>
            <View style={styles.progressInline}>
              <Animated.Text style={[
                styles.progressPercentage,
                {
                  transform: [{
                    scale: progressGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02]
                    })
                  }]
                }
              ]}>
                {Math.round(progress)}%
              </Animated.Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { 
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })
              }]}>
                <LinearGradient
                  colors={['#DC143C', '#B22222', '#8B0000']}
                  style={styles.progressFillGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
          
          <View style={styles.optionsContainer}>
            {currentStepData.type === 'toggle' ? (
              // Toggle component for toggle type questions
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>No</Text>
                <TouchableOpacity
                  style={[
                    styles.toggleSwitch,
                    (answers[currentStepData.id] !== false) && styles.toggleSwitchActive
                  ]}
                  onPress={() => handleAnswer(currentStepData.id, !(answers[currentStepData.id] !== false))}
                >
                  <View style={[
                    styles.toggleThumb,
                    (answers[currentStepData.id] !== false) && styles.toggleThumbActive
                  ]} />
                </TouchableOpacity>
                <Text style={styles.toggleLabel}>Yes</Text>
              </View>
            ) : currentStepData.type === 'slider' ? (
              // Layout matching reference image
              <View style={styles.sliderContainer}>
                {/* Current value displayed prominently above */}
                <View style={styles.sliderValueDisplay}>
                  <Text style={styles.sliderCurrentValue}>
                    {Math.round(answers[currentStepData.id] || currentStepData.defaultValue || 0)}%
                  </Text>
                </View>
                
                {/* Labels positioned above the slider */}
                <View style={styles.sliderLabelsContainer}>
                  <Text style={styles.sliderMinLabel}>{currentStepData.labels.min}</Text>
                  <Text style={styles.sliderMaxLabel}>{currentStepData.labels.max}</Text>
                </View>
                
                {/* Massive slider with enhanced theme */}
                <View style={styles.sliderWrapper}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={answers[currentStepData.id] || currentStepData.defaultValue || 0}
                    onValueChange={(value) => handleAnswer(currentStepData.id, value)}
                    onSlidingComplete={(value) => handleAnswer(currentStepData.id, value)}
                    minimumTrackTintColor="#FF6B9D"
                    maximumTrackTintColor="rgba(255, 107, 157, 0.15)"
                    thumbStyle={styles.sliderThumbStyle}
                    trackStyle={styles.sliderTrackStyle}
                    thumbTintColor="#FFFFFF"
                  />
                </View>
              </View>
            ) : currentStepData.id === 'fantasy' ? (
              // Special grid layout for fantasy settings
              <View style={styles.fantasyGrid}>
                {currentStepData.options.map((option, index) => {
                  const isSelected = answers[currentStepData.id]?.includes(option.value);
                  
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.fantasyCard,
                        isSelected && styles.fantasyCardSelected,
                        { borderColor: option.color }
                      ]}
                      onPress={() => handleAnswer(currentStepData.id, option.value, true)}
                    >
                      <View style={styles.fantasyCardContent}>
                        <View style={styles.fantasyCardHeader}>
                          <Text style={styles.fantasyCardIcon}>{option.icon}</Text>
                          <View style={styles.fantasyCardBadge}>
                            <Text style={styles.fantasyCardBadgeText}>
                              {isSelected ? 'Selected' : 'Tap'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.fantasyCardBody}>
                          <Text style={[styles.fantasyCardLabel, isSelected && styles.fantasyCardLabelSelected]}>
                            {option.label}
                          </Text>
                        </View>
                        <View style={styles.fantasyCardFooter}>
                          {isSelected ? (
                            <View style={[styles.fantasyCardCheckmark, { backgroundColor: option.color }]}>
                              <Text style={styles.fantasyCardCheckmarkText}>✓</Text>
                            </View>
                          ) : (
                            <View style={styles.fantasyCardIndicator}>
                              <Text style={styles.fantasyCardIndicatorText}>+</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : currentStepData.id === 'experience' ? (
              // Compact experience level layout
              <View style={styles.experienceCompactContainer}>
                {currentStepData.options.map((option, index) => {
                  const isSelected = answers[currentStepData.id] === option.value;
                  
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.experienceCompactCard,
                        isSelected && styles.experienceCompactCardSelected,
                        { borderColor: option.color }
                      ]}
                      onPress={() => handleAnswer(currentStepData.id, option.value)}
                    >
                      <View style={styles.experienceCompactContent}>
                        <View style={styles.experienceCompactLeft}>
                          <View style={styles.experienceCompactLevel}>
                            <Text style={styles.experienceCompactLevelText}>{index + 1}</Text>
                          </View>
                          <Text style={styles.experienceCompactIcon}>{option.icon}</Text>
                        </View>
                        <View style={styles.experienceCompactCenter}>
                          <Text style={[styles.experienceCompactLabel, isSelected && styles.experienceCompactLabelSelected]}>
                            {option.label}
                          </Text>
                          {option.description && (
                            <Text style={[styles.experienceCompactDescription, isSelected && styles.experienceCompactDescriptionSelected]}>
                              {option.description}
                            </Text>
                          )}
                        </View>
                        <View style={styles.experienceCompactRight}>
                          {isSelected ? (
                            <View style={[styles.experienceCompactCheckmark, { backgroundColor: option.color }]}>
                              <Text style={styles.experienceCompactCheckmarkText}>✓</Text>
                            </View>
                          ) : (
                            <View style={styles.experienceCompactIndicator}>
                              <Text style={styles.experienceCompactIndicatorText}>•</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              // Regular layout for other questions
              currentStepData.options.map((option, index) => {
                const isSelected = currentStepData.type === 'multiple'
                  ? answers[currentStepData.id]?.includes(option.value)
                  : answers[currentStepData.id] === option.value;
                
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                      { borderColor: option.color }
                    ]}
                    onPress={() => handleAnswer(currentStepData.id, option.value, currentStepData.type === 'multiple')}
                  >
                    <View style={styles.optionContent}>
                      {option.icon && (
                        <Text style={styles.optionIcon}>{option.icon}</Text>
                      )}
                      <View style={styles.optionTextContainer}>
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {option.label}
                        </Text>
                        {option.description && (
                          <Text style={styles.optionDescription}>
                            {option.description}
                          </Text>
                        )}
                      </View>
                    </View>
                    {isSelected && (
                      <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        

        
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={nextStep}
          disabled={!canProceed()}
        >
          <LinearGradient
            colors={canProceed() ? ['#DC143C', '#B22222', '#8B0000'] : ['#6B7280', '#4B5563']}
            style={styles.nextButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Submit' : 'Next'}
                </Text>
          </LinearGradient>
            </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  brandSection: {
    alignItems: 'flex-start',
    flex: 1,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(220, 20, 60, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  imageSection: {
    width: '100%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  sectionBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  integratedImageContainer: {
    width: '90%',
    height: 140,
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  integratedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageGlowEffect: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  imageBorderGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  backgroundHeart1: {
    position: 'absolute',
    top: 15,
    left: '3%',
    zIndex: 1,
  },
  backgroundHeart2: {
    position: 'absolute',
    top: 95,
    right: '5%',
    zIndex: 1,
  },
  backgroundHeart3: {
    position: 'absolute',
    top: 165,
    left: '8%',
    zIndex: 1,
  },
  backgroundHeart4: {
    position: 'absolute',
    top: 45,
    right: '25%',
    zIndex: 1,
  },
  backgroundHeart5: {
    position: 'absolute',
    top: 125,
    left: '18%',
    zIndex: 1,
  },
  backgroundHeart6: {
    position: 'absolute',
    top: 200,
    right: '12%',
    zIndex: 1,
  },
  backgroundHeart7: {
    position: 'absolute',
    top: 75,
    left: '30%',
    zIndex: 1,
  },
  backgroundHeart8: {
    position: 'absolute',
    top: 185,
    right: '22%',
    zIndex: 1,
  },
  heartAroundTopLeft: {
    position: 'absolute',
    top: 15,
    left: '2%',
    zIndex: 5,
  },
  heartAroundTopRight: {
    position: 'absolute',
    top: 20,
    right: '2%',
    zIndex: 5,
  },
  heartAroundBottomLeft: {
    position: 'absolute',
    bottom: 15,
    left: '2%',
    zIndex: 5,
  },
  heartAroundBottomRight: {
    position: 'absolute',
    bottom: 20,
    right: '2%',
    zIndex: 5,
  },
  heartAroundLeft: {
    position: 'absolute',
    top: '50%',
    left: '0.5%',
    marginTop: -8,
    zIndex: 5,
  },
  heartAroundRight: {
    position: 'absolute',
    top: '50%',
    right: '0.5%',
    marginTop: -9.5,
    zIndex: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#CD5C5C',
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  boldText: {
    fontWeight: '800',
    color: '#CD5C5C',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.5)',
  },
  profileIcon: {
    fontSize: 20,
    color: '#CD5C5C',
  },
    heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#CD5C5C',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    fontWeight: '400',
  },
    infoBox: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoPoints: {
    gap: 8,
  },
  infoPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#DC143C',
    fontWeight: 'bold',
    marginTop: 2,
  },
  infoPoint: {
    fontSize: 14,
    color: '#CD5C5C',
    lineHeight: 20,
    fontWeight: '400',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  startButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },

  bottomSpacing: {
    height: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  progressInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(220, 20, 60, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: 0,
  },
  progressLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.3,
    opacity: 0.8,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 8,
    position: 'relative',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'transparent',
    borderRadius: 3,
    overflow: 'visible',
    width: '100%',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    position: 'relative',
    zIndex: 2,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 4,
  },
  progressFillGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(220, 20, 60, 0.3)',
    borderRadius: 5,
    zIndex: 1,
    overflow: 'hidden',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    marginBottom: 25,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: 0.8,
    textShadowColor: 'rgba(220, 20, 60, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  stepSubtitle: {
    fontSize: 18,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  optionsContainer: {
    gap: 20,
  },
  fantasyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  experienceContainer: {
    gap: 16,
  },
  experienceCompactContainer: {
    gap: 12,
  },
    option: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  fantasyCard: {
    width: '48%',
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.2)',
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  experienceCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  experienceCompactCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fantasyCardSelected: {
    backgroundColor: 'rgba(220, 20, 60, 0.12)',
    borderColor: '#DC143C',
    borderWidth: 3,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  experienceCardSelected: {
    backgroundColor: 'rgba(220, 20, 60, 0.12)',
    borderColor: '#DC143C',
    borderWidth: 3,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  experienceCompactCardSelected: {
    backgroundColor: 'rgba(220, 20, 60, 0.12)',
    borderColor: '#DC143C',
    borderWidth: 3,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.01 }],
  },
    optionSelected: {
    backgroundColor: 'rgba(220, 20, 60, 0.12)',
    borderColor: '#DC143C',
    borderWidth: 3,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    transform: [{ scale: 1.02 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fantasyCardContent: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
  },
  experienceCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  experienceCompactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fantasyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fantasyCardIcon: {
    fontSize: 28,
    opacity: 0.9,
  },
  experienceLevel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  experienceCompactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 80,
  },
  experienceCompactLevel: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCompactLevelText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  experienceCompactIcon: {
    fontSize: 20,
    opacity: 0.9,
  },
  experienceLevelText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  experienceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  experienceIcon: {
    fontSize: 24,
    opacity: 0.9,
  },
  fantasyCardBadge: {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  fantasyCardBadgeText: {
    fontSize: 10,
    color: '#CD5C5C',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 20,
    opacity: 0.9,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  fantasyCardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceCardBody: {
    marginBottom: 16,
  },
  experienceCompactCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  fantasyCardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  experienceCardLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  experienceCompactLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  experienceCompactLabelSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(220, 20, 60, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '800',
  },
  experienceCompactDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    fontWeight: '500',
    opacity: 0.8,
  },
  experienceCompactDescriptionSelected: {
    color: '#E5E7EB',
    opacity: 1,
    fontWeight: '600',
  },
  experienceCardLabelSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(220, 20, 60, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '800',
  },
  experienceCardDescription: {
    fontSize: 15,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.8,
  },
  experienceCardDescriptionSelected: {
    color: '#E5E7EB',
    opacity: 1,
    fontWeight: '600',
  },
  fantasyCardLabelSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(220, 20, 60, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '800',
  },
  fantasyCardFooter: {
    alignItems: 'center',
  },
  experienceCardFooter: {
    alignItems: 'center',
  },
  experienceCompactRight: {
    alignItems: 'center',
    minWidth: 40,
  },
  fantasyCardCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  experienceCardCheckmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  experienceCompactCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  experienceCompactCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  experienceCompactIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCompactIndicatorText: {
    color: '#CD5C5C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  experienceCardCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  experienceCardIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCardIndicatorText: {
    color: '#CD5C5C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fantasyCardCheckmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fantasyCardIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fantasyCardIndicatorText: {
    color: '#CD5C5C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 25,
  },
  toggleLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E5E7EB',
    letterSpacing: 0.5,
  },
  toggleSwitch: {
    width: 64,
    height: 36,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 18,
    padding: 2,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleSwitchActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  toggleThumb: {
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: 28 }],
  },
  sliderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 0,
    marginTop: 0,
    width: '100%',
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sliderWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  slider: {
    width: '100%',
    height: 40,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  sliderMinLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5B8D1',
    letterSpacing: 0.3,
    textAlign: 'left',
  },
  sliderMaxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5B8D1',
    letterSpacing: 0.3,
    textAlign: 'right',
  },
  sliderThumbStyle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 8,
    borderColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 20,
  },
  sliderTrackStyle: {
    height: 48,
    borderRadius: 24,
  },

  optionLabelSelected: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(220, 20, 60, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.8,
  },
  optionDescriptionSelected: {
    color: '#E5E7EB',
    opacity: 1,
    fontWeight: '600',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  backButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    alignItems: 'center',
  },
    backButtonText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
    nextButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    minWidth: 120,
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
        fontSize: 16,
    fontWeight: '600',
    },

  sliderValueDisplay: {
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  sliderCurrentValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B9D',
    textAlign: 'center',
  },
});
