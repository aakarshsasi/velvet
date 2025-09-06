import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function PremiumUpgrade({ onUpgradePress }) {
  const { isPremium, upgradeToPremium, user } = useAuth();

  const handleUpgrade = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to upgrade to premium');
      return;
    }

    // If onUpgradePress is provided, use it (for navigation to payments page)
    if (onUpgradePress) {
      onUpgradePress();
      return;
    }

    // Fallback to original alert behavior
    Alert.alert(
      'Upgrade to Premium',
      'Unlock all premium features including exclusive content, advanced games, and personalized experiences!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upgrade Now',
          onPress: async () => {
            try {
              await upgradeToPremium();
              Alert.alert('Success', 'Welcome to Premium! 🎉');
            } catch (error) {
              Alert.alert('Error', 'Failed to upgrade. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isPremium) {
    return (
      <View style={styles.premiumBadge}>
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={styles.premiumGradient}
        >
          <Text style={styles.premiumText}>⭐ Premium Member</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.upgradeContainer} onPress={handleUpgrade}>
      <LinearGradient
        colors={['#FFD700', '#FFA500', '#FF8C00']}
        style={styles.upgradeGradient}
      >
        <Text style={styles.upgradeTitle}>🚀 Upgrade to Premium</Text>
        <Text style={styles.upgradeSubtitle}>
          Unlock exclusive content & features
        </Text>
        <View style={styles.featuresList}>
          <Text style={styles.feature}>✨ Advanced dice games</Text>
          <Text style={styles.feature}>🔥 Exclusive categories</Text>
          <Text style={styles.feature}>💎 Personalized content</Text>
          <Text style={styles.feature}>🎯 Premium challenges</Text>
        </View>
        <Text style={styles.upgradeButton}>Upgrade Now</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  premiumBadge: {
    marginVertical: 10,
  },
  premiumGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  premiumText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  upgradeContainer: {
    marginVertical: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  upgradeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 5,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.8,
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresList: {
    alignItems: 'center',
    marginBottom: 15,
  },
  feature: {
    fontSize: 12,
    color: '#000000',
    opacity: 0.9,
    marginBottom: 3,
  },
  upgradeButton: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
});
