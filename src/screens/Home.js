import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isPremium, upgradeToPremium, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [glowAnim] = useState(new Animated.Value(0.3));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadUserProfile();
    startAnimations();
  }, []);

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
    setRevealedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };



  const categories = [
    { id: 'mild-seduction', name: 'Mild Seduction', icon: '💕', color: '#FBBF24' },
    { id: 'foreplay', name: 'Foreplay', icon: '💋', color: '#F472B6' },
    { id: 'soft-domination', name: 'Soft Domination', icon: '👑', color: '#8B5CF6' },
    { id: 'light-restraints', name: 'Light Restraints', icon: '🔗', color: '#EC4899' },
    { id: 'roleplay', name: 'Roleplay', icon: '🎭', color: '#F59E0B' },
    { id: 'public-play', name: 'Public Play', icon: '🌆', color: '#10B981' },
    { id: 'lingerie-play', name: 'Lingerie Play', icon: '👗', color: '#EF4444' },
    { id: 'sensory-play', name: 'Sensory Play', icon: '✨', color: '#8B5CF6' },
    { id: 'teasing-denial', name: 'Teasing & Denial', icon: '🔥', color: '#F97316' },
    { id: 'fantasy-extreme', name: 'Fantasy Extreme', icon: '⚡', color: '#DC2626' },
  ];

  const featuredCards = [
    {
      id: 1,
      title: 'The Seductive Explorer',
      description: 'Wear your favorite lingerie and surprise your partner at the door',
      category: 'lingerie-play',
      intensity: 'mild',
    },
    {
      id: 2,
      title: 'Sensory Tease',
      description: 'Blindfold your partner and use only your fingertips for 10 minutes',
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
  ];

  const renderCategoryCard = (category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => router.push({ pathname: '/deck', params: { category: category.id } })}
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
          return ['rgba(236, 72, 153, 0.8)', 'rgba(219, 39, 119, 0.7)', 'rgba(190, 24, 93, 0.6)']; // Hot Pink
        case 'sensory-play':
          return ['rgba(6, 182, 212, 0.8)', 'rgba(8, 145, 178, 0.7)', 'rgba(14, 116, 144, 0.6)']; // Bright Cyan
        case 'soft-domination':
          return ['rgba(139, 92, 246, 0.8)', 'rgba(124, 58, 237, 0.7)', 'rgba(109, 40, 217, 0.6)']; // Rich Purple
        default:
          return ['rgba(220, 20, 60, 0.8)', 'rgba(178, 34, 34, 0.7)', 'rgba(139, 0, 0, 0.6)']; // Crimson
      }
    };

    return (
      <View key={card.id} style={styles.featuredCard}>
        <LinearGradient
          colors={getCardColors(card.category)}
          style={styles.featuredCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(card.intensity) }]}>
            <Text style={styles.intensityText}>{card.intensity.toUpperCase()}</Text>
          </View>
        </View>
        {revealedCards.has(card.id) ? (
          <Text style={styles.cardDescription}>{card.description}</Text>
        ) : (
          <View style={styles.cardPlaceholder}>
            <Text style={styles.cardPlaceholderText}>Click Reveal to see content</Text>
          </View>
        )}
        <LinearGradient
          colors={['#DC143C', '#B22222', '#8B0000']}
          style={styles.revealButton}
        >
          <TouchableOpacity style={styles.gradientButtonContent} onPress={() => toggleCardReveal(card.id)}>
            <Text style={styles.revealButtonText}>{revealedCards.has(card.id) ? 'Hide' : 'Reveal'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'mild': return '#10B981';
      case 'spicy': return '#F59E0B';
      case 'extreme': return '#EF4444';
      default: return '#6B7280';
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
              transform: [{ scale: pulseAnim }]
            }
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
                outputRange: [0.2, 0.6]
              }),
              transform: [{ scale: pulseAnim.interpolate({
                inputRange: [1, 1.05],
                outputRange: [0.8, 1.2]
              })}]
            }
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
                outputRange: [0.3, 0.7]
              }),
              transform: [{ scale: pulseAnim.interpolate({
                inputRange: [1, 1.05],
                outputRange: [0.9, 1.1]
              })}]
            }
          ]} 
        />
      </View>
      
      {/* Header */}
      <LinearGradient
        colors={['rgba(220, 20, 60, 0.15)', 'rgba(139, 0, 0, 0.08)', 'rgba(0, 0, 0, 0.2)']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.brandSection}>
            {/* Brand Title with Heart V */}
            <Animated.View 
              style={[
                styles.brandTitleContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.brandTitleRow}>
                {/* Heart V Symbol */}
                <Animated.View 
                  style={[
                    styles.heartV,
                    {
                      transform: [{ scale: pulseAnim }]
                    }
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
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => {
              if (user) {
                Alert.alert(
                  'Profile',
                  `Welcome, ${user.displayName || 'User'}!`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Logout', onPress: logout, style: 'destructive' }
                  ]
                );
              } else {
                router.push('/login');
              }
            }}
          >
            <Text style={styles.profileIcon}>{user ? '👤' : '🔐'}</Text>
          </TouchableOpacity>
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
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
                      <LinearGradient
              colors={['rgba(220, 20, 60, 0.25)', 'rgba(178, 34, 34, 0.15)', 'rgba(139, 0, 0, 0.12)', 'rgba(0, 0, 0, 0.2)']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
            <Text style={styles.heroTitle}>
              <Text style={styles.heroTitleMain}>Play Deeper.</Text>{'\n'}
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
                    onPress={upgradeToPremium}
                  >
                    <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
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
              transform: [{ translateY: slideAnim }]
            }
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
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Picks 💋</Text>
            <Text style={styles.sectionSubtitle}>Curated for your pleasure</Text>
          </View>
          {featuredCards.map(renderFeaturedCard)}
        </Animated.View>

        {/* Games Section */}
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Games 🎲</Text>
            <Text style={styles.sectionSubtitle}>Instant excitement</Text>
          </View>
          
          {/* Sexy Dice Game */}
          <View style={styles.gameCard}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.8)', 'rgba(37, 99, 235, 0.7)', 'rgba(29, 78, 216, 0.6)']}
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
                  colors={['rgba(59, 130, 246, 0.95)', 'rgba(37, 99, 235, 0.9)', 'rgba(29, 78, 216, 0.8)']}
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
              colors={['rgba(168, 85, 247, 0.8)', 'rgba(147, 51, 234, 0.7)', 'rgba(126, 34, 206, 0.6)']}
              style={styles.gameCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>The Ultimate Fantasy Builder</Text>
                <Text style={styles.gameDescription}>Create your personalized deck</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.createButton}
            >
              <TouchableOpacity 
                style={styles.gradientButtonContent}
                onPress={() => router.push('/deck')}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Spin the Wheel */}
          <View style={styles.gameCard}>
            <LinearGradient
              colors={['rgba(236, 72, 153, 0.8)', 'rgba(219, 39, 119, 0.7)', 'rgba(190, 24, 93, 0.6)']}
              style={styles.gameCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Spin the Wheel</Text>
                <Text style={styles.gameDescription}>Discover new positions & challenges</Text>
              </View>
              <View style={styles.wheelContainer}>
                <LinearGradient
                  colors={['rgba(236, 72, 153, 0.95)', 'rgba(219, 39, 119, 0.9)', 'rgba(190, 24, 93, 0.8)']}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    zIndex: 2,
  },
  brandSection: {
    flex: 1,
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
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  profileIcon: {
    fontSize: 14,
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
    paddingRight: 20,
  },
  categoryCard: {
    width: 110,
    height: 130,
    borderRadius: 20,
    marginRight: 16,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
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
    fontSize: 36,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
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
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
