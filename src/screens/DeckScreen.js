import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function DeckScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showCardReveal, setShowCardReveal] = useState(false);
  
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const cardRevealAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Enhanced animation values for card transitions
  const cardSlideAnim = useRef(new Animated.Value(0)).current;
  const cardRotateAnim = useRef(new Animated.Value(0)).current;
  const cardGlowAnim = useRef(new Animated.Value(0)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;
  const nextCardSlideAnim = useRef(new Animated.Value(0)).current;
  const nextCardOpacityAnim = useRef(new Animated.Value(1)).current;

  // Start sensual animations
  React.useEffect(() => {
    const startAnimations = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimations();
  }, []);

  // Card data for each category
  const cardDecks = {
    'mild-seduction': [
      {
        id: 1,
        title: 'The Silent Tease',
        description: 'No words, only eye contact and gestures for 10 minutes.',
        difficulty: 'Easy',
        duration: '10 min',
        icon: '👀',
        color: '#FBBF24',
      },
      {
        id: 2,
        title: 'Whisper Game',
        description: 'Whisper one desire in your partner\'s ear and see their reaction.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '💭',
        color: '#F59E0B',
      },
      {
        id: 3,
        title: 'Blindfold Guess',
        description: 'Feed your partner 3 different foods, they must guess.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '🍎',
        color: '#D97706',
      },
      {
        id: 4,
        title: 'The Slow Dance',
        description: 'One song, bodies close, minimal words.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '💃',
        color: '#F59E0B',
      },
      {
        id: 5,
        title: 'The Staring Contest',
        description: 'Whoever looks away first gives the other a kiss.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '👁️',
        color: '#FBBF24',
      },
      {
        id: 6,
        title: 'Strip Jenga',
        description: 'Each block pulled = remove one accessory (jewelry, watch, socks, etc. before clothes).',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🎲',
        color: '#D97706',
      },
      {
        id: 7,
        title: 'Hand Kiss Trail',
        description: 'Kiss slowly from the wrist to fingertips.',
        difficulty: 'Easy',
        duration: '10 min',
        icon: '💋',
        color: '#F472B6',
      },
      {
        id: 8,
        title: 'Flirty Compliment Exchange',
        description: 'Share the sexiest compliment you can think of.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '💝',
        color: '#FBBF24',
      },
      {
        id: 9,
        title: 'The Role Swap',
        description: 'Pretend to be each other for 5 minutes, with flirty exaggerations.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '🔄',
        color: '#D97706',
      },
      {
        id: 10,
        title: 'The Breath Game',
        description: 'Lean in close and just breathe near each other without touching.',
        difficulty: 'Easy',
        duration: '10 min',
        icon: '💨',
        color: '#F59E0B',
      },
      {
        id: 11,
        title: 'Mystery Touch',
        description: 'One partner touches the other with random objects (feather, pen, fabric) and they guess.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '✨',
        color: '#8B5CF6',
      },
      {
        id: 12,
        title: 'Text Me Something Naughty',
        description: 'While sitting across the room, text something teasing.',
        difficulty: 'Easy',
        duration: '10 min',
        icon: '📱',
        color: '#F472B6',
      },
      {
        id: 13,
        title: 'The Chase',
        description: 'Play a short playful "catch me if you can" around the room.',
        difficulty: 'Easy',
        duration: '10 min',
        icon: '🏃',
        color: '#F59E0B',
      },
      {
        id: 14,
        title: 'Back Drawing',
        description: 'Trace a word or shape on their back; they must guess it.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '✏️',
        color: '#D97706',
      },
      {
        id: 15,
        title: 'Clothing Dare',
        description: 'Each picks one item of the other\'s clothing they\'d like them to take off (still lighthearted).',
        difficulty: 'Medium',
        duration: '10 min',
        icon: '👕',
        color: '#F472B6',
      },
    ],
  };

  const currentDeck = cardDecks[category] || [];
  const currentCard = currentDeck[currentCardIndex];
  const progress = completedCards.size;
  const totalCards = currentDeck.length;



  const nextCard = () => {
    if (currentCardIndex < currentDeck.length - 1) {
      // Start exit animation for current card
      Animated.parallel([
        Animated.timing(nextCardSlideAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nextCardOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update card index
        setCurrentCardIndex(currentCardIndex + 1);
        
        // Reset animation values for new card
        nextCardSlideAnim.setValue(1);
        nextCardOpacityAnim.setValue(0);
        
        // Animate new card in with bounce effect
        Animated.parallel([
          Animated.spring(nextCardSlideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(nextCardOpacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Button press animation
  const animateButtonPress = (callback) => {
    Animated.sequence([
      Animated.timing(buttonPressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

    const startDeck = () => {
    
    // Reset all animation values to starting positions
    cardRevealAnim.setValue(0);
    cardScaleAnim.setValue(0.8);
    cardOpacityAnim.setValue(0);
    cardSlideAnim.setValue(0);
    cardRotateAnim.setValue(0);
    cardGlowAnim.setValue(0);
    
    // Reset card transition animations for first card
    nextCardSlideAnim.setValue(0);
    nextCardOpacityAnim.setValue(1);
    
    // Show the card reveal immediately to prevent blank screen
    setShowCardReveal(true);
    
    // Simplified animation sequence for reliability
    Animated.sequence([
      // Phase 1: Card appears and scales up
      Animated.parallel([
        Animated.timing(cardOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardScaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Card slides up
      Animated.timing(cardRevealAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Immediately transition to main deck
      setShowIntro(false);
      setShowCardReveal(false);
    });
  };

  const markAsCompleted = () => {
    setCompletedCards(prev => {
      const newSet = new Set([...prev, currentCard.id]);
      if (newSet.size === totalCards) {
        setShowCompletion(true);
      }
      return newSet;
    });
  };

  const getCategoryInfo = () => {
    switch (category) {
      case 'mild-seduction':
        return {
          name: 'Mild Seduction',
          icon: '💕',
          color: '#FBBF24',
          gradient: ['#FBBF24', '#F59E0B', '#D97706'],
          introDescription: 'Gently open up conversations and create deeper connections with your partner through playful interaction.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingHeart, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingRose, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingSparkle, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.mildSeductionElements}>
              <View style={styles.romanceIndicator}>
                <Text style={styles.romanceText}>💕 Romance Level: Sweet</Text>
              </View>
              <View style={styles.intimacyMeter}>
                <View style={styles.meterBar}>
                  <View style={styles.meterFill} />
                </View>
                <Text style={styles.meterText}>Intimacy Building</Text>
              </View>
            </View>
          ),
        };
      case 'foreplay':
        return {
          name: 'Foreplay',
          icon: '💋',
          color: '#F472B6',
          gradient: ['#F472B6', '#EC4899', '#DB2777'],
          introDescription: 'Build anticipation and explore different types of touch and sensation for deeper physical connection.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingKiss, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingLip, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingHeart, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.foreplayElements}>
              <View style={styles.sensationIndicator}>
                <Text style={styles.sensationText}>✨ Sensation Focus</Text>
              </View>
              <View style={styles.buildUpMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#F472B6' }]} />
                </View>
                <Text style={styles.meterText}>Build Up</Text>
              </View>
            </View>
          ),
        };
      case 'soft-domination':
        return {
          name: 'Soft Domination',
          icon: '👑',
          color: '#8B5CF6',
          gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'],
          introDescription: 'Explore gentle power dynamics and role-playing scenarios in a safe, loving environment.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingCrown, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingStar, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingPower, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.dominationElements}>
              <View style={styles.powerIndicator}>
                <Text style={styles.powerText}>👑 Power Exchange</Text>
              </View>
              <View style={styles.controlMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#8B5CF6' }]} />
                </View>
                <Text style={styles.meterText}>Control Level</Text>
              </View>
            </View>
          ),
        };
      default:
        return {
          name: 'Adventure',
          icon: '🎯',
          color: '#DC143C',
          gradient: ['#DC143C', '#B22222', '#8B0000'],
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingTarget, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingStar, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.defaultElements}>
              <View style={styles.adventureIndicator}>
                <Text style={styles.adventureText}>🎯 Adventure Mode</Text>
              </View>
            </View>
          ),
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No cards available for this category.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background */}
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000']}
        style={styles.background}
      />

      {/* Header - Only show when not in intro */}
      {!showIntro && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.categoryName}>Mild Seduction</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{currentCardIndex + 1} of {totalCards}</Text>
          </View>
        </View>
      )}



      {/* Full Page Dare */}
      <View style={styles.dareContainer}>
        {/* Background Theme - App Theme */}
        <LinearGradient
          colors={['#000000', '#1a0000', '#330000']}
          style={styles.dareBackground}
        />
        
        {/* Intro Screen */}
        {showIntro ? (
          <Animated.View 
            style={[
              styles.introContainer,
              {
                opacity: cardRevealAnim.interpolate({
                  inputRange: [0, 0.1],
                  outputRange: [1, 0],
                }),
                transform: [{
                  scale: cardRevealAnim.interpolate({
                    inputRange: [0, 0.1],
                    outputRange: [1, 0.95],
                  }),
                }],
              },
            ]}
          >
            {/* Sexy Background Elements */}
            <View style={styles.sexyBackgroundElements}>
              <Animated.View 
                style={[
                  styles.sexyGlowOrb,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.4, 0.8],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    }],
                  },
                ]}
              />
              <Animated.View 
                style={[
                  styles.sexyPulseRing,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.2, 0.6],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [1, 1.4],
                      }),
                    }],
                  },
                ]}
              />
            </View>

            {/* Enhanced Category Image with Sexy Effects */}
            <Animated.View 
              style={[
                styles.categoryImageContainer,
                {
                  transform: [{
                    scale: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1, 1.05],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(220, 20, 60, 0.3)', 'rgba(178, 34, 34, 0.2)', 'rgba(139, 0, 0, 0.3)']}
                style={styles.categoryImage}
              >
                <Image 
                  source={require('../../assets/images/mild-seduction.png')}
                  style={styles.categoryImagePNG}
                  resizeMode="cover"
                />
                {/* Sexy glow overlay */}
                <Animated.View 
                  style={[
                    styles.sexyImageGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.3, 0.7],
                      }),
                    },
                  ]}
                />
                {/* Subtle overlay for better integration */}
                <View style={styles.imageOverlay} />
              </LinearGradient>
            </Animated.View>
            
            {/* Enhanced Intro Content with Sexy Typography */}
            <Animated.View 
              style={[
                styles.introContent,
                {
                  transform: [{
                    translateY: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0, -5],
                    }),
                  }],
                },
              ]}
            >
              <Text style={styles.introTitle}>{categoryInfo.name}</Text>
              <Text style={styles.introSubtitle}>Ready to explore?</Text>
              <Text style={styles.introDescription}>{categoryInfo.introDescription}</Text>
              
              {/* Sexy category stats */}
              <View style={styles.categoryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{totalCards}</Text>
                  <Text style={styles.statLabel}>Challenges</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{categoryInfo.difficulty || 'Medium'}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>🔥</Text>
                  <Text style={styles.statLabel}>Hot</Text>
                </View>
              </View>
            </Animated.View>
            
            {/* Enhanced Start Deck Button with Sexy Effects */}
            <Animated.View
              style={[
                styles.startDeckButtonContainer,
                {
                  transform: [{
                    scale: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1, 1.02],
                    }),
                  }],
                },
              ]}
            >
              {/* Journey title outside button */}
              <Text style={styles.journeyTitle}>Begin Your Journey</Text>
              
              <TouchableOpacity 
                style={styles.startDeckButton} 
                onPress={() => animateButtonPress(startDeck)}
              >
                <LinearGradient
                  colors={['#DC143C', '#B22222', '#8B0000']}
                  style={styles.startDeckButtonGradient}
                >
                  {/* Sexy shimmer effect */}
                  <Animated.View
                    style={[
                      styles.sexyButtonShimmer,
                      {
                        transform: [{ translateX: glowAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [-200, 250],
                        }) }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(255, 255, 255, 0.6)', 'transparent']}
                      style={styles.sexyShimmerGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                  
                  <Text style={styles.startDeckButtonText}>Start Exploring</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        ) : (
          <>
            {/* Card Flip Animation - Only show when showCardReveal is true */}
            {showCardReveal && (
              <Animated.View 
                style={[
                  styles.cardFlipContainer,
                  {
                    transform: [
                      { translateY: cardRevealAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height * 0.5, 0],
                      })},
                      { translateX: cardSlideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width * 0.3, 0],
                      })},
                      { scale: cardScaleAnim },
                      { rotate: cardRotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-15deg', '0deg'],
                      })},
                    ],
                    opacity: cardOpacityAnim,
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(220, 20, 60, 0.8)', 'rgba(178, 34, 34, 0.7)', 'rgba(139, 0, 0, 0.8)']}
                  style={styles.cardFlipGradient}
                >
                  {/* Glow effect overlay */}
                  <Animated.View 
                    style={[
                      styles.cardGlowOverlay,
                      {
                        opacity: cardGlowAnim,
                        transform: [{ scale: cardGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }) }],
                      },
                    ]}
                  />
                  <View style={styles.cardFlipContent}>
                    <Text style={styles.cardFlipTitle}>First Challenge</Text>
                    <Text style={styles.cardFlipSubtitle}>Get ready for your first intimate adventure...</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
            
            {/* Animation test indicator */}
            {showCardReveal && (
              <View style={styles.animationTest}>
                <Text style={styles.animationTestText}>
                  Anim: {cardRevealAnim._value.toFixed(2)} | 
                  Scale: {cardScaleAnim._value.toFixed(2)} | 
                  Opacity: {cardOpacityAnim._value.toFixed(2)}
                </Text>
              </View>
            )}
            
            {/* Main Deck Content - Only show when not showing intro and not showing card reveal */}
            {(!showIntro && !showCardReveal) && currentCard && (
              <View style={styles.mainDeckContainer}>
                {/* Floating Theme Elements */}
                {categoryInfo.floatingElements}
                
                {/* Sensual Background Patterns */}
                <View style={styles.sensualPatterns}>
                  <Animated.View 
                    style={[
                      styles.patternCircle1,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.1, 0.2],
                        }),
                      },
                    ]}
                  />
                  <Animated.View 
                    style={[
                      styles.patternCircle2,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.15, 0.25],
                        }),
                      },
                    ]}
                  />
                </View>
                
                {/* Dare Content */}
                <Animated.View 
                  style={[
                    styles.dareContent,
                    {
                      transform: [
                        { translateX: nextCardSlideAnim.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: [-width * 0.5, 0, width * 0.5],
                        }) },
                      ],
                      opacity: nextCardOpacityAnim,
                    },
                  ]}
                >
                  {/* Card Header with Icon and Title */}
                  <Animated.View 
                    style={[
                      styles.cardHeader,
                      {
                        transform: [{ scale: nextCardOpacityAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }) }],
                      },
                    ]}
                  >
                    <View style={styles.cardIconContainer}>
                      <Text style={styles.cardIcon}>{currentCard.icon}</Text>
                    </View>
                    <Text style={styles.cardTitle}>{currentCard.title}</Text>
                    <View style={styles.cardDifficultyContainer}>
                      <Text style={styles.cardDifficulty}>{currentCard.difficulty}</Text>
                      <Text style={styles.cardDuration}>• {currentCard.duration}</Text>
                    </View>
                  </Animated.View>
                  
                  {/* Dare Text Card - Main Content */}
                  <View style={styles.dareTextContainer}>
                    {/* Subtle Background Pattern */}
                    <View style={styles.dareBackgroundPattern} />
                    <Text style={styles.dareText}>{currentCard.description}</Text>
                  </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View 
                  style={[
                    styles.actionButtonsContainer,
                    {
                      transform: [{ scale: buttonPressAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => animateButtonPress(nextCard)}
                  >
                    <LinearGradient
                      colors={['#DC143C', '#B22222', '#8B0000']}
                      style={styles.actionButtonGradient}
                    >
                      {/* Glossy Overlay */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.3)', 'transparent', 'rgba(255, 255, 255, 0.1)']}
                        style={styles.glossyOverlay}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                      {/* Shimmer Effect */}
                      <Animated.View
                        style={[
                          styles.buttonShimmer,
                          {
                            transform: [{ translateX: glowAnim.interpolate({
                              inputRange: [0.3, 1],
                              outputRange: [-200, 250],
                            }) }],
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
                          style={styles.shimmerGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        />
                      </Animated.View>
                      <Text style={styles.actionButtonText}>Next Prompt</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Completion Celebration */}
      {showCompletion && (
        <View style={styles.completionOverlay}>
          <LinearGradient
            colors={categoryInfo.gradient}
            style={styles.completionCard}
          >
            <Text style={styles.completionIcon}>🎉</Text>
            <Text style={styles.completionTitle}>Challenge Complete!</Text>
            <Text style={styles.completionSubtitle}>
              You've completed all {totalCards} challenges in {categoryInfo.name}
            </Text>
            <TouchableOpacity
              style={styles.completionButton}
              onPress={() => router.back()}
            >
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                style={styles.completionButtonGradient}
              >
                <Text style={styles.completionButtonText}>Back to Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}



      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              opacity: glowAnim,
              transform: [{ scale: glowAnim.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.8, 1.2],
              })}],
            },
          ]}
        />
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },

  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },

  dareContainer: {
    flex: 1,
    position: 'relative',
  },
  introContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50, // Reduced from 60 to save space
    paddingBottom: 30, // Reduced from 40 to save space
    position: 'relative',
  },
  categoryImageContainer: {
    width: width * 0.6, // Further reduced from 0.7 to save space
    height: width * 0.6, // Further reduced from 0.7 to save space
    borderRadius: 25,
    marginBottom: 20, // Further reduced from 30 to save space
    overflow: 'hidden',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    position: 'relative',
  },
  categoryImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryImageIcon: {
    fontSize: 100,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  categoryImagePNG: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,
  },
  cardFlipContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  cardFlipGradient: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  cardFlipContent: {
    alignItems: 'center',
    padding: 40,
  },
  cardFlipTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFlipSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  animationTest: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 2000,
  },
  animationTestText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },

  introContent: {
    alignItems: 'center',
    marginBottom: 20, // Reduced from 30 to save space
    paddingHorizontal: 10,
    width: '100%',
  },
  introTitle: {
    fontSize: 38, // Reduced from 42 to save space
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10, // Reduced from 15 to save space
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 1,
    lineHeight: 42, // Reduced from 48 to save space
  },
  introSubtitle: {
    fontSize: 22, // Reduced from 24 to save space
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8, // Reduced from 10 to save space
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  introDescription: {
    fontSize: 16, // Reduced from 18 to save space
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22, // Reduced from 26 to save space
    marginBottom: 15, // Reduced from 20 to save space
    paddingHorizontal: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    maxWidth: width * 0.9,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12, // Reduced from 15 to save space
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  journeyTitle: {
    fontSize: 22, // Reduced from 24 to save space
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 15, // Reduced from 20 to save space
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  startDeckButtonContainer: {
    width: width * 0.8,
    alignItems: 'center',
    marginTop: 20, // Added margin to separate from content above
  },
  startDeckButton: {
    width: '100%',
    height: 50, // Reduced from 60 since we only have text now
    borderRadius: 25, // Adjusted for new height
    overflow: 'hidden',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 20,
  },
  startDeckButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 0, // Remove padding to let flexbox handle centering
  },
  startDeckButtonText: {
    fontSize: 20, // Increased from 18 since we have more space now
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    textAlign: 'center', // Ensure center alignment
    lineHeight: 20, // Match font size for perfect centering
  },
  startDeckSubtext: {
    fontSize: 12, // Reduced from 14 to fit better
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 3, // Reduced from 5 for better spacing
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  startDeckIcon: {
    fontSize: 32, // Reduced from 40 to fit better
    color: '#FFFFFF',
    marginBottom: 0, // Remove margin to let flexbox handle spacing
    lineHeight: 32, // Match font size for perfect centering
  },
  dareBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dareContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15, // Adjusted for better spacing balance
    paddingBottom: 20, // Reduced bottom padding
    minHeight: height * 0.5, // Ensure proper height for content distribution
  },

  dareTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 40,
    borderRadius: 24,
    marginTop: 8, // Added small margin for balanced spacing
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
    width: width * 0.9,
    minHeight: height * 0.35, // Further reduced to prevent excessive height
    justifyContent: 'center',
    alignItems: 'center',
  },
  dareText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.6,
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 25,
    maxWidth: width * 0.8,
  },
  dareTextGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    zIndex: 1,
  },
  dareBackgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 20, 60, 0.03)',
    zIndex: 1,
  },

  cardHeader: {
    alignItems: 'center',
    marginBottom: 15, // Added small margin for visual separation
    marginTop: 0, // Removed top margin for visible shift
    paddingHorizontal: 20,
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardDifficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDifficulty: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },


  actionButtonsContainer: {
    alignItems: 'center',
    marginTop: 30, // Increased from 20 to create better spacing
    marginBottom: 20,
  },
  
  actionButton: {
    width: width * 0.7,
    height: 55,
    borderRadius: 27.5,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glossyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    zIndex: 2,
  },
  buttonShimmer: {
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
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.6,
  },
  
  // Themed Elements Styles
  mildSeductionElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  romanceIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  romanceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  intimacyMeter: {
    alignItems: 'center',
  },
  meterBar: {
    width: 120,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#FBBF24',
    borderRadius: 3,
  },
  meterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  
  foreplayElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  sensationIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  sensationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buildUpMeter: {
    alignItems: 'center',
  },
  
  dominationElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  powerIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  powerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  controlMeter: {
    alignItems: 'center',
  },
  
  defaultElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  adventureIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  adventureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    top: height * 0.3,
    right: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.15)',
  },
  
  // Themed Floating Elements
  floatingHeart: {
    position: 'absolute',
    top: height * 0.2,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 3,
    borderColor: 'rgba(220, 20, 60, 0.7)',
    shadowColor: 'rgba(220, 20, 60, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  floatingRose: {
    position: 'absolute',
    top: height * 0.6,
    right: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 3,
    borderColor: 'rgba(220, 20, 60, 0.7)',
    shadowColor: 'rgba(220, 20, 60, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 6,
  },
  floatingSparkle: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.7,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  floatingKiss: {
    position: 'absolute',
    top: height * 0.15,
    left: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(236, 72, 153, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.6)',
  },
  floatingLip: {
    position: 'absolute',
    top: height * 0.7,
    right: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(219, 39, 119, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(219, 39, 119, 0.6)',
  },
  floatingCrown: {
    position: 'absolute',
    top: height * 0.1,
    left: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  floatingStar: {
    position: 'absolute',
    top: height * 0.5,
    right: 60,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  floatingPower: {
    position: 'absolute',
    top: height * 0.8,
    left: width * 0.6,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  floatingTarget: {
    position: 'absolute',
    top: height * 0.25,
    left: 40,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  
  // Sensual Background Patterns
  sensualPatterns: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  patternCircle1: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(220, 20, 60, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.08)',
  },
  patternCircle2: {
    position: 'absolute',
    bottom: height * 0.15,
    left: width * 0.15,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(220, 20, 60, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.06)',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  completionCard: {
    width: width * 0.8,
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  completionIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  completionButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  completionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cardGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    zIndex: 1,
    backgroundColor: 'rgba(220, 20, 60, 0.5)',
    opacity: 0.5,
  },

  mainDeckContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30, // Adjusted from 20 to create better spacing from header
  },

  // New styles for intro page enhancements
  sexyBackgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Ensure it's behind other content
  },
  sexyGlowOrb: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.8,
  },
  sexyPulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.6,
  },
  sexyImageGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 20, 60, 0.3)',
    opacity: 0.7,
  },
  sexyButtonShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  sexyShimmerGradient: {
    width: 200,
    height: '100%',
  },

});

