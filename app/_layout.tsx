import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../src/contexts/AuthContext';
import { IAPProvider } from '../src/contexts/IAPContext';
import AnalyticsService from '../src/services/AnalyticsService';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Initialize analytics and error tracking
  useEffect(() => {
    // Track app launch with anonymous user tracking
    AnalyticsService.trackAppLaunch();

    // Set up global error handler
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Track JavaScript errors
      const errorMessage = args.join(' ');
      AnalyticsService.trackError(
        { message: errorMessage, stack: new Error().stack },
        'javascript_error',
        'error'
      );
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, [colorScheme]);

  if (!loaded) {
    // Show a proper splash screen instead of null
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#DC143C', fontSize: 48, fontWeight: 'bold', marginBottom: 20 }}>Velvet</Text>
        <Text style={{ color: '#CD5C5C', fontSize: 18, marginBottom: 30 }}>Your intimate adventure starts here</Text>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <IAPProvider>
          <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="welcome" />
         <Stack.Screen name="onboarding" />
        <Stack.Screen 
          name="analysis" 
          options={{ 
            gestureEnabled: false,
            animationTypeForReplace: 'pop'
          }} 
        />
        <Stack.Screen name="signup" />
        <Stack.Screen 
          name="signup-details" 
          options={{ 
            gestureEnabled: false,
            animationTypeForReplace: 'pop'
          }} 
        />
        <Stack.Screen 
          name="profile-result" 
          options={{ 
            gestureEnabled: false,
            animationTypeForReplace: 'pop'
          }} 
        />
         <Stack.Screen name="payment" />
         <Stack.Screen name="login" />
          <Stack.Screen name="home" />
          <Stack.Screen name="deck" />
          <Stack.Screen name="dice-game" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        </IAPProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
