import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

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

  const categories = [
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
      style={[styles.categoryCard, { backgroundColor: category.color }]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedCard = (card) => (
    <View key={card.id} style={styles.featuredCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(card.intensity) }]}>
          <Text style={styles.intensityText}>{card.intensity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.cardDescription}>{card.description}</Text>
      <LinearGradient
        colors={['#EC4899', '#DB2777']}
        style={styles.revealButton}
      >
        <TouchableOpacity style={styles.gradientButtonContent}>
          <Text style={styles.revealButtonText}>Reveal</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

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
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandSection}>
          <Text style={styles.brandSubtitle}>velvet</Text>
          <Text style={styles.brandTitle}>Velvet</Text>
          {userProfile ? (
            <Text style={styles.personaText}>Welcome back, {userProfile.persona} ✨</Text>
          ) : (
            <Text style={styles.tagline}>Play deeper. Love bolder.</Text>
          )}
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            <Text style={styles.heroTitleMain}>Play Deeper.</Text>{'\n'}
            <Text style={styles.heroTitleAccent}>Love Bolder.</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Intimate experiences designed for connection
          </Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spice Up Your Sex Life!</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryCard)}
          </ScrollView>
        </View>

        {/* Featured Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Picks</Text>
          {featuredCards.map(renderFeaturedCard)}
        </View>

        {/* Games Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Games</Text>
          
          {/* Sexy Dice Game */}
          <View style={styles.gameCard}>
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
                <Text style={styles.diceIcon}>🎲</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={styles.rollButton}
            >
              <TouchableOpacity style={styles.gradientButtonContent}>
                <Text style={styles.rollButtonText}>Roll</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Fantasy Builder */}
          <View style={styles.gameCard}>
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>The Ultimate Fantasy Builder</Text>
                <Text style={styles.gameDescription}>Create your personalized deck</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.createButton}
            >
              <TouchableOpacity style={styles.gradientButtonContent}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Spin the Wheel */}
          <View style={styles.gameCard}>
            <View style={styles.gameContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Spin the Wheel</Text>
                <Text style={styles.gameDescription}>Discover new positions & challenges</Text>
              </View>
              <View style={styles.wheelContainer}>
                <Text style={styles.wheelIcon}>🎡</Text>
              </View>
            </View>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.spinButton}
            >
              <TouchableOpacity style={styles.gradientButtonContent}>
                <Text style={styles.spinButtonText}>Spin</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  brandSection: {
    flex: 1,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'System',
    letterSpacing: 1,
    marginBottom: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#EC4899',
    fontFamily: 'System',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'System',
    fontStyle: 'italic',
  },
  personaText: {
    fontSize: 16,
    color: '#EC4899',
    fontFamily: 'System',
    fontWeight: '600',
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
    color: '#EC4899',
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 100,
    height: 120,
    borderRadius: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 16,
  },
  featuredCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
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
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
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
    color: '#EC4899',
    fontFamily: 'System',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diceContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceIcon: {
    fontSize: 32,
  },
  wheelContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelIcon: {
    fontSize: 32,
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
});
