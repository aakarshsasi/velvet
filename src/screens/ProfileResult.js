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
import { SvgXml } from 'react-native-svg';

// SVG content as string constant with app theme colors
const sexualPositionSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="1812.7008056640625 1549.800048828125 176.599609375 120.6998291015625" width="176.599609375" height="120.6998291015625" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="velvetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#DC143C;stop-opacity:0.8" />
      <stop offset="50%" style="stop-color:#FF1493;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:0.4" />
    </linearGradient>
  </defs>
  <path fill="url(#velvetGradient)" d="M1850.8,1647.7c-0.2,1.8-0.4,3.5-0.6,5.3c-0.6,3.5-0.9,6.8-1.6,10c-0.4,1.6-0.9,4.7-1.8,5.5c-2.4,2-8.5,1.5-12.7,1.5c-1.5,0-3.1,0-4.6-0.1c-0.7-0.2-1.2-0.8-2-1c-2.3-0.6-8,0.2-9.4-1.2c0.1-0.4,0.1-0.9,0.2-1.3c0.4-0.2,0.7-0.5,1.1-0.7c3.2-1.4,7.3-1.7,11.3-2.4c2.2-0.4,8.8-0.1,9.7-1.2c2.2-2.5,2.1-7.5,2.1-12.2c0-1.4,0-2.8,0.1-4.3c0.6-4.3,1.3-8.5,1.9-12.8c0.3-1.5,1.1-4.1,0.8-5.8c-0.9-5.3-1.2-10.1-2.2-15.2c-0.5-2.3-1-4.6-1.5-6.9c-0.6-3-0.5-6.6-0.5-9.9c0,0-0.1,0-0.1,0.1c-0.2,0.3-0.4,0.6-0.6,1c0,0.7,0,1.4-0.1,2.1c-1.3,6.2,0.7,11.3,1.8,16.4c0.6,3.2-0.3,6.2-0.8,8.5c0.1,0.9,0.2,1.7,0.3,2.6c0.1,1.3,0.3,2.6,0.4,3.9c0.3,1.6,0.6,3.1,0.9,4.6c0,0,0,0-0.1,0c0,0,0-0.1,0-0.1c-1.3-1.9-1.9-4.3-2.5-6.8c-0.1-1.1-0.1-2.2-0.2-3.4c-0.2,3-0.5,5.1,0.3,7.9c0.4,1.4,1.3,3.1,1.3,5c-0.1,0-0.1-0.1-0.2-0.1c-0.7-1.2-1-2-1.7-3.2c-0.2-2-0.5-1.3-0.7,1.3c0.1,0.8,0.4,2.1,0.1,3c-0.5,0.7-1,1.5-1.5,2.2c-0.4,1.3-0.2,5.1,0.4,6.4c-0.3-1-2.4-2.2-2-5c0.4-2.7,0.3-4,0.5-6c-0.6-0.9-1.1-1.9-1.7-2.8c0.3,0.8,0.7,1.7,1,2.5c0.5,2-0.8,4.1-1.3,5.7c0,0-0.1,0-0.1-0.1c-0.4-1.1-1.1-2.1-1.5-3.4c0,0,0,0-0.1,0c0,0,0,0.1,0,0.1c-1.1,1.7-1.4,3.7-2.3,5.7c-0.5,0.7-1.1,1.4-1.6,2.2c-0.3,0.6-0.6,1.1-0.9,1.7c-0.2-1.4-1.2-3.5-1.2-5.5c0-2,1.8-8.7-0.7-12c0.4,1.4,0.8,2.8,1.1,4.4c0.3,2.1-1.2,5.4-1.5,7.3c-0.3,2,1.2,3.9,0.4,5.9c0,0,0-0.1,0-0.1c-1.5-1.4-4-6-4-7.6c0-1.6-0.3-2.4-0.2-3.6c0,0,0,0-0.1,0c-0.2,1.3-1,2.9-0.7,4.5c0.2,1,0.4,2,0.6,3c0,0,0,0-0.1,0c0,0,0-0.1,0-0.1c-1.6-1.6-2.2-5.6-1.6-9.2c0.4-2.1,2.2-3.9,0.3-7.9c0,2.3-0.5,3.7-1,5.5c-0.8,1.2-0.7,4-0.4,6.4c-0.2-0.8-1.4-1.6-1.5-4c0.2-2,1.3-4.2,1-6.4c-0.4-1.9-0.9-3.8-1.3-5.7c-1.1-6.8,2.3-6.1,0.8-17.4c-0.5-2.8-1-5-0.3-8.2c1.2-5-3.7-4.5-0.3-13.2c-1,1.2-2,3.8-2.2,5.9c-0.1,1.9,1.5,4.2,1.2,5.9c-1.1,7.6,1.9,13.3-0.8,23.6c-0.3,1.2,0.2,3.6,0.3,5.3c-0.2-0.9-1.7-4.3-0.5-12.4c-0.1-0.6-0.3-10.9-0.8-14.6c-0.4-3.7-1.9-7.2-1.4-10.1c0.2-1,0.4-2,0.6-2.9c-0.1-2.8-0.3-5.6-0.4-8.3c-0.1-3.3,1.7-11.8,8-16.7c1.9-1.5,2.6-2.5,5-2.5c2.5,0,5.2-0.3,6.2,1.2c1.4-0.6,5.3-3.8,7.3-1.8c-0.1,0.6-0.2,1.1-0.3,1.7c0.9,0.2,1.7,0.5,2.5,0.7c0.3,0.3,0.5,0.7,0.8,1c0,0,0.1-0.1,0.1-0.1c0.2-0.1,0.5-0.3,0.7-0.4c0.5,0.1,0.6,0.4,1,0.6c1.3,0.6,2.7,0.2,3.4,1.3c1,1.9-0.4,3.7-0.8,5.3c-0.5,2,0.7,4.9,1.2,6.4c0.7,2.2,3.2,5.6,4.9,6.9c0.7,0.5,1.7,0.7,2.4,1.1c0.5,0.3,1,0.6,1.5,1c1.2,0.1,2.5,0.2,3.7,0.3c1.7,0.4,3.2,1.1,5,1.5c0.8,0.1,1.5,0.3,2.3,0.4c1.6,0.3,3.6-0.3,4.9,0.3c-0.6-0.6-1.2-1.3-1.8-1.9c-0.7,0-2.1,0.2-2.5,0c-0.5-0.4-1-0.8-1.5-1.3c-1.5-0.9-3-1.7-4.5-2.5c0.5,1.2,1,2.2,1.7,3.2c-1.2-0.5-2.3-1.7-2.9-2.8c0,0-0.1,0-0.1,0.1c0,0.2-0.1,0.4-0.1,0.6c-0.1,0-0.1,0-0.2-0.1c-0.6-0.7-1.6-1.1-2.2-1.8c-0.4-0.7-0.8-1.4-1.2-2.1c-0.2,0.8-0.3,1.7-0.5,2.5c0,0,0,0-0.1,0c-0.1-1-0.2-2-0.3-3.1c0.3-1.2,1-2.7,0.6-4.5c-0.2-0.9-1.5-2.9-1.3-3.9c0.6-3.5,2.9-7.2,4.7-9.7c1.2-0.9,2.4-1.8,3.6-2.7c1.6-1.4,4.6-3.9,8.1-3.2c5.7,1.1,10.7,2.9,16.8,3.5c0,0-0.1,0-0.1,0.1c-0.5,0.2-1,0.4-1.5,0.6c0,0,0,0,0,0.1c1.5,0.5,3.4,1.7,4.1,3c0,0,0,0-0.1,0.1c-0.7-0.4-1.4-1.1-2.2-1.3c0.5,0.7,0.9,1,1.3,1.9c-0.9-0.2-1.8-0.3-2.7-0.5c0,0,0,0,0,0.1c0.4,1.2,1.6,2.3,2.9,2.6c1,0,2,0,3.1,0c0.7,0,1.4,0,2.2,0.1c1.6-0.1,3.1-0.3,4.7-0.4c0.9-0.3,1.8-0.5,2.7-0.8c1.4-0.3,3.3,0,4.4,0.3c1.3,0.2,2.6,0.3,3.9,0.5c2.6,0.8,5.2,1.6,7.8,2.4c1,0.5,2,1,3,1.5c7.9,3.5,15.3,10.9,20.4,17.2c1.7,2.3,3.4,4.6,5.1,6.9c0.6,0.8,1.3,2.6,2.2,3c1.5-0.6,3.1-1.2,4.6-1.8c3.6-0.9,7.8-0.2,10,1.4c0.7,0.5,2.2,3.1,2.5,4c0.5,1.5,0.4,3.4,0.4,5.2c0,1.3,0,2.5,0,3.8c-1,5.4-2.1,10.7-3.2,15.7c-0.6,2.4-0.4,4.9-0.8,7.6c-0.6,3.6-0.5,9.4,0.7,12.3c0.5,0.7,1,1.5,1.5,2.2c3.1,5,7.7,5.7,14.5,6.9c2.9,0.5,6.8-0.6,8,1.6c0.2,0.4,0.4,0.6,0.2,1c-0.5,0.4-1,0.7-1.5,1.1c-3.1,1.2-7.2,0.3-10.9,0.9c-1,0-2,0.1-3.1,0.1c-2.7-0.5-5.4-1.2-8-1.7c-1.2,0.1-2.5,0.1-3.7,0.2c-2,0.3-4.3-0.1-6,0.2c-1.2,0.2-1.9-0.9-3.2-0.6c-5.8,1-11.8,1.6-17.1,3.2c-5.9,1.8-11.8,3.6-17.6,5.4c-3.6,0.8-7.1,1.5-10.7,2.3c-6.5,1.7-19.4,2.3-22.7-2.5c0.2-1.9,0.5-4.6,1.3-6c0.4-0.8,2.1-2.5,1.8-3.4c-0.5-0.2-1.4-0.7-1.6-1.1c-0.6-1.3-0.6-4.6,0-5.9c1.5-3.2,7.5-7,10.6-9c-1.4-1.8-4.5-3-4.5-6.1c-3.1-1.6-6.3-3.1-9.4-4.7c-4.6-2.3-9.8-3.9-14.8-5.9c-2.9-1.2-5.8-2.4-8.7-3.6c-0.2,2.2-0.8,5.4-0.3,8.2c0,1.9,0.1,3.8,0.1,5.7c-0.3,1.1-0.7,2.2-1,3.4c-0.9,3.1-1.2,7.5-1,11.2c2.1-1,2.9,1.5,1.9,3.1C1857.9,1647.9,1854.4,1647.8,1850.8,1647.7z"/>
</svg>`;

const { width, height } = Dimensions.get('window');

export default function ProfileResultScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
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
    const loadingSteps = [
      { progress: 18, messageIndex: 0, delay: 0 },
      { progress: 37, messageIndex: 1, delay: 1600 },
      { progress: 59, messageIndex: 2, delay: 1600 },
      { progress: 78, messageIndex: 3, delay: 1600 },
      { progress: 99, messageIndex: 4, delay: 1600 },
      { progress: 100, messageIndex: 4, delay: 1000 }
    ];

    let currentStep = 0;
    
    const animateProgress = () => {
      if (currentStep < loadingSteps.length) {
        const step = loadingSteps[currentStep];
        
        Animated.timing(progressAnim, {
          toValue: step.progress,
          duration: 1600,
          useNativeDriver: false,
        }).start();
        
        setProgress(step.progress);
        
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setCurrentMessageIndex(step.messageIndex);
          
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
          setTimeout(() => {
            setIsLoading(false);
            startEnhancedAnimations();
          }, 1000);
        }
      }
    };

    animateProgress();
  };

  const startEnhancedAnimations = () => {
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

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
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

  // Realistic scoring algorithm based on quiz answers
  const generateProfileDimensions = (profile) => {
    if (!profile) {
      console.log('No profile found, using default dimensions');
      return {
        desire: 65,
        satisfaction: 70,
        openness: 60,
        communication: 55,
        trust: 75
      };
    }

    console.log('Generating realistic dimensions for profile:', profile);

    let dimensions = {
      desire: 50,      // Base score - can be low or high
      satisfaction: 50, // Base score - can be low or high  
      openness: 50,    // Base score - can be low or high
      communication: 50, // Base score - can be low or high
      trust: 50        // Base score - can be low or high
    };

    // 1. DESIRE DIMENSION - Based on desire level, intimacy frequency, and enhancement
    if (profile.desireLevel === 'mild') {
      dimensions.desire = 35 + Math.floor(Math.random() * 20); // 35-55 range
    } else if (profile.desireLevel === 'spicy') {
      dimensions.desire = 60 + Math.floor(Math.random() * 25); // 60-85 range
    } else if (profile.desireLevel === 'extreme') {
      dimensions.desire = 75 + Math.floor(Math.random() * 20); // 75-95 range
    }

    // Intimacy frequency impact
    if (profile.intimacyFrequency === 'rarely') dimensions.desire -= 10;
    else if (profile.intimacyFrequency === 'daily') dimensions.desire += 15;
    else if (profile.intimacyFrequency === 'weekly') dimensions.desire += 8;
    else if (profile.intimacyFrequency === 'monthly') dimensions.desire += 2;

    // Enhancement commitment impact
    if (profile.enhancement >= 80) dimensions.desire += 12;
    else if (profile.enhancement >= 60) dimensions.desire += 8;
    else if (profile.enhancement >= 40) dimensions.desire += 4;
    else if (profile.enhancement < 40) dimensions.desire -= 5;

    // 2. SATISFACTION DIMENSION - Based on relationship status and improvement goals
    if (profile.relationshipStatus === 'dating') {
      dimensions.satisfaction = 45 + Math.floor(Math.random() * 20); // 45-65 range
    } else if (profile.relationshipStatus === 'committed') {
      dimensions.satisfaction = 55 + Math.floor(Math.random() * 20); // 55-75 range
    } else if (profile.relationshipStatus === 'engaged') {
      dimensions.satisfaction = 65 + Math.floor(Math.random() * 20); // 65-85 range
    } else if (profile.relationshipStatus === 'married') {
      dimensions.satisfaction = 60 + Math.floor(Math.random() * 25); // 60-85 range
    } else if (profile.relationshipStatus === 'long-term') {
      dimensions.satisfaction = 70 + Math.floor(Math.random() * 20); // 70-90 range
    }

    // Improvement goals impact
    if (profile.improvementGoal === 'quality') dimensions.satisfaction += 10;
    else if (profile.improvementGoal === 'frequency') dimensions.satisfaction += 8;
    else if (profile.improvementGoal === 'variety') dimensions.satisfaction += 12;
    else if (profile.improvementGoal === 'communication') dimensions.satisfaction += 6;
    else if (profile.improvementGoal === 'emotional-connection') dimensions.satisfaction += 8;

    // 3. OPENNESS DIMENSION - Based on fantasy settings, turn-ons, and comfort level
    dimensions.openness = 40; // Lower base score
    
    if (profile.fantasySettings) {
      dimensions.openness += profile.fantasySettings.length * 4;
      if (profile.fantasySettings.includes('outdoors')) dimensions.openness += 8;
      if (profile.fantasySettings.includes('public-place')) dimensions.openness += 12;
      if (profile.fantasySettings.includes('office')) dimensions.openness += 6;
      if (profile.fantasySettings.includes('car')) dimensions.openness += 8;
      if (profile.fantasySettings.includes('shower')) dimensions.openness += 5;
    }

    if (profile.turnOns) {
      dimensions.openness += profile.turnOns.length * 3;
      if (profile.turnOns.includes('sensory')) dimensions.openness += 6;
      if (profile.turnOns.includes('teasing')) dimensions.openness += 5;
      if (profile.turnOns.includes('roleplay')) dimensions.openness += 8;
      if (profile.turnOns.includes('power-play')) dimensions.openness += 10;
      if (profile.turnOns.includes('public-play')) dimensions.openness += 12;
      if (profile.turnOns.includes('bondage')) dimensions.openness += 9;
      if (profile.turnOns.includes('dirty-talk')) dimensions.openness += 7;
    }

    // Comfort level impact
    if (profile.comfortLevel >= 8) dimensions.openness += 15;
    else if (profile.comfortLevel >= 6) dimensions.openness += 10;
    else if (profile.comfortLevel >= 4) dimensions.openness += 5;
    else if (profile.comfortLevel < 4) dimensions.openness -= 8;

    // 4. COMMUNICATION DIMENSION - Based on comfort level and improvement goals
    dimensions.communication = 45; // Lower base score
    
    if (profile.comfortLevel >= 8) dimensions.communication += 20;
    else if (profile.comfortLevel >= 6) dimensions.communication += 15;
    else if (profile.comfortLevel >= 4) dimensions.communication += 8;
    else if (profile.comfortLevel < 4) dimensions.communication -= 10;
    
    if (profile.improvementGoal === 'communication') dimensions.communication += 15;
    if (profile.improvementGoal === 'emotional-connection') dimensions.communication += 12;
    
    if (profile.turnOns?.includes('dirty-talk')) dimensions.communication += 10;
    if (profile.turnOns?.includes('roleplay')) dimensions.communication += 8;

    // 5. TRUST DIMENSION - Based on relationship status and biggest challenge
    dimensions.trust = 60; // Moderate base score
    
    if (profile.relationshipStatus === 'dating') dimensions.trust += 5;
    else if (profile.relationshipStatus === 'committed') dimensions.trust += 10;
    else if (profile.relationshipStatus === 'engaged') dimensions.trust += 15;
    else if (profile.relationshipStatus === 'married') dimensions.trust += 20;
    else if (profile.relationshipStatus === 'long-term') dimensions.trust += 18;

    // Biggest challenge impact
    if (profile.biggestChallenge === 'communication') dimensions.trust -= 8;
    else if (profile.biggestChallenge === 'time') dimensions.trust -= 3;
    else if (profile.biggestChallenge === 'desire-mismatch') dimensions.trust -= 5;
    else if (profile.biggestChallenge === 'routine') dimensions.trust -= 2;
    else if (profile.biggestChallenge === 'emotional-connection') dimensions.trust -= 6;

    // Cap all dimensions between 20-95 for realism
    Object.keys(dimensions).forEach(key => {
      dimensions[key] = Math.max(20, Math.min(95, dimensions[key]));
    });

    console.log('Generated realistic dimensions:', dimensions);
    return dimensions;
  };

  const profileDimensions = generateProfileDimensions(userProfile);

  // Personalized insight generation based on actual app content
  const generatePersonalizedInsight = (profile, dimensions) => {
    if (!profile) {
      return {
        title: "Your Personalized Velvet Experience ✨",
        text: "Based on your profile, we recommend starting with our Mild Seduction category and the Sexy Dice Game for a gentle introduction to new experiences.",
        icons: ["💕", "🎲", "✨"],
        recommendations: ["Mild Seduction", "Sexy Dice Game", "Today's Picks"]
      };
    }

    console.log('Generating personalized insight for profile:', profile);
    console.log('Dimensions:', dimensions);

    // Find top and lowest dimensions
    const sortedDimensions = Object.entries(dimensions)
      .sort(([,a], [,b]) => b - a);
    
    const topDimension = sortedDimensions[0];
    const lowestDimension = sortedDimensions[sortedDimensions.length - 1];

    let insightTitle = "Your Personalized Velvet Experience ✨";
    let insightText = "";
    let icons = ["✨", "💋", "🔥"];
    let recommendations = [];

    // Base recommendations on actual app content
    const baseRecommendations = [
      "Today's Picks 💋",
      "Sexy Dice Game 🎲", 
      "Spin the Wheel 🎡",
      "Fantasy Builder 🏗️"
    ];

    // 1. Desire-based recommendations
    if (profile.desireLevel === 'mild') {
      recommendations.push("Mild Seduction 💕", "Foreplay 💋");
      icons = ["🌸", "💕", "✨"];
      insightText += "Your gentle approach to intimacy is perfect for our Mild Seduction and Foreplay categories. ";
    } else if (profile.desireLevel === 'spicy') {
      recommendations.push("Soft Domination 👑", "Roleplay 🎭");
      icons = ["🔥", "🎭", "💋"];
      insightText += "Your adventurous spirit will love our Soft Domination and Roleplay experiences. ";
    } else if (profile.desireLevel === 'extreme') {
      recommendations.push("Fantasy Extreme ⚡", "Light Restraints 🔗");
      icons = ["⚡", "🔗", "😈"];
      insightText += "Your extreme desires are perfect for our Fantasy Extreme and Light Restraints categories. ";
    }

    // 2. Frequency-based recommendations
    if (profile.intimacyFrequency === 'rarely') {
      recommendations.push("Sensory Play ✨");
      insightText += "Since you're in a dry spell, our Sensory Play cards can help rekindle the spark. ";
    } else if (profile.intimacyFrequency === 'daily') {
      recommendations.push("Teasing & Denial 🔥");
      insightText += "Your daily intimacy makes you perfect for our Teasing & Denial challenges. ";
    }

    // 3. Challenge-based recommendations
    if (profile.biggestChallenge === 'communication') {
      recommendations.push("Communication Cards 💬");
      insightText += "Our communication-focused cards will help you express your needs better. ";
    } else if (profile.biggestChallenge === 'routine') {
      recommendations.push("Variety Packs 🎭");
      insightText += "Break out of routine with our variety packs and random position generators. ";
    } else if (profile.biggestChallenge === 'emotional-connection') {
      recommendations.push("Emotional Intimacy 💝");
      insightText += "Focus on emotional connection with our gentle, bonding experiences. ";
    }

    // 4. Comfort level recommendations
    if (profile.comfortLevel < 5) {
      recommendations.push("Gentle Start 🌸");
      insightText += "Start gently with our beginner-friendly experiences to build confidence. ";
    } else if (profile.comfortLevel >= 8) {
      recommendations.push("Advanced Challenges 🚀");
      insightText += "Your high comfort level makes you perfect for our advanced challenges. ";
    }

    // 5. Fantasy settings recommendations
    if (profile.fantasySettings?.includes('outdoors')) {
      recommendations.push("Outdoor Adventure 🌲");
      insightText += "Your love for outdoor play will enjoy our adventure-themed cards. ";
    }
    if (profile.fantasySettings?.includes('public-place')) {
      recommendations.push("Public Play 🌆");
      insightText += "Explore our public play scenarios for thrilling experiences. ";
    }

    // 6. Turn-ons based recommendations
    if (profile.turnOns?.includes('sensory')) {
      recommendations.push("Sensory Experience 🎵");
      insightText += "Our sensory play cards will heighten your pleasure. ";
    }
    if (profile.turnOns?.includes('roleplay')) {
      recommendations.push("Roleplay Collection 🎭");
      insightText += "Dive into our extensive roleplay scenarios. ";
    }

    // 7. Enhancement commitment recommendations
    if (profile.enhancement >= 80) {
      recommendations.push("Premium Content 💎");
      insightText += "Your high commitment to improvement makes you perfect for our premium content. ";
    }

    // Remove duplicates and limit to 6 recommendations
    recommendations = [...new Set([...baseRecommendations, ...recommendations])].slice(0, 6);

    // Create personalized message based on dimensions
    if (topDimension[1] >= 80) {
      insightText += `Your ${topDimension[0]} score of ${Math.round(topDimension[1])}% shows you're ready for advanced experiences! `;
    } else if (topDimension[1] >= 60) {
      insightText += `Your ${topDimension[0]} score of ${Math.round(topDimension[1])}% indicates good potential for growth. `;
    } else {
      insightText += `Your ${topDimension[0]} score of ${Math.round(topDimension[1])}% suggests starting with foundational experiences. `;
    }

    if (lowestDimension[1] < 40) {
      insightText += `Focus on improving your ${lowestDimension[0]} through our targeted exercises and guidance.`;
    } else {
      insightText += `All areas show balanced development, perfect for comprehensive growth.`;
    }

    return {
      title: insightTitle,
      text: insightText,
      icons: icons,
      recommendations: recommendations
    };
  };

  const personalizedInsight = generatePersonalizedInsight(userProfile, profileDimensions);

  // Loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        <LinearGradient
          colors={['#000000', '#1A0000', '#330000', '#4D0000']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingTitle}>Analyzing Your Profile</Text>
          <Text style={styles.loadingSubtitle}>Discovering your unique desires...</Text>
          
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
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <Animated.View 
          style={[
            styles.heroHeader, 
            { 
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.heroContent}>
            <Animated.Text 
              style={[
                styles.heroTitle,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              Your Intimacy Profile 🔥
            </Animated.Text>
            <Text style={styles.heroSubtitle}>Discover your unique desires</Text>
            
            {/* Sexual Position SVG Illustration */}
            <View style={styles.svgContainer}>
              <SvgXml
                xml={sexualPositionSvg}
                width="200"
                height="120"
                style={styles.heroSvg}
              />
            </View>
            
            <View style={styles.sparkleContainer}>
              <Text style={styles.sparkle}>✨</Text>
              <Text style={styles.sparkle}>💫</Text>
              <Text style={styles.sparkle}>🌟</Text>
            </View>
          </View>
        </Animated.View>

        {/* Profile Summary Card */}
        <Animated.View 
          style={[
            styles.profileSummaryCard, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Profile Summary</Text>
            <Text style={styles.cardSubtitle}>Based on your quiz answers</Text>
            
            {/* Small SVG Decoration */}
            <View style={styles.cardSvgContainer}>
              <SvgXml
                xml={sexualPositionSvg}
                width="80"
                height="40"
                style={styles.cardSvg}
              />
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Desire Level</Text>
              <Text style={styles.summaryValue}>
                {userProfile?.desireLevel?.charAt(0).toUpperCase() + userProfile?.desireLevel?.slice(1) || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Relationship</Text>
              <Text style={styles.summaryValue}>
                {userProfile?.relationshipStatus?.charAt(0).toUpperCase() + userProfile?.relationshipStatus?.slice(1) || 'Not specified'}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Frequency</Text>
              <Text style={styles.summaryValue}>
                {userProfile?.intimacyFrequency?.charAt(0).toUpperCase() + userProfile?.intimacyFrequency?.slice(1) || 'Not specified'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Enhancement</Text>
              <Text style={styles.summaryValue}>
                {userProfile?.enhancement ? `${Math.round(userProfile.enhancement)}%` : 'Not specified'}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Intimacy Dimensions */}
        <Animated.View 
          style={[
            styles.dimensionsSection, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Intimacy Dimensions</Text>
            
            {/* Section SVG Decoration */}
            <View style={styles.sectionSvgContainer}>
              <SvgXml
                xml={sexualPositionSvg}
                width="60"
                height="30"
                style={styles.sectionSvg}
              />
            </View>
          </View>

          <View style={styles.dimensionsGrid}>
            {Object.entries(profileDimensions).map(([key, value], index) => (
              <Animated.View 
                key={key}
                style={[
                  styles.dimensionCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, index % 2 === 0 ? 10 : -10]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.dimensionHeader}>
                  <Text style={styles.dimensionLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.dimensionValue}>{Math.round(value)}%</Text>
                </View>
                
            <View style={styles.dimensionBar}>
                  <Animated.View 
                    style={[
                      styles.dimensionFill, 
                      { 
                        width: `${value}%`
                      }
                    ]} 
                  />
                </View>
                
                <View style={styles.dimensionFooter}>
                  <Text style={styles.dimensionDescription}>
                    {value >= 90 ? 'Exceptional' : 
                     value >= 80 ? 'Excellent' : 
                     value >= 70 ? 'Good' : 
                     value >= 60 ? 'Fair' : 'Developing'}
                  </Text>
                  <Text style={styles.dimensionReason}>
                    {key === 'desire' && 'Based on your desire level, frequency, and enhancement commitment'}
                    {key === 'satisfaction' && 'Based on your relationship status and improvement goals'}
                    {key === 'openness' && 'Based on your fantasy settings, turn-ons, and comfort level'}
                    {key === 'communication' && 'Based on your comfort level and improvement goals'}
                    {key === 'trust' && 'Based on your relationship status and biggest challenges'}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

                {/* Personalized Recommendations */}
        <Animated.View 
          style={[
            styles.recommendationsSection, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You ✨</Text>
            
            {/* Section SVG Decoration */}
            <View style={styles.sectionSvgContainer}>
              <SvgXml
                xml={sexualPositionSvg}
                width="60"
                height="30"
                style={styles.sectionSvg}
              />
            </View>
          </View>

          <View style={styles.recommendationsGrid}>
            {personalizedInsight.recommendations.map((recommendation, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.recommendationCard,
                  {
                    opacity: fadeAnim,
                    transform: [{
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, index % 2 === 0 ? 15 : -15]
                      })
                    }]
                  }
                ]}
              >
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Personalized Insight */}
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
            <View style={styles.insightHeader}>
              <Text style={styles.insightTitle}>{personalizedInsight.title}</Text>
              
              {/* Insight SVG Decoration */}
              <View style={styles.insightSvgContainer}>
                <SvgXml
                  xml={sexualPositionSvg}
                  width="50"
                  height="25"
                  style={styles.insightSvg}
                />
              </View>
            </View>
            
            <Text style={styles.insightText}>
              {personalizedInsight.text}
            </Text>
            
            <View style={styles.insightIcons}>
              {personalizedInsight.icons.map((icon, index) => (
                <Text key={index} style={styles.insightIcon}>{icon}</Text>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Button */}
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
  
  // Hero Header
  heroHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: '#DC143C',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#CD5C5C',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  sparkleContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  sparkle: {
    fontSize: 24,
    opacity: 0.8,
  },
  svgContainer: {
    marginBottom: 20,
  },
  heroSvg: {
    width: '100%',
    height: '100%',
  },

  // Profile Summary Card
  profileSummaryCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#CD5C5C',
    opacity: 0.8,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.2)',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#CD5C5C',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC143C',
    textAlign: 'center',
  },
  cardSvgContainer: {
    marginTop: 10,
    alignSelf: 'center',
  },
  cardSvg: {
    width: '100%',
    height: '100%',
  },

  // Dimensions Section
  dimensionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  sectionSvgContainer: {
    marginLeft: 10,
  },
  sectionSvg: {
    width: '100%',
    height: '100%',
  },
  dimensionsGrid: {
    gap: 16,
  },
  dimensionCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.2)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dimensionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dimensionValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC143C',
  },
  dimensionBar: {
    height: 12,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    marginBottom: 12,
  },
  dimensionFill: {
    height: '100%',
    backgroundColor: '#DC143C',
    borderRadius: 6,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    shadowOpacity: 0.6,
    elevation: 4,
  },
  dimensionFooter: {
    alignItems: 'center',
  },
  dimensionDescription: {
    fontSize: 14,
    color: '#CD5C5C',
    fontWeight: '500',
  },
  dimensionReason: {
    fontSize: 11,
    fontWeight: '400',
    color: '#CD5C5C',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
    lineHeight: 14,
  },

  // Recommendations Section
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  recommendationCard: {
    width: '48%',
    padding: 16,
    backgroundColor: 'rgba(220, 20, 60, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    elevation: 6,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Insight Section
  insightSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  insightCard: {
    backgroundColor: 'rgba(220, 20, 60, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.3)',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
  },
  insightHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  insightSvgContainer: {
    marginTop: 10,
    alignSelf: 'center',
  },
  insightSvg: {
    width: '100%',
    height: '100%',
  },
  insightText: {
    fontSize: 16,
    color: '#CD5C5C',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
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

  // Bottom Spacing
  bottomSpacing: {
    height: 200,
  },

  // Sticky Button
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 40,
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
    paddingVertical: 18,
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

  // Loading Styles
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
