import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Lottie from 'lottie-react';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import welcomeAnimation from '../../assets/images/welcome.json';

const { width, height } = Dimensions.get("screen");

export default function WelcomeScreen() {
  const router = useRouter();
  const [LottieView, setLottieView] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('lottie-react-native').then((module) => {
        setLottieView(() => module.default);
      });
    }

    // Simple fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetStarted = () => {
    router.push("/onboarding");
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#0F0F23', '#1F1B4B', '#2D1B69']}
        style={styles.gradient}
      />

      {/* Lottie Animation */}
      {Platform.OS === 'web' ? (
        <Lottie
          animationData={welcomeAnimation}
          loop
          autoplay
          style={styles.lottie}
        />
      ) : (
        LottieView && (
          <LottieView
            source={welcomeAnimation}
            autoPlay
            loop
            style={styles.lottie}
          />
        )
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
          <Text style={styles.brandTitle}>Velvet</Text>
          <Text style={styles.tagline}>Play deeper. Love bolder.</Text>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 56,
    fontWeight: '900',
    color: '#EC4899',
    marginBottom: 16,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 18,
    color: '#D1D5DB',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
