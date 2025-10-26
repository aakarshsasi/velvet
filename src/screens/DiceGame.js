import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import PremiumUpgrade from '../components/PremiumUpgrade';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function DiceGame() {
  const router = useRouter();
  const { user, isPremium, upgradeToPremium } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('sensual');
  const [actionResult, setActionResult] = useState(null);
  const [targetResult, setTargetResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollAnimation] = useState(new Animated.Value(0));
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [showMenu, setShowMenu] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const categories = {
    sensual: {
      name: 'Sensual',
      icon: '💕',
      description: 'Soft & Romantic',
      color: '#FF6B9D',
      isPremium: false,
      actions: ['Kiss', 'Massage', 'Caress', 'Nibble', 'Stroke', 'Whisper to'],
      targets: ['Neck', 'Lips', 'Ears', 'Shoulders', 'Back', 'Arms'],
    },
    naughty: {
      name: 'Naughty',
      icon: '🔥',
      description: 'Bold & Teasing',
      color: '#FF6B35',
      isPremium: true,
      actions: ['Lick', 'Bite', 'Suck', 'Tease', 'Spank', 'Grind against'],
      targets: [
        'Thighs',
        'Butt',
        'Chest',
        'Inner thighs',
        'Nipples',
        'Lower back',
      ],
    },
    expert: {
      name: 'Expert',
      icon: '⚡',
      description: 'Wild & Daring',
      color: '#8B5CF6',
      isPremium: true,
      actions: [
        'Tongue-tease',
        'Nibble on',
        'Ice-play with',
        'Blindfold and touch',
        'Feather-tickle',
        'Deep kiss',
      ],
      targets: [
        'Cock/Pussy',
        'Asshole',
        'Inner thighs',
        'Tits',
        'Balls/Clit',
        'Collarbone',
      ],
    },
  };

  React.useEffect(() => {
    // Continuous subtle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rollAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rollAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Debug effect to monitor category changes
  React.useEffect(() => {
    console.log('Category changed to:', selectedCategory);
  }, [selectedCategory]);

  // Helper function to check if a category is accessible
  const isCategoryAccessible = (categoryKey) => {
    const category = categories[categoryKey];
    if (!category.isPremium) return true; // Sensual is always free

    // Premium categories are only accessible if user is premium
    return isPremium;
  };

  // Helper function to show premium upgrade modal
  const showPremiumUpgradeModal = () => {
    setShowPremiumModal(true);
  };

  const rollDice = () => {
    if (isRolling) return;

    // Check if current category is accessible
    if (!isCategoryAccessible(selectedCategory)) {
      showPremiumUpgradeModal();
      return;
    }

    // Haptic feedback when starting to roll
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setIsRolling(true);

    // Shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Roll animation
    Animated.sequence([
      Animated.timing(rollAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rollAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Generate results after animation
    setTimeout(() => {
      const currentCategory = categories[selectedCategory];
      const randomAction =
        currentCategory.actions[
          Math.floor(Math.random() * currentCategory.actions.length)
        ];
      const randomTarget =
        currentCategory.targets[
          Math.floor(Math.random() * currentCategory.targets.length)
        ];

      // Haptic feedback when results are shown
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setActionResult(randomAction);
      setTargetResult(randomTarget);
      setRollCount((prev) => prev + 1); // Increment roll count
      setIsRolling(false);
    }, 600);
  };

  const getCategoryColor = (category) => {
    return selectedCategory === category
      ? categories[category].color
      : '#6B7280';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <LinearGradient
        colors={['#DC143C', '#B22222', '#8B0000', '#4D0000']}
        style={styles.background}
      />

      {/* Dynamic background patterns based on category */}
      <View style={styles.backgroundPatterns}>
        <View
          style={[
            styles.pattern1,
            { backgroundColor: categories[selectedCategory].color + '15' },
          ]}
        />
        <View
          style={[
            styles.pattern2,
            { backgroundColor: categories[selectedCategory].color + '12' },
          ]}
        />
        <View
          style={[
            styles.pattern3,
            { backgroundColor: categories[selectedCategory].color + '10' },
          ]}
        />
        <View
          style={[
            styles.pattern4,
            { backgroundColor: categories[selectedCategory].color + '08' },
          ]}
        />
      </View>

      {/* Header - Similar to deck page */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.categoryName}>Dice Game</Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Category Display */}
      <View style={styles.categoryDisplay}>
        <Text style={styles.categoryText}>
          {categories[selectedCategory].name}
          {!isCategoryAccessible(selectedCategory) &&
            categories[selectedCategory].isPremium &&
            ' 🔒'}
        </Text>
        <Text style={styles.categorySubtext}>
          {!isCategoryAccessible(selectedCategory) &&
          categories[selectedCategory].isPremium
            ? 'Premium category - Upgrade to unlock'
            : 'Your current vibe'}
        </Text>
      </View>

      {/* Dice Results */}
      <View style={styles.diceResults}>
        <View style={styles.diceColumn}>
          <View style={styles.diceContainer} key={`action-${selectedCategory}`}>
            <Text
              style={[
                styles.diceLabel,
                {
                  color:
                    selectedCategory === 'expert'
                      ? '#8B5CF6'
                      : categories[selectedCategory].color,
                },
              ]}
            >
              Action
            </Text>
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor:
                    selectedCategory === 'expert'
                      ? '#F3F0FF'
                      : categories[selectedCategory].color === '#FF6B9D'
                        ? '#FFF0F5'
                        : categories[selectedCategory].color === '#FF6B35'
                          ? '#FFF8F0'
                          : '#FFF0F0',
                  borderColor:
                    selectedCategory === 'expert'
                      ? '#8B5CF6'
                      : categories[selectedCategory].color,
                  shadowColor:
                    selectedCategory === 'expert'
                      ? '#8B5CF6'
                      : categories[selectedCategory].color,
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.resultText,
                  {
                    color:
                      selectedCategory === 'expert'
                        ? '#8B5CF6'
                        : categories[selectedCategory].color,
                    transform: [
                      { translateX: shakeAnimation },
                      {
                        scale: rollAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.05],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {actionResult || 'Roll to see'}
              </Animated.Text>
            </View>
          </View>

          <View style={styles.diceContainer} key={`target-${selectedCategory}`}>
            <Text
              style={[
                styles.diceLabel,
                {
                  color:
                    selectedCategory === 'expert'
                      ? '#8B5CF6'
                      : categories[selectedCategory].color,
                },
              ]}
            >
              Target
            </Text>
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor:
                    selectedCategory === 'expert'
                      ? '#F3F0FF'
                      : categories[selectedCategory].color === '#FF6B9D'
                        ? '#FFF0F5'
                        : categories[selectedCategory].color === '#FF6B35'
                          ? '#FFF8F0'
                          : '#FFF0F0',
                  borderColor:
                    selectedCategory === 'expert'
                      ? '#8B5CF6'
                      : categories[selectedCategory].color,
                  shadowColor:
                    selectedCategory === 'expert'
                      ? '#8B5CF6'
                      : categories[selectedCategory].color,
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.resultText,
                  {
                    color:
                      selectedCategory === 'expert'
                        ? '#8B5CF6'
                        : categories[selectedCategory].color,
                    transform: [
                      { translateX: shakeAnimation },
                      {
                        scale: rollAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.05],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {targetResult || 'Roll to see'}
              </Animated.Text>
            </View>
          </View>
        </View>
      </View>

      {/* Roll Button */}
      <View style={styles.rollButtonContainer}>
        <TouchableOpacity
          style={[
            styles.rollButton,
            isRolling && styles.rollButtonRolling,
            { borderColor: categories[selectedCategory].color },
          ]}
          onPress={rollDice}
          disabled={isRolling}
        >
          <LinearGradient
            colors={
              isRolling
                ? ['#6B7280', '#4B5563']
                : [
                    categories[selectedCategory].color,
                    categories[selectedCategory].color + 'DD',
                  ]
            }
            style={styles.rollButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.rollButtonIcon}>🎲</Text>
            <Text
              style={[
                styles.rollButtonText,
                { color: isRolling ? '#6B7280' : '#FFFFFF' },
              ]}
            >
              {isRolling ? 'Rolling...' : 'ROLL DICE'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Category Selection Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Choose Your Vibe</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowMenu(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.categoryList}>
                {Object.keys(categories).map((category) => {
                  const isAccessible = isCategoryAccessible(category);
                  const isPremiumCategory = categories[category].isPremium;
                  const isLockedForRolling = !isAccessible && isPremiumCategory;

                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryItem,
                        selectedCategory === category &&
                          styles.categoryItemSelected,
                      ]}
                      onPress={() => {
                        // Haptic feedback when selecting category
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        console.log('Changing category to:', category);
                        setSelectedCategory(category);
                        setShowMenu(false);
                        // Reset results when category changes
                        setActionResult(null);
                        setTargetResult(null);
                      }}
                    >
                      <Text style={styles.categoryItemIcon}>
                        {categories[category].icon}
                      </Text>
                      <View style={styles.categoryItemText}>
                        <Text
                          style={[
                            styles.categoryItemName,
                            selectedCategory === category &&
                              styles.categoryItemNameSelected,
                          ]}
                        >
                          {categories[category].name}
                          {isLockedForRolling && ' 🔒'}
                        </Text>
                        <Text style={[styles.categoryItemDescription]}>
                          {isLockedForRolling
                            ? `${categories[category].description} - Premium (Locked)`
                            : categories[category].description}
                        </Text>
                      </View>
                      {isLockedForRolling && (
                        <View style={styles.browseOnlyBadge}>
                          <Text style={styles.browseOnlyText}>Locked</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Premium Upgrade Modal */}
      <Modal
        visible={showPremiumModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPremiumModal(false)}
        >
          <TouchableOpacity
            style={styles.premiumModalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.modalGradient}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  🔥 Unlock Premium Categories
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPremiumModal(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.premiumModalBody}>
                <Text style={styles.premiumModalDescription}>
                  Premium categories are completely locked! Upgrade to unlock
                  Naughty and Expert categories and start rolling the dice!
                </Text>
                <PremiumUpgrade
                  onUpgradePress={() => {
                    setShowPremiumModal(false);
                    router.push('/payment');
                  }}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  backgroundPatterns: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  pattern1: {
    position: 'absolute',
    top: '15%',
    right: '8%',
    width: 140,
    height: 140,
    backgroundColor: 'rgba(139, 0, 0, 0.08)',
    borderRadius: 70,
    transform: [{ rotate: '45deg' }],
  },
  pattern2: {
    position: 'absolute',
    top: '55%',
    left: '3%',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(178, 34, 34, 0.06)',
    borderRadius: 50,
    transform: [{ rotate: '-30deg' }],
  },
  pattern3: {
    position: 'absolute',
    bottom: '35%',
    right: '15%',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(220, 20, 60, 0.05)',
    borderRadius: 60,
    transform: [{ rotate: '15deg' }],
  },
  pattern4: {
    position: 'absolute',
    top: '75%',
    left: '20%',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 107, 157, 0.04)',
    borderRadius: 40,
    transform: [{ rotate: '60deg' }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerCenter: {
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoryDisplay: {
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 45,
    paddingHorizontal: 20,
  },
  categoryText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  categorySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  diceResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 60,
  },
  diceColumn: {
    alignItems: 'center',
    width: '100%',
    gap: 35,
  },
  diceContainer: {
    alignItems: 'center',
    width: '100%',
    minHeight: 160,
  },
  diceLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 18,
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultCard: {
    width: width - 120,
    height: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  resultText: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    zIndex: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
    lineHeight: 32,
  },
  rollButtonContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 35,
    paddingHorizontal: 20,
  },
  rollButton: {
    width: width - 80,
    height: 80,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
    elevation: 25,
    borderWidth: 3,
  },
  rollButtonRolling: {
    opacity: 0.7,
  },
  rollButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  rollButtonIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  rollButtonText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  modalGradient: {
    paddingTop: 16,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 50,
    position: 'relative',
    minHeight: 40,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoryList: {
    gap: 18,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryItemSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#FFFFFF',
  },
  categoryItemIcon: {
    fontSize: 28,
    marginRight: 20,
  },
  categoryItemText: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  categoryItemNameSelected: {
    color: '#FFFFFF',
  },
  categoryItemDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  categoryItemLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    opacity: 0.6,
  },
  categoryItemNameLocked: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  categoryItemDescriptionLocked: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  browseOnlyBadge: {
    width: 60,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  browseOnlyText: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
  },
  premiumModalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    maxHeight: height * 0.75,
    backgroundColor: '#DC143C',
    marginBottom: 0,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  premiumModalBody: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  premiumModalDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
});
