import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1+ = quiz steps
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0));
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
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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
        <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Velvet</Text>
            <Text style={styles.brandSubtitle}>Play deeper. Love bolder.</Text>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Let's Spice Things Up! 🔥
            </Text>
            <Text style={styles.heroSubtitle}>
              To personalize your experience, tell us a little about what you're looking for!
            </Text>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why Take This Quiz?</Text>
            <View style={styles.infoPoints}>
              <Text style={styles.infoPoint}>• Be authentic and answer honestly to uncover your wildest dreams!</Text>
              <Text style={styles.infoPoint}>• Answer with the first thought that comes to mind—adventures await...</Text>
              <Text style={styles.infoPoint}>• This quiz was developed with care by a professional psychologist.</Text>
            </View>
          </View>

          {/* Start Quiz Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.startButtonGradient}
              >
                <Text style={styles.startButtonText}>Start Quiz</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show quiz steps
  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandSection}>
          <Text style={styles.brandSubtitle}>velvet</Text>
          <Text style={styles.brandTitle}>Velvet</Text>
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
            colors={['#EC4899', '#8B5CF6']}
            style={[styles.progressFill, { width: `${progress}%` }]}
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
            colors={canProceed() ? ['#EC4899', '#DB2777'] : ['#6B7280', '#4B5563']}
            style={styles.nextButtonGradient}
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
    backgroundColor: '#0F0F23',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  brandSection: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#EC4899',
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    fontStyle: 'italic',
  },
  tagline: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'System',
    fontStyle: 'italic',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  profileIcon: {
    fontSize: 20,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  infoBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoPoints: {
    gap: 12,
  },
  infoPoint: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
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
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 50,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
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
    color: '#9CA3AF',
    textAlign: 'center',
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
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderColor: '#EC4899',
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
    color: '#EC4899',
  },
  optionDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: '#D1D5DB',
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
    borderColor: '#6B7280',
  },
  backButtonText: {
    color: '#9CA3AF',
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
