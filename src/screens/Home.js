import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Path, Svg } from 'react-native-svg';
import SideMenu from '../components/SideMenu';
import { useAuth } from '../contexts/AuthContext';
import useAnalytics from '../hooks/useAnalytics';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isPremium } = useAuth();
  const analytics = useAnalytics();
  const [selectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [glowAnim] = useState(new Animated.Value(0.3));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    loadUserProfile();
    startAnimations();
    // Track screen view
    analytics.trackScreen('home', 'HomeScreen');
    analytics.trackJourney('home_screen_viewed', {
      is_premium: isPremium,
      selected_category: selectedCategory,
    });
  }, []);

  // Separate useEffect for timer management
  useEffect(() => {
    const cleanup = startTimer();
    return cleanup;
  }, []);

  // Timer function to calculate time until next day
  const calculateTimeRemaining = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight

    const diff = tomorrow.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    // Update immediately
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const timerInterval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    // Return cleanup function
    return () => {
      clearInterval(timerInterval);
    };
  };

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

  const toggleCardReveal = (cardId) => {
    setRevealedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
        analytics.trackContentInteraction('featured_card', cardId, 'hide', {
          card_id: cardId,
        });
      } else {
        newSet.add(cardId);
        // Find the card to get its category
        const card = featuredCards.find((c) => c.id === cardId);
        analytics.trackCardReveal(
          cardId,
          card?.category || 'unknown',
          'home_featured'
        );
        analytics.trackContentInteraction('featured_card', cardId, 'reveal', {
          card_id: cardId,
          card_category: card?.category || 'unknown',
          card_intensity: card?.intensity || 'unknown',
        });
        // Track content preview for anonymous users
        analytics.trackContentPreview('featured_card', cardId);
      }
      return newSet;
    });
  };

  const categories = [
    {
      id: 'mild-seduction',
      name: 'Mild Seduction',
      icon: '💕',
      color: '#FBBF24',
    },
    { id: 'foreplay', name: 'Foreplay', icon: '💋', color: '#F472B6' },
    {
      id: 'soft-domination',
      name: 'Soft Domination',
      icon: '👑',
      color: '#8B5CF6',
    },
    {
      id: 'light-restraints',
      name: 'Light Restraints',
      icon: '🔗',
      color: '#EC4899',
    },
    { id: 'roleplay', name: 'Roleplay', icon: '🎭', color: '#F59E0B' },
    { id: 'public-play', name: 'Public Play', icon: '🌆', color: '#10B981' },
    {
      id: 'lingerie-play',
      name: 'Lingerie Play',
      icon: '👗',
      color: '#EF4444',
    },
    { id: 'sensory-play', name: 'Sensory Play', icon: '✨', color: '#8B5CF6' },
    {
      id: 'teasing-denial',
      name: 'Teasing & Denial',
      icon: '🔥',
      color: '#F97316',
    },
    {
      id: 'fantasy-extreme',
      name: 'Fantasy Extreme',
      icon: '⚡',
      color: '#DC2626',
    },
  ];

  // Comprehensive pool of featured cards for daily shuffling
  const allFeaturedCards = [
    {
      id: 1,
      title: 'The Seductive Explorer',
      description:
        'Wear your favorite lingerie and surprise your partner at the door',
      category: 'lingerie-play',
      intensity: 'mild',
    },
    {
      id: 2,
      title: 'Sensory Tease',
      description:
        'Blindfold your partner and use only your fingertips for 10 minutes',
      category: 'sensory-play',
      intensity: 'spicy',
    },
    {
      id: 3,
      title: 'Power Exchange',
      description: 'Take turns giving and receiving commands for 15 minutes',
      category: 'soft-domination',
      intensity: 'spicy',
    },
    {
      id: 4,
      title: 'Intimate Whisper',
      description: 'Share your deepest fantasy while maintaining eye contact',
      category: 'mild-seduction',
      intensity: 'mild',
    },
    {
      id: 5,
      title: 'Touch & Tell',
      description:
        "Guide your partner's hands to show them exactly how you want to be touched",
      category: 'foreplay',
      intensity: 'spicy',
    },
    {
      id: 6,
      title: 'Satin Surprise',
      description:
        'Blindfold your partner and let them explore your lingerie with their hands',
      category: 'lingerie-play',
      intensity: 'hot',
    },
    {
      id: 7,
      title: 'Temperature Play',
      description:
        'Use ice cubes and warm oil for an alternating sensation experience',
      category: 'sensory-play',
      intensity: 'spicy',
    },
    {
      id: 8,
      title: 'The Tease Master',
      description:
        'Build anticipation by getting close but not touching for 20 minutes',
      category: 'teasing-denial',
      intensity: 'hot',
    },
    {
      id: 9,
      title: 'Role Reversal',
      description: 'Switch dominant and submissive roles mid-session',
      category: 'soft-domination',
      intensity: 'spicy',
    },
    {
      id: 10,
      title: 'Silk Road',
      description:
        'Use silk scarves to create gentle restraints and blindfolds',
      category: 'light-restraints',
      intensity: 'mild',
    },
    {
      id: 11,
      title: 'Public Tension',
      description:
        'Exchange secret touches in a public setting without getting caught',
      category: 'public-play',
      intensity: 'hot',
    },
    {
      id: 12,
      title: 'Fantasy Island',
      description:
        'Act out a romantic getaway scenario with tropical sounds and scents',
      category: 'roleplay',
      intensity: 'mild',
    },
    {
      id: 13,
      title: 'The Massage Master',
      description: 'Give a full body massage focusing on erogenous zones',
      category: 'foreplay',
      intensity: 'mild',
    },
    {
      id: 14,
      title: 'Midnight Snack',
      description: 'Feed each other sensually with your favorite treats',
      category: 'sensory-play',
      intensity: 'mild',
    },
    {
      id: 15,
      title: 'The Photographer',
      description: 'Take intimate photos of each other (keep them private!)',
      category: 'lingerie-play',
      intensity: 'spicy',
    },
    {
      id: 16,
      title: 'Dance of Desire',
      description:
        'Create a slow, sensual dance together with your favorite music',
      category: 'mild-seduction',
      intensity: 'mild',
    },
    {
      id: 17,
      title: 'The Commander',
      description: 'Give your partner specific instructions for 30 minutes',
      category: 'soft-domination',
      intensity: 'hot',
    },
    {
      id: 18,
      title: 'Scent Sensation',
      description:
        'Use different perfumes and scents to create a multi-sensory experience',
      category: 'sensory-play',
      intensity: 'mild',
    },
    {
      id: 19,
      title: 'The Restraint Artist',
      description: 'Use soft ties to create beautiful, comfortable restraints',
      category: 'light-restraints',
      intensity: 'spicy',
    },
    {
      id: 20,
      title: 'Fantasy Fulfillment',
      description: "Act out your partner's secret fantasy scenario",
      category: 'roleplay',
      intensity: 'hot',
    },
  ];

  // Deck cards data (extracted from DeckScreen.js)
  const deckCards = {
    'mild-seduction': [
      {
        id: 1,
        title: 'Taboo Fantasy Unleashed',
        description:
          'Describe your filthiest fantasy to your partner—bondage, public sex, or forbidden role-play—in vivid, explicit detail while locking eyes and tracing their jawline with your fingers.',
        difficulty: 'Medium',
        duration: '8 min',
        icon: '😈',
        color: '#FBBF24',
      },
      {
        id: 2,
        title: 'Thigh Edge Tease',
        description:
          'Run your fingers up their inner thigh, stopping a breath away from their throbbing cock or dripping pussy, teasing the edge of their underwear without crossing it.',
        difficulty: 'Medium',
        duration: '7 min',
        icon: '🔥',
        color: '#F59E0B',
      },
      {
        id: 3,
        title: 'Lip Chase Torment',
        description:
          'Hover your lips over theirs, brushing lightly, then bite their bottom lip sharply, pulling back to make them lean in desperate for more.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '💋',
        color: '#D97706',
      },
      {
        id: 4,
        title: 'Blindfold Power Play',
        description:
          'Blindfold them tightly, then explore their body with bold hands—pinching nipples, slapping their ass lightly, grazing their crotch, making them squirm with anticipation.',
        difficulty: 'Hard',
        duration: '10 min',
        icon: '😈',
        color: '#FBBF24',
      },
      {
        id: 5,
        title: 'Earlobe Hunger',
        description:
          'Lick a slow, wet trail up their neck, then suck their earlobe with deliberate heat, letting your teeth graze as you tease their sensitive skin.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '👂',
        color: '#F59E0B',
      },
      {
        id: 6,
        title: 'Nipple Flick Frenzy',
        description:
          'Lift their shirt and flick your tongue around their nipples, teasing without sucking, letting your breath drive them wild with unfulfilled need.',
        difficulty: 'Medium',
        duration: '7 min',
        icon: '😘',
        color: '#D97706',
      },
      {
        id: 7,
        title: 'Lap Grind Takeover',
        description:
          'Straddle them with authority, grinding your hips in slow, deep circles against their swelling arousal, daring them to grab you and escalate.',
        difficulty: 'Hard',
        duration: '8 min',
        icon: '🍑',
        color: '#F472B6',
      },
      {
        id: 8,
        title: 'Underwear Breach Assault',
        description:
          'Slide your hand inside their underwear, stroking their clit or shaft with feather-light touches, teasing them into a frenzy without giving full satisfaction.',
        difficulty: 'Hard',
        duration: '6 min',
        icon: '👙',
        color: '#FBBF24',
      },
      {
        id: 9,
        title: 'Neck Pulse Ravish',
        description:
          'Kiss and suck their neck where their pulse pounds, biting softly to mark their skin while pressing your body close to feel their reaction.',
        difficulty: 'Medium',
        duration: '6 min',
        icon: '👅',
        color: '#D97706',
      },
      {
        id: 10,
        title: 'Collarbone Claim Bite',
        description:
          'Lick their collarbone with possessive intent, then bite firmly to leave a faint mark, grinding your hips subtly to amplify the heat.',
        difficulty: 'Medium',
        duration: '6 min',
        icon: '😈',
        color: '#F59E0B',
      },
      {
        id: 11,
        title: 'Ass Worship Massage',
        description:
          'Massage their lower back, slipping hands under their waistband to knead their ass cheeks, dipping daringly between to tease forbidden zones.',
        difficulty: 'Medium',
        duration: '7 min',
        icon: '💆',
        color: '#8B5CF6',
      },
      {
        id: 12,
        title: 'Kinky Confession Swap',
        description:
          'Take turns revealing your most depraved sexual secret—public fucking, domination, or taboo toys—while groping their ass, chest, or crotch to make it feel dangerously real.',
        difficulty: 'Hard',
        duration: '10 min',
        icon: '😈',
        color: '#F472B6',
      },
      {
        id: 13,
        title: 'Hip Clash Lock',
        description:
          'Pull them into a tight embrace, grinding your hips hard against their growing arousal, letting the friction build unbearable tension.',
        difficulty: 'Medium',
        duration: '6 min',
        icon: '💃',
        color: '#FBBF24',
      },
      {
        id: 14,
        title: 'Nipple Twist Torture',
        description:
          'Pinch and twist their nipples through clothes (or bare), applying just enough pressure to draw gasps, teasing without full release.',
        difficulty: 'Hard',
        duration: '7 min',
        icon: '😘',
        color: '#F59E0B',
      },
      {
        id: 15,
        title: 'Public Risk Grind',
        description:
          'Drag them into a slow, dirty dance, bodies pressed scandalously close, hands gripping their ass as you grind with reckless abandon.',
        difficulty: 'Hard',
        duration: '8 min',
        icon: '💃',
        color: '#D97706',
      },
      {
        id: 16,
        title: 'Ice Cube Seduction',
        description:
          'Trail an ice cube over their neck, chest, and inner thighs, chasing it with your hot tongue to create a maddening contrast of sensations.',
        difficulty: 'Hard',
        duration: '8 min',
        icon: '🧊',
        color: '#06B6D4',
      },
      {
        id: 17,
        title: 'Belt Bind Tease',
        description:
          'Use a belt to loosely tie their wrists, then kiss and touch their body, avoiding their most sensitive spots to build desperate anticipation.',
        difficulty: 'Hard',
        duration: '9 min',
        icon: '😈',
        color: '#8B5CF6',
      },
      {
        id: 18,
        title: 'Breath Play Edge',
        description:
          'With consent, lightly press your hand to their throat to feel their pulse, kissing their neck and jaw to heighten their arousal.',
        difficulty: 'Hard',
        duration: '7 min',
        icon: '😘',
        color: '#EF4444',
      },
      {
        id: 19,
        title: 'Clothed Crotch Rub',
        description:
          'Rub their crotch through their clothes with slow, deliberate pressure, feeling their hardness or wetness grow as you tease without mercy.',
        difficulty: 'Hard',
        duration: '6 min',
        icon: '🔥',
        color: '#F59E0B',
      },
      {
        id: 20,
        title: 'Mirror Fuck Fantasy',
        description:
          "Position them in front of a mirror, hands roaming their body as you both watch, teasing their erogenous zones while describing how you'd fuck them while staring at their reflection.",
        difficulty: 'Hard',
        duration: '8 min',
        icon: '😈',
        color: '#EC4899',
      },
    ],
    foreplay: [
      {
        id: 1,
        title: 'Slow Undressing',
        description:
          'Take turns slowly undressing each other, making eye contact throughout.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '👗',
        color: '#EC4899',
      },
      {
        id: 2,
        title: 'Kiss and Tell',
        description:
          "Kiss different parts of your partner's body and tell them what you love about each spot.",
        difficulty: 'Medium',
        duration: '12 min',
        icon: '💋',
        color: '#F472B6',
      },
      {
        id: 3,
        title: 'Teasing Touch',
        description:
          'Touch your partner everywhere except where they want to be touched most.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '👆',
        color: '#FB7185',
      },
      {
        id: 4,
        title: 'Sensual Shower',
        description:
          'Take a warm shower together, washing each other slowly and intimately.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🚿',
        color: '#EC4899',
      },
      {
        id: 5,
        title: 'Bedroom Eyes',
        description:
          "Stare into each other's eyes for 5 minutes without speaking or touching.",
        difficulty: 'Easy',
        duration: '5 min',
        icon: '👀',
        color: '#F472B6',
      },
    ],
    'sensory-play': [
      {
        id: 1,
        title: 'Blindfolded Taste',
        description:
          'Blindfold your partner and feed them different foods to guess.',
        difficulty: 'Easy',
        duration: '15 min',
        icon: '👁️',
        color: '#06B6D4',
      },
      {
        id: 2,
        title: 'Temperature Play',
        description:
          'Use ice cubes and warm water to create alternating sensations.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '❄️',
        color: '#0891B2',
      },
      {
        id: 3,
        title: 'Scent Exploration',
        description:
          'Use different scented oils and let your partner identify them blindfolded.',
        difficulty: 'Easy',
        duration: '12 min',
        icon: '🌸',
        color: '#0E7490',
      },
      {
        id: 4,
        title: 'Texture Touch',
        description:
          "Use different fabrics and materials to explore textures on your partner's skin.",
        difficulty: 'Easy',
        duration: '18 min',
        icon: '🤏',
        color: '#06B6D4',
      },
      {
        id: 5,
        title: 'Sound Sensation',
        description:
          'Use music, whispers, and different sounds to create an audio experience.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🎵',
        color: '#0891B2',
      },
    ],
    'lingerie-play': [
      {
        id: 1,
        title: 'Lingerie Reveal',
        description:
          'Model different lingerie pieces for your partner, letting them choose their favorite.',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '👙',
        color: '#EC4899',
      },
      {
        id: 2,
        title: 'Slow Strip',
        description:
          'Perform a slow, sensual striptease in your favorite lingerie.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '💃',
        color: '#F472B6',
      },
      {
        id: 3,
        title: 'Lingerie Shopping',
        description:
          "Shop for lingerie together online, discussing what you'd like to see each other in.",
        difficulty: 'Easy',
        duration: '45 min',
        icon: '🛍️',
        color: '#FB7185',
      },
      {
        id: 4,
        title: 'Photo Session',
        description:
          'Take tasteful photos of each other in lingerie (keep them private!).',
        difficulty: 'Medium',
        duration: '40 min',
        icon: '📸',
        color: '#EC4899',
      },
      {
        id: 5,
        title: 'Lingerie Surprise',
        description:
          'Surprise your partner by wearing their favorite lingerie under your clothes.',
        difficulty: 'Easy',
        duration: '5 min',
        icon: '🎁',
        color: '#F472B6',
      },
    ],
    'soft-domination': [
      {
        id: 1,
        title: 'Command and Obey',
        description:
          'Take turns giving and receiving simple, respectful commands.',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '👑',
        color: '#8B5CF6',
      },
      {
        id: 2,
        title: 'Power Play',
        description: 'Switch dominant and submissive roles every 10 minutes.',
        difficulty: 'Medium',
        duration: '40 min',
        icon: '⚖️',
        color: '#7C3AED',
      },
      {
        id: 3,
        title: 'Pleasure Control',
        description:
          "One partner controls the other's pleasure for 20 minutes.",
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🎮',
        color: '#6D28D9',
      },
      {
        id: 4,
        title: 'Service Time',
        description:
          'One partner serves the other for 25 minutes (massage, drinks, etc.).',
        difficulty: 'Easy',
        duration: '25 min',
        icon: '🤝',
        color: '#8B5CF6',
      },
      {
        id: 5,
        title: 'Permission Game',
        description:
          'Ask permission before any touch or action for 30 minutes.',
        difficulty: 'Medium',
        duration: '30 min',
        icon: '🙋',
        color: '#7C3AED',
      },
    ],
  };

  // Transform deck cards to featured card format
  const transformDeckCard = (deckCard, category) => {
    // Map difficulty to intensity
    const difficultyToIntensity = {
      Easy: 'mild',
      Medium: 'spicy',
      Hard: 'hot',
    };

    return {
      id: `deck_${category}_${deckCard.id}`,
      title: deckCard.title,
      description: deckCard.description,
      category: category,
      intensity: difficultyToIntensity[deckCard.difficulty] || 'mild',
      source: 'deck',
      originalCard: deckCard,
    };
  };

  // Daily shuffle function based on current date
  const getDailyShuffledCards = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Create a simple hash from the date string for consistent daily shuffling
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Prepare deck cards from each category with proper randomization
    const allDeckCards = [];
    Object.keys(deckCards).forEach((category) => {
      const categoryCards = deckCards[category];
      if (categoryCards.length > 0) {
        // Shuffle the category cards first
        const shuffledCategory = [...categoryCards];
        for (let i = shuffledCategory.length - 1; i > 0; i--) {
          const j = Math.floor((hash * (i + 1)) % (i + 1));
          [shuffledCategory[i], shuffledCategory[j]] = [
            shuffledCategory[j],
            shuffledCategory[i],
          ];
        }

        // Take 2-4 random cards from each category (more variety)
        const sampleSize = Math.min(
          4,
          Math.max(2, Math.floor(categoryCards.length * 0.3))
        );
        const sampledCards = shuffledCategory
          .slice(0, sampleSize)
          .map((card) => transformDeckCard(card, category));
        allDeckCards.push(...sampledCards);
      }
    });

    // Shuffle all cards together
    const allCards = [...allFeaturedCards, ...allDeckCards];
    const shuffled = [...allCards];
    const seed = Math.abs(hash);

    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((seed * (i + 1)) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return exactly 3 cards for optimal display
    const selectedCards = shuffled.slice(0, 3);

    // Ensure we have a good mix of featured and deck cards
    const deckCount = selectedCards.filter(
      (card) => card.source === 'deck'
    ).length;

    // If we don't have at least one deck card, replace the last card with a deck card
    if (deckCount === 0 && allDeckCards.length > 0) {
      const deckCardIndex = Math.floor((seed * 13) % allDeckCards.length);
      selectedCards[2] = allDeckCards[deckCardIndex];
    }

    return selectedCards; // Return exactly 3 cards
  };

  // Get today's shuffled featured cards
  const featuredCards = getDailyShuffledCards();

  const renderCategoryCard = (category, index) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        index === 0 && styles.firstCard,
        index === categories.length - 1 && styles.lastCard,
      ]}
      onPress={() => {
        analytics.trackCategoryView(category.id, category.name);
        analytics.trackContentInteraction('category', category.id, 'view', {
          category_name: category.name,
          category_color: category.color,
        });
        router.push({ pathname: '/deck', params: { category: category.id } });
      }}
    >
      <LinearGradient
        colors={[category.color, category.color + 'DD', category.color + '99']}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.categoryGlow} />
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryName}>{category.name}</Text>
        <View style={styles.categoryShine} />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFeaturedCard = (card) => {
    // Different color schemes for each card type
    const getCardColors = (category) => {
      switch (category) {
        case 'lingerie-play':
          return [
            'rgba(236, 72, 153, 0.8)',
            'rgba(219, 39, 119, 0.7)',
            'rgba(190, 24, 93, 0.6)',
          ]; // Hot Pink
        case 'sensory-play':
          return [
            'rgba(6, 182, 212, 0.8)',
            'rgba(8, 145, 178, 0.7)',
            'rgba(14, 116, 144, 0.6)',
          ]; // Bright Cyan
        case 'soft-domination':
          return [
            'rgba(139, 92, 246, 0.8)',
            'rgba(124, 58, 237, 0.7)',
            'rgba(109, 40, 217, 0.6)',
          ]; // Rich Purple
        case 'mild-seduction':
          return [
            'rgba(251, 191, 36, 0.8)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(217, 119, 6, 0.6)',
          ]; // Golden
        case 'foreplay':
          return [
            'rgba(236, 72, 153, 0.8)',
            'rgba(244, 114, 182, 0.7)',
            'rgba(251, 113, 133, 0.6)',
          ]; // Pink
        default:
          return [
            'rgba(220, 20, 60, 0.8)',
            'rgba(178, 34, 34, 0.7)',
            'rgba(139, 0, 0, 0.6)',
          ]; // Crimson
      }
    };

    return (
      <TouchableOpacity
        key={card.id}
        style={styles.featuredCard}
        onPress={() => {
          // If it's a deck card, navigate to the deck
          if (card.source === 'deck') {
            router.push({
              pathname: '/deck',
              params: { category: card.category },
            });
          }
        }}
      >
        <LinearGradient
          colors={getCardColors(card.category)}
          style={styles.featuredCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.intensityBadge,
                { backgroundColor: getIntensityColor(card.intensity) },
              ]}
            >
              <Text style={styles.intensityText}>
                {card.intensity.toUpperCase()}
              </Text>
            </View>
            {card.source === 'deck' && (
              <View style={styles.deckBadge}>
                <Text style={styles.deckBadgeText}>🎲 DECK</Text>
              </View>
            )}
          </View>
        </View>
        {revealedCards.has(card.id) ? (
          <Text style={styles.cardDescription}>{card.description}</Text>
        ) : (
          <View style={styles.cardPlaceholder}>
            <Text style={styles.cardPlaceholderText}>
              {card.source === 'deck'
                ? 'Tap to explore this deck'
                : 'Click Reveal to see content'}
            </Text>
          </View>
        )}
        <LinearGradient
          colors={['#DC143C', '#B22222', '#8B0000']}
          style={styles.revealButton}
        >
          <TouchableOpacity
            style={styles.gradientButtonContent}
            onPress={(e) => {
              e.stopPropagation(); // Prevent deck navigation when revealing
              toggleCardReveal(card.id);
            }}
          >
            <Text style={styles.revealButtonText}>
              {revealedCards.has(card.id) ? 'Hide' : 'Reveal'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'mild':
        return '#10B981';
      case 'spicy':
        return '#F59E0B';
      case 'hot':
        return '#DC143C';
      case 'extreme':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background Gradient */}
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000', '#4D0000', '#660000']}
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
              top: 100,
              left: 50,
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              top: 300,
              right: 60,
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
              bottom: 200,
              left: 80,
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

      {/* Header */}
      <LinearGradient
        colors={[
          'rgba(220, 20, 60, 0.15)',
          'rgba(139, 0, 0, 0.08)',
          'rgba(0, 0, 0, 0.2)',
        ]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              if (user) {
                setIsSideMenuVisible(true);
              } else {
                router.push('/login');
              }
            }}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.brandSection}>
            {/* Brand Title with Heart V */}
            <Animated.View
              style={[
                styles.brandTitleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.brandTitleRow}>
                {/* Heart V Symbol */}
                <Animated.View
                  style={[
                    styles.heartV,
                    {
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  <Svg width="40" height="55" viewBox="0 0 24 24" fill="none">
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
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(220, 20, 60, 0.25)',
              'rgba(178, 34, 34, 0.15)',
              'rgba(139, 0, 0, 0.12)',
              'rgba(0, 0, 0, 0.2)',
            ]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heroTitle}>
              <Text style={styles.heroTitleMain}>Play Deeper.</Text>
              {'\n'}
              <Text style={styles.heroTitleAccent}>Love Bolder.</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Intimate experiences designed for connection
            </Text>
            {user ? (
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>
                  {isPremium ? '👑 Premium Member' : '🔥 Free User'}
                </Text>
                {!isPremium && (
                  <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={() => {
                      analytics.trackPremiumUpgradeAttempt(
                        'home_screen',
                        'button_click'
                      );
                      analytics.trackFunnelStep(
                        'premium_conversion_funnel',
                        'upgrade_clicked',
                        1,
                        3
                      );
                      analytics.trackFeatureInterest(
                        'premium_upgrade',
                        'button_click'
                      );
                      router.push('/payment');
                    }}
                  >
                    <Text style={styles.upgradeButtonText}>
                      Upgrade to Premium
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>🔥 Premium Content</Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spice Up Your Sex Life! 🔥</Text>
            <Text style={styles.sectionSubtitle}>Choose your adventure</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
            decelerationRate="fast"
            snapToInterval={130} // Card width + margin
            snapToAlignment="start"
          >
            {categories.map(renderCategoryCard)}
          </ScrollView>
        </Animated.View>

        {/* Featured Cards Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Today&apos;s Picks 💋</Text>
                <Text style={styles.sectionSubtitle}>
                  Curated for your pleasure
                </Text>
              </View>
              <View style={styles.timerContainer}>
                <View style={styles.timerCard}>
                  <Text style={styles.timerLabel}>New picks in</Text>
                  <View style={styles.timerDisplay}>
                    <Text style={styles.timerText}>{timeRemaining}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {featuredCards.map(renderFeaturedCard)}
        </Animated.View>

        {/* Games Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Games 🎲</Text>
            <Text style={styles.sectionSubtitle}>Instant excitement</Text>
          </View>

          {/* Sexy Dice Game */}
          <View style={styles.gameCard}>
            <LinearGradient
              colors={[
                'rgba(59, 130, 246, 0.8)',
                'rgba(37, 99, 235, 0.7)',
                'rgba(29, 78, 216, 0.6)',
              ]}
              style={styles.gameCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Sexy Dice Game</Text>
                <View style={styles.gameTags}>
                  <Text style={styles.gameTag}>Sensual</Text>
                  <Text style={styles.gameTag}>Expert</Text>
                  <Text style={styles.gameTag}>Naughty</Text>
                </View>
              </View>
              <View style={styles.diceContainer}>
                <LinearGradient
                  colors={[
                    'rgba(59, 130, 246, 0.95)',
                    'rgba(37, 99, 235, 0.9)',
                    'rgba(29, 78, 216, 0.8)',
                  ]}
                  style={styles.diceGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.diceIcon}>🎲</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.rollButton}
            >
              <TouchableOpacity
                style={styles.gradientButtonContent}
                onPress={() => router.push('/dice-game')}
              >
                <Text style={styles.rollButtonText}>Roll</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Fantasy Builder */}
          <View style={styles.gameCard}>
            <LinearGradient
              colors={[
                'rgba(168, 85, 247, 0.8)',
                'rgba(147, 51, 234, 0.7)',
                'rgba(126, 34, 206, 0.6)',
              ]}
              style={styles.gameCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>
                  The Ultimate Fantasy Builder
                </Text>
                <Text style={styles.gameDescription}>
                  Create your personalized deck
                </Text>
              </View>
            </View>
            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.createButton}
            >
              <TouchableOpacity
                style={styles.gradientButtonContent}
                onPress={() => router.push('/fantasy-builder')}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Spin the Wheel */}
          <View style={styles.gameCard}>
            <LinearGradient
              colors={[
                'rgba(236, 72, 153, 0.8)',
                'rgba(219, 39, 119, 0.7)',
                'rgba(190, 24, 93, 0.6)',
              ]}
              style={styles.gameCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Spin the Wheel</Text>
                <Text style={styles.gameDescription}>
                  Discover new positions & challenges
                </Text>
              </View>
              <View style={styles.wheelContainer}>
                <LinearGradient
                  colors={[
                    'rgba(236, 72, 153, 0.95)',
                    'rgba(219, 39, 119, 0.9)',
                    'rgba(190, 24, 93, 0.8)',
                  ]}
                  style={styles.wheelGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={styles.wheelIcon}>🎡</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.spinButton}
            >
              <TouchableOpacity
                style={styles.gradientButtonContent}
                onPress={() => router.push('/spin-wheel')}
              >
                <Text style={styles.spinButtonText}>Spin</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Side Menu */}
      <SideMenu
        isVisible={isSideMenuVisible}
        onClose={() => setIsSideMenuVisible(false)}
      />
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
    zIndex: -1,
  },
  floatingElements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
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
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 2,
  },
  brandSection: {
    flex: 1,
    alignItems: 'center',
  },
  brandTitleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartV: {
    marginRight: 2,
  },
  brandTitleRest: {
    fontSize: 32,
    fontWeight: '700',
    color: '#DC143C',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },

  tagline: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'System',
    fontStyle: 'italic',
  },
  boldText: {
    fontWeight: '800',
    color: '#DC143C',
  },
  personaText: {
    fontSize: 16,
    color: '#DC143C',
    fontFamily: 'System',
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 18,
    color: '#DC143C',
    fontWeight: 'bold',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroGradient: {
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(220, 20, 60, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: 12,
  },
  heroTitleMain: {
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  heroTitleAccent: {
    color: '#DC143C',
    fontFamily: 'System',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    fontFamily: 'System',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.2)',
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timerLabel: {
    fontSize: 10,
    color: '#CD5C5C',
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  timerDisplay: {
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  timerText: {
    fontSize: 14,
    color: '#DC143C',
    fontFamily: 'System',
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'System',
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    marginBottom: 20,
    textShadowColor: 'rgba(220, 20, 60, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  categoriesContainer: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  categoryCard: {
    width: 110,
    height: 140,
    borderRadius: 24,
    marginRight: 20,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    transform: [{ scale: 1 }],
  },
  firstCard: {
    marginLeft: 20,
  },
  lastCard: {
    marginRight: 20,
  },
  categoryGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.9,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 0.3,
  },
  featuredCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.25)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    opacity: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deckBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  deckBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  intensityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'System',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardPlaceholder: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardPlaceholderText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'System',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  revealButton: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
  },
  revealButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  gameCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.25)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  gameCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    opacity: 0.5,
  },
  gameContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameInfo: {
    flex: 1,
    marginRight: 16,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'System',
    lineHeight: 20,
  },
  gameTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gameTag: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC143C',
    fontFamily: 'System',
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diceContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    shadowColor: 'rgba(59, 130, 246, 0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  diceGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    opacity: 0.8,
  },
  diceIcon: {
    fontSize: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  wheelContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  wheelGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    opacity: 0.3,
  },
  wheelIcon: {
    fontSize: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  rollButton: {
    borderRadius: 25,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  rollButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  createButton: {
    borderRadius: 25,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  spinButton: {
    borderRadius: 25,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  spinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  gradientButtonContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
  upgradeButton: {
    backgroundColor: 'rgba(220, 20, 60, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
