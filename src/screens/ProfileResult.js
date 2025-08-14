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

const { width, height } = Dimensions.get('window');

export default function ProfileResultScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserProfile();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
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

  const handleExploreMore = () => {
    router.replace('/home');
  };

  // Mock profile data for radar chart dimensions
  const profileDimensions = {
    desire: 85,
    satisfaction: 78,
    openness: 92,
    communication: 88,
    trust: 95
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.headerTitle}>Your intimacy profile 🔥</Text>
        </Animated.View>

        {/* Radar Chart Section */}
        <Animated.View style={[styles.chartSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.radarChart}>
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
          </View>
        </Animated.View>

        {/* Profile Dimensions */}
        <Animated.View style={[styles.dimensionsSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>Your Intimacy Dimensions</Text>
          
          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Desire</Text>
            <View style={styles.dimensionBar}>
              <View style={[styles.dimensionFill, { width: `${profileDimensions.desire}%` }]} />
            </View>
            <Text style={styles.dimensionValue}>{profileDimensions.desire}%</Text>
          </View>

          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Satisfaction</Text>
            <View style={styles.dimensionBar}>
              <View style={[styles.dimensionFill, { width: `${profileDimensions.satisfaction}%` }]} />
            </View>
            <Text style={styles.dimensionValue}>{profileDimensions.satisfaction}%</Text>
          </View>

          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Openness</Text>
            <View style={styles.dimensionBar}>
              <View style={[styles.dimensionFill, { width: `${profileDimensions.openness}%` }]} />
            </View>
            <Text style={styles.dimensionValue}>{profileDimensions.openness}%</Text>
          </View>

          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Communication</Text>
            <View style={styles.dimensionBar}>
              <View style={[styles.dimensionFill, { width: `${profileDimensions.communication}%` }]} />
            </View>
            <Text style={styles.dimensionValue}>{profileDimensions.communication}%</Text>
          </View>

          <View style={styles.dimensionRow}>
            <Text style={styles.dimensionLabel}>Trust</Text>
            <View style={styles.dimensionBar}>
              <View style={[styles.dimensionFill, { width: `${profileDimensions.trust}%` }]} />
            </View>
            <Text style={styles.dimensionValue}>{profileDimensions.trust}%</Text>
          </View>
        </Animated.View>

        {/* Personalized Insight */}
        <Animated.View style={[styles.insightSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>A Sex Insight Just for You 😉</Text>
            <Text style={styles.insightText}>
              Since you highly value <Text style={styles.insightHighlight}>Openness</Text> and <Text style={styles.insightHighlight}>Desire</Text> in sex, our <Text style={styles.insightHighlight}>Scratch off Bedroom Game</Text> 🍌 might be exactly what you're looking for!
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity style={styles.tryNowButton} onPress={handleExploreMore}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.tryNowButtonGradient}
            >
              <Text style={styles.tryNowButtonText}>Explore More</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
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
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    backgroundColor: '#EC4899',
    borderRadius: 10,
  },
  profileOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  dimensionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
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
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  dimensionFill: {
    height: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 4,
  },
  dimensionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EC4899',
    width: 50,
    textAlign: 'right',
  },
  insightSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  insightCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
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
    color: '#D1D5DB',
    lineHeight: 24,
    textAlign: 'center',
  },
  insightHighlight: {
    color: '#EC4899',
    fontWeight: '700',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  tryNowButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tryNowButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryNowButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 50,
  },
});
