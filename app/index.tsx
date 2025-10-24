import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function InitialRoute() {
  const router = useRouter();
  const { user, loading, hasCompletedOnboarding } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && hasCompletedOnboarding) {
        // User is signed in and has completed onboarding
        router.replace('/home');
      } else if (user && !hasCompletedOnboarding) {
        // User is signed in but hasn't completed onboarding
        router.replace('/onboarding');
      } else {
        // No user, show welcome screen
        router.replace('/welcome');
      }
    }
  }, [user, loading, hasCompletedOnboarding, router]);

  // Show a minimal loading screen only while checking auth
  if (loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#DC143C" style={styles.loader} />
      </View>
    );
  }

  // If not loading, redirect immediately (this should be very fast)
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A0E0E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});
