import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

const { width, height } = Dimensions.get('window');

export default function ProfileResultScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // New animation refs for enhanced effects
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const loadingMessages = [
    "Processing your responses...",
    "Calculating compatibility...",
    "Setting up personalised decks...",
    "Generating insights...",
    "Almost ready..."
  ];

  useEffect(() => {
    loadUserProfile();
    startLoadingAnimation();
  }, []);

  const startLoadingAnimation = () => {
    // Generate random progress steps
    const generateRandomProgress = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const loadingSteps = [
      { progress: generateRandomProgress(15, 25), messageIndex: 0, delay: 0 },
      { progress: generateRandomProgress(35, 45), messageIndex: 1, delay: 1600 },
      { progress: generateRandomProgress(55, 65), messageIndex: 2, delay: 1600 },
      { progress: generateRandomProgress(75, 85), messageIndex: 3, delay: 1600 },
      { progress: 99, messageIndex: 4, delay: 1600 },
      { progress: 100, messageIndex: 4, delay: 1000 }
    ];

    console.log('Loading steps:', loadingSteps);
    
    let currentStep = 0;
    
    const animateProgress = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        
        console.log(`Animating to ${step.progress}%`);
        
        // Animate progress bar
        Animated.timing(progressAnim, {
          toValue: step.progress,
          duration: 1600,
          useNativeDriver: false,
        }).start();
        
        // Update progress
        setProgress(step.progress);
        
        // Fade out current message
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Update message
          setCurrentMessageIndex(step.messageIndex);
          
          // Fade in new message
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        });
        
        currentStep++;
        
        if (currentStep < loadingSteps.length) {
          setTimeout(animateProgress, step.delay);
        } else {
          // Loading complete, transition to profile
          setTimeout(() => {
            console.log('Loading complete, transitioning to profile');
            setIsLoading(false);
            startEnhancedAnimations();
          }, 1000);
        }
      }
    };

    // Start progress animation
    animateProgress();
  };

  const startEnhancedAnimations = () => {
    // Enhanced entrance animations
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

    // Continuous pulse effect for the main title
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

    // Glow effect for the radar chart
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

    // Shimmer effect for the button
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2500,
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

  const handleExploreMore = () => {
    router.replace('/home');
  };

  // Dynamic profile data generation based on quiz answers
  const generateProfileDimensions = (profile) => {
    if (!profile) {
      console.log('No profile found, using default dimensions');
      return {
        desire: 75,
        satisfaction: 70,
        openness: 80,
        communication: 75,
        trust: 80
      };
    }

    console.log('Generating dimensions for profile:', profile);

    let dimensions = {
      desire: 0,
      satisfaction: 0,
      openness: 0,
      communication: 0,
      trust: 0
    };

    // 1. DESIRE DIMENSION - Based on desire level and turn-ons
    if (profile.desireLevel === 'mild') {
      dimensions.desire = 60 + Math.floor(Math.random() * 20); // 60-80
    } else if (profile.desireLevel === 'spicy') {
      dimensions.desire = 75 + Math.floor(Math.random() * 20); // 75-95
    } else if (profile.desireLevel === 'extreme') {
      dimensions.desire = 85 + Math.floor(Math.random() * 15); // 85-100
    }

    // Bonus for adventurous turn-ons
    if (profile.turnOns?.includes('roleplay')) dimensions.desire += 5;
    if (profile.turnOns?.includes('power-play')) dimensions.desire += 5;
    if (profile.turnOns?.includes('public-play')) dimensions.desire += 8;
    if (profile.turnOns?.includes('bondage')) dimensions.desire += 7;

    // 2. SATISFACTION DIMENSION - Based on experience and personality
    if (profile.experience === 'beginner') {
      dimensions.satisfaction = 65 + Math.floor(Math.random() * 20); // 65-85
    } else if (profile.experience === 'intermediate') {
      dimensions.satisfaction = 75 + Math.floor(Math.random() * 20); // 75-95
    } else if (profile.experience === 'advanced') {
      dimensions.satisfaction = 80 + Math.floor(Math.random() * 20); // 80-100
    } else if (profile.experience === 'expert') {
      dimensions.satisfaction = 85 + Math.floor(Math.random() * 15); // 85-100
    }

    // Bonus for personality types
    if (profile.personality === 'dominant') dimensions.satisfaction += 5;
    if (profile.personality === 'switch') dimensions.satisfaction += 8;

    // 3. OPENNESS DIMENSION - Based on fantasy settings and turn-ons
    dimensions.openness = 70; // Base score
    
    // Fantasy settings bonus (multiple choice)
    if (profile.fantasySettings) {
      dimensions.openness += profile.fantasySettings.length * 3; // +3 per setting
      if (profile.fantasySettings.includes('outdoors')) dimensions.openness += 5;
      if (profile.fantasySettings.includes('public-place')) dimensions.openness += 8;
      if (profile.fantasySettings.includes('office')) dimensions.openness += 4;
      if (profile.fantasySettings.includes('car')) dimensions.openness += 6;
    }

    // Turn-ons bonus (multiple choice)
    if (profile.turnOns) {
      dimensions.openness += profile.turnOns.length * 2; // +2 per turn-on
      if (profile.turnOns.includes('sensory')) dimensions.openness += 5;
      if (profile.turnOns.includes('teasing')) dimensions.openness += 4;
    }

    // 4. COMMUNICATION DIMENSION - Based on personality and experience
    dimensions.communication = 70; // Base score
    
    if (profile.personality === 'equal') dimensions.communication += 10;
    if (profile.personality === 'switch') dimensions.communication += 8;
    if (profile.personality === 'submissive') dimensions.communication += 5;
    
    if (profile.experience === 'intermediate') dimensions.communication += 5;
    if (profile.experience === 'advanced') dimensions.communication += 8;
    if (profile.experience === 'expert') dimensions.communication += 10;

    // Bonus for communication-related turn-ons
    if (profile.turnOns?.includes('dirty-talk')) dimensions.communication += 8;
    if (profile.turnOns?.includes('roleplay')) dimensions.communication += 6;

    // 5. TRUST DIMENSION - Based on experience and personality
    dimensions.trust = 75; // Base score
    
    if (profile.experience === 'beginner') dimensions.trust += 5;
    if (profile.experience === 'intermediate') dimensions.trust += 8;
    if (profile.experience === 'advanced') dimensions.trust += 10;
    if (profile.experience === 'expert') dimensions.trust += 12;
    
    if (profile.personality === 'equal') dimensions.trust += 8;
    if (profile.personality === 'switch') dimensions.trust += 5;

    // Bonus for trust-building activities
    if (profile.turnOns?.includes('sensory')) dimensions.trust += 5;
    if (profile.turnOns?.includes('foreplay')) dimensions.trust += 4;

    // Ensure all dimensions are within 0-100 range
    Object.keys(dimensions).forEach(key => {
      dimensions[key] = Math.max(0, Math.min(100, dimensions[key]));
    });

    console.log('Generated dimensions:', dimensions);
    return dimensions;
  };

  const profileDimensions = generateProfileDimensions(userProfile);

  // Dynamic insight generation based on profile and dimensions
  const generatePersonalizedInsight = (profile, dimensions) => {
    if (!profile) {
      console.log('No profile found, using default insight');
      return {
        title: "A Sex Insight Just for You 😉",
        text: "Since you highly value Openness and Desire in sex, our Scratch off Bedroom Game 🍌 might be exactly what you're looking for!",
        icons: ["🔥", "💋", "✨"]
      };
    }

    console.log('Generating insight for profile:', profile);
    console.log('Dimensions:', dimensions);

    // Find highest scoring dimensions
    const sortedDimensions = Object.entries(dimensions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
    
    const topDimension = sortedDimensions[0];
    const secondDimension = sortedDimensions[1];

    console.log('Top dimensions:', { top: topDimension, second: secondDimension });

    // Generate insights based on desire level
    let insightText = "";
    let gameSuggestion = "";
    let icons = ["🔥", "💋", "✨"];

    if (profile.desireLevel === 'mild') {
      gameSuggestion = "Gentle Touch Massage Kit";
      icons = ["🌸", "💕", "✨"];
    } else if (profile.desireLevel === 'spicy') {
      gameSuggestion = "Truth or Dare Intimacy Edition";
      icons = ["🔥", "🎭", "💋"];
    } else if (profile.desireLevel === 'extreme') {
      gameSuggestion = "BDSM Fantasy Roleplay Deck";
      icons = ["⚡", "🔗", "😈"];
    }

    // Generate insights based on personality
    if (profile.personality === 'dominant') {
      gameSuggestion = "Power Play Command Cards";
      icons = ["👑", "⚡", "🔥"];
    } else if (profile.personality === 'submissive') {
      gameSuggestion = "Surrender & Trust Building Kit";
      icons = ["💕", "🔒", "✨"];
    } else if (profile.personality === 'switch') {
      gameSuggestion = "Versatile Intimacy Game Set";
      icons = ["🔄", "🎭", "💋"];
    }

    // Generate insights based on experience
    if (profile.experience === 'beginner') {
      gameSuggestion = "Step-by-Step Intimacy Guide";
      icons = ["📚", "💡", "🌸"];
    } else if (profile.experience === 'expert') {
      gameSuggestion = "Advanced Pleasure Mastery Kit";
      icons = ["👑", "⚡", "💎"];
    }

    // Create personalized insight text
    insightText = `Since you highly value ${topDimension[0].charAt(0).toUpperCase() + topDimension[0].slice(1)} (${topDimension[1]}%) and ${secondDimension[0].charAt(0).toUpperCase() + secondDimension[0].slice(1)} (${secondDimension[1]}%), our ${gameSuggestion} might be exactly what you're looking for!`;

    // Add specific insights based on turn-ons
    if (profile.turnOns?.includes('roleplay')) {
      insightText += " Your love for roleplay makes you perfect for our immersive scenarios!";
    }
    if (profile.turnOns?.includes('sensory')) {
      insightText += " Your sensory preferences will love our texture and temperature play kits!";
    }
    if (profile.fantasySettings?.includes('outdoors')) {
      insightText += " Your adventurous spirit craves our outdoor exploration guides!";
    }

    const finalInsight = {
      title: "A Sex Insight Just for You 😉",
      text: insightText,
      icons: icons
    };

    console.log('Generated insight:', finalInsight);
    return finalInsight;
  };

  const personalizedInsight = generatePersonalizedInsight(userProfile, profileDimensions);

  const getPersonaIcon = (persona) => {
    const icons = {
      'Seductive Explorer': '🌟',
      'Passionate Adventurer': '🔥',
      'Mysterious Seductress': '💋',
      'Wild Dreamer': '⚡',
      'Sensual Master': '👑'
    };
    return icons[persona] || '🌟';
  };

  const getDesireColor = (level) => {
    const colors = {
      'mild': '#10B981',
      'spicy': '#F59E0B',
      'extreme': '#EF4444'
    };
    return colors[level] || '#10B981';
  };

  // Loading screen
  if (isLoading) {
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

        {/* Loading Content */}
        <View style={styles.loadingContainer}>
          {/* Loading Title */}
          <Text style={styles.loadingTitle}>Analyzing Your Profile</Text>
          <Text style={styles.loadingSubtitle}>Discovering your unique desires...</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>

          {/* Loading Messages */}
          <Animated.View 
            style={[
              styles.loadingMessages,
              {
                opacity: fadeAnim
              }
            ]}
          >
            <Animated.Text 
              style={[
                styles.loadingMessage,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0]
                    })
                  }]
                }
              ]}
            >
              {loadingMessages[currentMessageIndex]}
            </Animated.Text>
          </Animated.View>

          {/* Sparkle Effect */}
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
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000', '#4D0000']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Enhanced Floating Elements with rotation */}
      <View style={styles.floatingElements}>
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              top: height * 0.1, 
              left: width * 0.1
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              top: height * 0.3, 
              right: width * 0.15
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              bottom: height * 0.2, 
              left: width * 0.2
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              top: height * 0.6, 
              left: width * 0.7
            }
          ]} 
        />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with pulse animation */}
        <Animated.View 
          style={[
            styles.header, 
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Animated.Text 
            style={[
              styles.headerTitle,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}
          >
            Your Intimacy Profile 🔥
          </Animated.Text>
          <Text style={styles.headerSubtitle}>Discover your unique desires</Text>
          
          {/* Sparkle effect */}
          <View style={styles.sparkleContainer}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={styles.sparkle}>💫</Text>
            <Text style={styles.sparkle}>🌟</Text>
          </View>
        </Animated.View>

        {/* Enhanced Radar Chart Section with glow effect */}
        <Animated.View 
          style={[
            styles.chartSection, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.radarChart,
              {
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0.3, 0.8]
                }),
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [20, 40]
                })
              }
            ]}
          >
            {/* Radar Chart Background */}
            <View style={styles.radarBackground}>
              {/* Chart axes and grid lines would go here */}
              <View style={styles.chartCenter} />
            </View>
            
            {/* Profile Data Overlay */}
            <View style={styles.profileOverlay}>
              <Text style={styles.profileTitle}>Your Profile</Text>
              <Text style={styles.profileSubtitle}>Based on your quiz answers</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Elegant Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* Enhanced Profile Dimensions with staggered animations */}
        <Animated.View 
          style={[
            styles.dimensionsSection, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Your Intimacy Dimensions</Text>
          
          {Object.entries(profileDimensions).map(([key, value], index) => (
            <Animated.View 
              key={key}
              style={[
                styles.dimensionRow,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, index % 2 === 0 ? 5 : -5]
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.dimensionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <View style={styles.dimensionBar}>
                <Animated.View 
                  style={[
                    styles.dimensionFill, 
                    { 
                      width: `${value}%`,
                      opacity: fadeAnim,
                      transform: [{
                        scaleX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1]
                        })
                      }]
                    }
                  ]} 
                />
              </View>
              <Text style={styles.dimensionValue}>{value}%</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quiz Answers Summary */}
        {userProfile && (
          <Animated.View 
            style={[
              styles.quizAnswersSection, 
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Your Quiz Answers</Text>
            
            <View style={styles.quizAnswerRow}>
              <Text style={styles.quizAnswerLabel}>Desire Level:</Text>
              <Text style={styles.quizAnswerValue}>
                {userProfile.desireLevel?.charAt(0).toUpperCase() + userProfile.desireLevel?.slice(1) || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.quizAnswerRow}>
              <Text style={styles.quizAnswerLabel}>Personality:</Text>
              <Text style={styles.quizAnswerValue}>
                {userProfile.personality?.charAt(0).toUpperCase() + userProfile.personality?.slice(1) || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.quizAnswerRow}>
              <Text style={styles.quizAnswerLabel}>Experience:</Text>
              <Text style={styles.quizAnswerValue}>
                {userProfile.experience?.charAt(0).toUpperCase() + userProfile.experience?.slice(1) || 'Not specified'}
              </Text>
            </View>
            
            {userProfile.turnOns && userProfile.turnOns.length > 0 && (
              <View style={styles.quizAnswerRow}>
                <Text style={styles.quizAnswerLabel}>Turn-Ons:</Text>
                <Text style={styles.quizAnswerValue}>
                  {userProfile.turnOns.map(turnOn => 
                    turnOn.charAt(0).toUpperCase() + turnOn.slice(1)
                  ).join(', ')}
                </Text>
              </View>
            )}
            
            {userProfile.fantasySettings && userProfile.fantasySettings.length > 0 && (
              <View style={styles.quizAnswerRow}>
                <Text style={styles.quizAnswerLabel}>Fantasy Settings:</Text>
                <Text style={styles.quizAnswerValue}>
                  {userProfile.fantasySettings.map(setting => 
                    setting.charAt(0).toUpperCase() + setting.slice(1)
                  ).join(', ')}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Enhanced Personalized Insight with floating effect */}
        <Animated.View 
          style={[
            styles.insightSection, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.insightCard,
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
            <Text style={styles.insightTitle}>{personalizedInsight.title}</Text>
            <Text style={styles.insightText}>
              {personalizedInsight.text}
            </Text>
            
            {/* Enhanced visual elements */}
            <View style={styles.insightIcons}>
              {personalizedInsight.icons.map((icon, index) => (
                <Text key={index} style={styles.insightIcon}>{icon}</Text>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        {/* Bottom Spacing for sticky button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Explore More Button with enhanced animations - Positioned above ScrollView */}
      <Animated.View 
        style={[
          styles.stickyButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.exploreButton} onPress={handleExploreMore}>
          <LinearGradient
            colors={['#DC143C', '#B22222', '#8B0000']}
            style={styles.exploreButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Shimmer Effect */}
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
            
            <Text style={styles.exploreButtonText}>Begin your Velvet journey ✨</Text>
            
            {/* Arrow indicator */}
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
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#DC143C',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: 2,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#CD5C5C',
    fontWeight: '300',
    letterSpacing: 1,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 8,
  },
  sparkleContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  sparkle: {
    fontSize: 20,
    opacity: 0.8,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  radarChart: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  radarBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenter: {
    width: 20,
    height: 20,
    backgroundColor: '#DC143C',
    borderRadius: 10,
  },
  profileOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#CD5C5C',
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: 200,
    alignSelf: 'center',
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
  dimensionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  dimensionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dimensionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 100,
  },
  dimensionBar: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderRadius: 5,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.3,
    elevation: 3,
  },
  dimensionFill: {
    height: '100%',
    backgroundColor: '#DC143C',
    borderRadius: 5,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    shadowOpacity: 0.6,
    elevation: 3,
  },
  dimensionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC143C',
    width: 50,
    textAlign: 'right',
  },
  quizAnswersSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quizAnswerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizAnswerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quizAnswerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CD5C5C',
  },
  insightSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  insightCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 8,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  insightText: {
    fontSize: 16,
    color: '#CD5C5C',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  insightHighlight: {
    color: '#DC143C',
    fontWeight: '700',
  },
  insightIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  insightIcon: {
    fontSize: 24,
    opacity: 0.8,
  },
  bottomSpacing: {
    height: 150, // Increased for sticky button to prevent clipping
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
  exploreButton: {
    borderRadius: 50,
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
    shadowOpacity: 0.6,
    minWidth: 280,
  },
  exploreButtonGradient: {
    paddingVertical: 16,
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
  exploreButtonText: {
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
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderRadius: 4,
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#DC143C',
  },
  loadingMessages: {
    marginBottom: 30,
  },
  loadingMessage: {
    fontSize: 18,
    color: '#CD5C5C',
    textAlign: 'center',
    marginBottom: 10,
  },
});
