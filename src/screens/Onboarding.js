import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1+ = quiz steps
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [glowAnim] = useState(new Animated.Value(0));
  const [showIntro, setShowIntro] = useState(true);

  const onboardingSteps = [
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
      title: "What Turns You On? 💋",
      subtitle: "Select all that excite you",
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
      title: "Your Fantasy Settings 🌟",
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
      id: 'personality',
      title: "Your Intimate Personality 🎭",
      subtitle: "How do you like to express yourself?",
      type: 'single',
            options: [
        { value: 'dominant', label: 'Dominant & Take Charge', description: 'You lead the way', color: '#8B5CF6' },
        { value: 'submissive', label: 'Submissive & Surrender', description: 'You follow their lead', color: '#EC4899' },
        { value: 'switch', label: 'Switch & Versatile', description: 'You love both roles', color: '#F59E0B' },
        { value: 'equal', label: 'Equal Partnership', description: 'You share control equally', color: '#10B981' }
      ]
    },
    {
      id: 'experience',
      title: "Your Experience Level 🌈",
      subtitle: "Be honest - we're here to help you grow",
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner', description: 'New to exploration', color: '#10B981' },
        { value: 'intermediate', label: 'Intermediate', description: 'Some experience', color: '#F59E0B' },
        { value: 'advanced', label: 'Advanced', description: 'Experienced explorer', color: '#EF4444' },
        { value: 'expert', label: 'Expert', description: 'Master of pleasure', color: '#8B5CF6' }
      ]
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
        if (answers[step.id]) {
          if (step.type === 'multiple' && answers[step.id].length > 0) {
            answeredSteps++;
          } else if (step.type === 'single') {
            answeredSteps++;
          }
        }
      });
      const progressValue = (answeredSteps / onboardingSteps.length) * 100;
      setProgress(progressValue);
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
  }, [currentStep, showIntro, answers]);

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
    }
    return answers[currentStepData.id];
  };

  const generateIntimacyProfile = async () => {
    try {
      // Generate profile based on answers
      const profile = {
        desireLevel: answers.desire || 'mild',
        turnOns: answers.turnOns || [],
        fantasySettings: answers.fantasy || [],
        personality: answers.personality || 'equal',
        experience: answers.experience || 'beginner',
        persona: generatePersona(answers),
        premiumSuggestions: generatePremiumSuggestions(answers)
      };
      
      // Store profile and mark onboarding as completed
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      
      console.log('Generated Profile:', profile);
      router.replace('/profile-result');
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
    if (answers.desire === 'extreme' && answers.personality === 'dominant') {
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
    
    if (answers.experience === 'beginner') {
      suggestions.push('Step-by-Step Guides');
      suggestions.push('Video Tutorials');
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
          <Text style={styles.tagline}>Play deeper. Love bolder.</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#DC143C', '#B22222', '#8B0000']}
            style={[styles.progressFill, { width: `${progress}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>
          
          <View style={styles.optionsContainer}>
            {currentStepData.options.map((option, index) => {
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
                        <Text style={[styles.optionDescription, isSelected && styles.optionDescriptionSelected]}>
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
                            })}
                        </View>
        </Animated.View>
            </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
        paddingHorizontal: 20,
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
  brandSection: {
    flex: 1,
  },

  tagline: {
    fontSize: 16,
    color: '#CD5C5C',
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.5,
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
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#CD5C5C',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#CD5C5C',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontWeight: '400',
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    },
    optionSelected: {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderColor: '#DC143C',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionLabelSelected: {
    color: '#DC143C',
  },
  optionDescription: {
    fontSize: 14,
    color: '#CD5C5C',
    lineHeight: 20,
    fontWeight: '400',
  },
  optionDescriptionSelected: {
    color: '#FFFFFF',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 16,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#CD5C5C',
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
  },
  backButtonText: {
    color: '#CD5C5C',
    fontSize: 16,
    fontWeight: '600',
    },
    nextButton: {
    flex: 1,
        borderRadius: 25,
    overflow: 'hidden',
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
});
