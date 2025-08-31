import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Always show welcome first, then handle routing in welcome screen
      router.replace('/welcome');
    }
  }, [loading, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#DC143C" />
      </View>
    );
  }

  return null;
}
