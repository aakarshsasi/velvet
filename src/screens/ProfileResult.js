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
  
  // New animation refs for enhanced effects
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserProfile();
    startEnhancedAnimations();
  }, []);

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

    // Subtle rotation for floating elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
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
              left: width * 0.1,
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              top: height * 0.3, 
              right: width * 0.15,
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg']
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              bottom: height * 0.2, 
              left: width * 0.2,
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.floatingCircle, 
            { 
              top: height * 0.6, 
              left: width * 0.7,
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg']
                })
              }]
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
                      outputRange: [0, index % 2 === 0 ? 20 : -20]
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
                      transform: [{
                        scaleX: scaleAnim
                      }]
                    }
                  ]} 
                />
              </View>
              <Text style={styles.dimensionValue}>{value}%</Text>
            </Animated.View>
          ))}
        </Animated.View>

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
            <Text style={styles.insightTitle}>A Sex Insight Just for You 😉</Text>
            <Text style={styles.insightText}>
              Since you highly value <Text style={styles.insightHighlight}>Openness</Text> and <Text style={styles.insightHighlight}>Desire</Text> in sex, our <Text style={styles.insightHighlight}>Scratch off Bedroom Game</Text> 🍌 might be exactly what you're looking for!
            </Text>
            
            {/* Enhanced visual elements */}
            <View style={styles.insightIcons}>
              <Text style={styles.insightIcon}>🔥</Text>
              <Text style={styles.insightIcon}>💋</Text>
              <Text style={styles.insightIcon}>✨</Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Bottom Spacing for sticky button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Explore More Button with enhanced animations */}
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
    height: 8,
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
  },
  dimensionFill: {
    height: '100%',
    backgroundColor: '#DC143C',
    borderRadius: 4,
  },
  dimensionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC143C',
    width: 50,
    textAlign: 'right',
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
    height: 120, // Increased for sticky button
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
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
});
