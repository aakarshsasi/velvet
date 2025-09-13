import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
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

export default function DeckScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const { user, isPremium } = useAuth();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCards, setCompletedCards] = useState(new Set());
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showCardReveal, setShowCardReveal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const cardRevealAnim = useRef(new Animated.Value(0)).current;
  const cardScaleAnim = useRef(new Animated.Value(0.8)).current;
  const cardOpacityAnim = useRef(new Animated.Value(0)).current;
  
  // Enhanced animation values for card transitions
  const cardSlideAnim = useRef(new Animated.Value(0)).current;
  const cardRotateAnim = useRef(new Animated.Value(0)).current;
  const cardGlowAnim = useRef(new Animated.Value(0)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;
  const nextCardSlideAnim = useRef(new Animated.Value(0)).current;
  const nextCardOpacityAnim = useRef(new Animated.Value(1)).current;

  // Start sensual animations
  React.useEffect(() => {
    const startAnimations = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimations();
  }, []);

  // Helper function to check if a category is premium
  const isCategoryPremium = (categoryKey) => {
    // Only 'mild-seduction' is free, all others are premium
    return categoryKey !== 'mild-seduction';
  };

  // Helper function to show premium upgrade modal
  const showPremiumUpgradeModal = () => {
    setShowPremiumModal(true);
  };

  // Card data for each category
  const cardDecks = {
    'mild-seduction': [
      {
        id: 1,
        title: 'Sultry Whisper Tease',
        description: 'Lean in close and whisper a naughty fantasy into your partner\'s ear, describing in vivid detail what you\'d do to them. Maintain intense eye contact and let your breath graze their skin.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '😘',
        color: '#FBBF24',
      },
      {
        id: 2,
        title: 'Thigh Caress',
        description: 'Slowly trace your fingers along your partner\'s inner thigh, teasing closer to their most sensitive spots without touching them directly. Whisper how much their body turns you on.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '🔥',
        color: '#F59E0B',
      },
      {
        id: 3,
        title: 'Lip Tease Nibble',
        description: 'Hover your lips over your partner\'s, barely brushing them, then gently nibble their lower lip while murmuring how much you crave their taste.',
        difficulty: 'Easy',
        duration: '3 min',
        icon: '💋',
        color: '#D97706',
      },
      {
        id: 4,
        title: 'Blindfolded Touch',
        description: 'Blindfold your partner and run your hands sensually over their body, focusing on erogenous zones like their neck, chest, and hips. Describe how their reactions drive you wild.',
        difficulty: 'Medium',
        duration: '7 min',
        icon: '😈',
        color: '#FBBF24',
      },
      {
        id: 5,
        title: 'Earlobe Suck',
        description: 'Kiss your partner\'s neck, then slowly suck on their earlobe while whispering how much you want to feel their body against yours.',
        difficulty: 'Easy',
        duration: '3 min',
        icon: '👂',
        color: '#F59E0B',
      },
      {
        id: 6,
        title: 'Chest Kiss Trail',
        description: 'Unbutton your partner\'s shirt (or lift it) and plant slow, wet kisses from their collarbone down to their chest, lingering just above their nipples.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '😘',
        color: '#D97706',
      },
      {
        id: 7,
        title: 'Slow Grind Tease',
        description: 'Straddle your partner\'s lap, slowly grinding against them while maintaining eye contact and whispering how desperately you want to feel them inside you.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '🍑',
        color: '#F472B6',
      },
      {
        id: 8,
        title: 'Underwear Tease',
        description: 'Slide your hand under your partner\'s clothing, teasingly brushing over their underwear while describing in explicit detail how you plan to pleasure them later.',
        difficulty: 'Medium',
        duration: '4 min',
        icon: '👙',
        color: '#FBBF24',
      },
      {
        id: 9,
        title: 'Inner Wrist Lick',
        description: 'Take your partner\'s wrist, kiss it softly, then trace your tongue along their pulse point while locking eyes and murmuring how their scent makes you ache.',
        difficulty: 'Medium',
        duration: '3 min',
        icon: '👅',
        color: '#D97706',
      },
      {
        id: 10,
        title: 'Collarbone Bite',
        description: 'Kiss along your partner\'s collarbone, then give a gentle, teasing bite while pressing your body closer to theirs and describing how they make you lose control.',
        difficulty: 'Medium',
        duration: '4 min',
        icon: '😈',
        color: '#F59E0B',
      },
      {
        id: 11,
        title: 'Sensual Massage Tease',
        description: 'Massage your partner\'s lower back, letting your hands slip just under their waistband, teasing their skin while whispering how much you want to explore every inch of them.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '💆',
        color: '#8B5CF6',
      },
      {
        id: 12,
        title: 'Erotic Confession',
        description: 'Take turns confessing your most forbidden sexual fantasy to each other in explicit detail, letting your hands wander over their body as you speak.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '😈',
        color: '#F472B6',
      },
      {
        id: 13,
        title: 'Hip Grind Hug',
        description: 'Pull your partner close, pressing your hips together and subtly grinding against them while whispering how their body drives you crazy.',
        difficulty: 'Medium',
        duration: '4 min',
        icon: '💃',
        color: '#FBBF24',
      },
      {
        id: 14,
        title: 'Nipple Tease',
        description: 'Lightly trace circles around your partner\'s nipples through their shirt (or directly on skin if they\'re comfortable), teasing without full contact while describing how much you want them.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '😘',
        color: '#F59E0B',
      },
      {
        id: 15,
        title: 'Dirty Dance Move',
        description: 'Pull your partner close for a slow dance, pressing your bodies together and letting your hands wander to their hips or lower back while whispering how much you want to fuck them.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '💃',
        color: '#D97706',
      },
    ],
    'foreplay': [
      {
        id: 1,
        title: 'Passionate Kiss',
        description: 'Kiss your partner passionately for 20 seconds without using hands.',
        difficulty: 'Easy',
        duration: '1 min',
        icon: '💋',
        color: '#F472B6',
      },
      {
        id: 2,
        title: 'Feather Touch',
        description: 'Explore your partner\'s body with feather-light touches over clothing.',
        difficulty: 'Medium',
        duration: '10 min',
        icon: '🪶',
        color: '#EC4899',
      },
      {
        id: 3,
        title: 'Lip Nibble',
        description: 'Nibble gently on your partner\'s lower lip during a kiss.',
        difficulty: 'Medium',
        duration: '3 min',
        icon: '😘',
        color: '#DB2777',
      },
      {
        id: 4,
        title: 'Collarbone Trace',
        description: 'Use your tongue to trace patterns on your partner\'s collarbone.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '👅',
        color: '#F472B6',
      },
      {
        id: 5,
        title: 'Thigh Massage',
        description: 'Massage your partner\'s thighs slowly, inching closer but not touching intimately.',
        difficulty: 'Medium',
        duration: '8 min',
        icon: '💆',
        color: '#EC4899',
      },
      {
        id: 6,
        title: 'Wrist Fantasies',
        description: 'Whisper fantasies while kissing your partner\'s inner wrist.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '💭',
        color: '#DB2777',
      },
      {
        id: 7,
        title: 'Earlobe Lick',
        description: 'Lick your partner\'s earlobe softly and breathe warmly into their ear.',
        difficulty: 'Medium',
        duration: '4 min',
        icon: '👂',
        color: '#F472B6',
      },
      {
        id: 8,
        title: 'Chest Trail',
        description: 'Trail kisses from your partner\'s mouth down to their chest, stopping at the collar.',
        difficulty: 'Medium',
        duration: '6 min',
        icon: '💋',
        color: '#EC4899',
      },
      {
        id: 9,
        title: 'Finger Suck',
        description: 'Gently suck on your partner\'s fingers one by one.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '👄',
        color: '#DB2777',
      },
      {
        id: 10,
        title: 'Body Press',
        description: 'Press your body against your partner\'s while swaying to imaginary music.',
        difficulty: 'Easy',
        duration: '3 min',
        icon: '💃',
        color: '#F472B6',
      },
      {
        id: 11,
        title: 'Back Scratch',
        description: 'Use your nails to lightly scratch your partner\'s back over their shirt.',
        difficulty: 'Medium',
        duration: '4 min',
        icon: '💅',
        color: '#EC4899',
      },
      {
        id: 12,
        title: 'Elbow to Arm',
        description: 'Kiss the inside of your partner\'s elbow and work up the arm.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '💋',
        color: '#DB2777',
      },
      {
        id: 13,
        title: 'Jawline Kisses',
        description: 'Blow soft kisses along your partner\'s jawline.',
        difficulty: 'Easy',
        duration: '4 min',
        icon: '💋',
        color: '#F472B6',
      },
      {
        id: 14,
        title: 'Deep Hair Kiss',
        description: 'Hold a deep kiss while running hands through each other\'s hair.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '💋',
        color: '#EC4899',
      },
      {
        id: 15,
        title: 'Lip Tease',
        description: 'Tease your partner\'s lips with yours, pulling away just before contact.',
        difficulty: 'Medium',
        duration: '3 min',
        icon: '😏',
        color: '#DB2777',
      },
    ],
    'soft-domination': [
      {
        id: 1,
        title: 'Slow Strip',
        description: 'Command your partner to strip slowly while you watch and direct their movements.',
        difficulty: 'Hard',
        duration: '10 min',
        icon: '👗',
        color: '#8B5CF6',
      },
      {
        id: 2,
        title: 'Hands Pinned',
        description: 'Pin your partner\'s hands above their head and kiss them deeply, then finger them until they beg for more.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🔒',
        color: '#7C3AED',
      },
      {
        id: 3,
        title: 'Kneel and Serve',
        description: 'Order your partner to kneel and perform oral sex on you for two minutes.',
        difficulty: 'Hard',
        duration: '5 min',
        icon: '🫦',
        color: '#6D28D9',
      },
      {
        id: 4,
        title: 'Doggy Position',
        description: 'Tell your partner to assume the doggy-style position and spank them lightly before penetrating.',
        difficulty: 'Hard',
        duration: '12 min',
        icon: '🐕',
        color: '#8B5CF6',
      },
      {
        id: 5,
        title: 'Blindfold Tease',
        description: 'Command your partner to blindfold themselves and let you tease their nipples with your mouth.',
        difficulty: 'Hard',
        duration: '10 min',
        icon: '👁️',
        color: '#7C3AED',
      },
      {
        id: 6,
        title: 'Cowgirl Control',
        description: 'Command your partner to ride you in cowgirl position while you control the pace with your hands on their hips.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '👑',
        color: '#6D28D9',
      },
      {
        id: 7,
        title: 'Edge Control',
        description: 'Instruct your partner to spread their legs and use your fingers to bring them to the edge of orgasm.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🔥',
        color: '#8B5CF6',
      },
      {
        id: 8,
        title: 'Head Guidance',
        description: 'Order your partner to give you a blowjob while you guide their head.',
        difficulty: 'Hard',
        duration: '8 min',
        icon: '💦',
        color: '#7C3AED',
      },
      {
        id: 9,
        title: 'Bend and Spank',
        description: 'Tell your partner to bend over and receive light spanking followed by anal fingering.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🍑',
        color: '#6D28D9',
      },
      {
        id: 10,
        title: 'Submissive Pose',
        description: 'Command your partner to hold a submissive pose while you explore their body with toys.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '🎭',
        color: '#8B5CF6',
      },
      {
        id: 11,
        title: '69 Control',
        description: 'Direct your partner to perform 69 position with you on top, controlling the intensity.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '6️⃣9️⃣',
        color: '#7C3AED',
      },
      {
        id: 12,
        title: 'Yes Master',
        description: 'Instruct your partner to whisper "yes, master/mistress" while you finger or lick them.',
        difficulty: 'Hard',
        duration: '10 min',
        icon: '🗣️',
        color: '#6D28D9',
      },
      {
        id: 13,
        title: 'Face Straddle',
        description: 'Order your partner to straddle your face for oral pleasure while you dominate the rhythm.',
        difficulty: 'Hard',
        duration: '12 min',
        icon: '👅',
        color: '#8B5CF6',
      },
      {
        id: 14,
        title: 'Missionary Submit',
        description: 'Tell your partner to assume missionary position and submit to deep thrusting.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🛏️',
        color: '#7C3AED',
      },
      {
        id: 15,
        title: 'Manual Edge',
        description: 'Command your partner to edge themselves manually while you watch and deny release until you allow it.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '⏰',
        color: '#6D28D9',
      },
    ],
    'light-restraints': [
      {
        id: 1,
        title: 'Scarf Wrist Tie',
        description: 'Tie your partner\'s wrists loosely with a scarf and tease their body with kisses before fingering them.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🧣',
        color: '#EC4899',
      },
      {
        id: 2,
        title: 'Silk Ankle Restraint',
        description: 'Use silk ties to restrain your partner\'s ankles and perform oral sex in a spread-eagle position.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🎀',
        color: '#DB2777',
      },
      {
        id: 3,
        title: 'Behind Back Binding',
        description: 'Bind your partner\'s hands behind their back and guide them into giving you a blowjob.',
        difficulty: 'Hard',
        duration: '12 min',
        icon: '🔒',
        color: '#EC4899',
      },
      {
        id: 4,
        title: 'Bed Cuff Missionary',
        description: 'Lightly cuff your partner to the bed and penetrate them in missionary while they can\'t touch you.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '🛏️',
        color: '#DB2777',
      },
      {
        id: 5,
        title: 'Arms Restrained Ride',
        description: 'Restrain your partner\'s arms and have them ride you reverse cowgirl style.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🤲',
        color: '#EC4899',
      },
      {
        id: 6,
        title: 'Chair Tie Edge',
        description: 'Tie your partner to a chair and edge them with your fingers until they plead.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🪑',
        color: '#DB2777',
      },
      {
        id: 7,
        title: 'Soft Rope Anal',
        description: 'Use soft ropes on your partner\'s wrists and introduce anal play with gentle fingering.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🪢',
        color: '#EC4899',
      },
      {
        id: 8,
        title: 'Legs Apart Lick',
        description: 'Bind your partner\'s legs apart and lick them to orgasm.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '👅',
        color: '#DB2777',
      },
      {
        id: 9,
        title: 'Face-Down Spank',
        description: 'Restrain your partner face-down and spank lightly before doggy-style penetration.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🍑',
        color: '#EC4899',
      },
      {
        id: 10,
        title: 'Hands Above Head Toy',
        description: 'Tie your partner\'s hands above their head and use a toy for clitoral or prostate stimulation.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '🎯',
        color: '#DB2777',
      },
      {
        id: 11,
        title: 'Handcuff 69',
        description: 'Lightly handcuff your partner and switch to 69 position for mutual oral.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '6️⃣9️⃣',
        color: '#EC4899',
      },
      {
        id: 12,
        title: 'Ankles to Bedposts',
        description: 'Bind your partner\'s ankles to the bedposts and finger them deeply.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🛏️',
        color: '#DB2777',
      },
      {
        id: 13,
        title: 'Scarf Beg Command',
        description: 'Use scarves to restrain your partner and command them to beg for a blowjob from you.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🧣',
        color: '#EC4899',
      },
      {
        id: 14,
        title: 'Hogtie Nipple Play',
        description: 'Tie your partner in a hogtie position and tease with nipple play before sex.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🐷',
        color: '#DB2779',
      },
      {
        id: 15,
        title: 'Wrist Restraint Anal',
        description: 'Restrain your partner\'s wrists and have them submit to anal penetration slowly.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🔒',
        color: '#EC4899',
      },
    ],
    'roleplay': [
      {
        id: 1,
        title: 'Boss and Employee',
        description: 'Roleplay as boss and employee: Command your "employee" to strip and give you oral under the desk.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '👔',
        color: '#F59E0B',
      },
      {
        id: 2,
        title: 'Strangers at Bar',
        description: 'Pretend to be strangers meeting at a bar: Seduce your partner into a quickie in doggy position.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🍺',
        color: '#D97706',
      },
      {
        id: 3,
        title: 'Doctor and Patient',
        description: 'Act as doctor and patient: "Examine" your partner intimately with fingers and tongue.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '👨‍⚕️',
        color: '#F59E0B',
      },
      {
        id: 4,
        title: 'Teacher and Student',
        description: 'Roleplay teacher and student: Punish with light spanking then reward with a blowjob.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '📚',
        color: '#D97706',
      },
      {
        id: 5,
        title: 'Vampire and Victim',
        description: 'Be vampire and victim: Bite necks sensually before penetrating in missionary.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '🧛',
        color: '#F59E0B',
      },
      {
        id: 6,
        title: 'Cop and Criminal',
        description: 'Pretend cop and criminal: Handcuff your partner and "interrogate" with fingering.',
        difficulty: 'Hard',
        duration: '22 min',
        icon: '👮',
        color: '#D97706',
      },
      {
        id: 7,
        title: 'Master and Servant',
        description: 'Roleplay master and servant: Order your servant to perform 69 while you command.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '👑',
        color: '#F59E0B',
      },
      {
        id: 8,
        title: 'Pirate and Captive',
        description: 'Act as pirate and captive: Tie them up and explore with anal fingering.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🏴‍☠️',
        color: '#D97706',
      },
      {
        id: 9,
        title: 'Superhero and Villain',
        description: 'Be superhero and villain: "Capture" your partner and tease to orgasm orally.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🦸',
        color: '#F59E0B',
      },
      {
        id: 10,
        title: 'Alien and Abductee',
        description: 'Roleplay alien and abductee: Probe intimately with toys and fingers.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '👽',
        color: '#D97706',
      },
      {
        id: 11,
        title: 'Royal and Commoner',
        description: 'Pretend royal and commoner: Command submission in cowgirl position.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '👑',
        color: '#F59E0B',
      },
      {
        id: 12,
        title: 'Werewolf and Mate',
        description: 'Act as werewolf and mate: Howl playfully before rough doggy-style sex.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🐺',
        color: '#D97706',
      },
      {
        id: 13,
        title: 'Chef and Diner',
        description: 'Roleplay chef and diner: "Serve" pleasure with licking and fingering.',
        difficulty: 'Hard',
        duration: '22 min',
        icon: '👨‍🍳',
        color: '#F59E0B',
      },
      {
        id: 14,
        title: 'Spy and Target',
        description: 'Be spy and target: Seduce into reverse cowgirl with spanking.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🕵️',
        color: '#D97706',
      },
      {
        id: 15,
        title: 'Ghost and Haunted',
        description: 'Pretend ghost and haunted: Tease invisibly before full anal penetration.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '👻',
        color: '#F59E0B',
      },
    ],
    'public-play': [
      {
        id: 1,
        title: 'Parked Car Fingering',
        description: 'In a parked car, finger your partner while they try to stay quiet.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🚗',
        color: '#10B981',
      },
      {
        id: 2,
        title: 'Movie Theater Handjob',
        description: 'At a movie theater, give your partner a handjob under a blanket.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🎬',
        color: '#059669',
      },
      {
        id: 3,
        title: 'Elevator Commands',
        description: 'In an elevator, press against your partner and whisper commands for later oral sex.',
        difficulty: 'Medium',
        duration: '5 min',
        icon: '🛗',
        color: '#10B981',
      },
      {
        id: 4,
        title: 'Park Bench Tease',
        description: 'At a park bench, subtly tease your partner\'s inner thigh leading to fingering.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '🪑',
        color: '#059669',
      },
      {
        id: 5,
        title: 'Restaurant Bathroom Oral',
        description: 'In a restaurant bathroom, quickly perform oral on your partner.',
        difficulty: 'Hard',
        duration: '10 min',
        icon: '🚽',
        color: '#10B981',
      },
      {
        id: 6,
        title: 'Alley Quickie',
        description: 'During a walk, pull into an alley for a standing doggy-style quickie.',
        difficulty: 'Hard',
        duration: '12 min',
        icon: '🏘️',
        color: '#059669',
      },
      {
        id: 7,
        title: 'Party Closet Masturbation',
        description: 'At a party, sneak away for mutual masturbation in a closet.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '🎉',
        color: '#10B981',
      },
      {
        id: 8,
        title: 'Fitting Room Blowjob',
        description: 'In a fitting room, try on clothes and end with a blowjob.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '👗',
        color: '#059669',
      },
      {
        id: 9,
        title: 'Beach Towel Fingering',
        description: 'On a beach, under a towel, finger your partner to near orgasm.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🏖️',
        color: '#10B981',
      },
      {
        id: 10,
        title: 'Library Fantasies',
        description: 'In a library, whisper fantasies while lightly touching over clothes, then escalate to anal play later.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '📚',
        color: '#059669',
      },
      {
        id: 11,
        title: 'Concert Grinding',
        description: 'At a concert, grind against your partner and plan for 69 at home.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '🎵',
        color: '#10B981',
      },
      {
        id: 12,
        title: 'Taxi Tease',
        description: 'In a taxi, tease with hand play leading to full penetration upon arrival.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🚕',
        color: '#059669',
      },
      {
        id: 13,
        title: 'Hiking Cowgirl',
        description: 'During a hike, find a secluded spot for outdoor cowgirl sex.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🏔️',
        color: '#10B981',
      },
      {
        id: 14,
        title: 'Bar Restroom Fingering',
        description: 'At a bar, flirt heavily and sneak to the restroom for fingering.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '🍻',
        color: '#059669',
      },
      {
        id: 15,
        title: 'Hotel Lobby Anal',
        description: 'In a hotel lobby, build tension with touches, then upstairs for anal exploration.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '🏨',
        color: '#10B981',
      },
    ],
    'lingerie-play': [
      {
        id: 1,
        title: 'Model and Rip',
        description: 'Have your partner model lingerie, then rip it off and finger them intensely.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '👗',
        color: '#EF4444',
      },
      {
        id: 2,
        title: 'Matching Striptease',
        description: 'Dress in matching outfits, tease with a striptease, and end in oral sex.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '👯',
        color: '#DC2626',
      },
      {
        id: 3,
        title: 'Sheer Command',
        description: 'Let your partner command you to wear sheer lingerie while they perform a blowjob.',
        difficulty: 'Hard',
        duration: '18 min',
        icon: '👙',
        color: '#EF4444',
      },
      {
        id: 4,
        title: 'Photo Pose',
        description: 'Pose in lingerie for photos, then submit to doggy-style penetration.',
        difficulty: 'Hard',
        duration: '22 min',
        icon: '📸',
        color: '#DC2626',
      },
      {
        id: 5,
        title: 'Layer by Layer',
        description: 'Layer lingerie and remove pieces one by one during foreplay leading to anal.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '👘',
        color: '#EF4444',
      },
      {
        id: 6,
        title: 'Dance to 69',
        description: 'Have your partner dance in lingerie, then pull them into 69 position.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '💃',
        color: '#DC2626',
      },
      {
        id: 7,
        title: 'Lingerie Blindfold',
        description: 'Use lingerie as blindfolds and restraints before fingering to orgasm.',
        difficulty: 'Medium',
        duration: '18 min',
        icon: '👁️',
        color: '#EF4444',
      },
      {
        id: 8,
        title: 'Crotchless Model',
        description: 'Model crotchless lingerie and invite your partner for immediate oral.',
        difficulty: 'Hard',
        duration: '15 min',
        icon: '👙',
        color: '#DC2626',
      },
      {
        id: 9,
        title: 'Strap Tease',
        description: 'Tease by adjusting lingerie straps while your partner watches, then ride them cowgirl.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🎀',
        color: '#EF4444',
      },
      {
        id: 10,
        title: 'Edible Lingerie',
        description: 'Incorporate edible lingerie and lick it off before deep thrusting.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🍯',
        color: '#DC2626',
      },
      {
        id: 11,
        title: 'Fashion Show',
        description: 'Have your partner command a lingerie fashion show ending in spanking and sex.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '🎭',
        color: '#EF4444',
      },
      {
        id: 12,
        title: 'Lingerie Bondage',
        description: 'Use lingerie ties for light bondage during missionary.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🔗',
        color: '#DC2626',
      },
      {
        id: 13,
        title: 'Provocative Pose',
        description: 'Pose provocatively in lingerie and let your partner explore with toys.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🎯',
        color: '#EF4444',
      },
      {
        id: 14,
        title: 'Slow Strip Edge',
        description: 'Strip slowly from lingerie while your partner edges you manually.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '⏰',
        color: '#DC2626',
      },
      {
        id: 15,
        title: 'Vibrating Lingerie',
        description: 'Wear vibrating lingerie and control each other\'s pleasure leading to anal play.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🔋',
        color: '#EF4444',
      },
    ],
    'sensory-play': [
      {
        id: 1,
        title: 'Ice Drip Fingering',
        description: 'Blindfold your partner and drip ice on their skin before fingering them.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🧊',
        color: '#8B5CF6',
      },
      {
        id: 2,
        title: 'Feather to Oral',
        description: 'Use feathers to tease, then switch to oral sex with warm breath.',
        difficulty: 'Medium',
        duration: '18 min',
        icon: '🪶',
        color: '#7C3AED',
      },
      {
        id: 3,
        title: 'Flavored Oils',
        description: 'Apply flavored oils and lick them off during a blowjob.',
        difficulty: 'Medium',
        duration: '15 min',
        icon: '🫒',
        color: '#6D28D9',
      },
      {
        id: 4,
        title: 'Hot and Cold',
        description: 'Alternate hot and cold sensations on erogenous zones before penetration.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🌡️',
        color: '#8B5CF6',
      },
      {
        id: 5,
        title: 'Silk Touch 69',
        description: 'Blindfold and use silk for touching, leading to 69 exploration.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🧣',
        color: '#7C3AED',
      },
      {
        id: 6,
        title: 'Chocolate Body',
        description: 'Incorporate food like chocolate on body parts for licking and anal fingering.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🍫',
        color: '#6D28D9',
      },
      {
        id: 7,
        title: 'Earplug Heighten',
        description: 'Use earplugs to heighten touch during doggy-style sex.',
        difficulty: 'Medium',
        duration: '18 min',
        icon: '🔇',
        color: '#8B5CF6',
      },
      {
        id: 8,
        title: 'Warming Lube',
        description: 'Apply warming lube and tease with fingers to orgasm.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🔥',
        color: '#7C3AED',
      },
      {
        id: 9,
        title: 'Blindfold Toy',
        description: 'Blindfold your partner and surprise with toy insertion.',
        difficulty: 'Hard',
        duration: '22 min',
        icon: '🎁',
        color: '#6D28D9',
      },
      {
        id: 10,
        title: 'Scented Candles',
        description: 'Use scented candles for aroma while performing cowgirl position.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🕯️',
        color: '#8B5CF6',
      },
      {
        id: 11,
        title: 'Texture Alternation',
        description: 'Alternate textures like fur and leather on skin before oral.',
        difficulty: 'Medium',
        duration: '25 min',
        icon: '🦊',
        color: '#7C3AED',
      },
      {
        id: 12,
        title: 'Sight and Sound Deprivation',
        description: 'Deprive sight and sound, then edge with manual stimulation.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '🔇',
        color: '#6D28D9',
      },
      {
        id: 13,
        title: 'Ice Cube Missionary',
        description: 'Use ice cubes during missionary for contrasting sensations.',
        difficulty: 'Medium',
        duration: '20 min',
        icon: '🧊',
        color: '#8B5CF6',
      },
      {
        id: 14,
        title: 'Taste Test Genitals',
        description: 'Incorporate taste tests with edibles on genitals before sex.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '👅',
        color: '#7C3AED',
      },
      {
        id: 15,
        title: 'Blindfold Vibration',
        description: 'Blindfold and use vibrations for sensory overload leading to anal.',
        difficulty: 'Hard',
        duration: '28 min',
        icon: '🔊',
        color: '#6D28D9',
      },
    ],
    'teasing-denial': [
      {
        id: 1,
        title: '5-Minute Tease',
        description: 'Tease your partner\'s genitals with fingers for 5 minutes without allowing orgasm.',
        difficulty: 'Hard',
        duration: '8 min',
        icon: '⏰',
        color: '#F97316',
      },
      {
        id: 2,
        title: 'Triple Edge Oral',
        description: 'Edge your partner orally three times before permitting release via blowjob.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🫦',
        color: '#EA580C',
      },
      {
        id: 3,
        title: 'Toy Edge Denial',
        description: 'Use a toy to bring your partner close, deny, then penetrate in doggy.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '🎯',
        color: '#F97316',
      },
      {
        id: 4,
        title: 'Manual Edge Repeat',
        description: 'Manually stimulate your partner to the brink, stop, repeat, end with fingering climax.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '✋',
        color: '#EA580C',
      },
      {
        id: 5,
        title: 'Beg for Missionary',
        description: 'Tease with light touches, deny penetration until begging, then missionary.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🙏',
        color: '#F97316',
      },
      {
        id: 6,
        title: '69 Double Denial',
        description: 'Edge your partner in 69 position, denying mutual orgasm twice.',
        difficulty: 'Hard',
        duration: '35 min',
        icon: '6️⃣9️⃣',
        color: '#EA580C',
      },
      {
        id: 7,
        title: 'Cowgirl Denial Commands',
        description: 'Use denial commands while your partner rides you cowgirl slowly.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '👑',
        color: '#F97316',
      },
      {
        id: 8,
        title: 'Anal Tease Denial',
        description: 'Tease anal area with fingers, deny entry until pleas, then proceed.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🍑',
        color: '#EA580C',
      },
      {
        id: 9,
        title: 'Edge and Switch',
        description: 'Bring your partner to edge with oral, stop, and switch roles.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '🔄',
        color: '#F97316',
      },
      {
        id: 10,
        title: 'Timer Teasing',
        description: 'Use timers for teasing sessions leading to explosive sex.',
        difficulty: 'Hard',
        duration: '40 min',
        icon: '⏱️',
        color: '#EA580C',
      },
      {
        id: 11,
        title: 'Manual Denial Cowgirl',
        description: 'Deny orgasm during manual play, then allow in reverse cowgirl.',
        difficulty: 'Hard',
        duration: '25 min',
        icon: '🤲',
        color: '#F97316',
      },
      {
        id: 12,
        title: 'Nipple Genital Tease',
        description: 'Tease nipples and genitals alternately, deny release until anal play.',
        difficulty: 'Hard',
        duration: '30 min',
        icon: '👅',
        color: '#EA580C',
      },
      {
        id: 13,
        title: 'Vibration Edge Stop',
        description: 'Edge with vibrations, stop repeatedly, end with deep thrusting.',
        difficulty: 'Hard',
        duration: '35 min',
        icon: '🔊',
        color: '#F97316',
      },
      {
        id: 14,
        title: 'Self-Tease Watch',
        description: 'Command your partner to self-tease while you watch and deny.',
        difficulty: 'Hard',
        duration: '20 min',
        icon: '👁️',
        color: '#EA580C',
      },
      {
        id: 15,
        title: 'Multi-Round Denial',
        description: 'Build denial over multiple rounds, culminate in full-body orgasm via positions.',
        difficulty: 'Hard',
        duration: '45 min',
        icon: '🔥',
        color: '#F97316',
      },
    ],
    'fantasy-extreme': [
      {
        id: 1,
        title: 'Kidnapping Fantasy',
        description: 'Enact a kidnapping fantasy: Blindfold, restrain, and penetrate roughly in doggy.',
        difficulty: 'Extreme',
        duration: '30 min',
        icon: '🚨',
        color: '#DC2626',
      },
      {
        id: 2,
        title: 'Tentacle Play',
        description: 'Explore tentacle play with toys for multi-point stimulation and oral.',
        difficulty: 'Extreme',
        duration: '35 min',
        icon: '🐙',
        color: '#B91C1C',
      },
      {
        id: 3,
        title: 'Mythical Shape-Shifting',
        description: 'Roleplay mythical creatures: Fuck as if shape-shifting with anal inclusion.',
        difficulty: 'Extreme',
        duration: '40 min',
        icon: '🐉',
        color: '#DC2626',
      },
      {
        id: 4,
        title: 'BDSM Light Whipping',
        description: 'Incorporate BDSM elements like whipping lightly before blowjob submission.',
        difficulty: 'Extreme',
        duration: '30 min',
        icon: '🪢',
        color: '#B91C1C',
      },
      {
        id: 5,
        title: 'Fantasy Orgy Simulation',
        description: 'Fantasy orgy simulation: Use mirrors and toys for "multiple partners" feel during 69.',
        difficulty: 'Extreme',
        duration: '45 min',
        icon: '🪞',
        color: '#DC2626',
      },
      {
        id: 6,
        title: 'Acrobatic Wheelbarrow',
        description: 'Extreme positions: Try acrobatic sex like standing wheelbarrow with fingering.',
        difficulty: 'Extreme',
        duration: '25 min',
        icon: '🤸',
        color: '#B91C1C',
      },
      {
        id: 7,
        title: 'Water Play Shower',
        description: 'Water play fantasy: Shower sex with deep throating and anal.',
        difficulty: 'Extreme',
        duration: '35 min',
        icon: '🚿',
        color: '#DC2626',
      },
      {
        id: 8,
        title: 'Supernatural Possession',
        description: 'Supernatural possession: Command "demonic" acts like intense cowgirl riding.',
        difficulty: 'Extreme',
        duration: '30 min',
        icon: '👹',
        color: '#B91C1C',
      },
      {
        id: 9,
        title: 'Post-Apocalyptic Ruins',
        description: 'Post-apocalyptic survival: Rough sex in "ruins" with spanking and penetration.',
        difficulty: 'Extreme',
        duration: '40 min',
        icon: '🏚️',
        color: '#DC2626',
      },
      {
        id: 10,
        title: 'Alien Invasion Probe',
        description: 'Alien invasion: Probe with fingers, toys, and full anal exploration.',
        difficulty: 'Extreme',
        duration: '45 min',
        icon: '👽',
        color: '#B91C1C',
      },
      {
        id: 11,
        title: 'Time Travel Relive',
        description: 'Time travel fantasy: "Relive" past encounters with escalated blowjobs.',
        difficulty: 'Extreme',
        duration: '35 min',
        icon: '⏰',
        color: '#DC2626',
      },
      {
        id: 12,
        title: 'Superhuman Airborne',
        description: 'Superhuman strength: Lift and fuck in airborne positions with oral finish.',
        difficulty: 'Extreme',
        duration: '30 min',
        icon: '💪',
        color: '#B91C1C',
      },
      {
        id: 13,
        title: 'Dark Magic Ritual',
        description: 'Dark magic ritual: Use candles, chants, and ritualistic fingering to orgasm.',
        difficulty: 'Extreme',
        duration: '40 min',
        icon: '🕯️',
        color: '#DC2626',
      },
      {
        id: 14,
        title: 'Monster Chase Primal',
        description: 'Monster chase: "Catch" your partner for primal doggy-style with bites.',
        difficulty: 'Extreme',
        duration: '35 min',
        icon: '👹',
        color: '#B91C1C',
      },
      {
        id: 15,
        title: 'VR Fantasy Real',
        description: 'Virtual reality extreme: Describe VR scenarios while performing real anal and sex acts.',
        difficulty: 'Extreme',
        duration: '50 min',
        icon: '🥽',
        color: '#DC2626',
      },
    ],
  };

  const currentDeck = cardDecks[category] || [];
  const currentCard = currentDeck[currentCardIndex];
  const progress = completedCards.size;
  const totalCards = currentDeck.length;



  const nextCard = () => {
    // Check if current category is premium and user is not premium
    if (isCategoryPremium(category) && !isPremium) {
      showPremiumUpgradeModal();
      return;
    }
    
    if (currentCardIndex < currentDeck.length - 1) {
      // Start exit animation for current card
      Animated.parallel([
        Animated.timing(nextCardSlideAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(nextCardOpacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Update card index
        setCurrentCardIndex(currentCardIndex + 1);
        
        // Reset animation values for new card
        nextCardSlideAnim.setValue(1);
        nextCardOpacityAnim.setValue(0);
        
        // Animate new card in with bounce effect
        Animated.parallel([
          Animated.spring(nextCardSlideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(nextCardOpacityAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Button press animation
  const animateButtonPress = (callback) => {
    Animated.sequence([
      Animated.timing(buttonPressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

    const startDeck = () => {
    // Check if current category is premium and user is not premium
    if (isCategoryPremium(category) && !isPremium) {
      showPremiumUpgradeModal();
      return;
    }
    
    // Reset all animation values to starting positions
    cardRevealAnim.setValue(0);
    cardScaleAnim.setValue(0.8);
    cardOpacityAnim.setValue(0);
    cardSlideAnim.setValue(0);
    cardRotateAnim.setValue(0);
    cardGlowAnim.setValue(0);
    
    // Reset card transition animations for first card
    nextCardSlideAnim.setValue(0);
    nextCardOpacityAnim.setValue(1);
    
    // Show the card reveal immediately to prevent blank screen
    setShowCardReveal(true);
    
    // Simplified animation sequence for reliability
    Animated.sequence([
      // Phase 1: Card appears and scales up
      Animated.parallel([
        Animated.timing(cardOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(cardScaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Card slides up
      Animated.timing(cardRevealAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Immediately transition to main deck
      setShowIntro(false);
      setShowCardReveal(false);
    });
  };

  const markAsCompleted = () => {
    setCompletedCards(prev => {
      const newSet = new Set([...prev, currentCard.id]);
      if (newSet.size === totalCards) {
        setShowCompletion(true);
      }
      return newSet;
    });
  };

  const getCategoryInfo = () => {
    switch (category) {
      case 'mild-seduction':
        return {
          name: 'Mild Seduction',
          icon: '💕',
          color: '#FBBF24',
          gradient: ['#FBBF24', '#F59E0B', '#D97706'],
          difficulty: 'Easy',
          introDescription: 'Gently open up conversations and create deeper connections with your partner through playful interaction.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingHeart, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingRose, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingSparkle, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.mildSeductionElements}>
              <View style={styles.romanceIndicator}>
                <Text style={styles.romanceText}>💕 Romance Level: Sweet</Text>
              </View>
              <View style={styles.intimacyMeter}>
                <View style={styles.meterBar}>
                  <View style={styles.meterFill} />
                </View>
                <Text style={styles.meterText}>Intimacy Building</Text>
              </View>
            </View>
          ),
        };
      case 'foreplay':
        return {
          name: 'Foreplay',
          icon: '💋',
          color: '#F472B6',
          gradient: ['#F472B6', '#EC4899', '#DB2777'],
          difficulty: 'Medium',
          introDescription: 'Build anticipation and explore different types of touch and sensation for deeper physical connection.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingKiss, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingLip, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingHeart, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.foreplayElements}>
              <View style={styles.sensationIndicator}>
                <Text style={styles.sensationText}>✨ Sensation Focus</Text>
              </View>
              <View style={styles.buildUpMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#F472B6' }]} />
                </View>
                <Text style={styles.meterText}>Build Up</Text>
              </View>
            </View>
          ),
        };
      case 'soft-domination':
        return {
          name: 'Soft Domination',
          icon: '👑',
          color: '#8B5CF6',
          gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'],
          difficulty: 'Hard',
          introDescription: 'Explore gentle power dynamics and role-playing scenarios in a safe, loving environment.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingCrown, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingStar, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingPower, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.dominationElements}>
              <View style={styles.powerIndicator}>
                <Text style={styles.powerText}>👑 Power Exchange</Text>
              </View>
              <View style={styles.controlMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#8B5CF6' }]} />
                </View>
                <Text style={styles.meterText}>Control Level</Text>
              </View>
            </View>
          ),
        };
      case 'roleplay':
        return {
          name: 'Roleplay',
          icon: '🎭',
          color: '#F59E0B',
          gradient: ['#F59E0B', '#D97706', '#B45309'],
          difficulty: 'Hard',
          introDescription: 'Dive into fantasies with scripts, costumes, and explicit scenarios involving various acts and power dynamics.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingMask, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingDrama, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingStage, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.roleplayElements}>
              <View style={styles.fantasyIndicator}>
                <Text style={styles.fantasyText}>🎭 Fantasy Level: High</Text>
              </View>
              <View style={styles.roleplayMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#F59E0B' }]} />
                </View>
                <Text style={styles.meterText}>Roleplay Intensity</Text>
              </View>
            </View>
          ),
        };
      case 'teasing-denial':
        return {
          name: 'Teasing & Denial',
          icon: '🔥',
          color: '#F97316',
          gradient: ['#F97316', '#EA580C', '#C2410C'],
          difficulty: 'Hard',
          introDescription: 'Build intense frustration through edging and denial techniques, culminating in explosive releases and heightened pleasure.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingFire, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingTimer, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingEdge, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.teasingElements}>
              <View style={styles.frustrationIndicator}>
                <Text style={styles.frustrationText}>🔥 Frustration Level: High</Text>
              </View>
              <View style={styles.denialMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#F97316' }]} />
                </View>
                <Text style={styles.meterText}>Denial Control</Text>
              </View>
            </View>
          ),
        };
      case 'fantasy-extreme':
        return {
          name: 'Fantasy Extreme',
          icon: '⚡',
          color: '#DC2626',
          gradient: ['#DC2626', '#B91C1C', '#991B1B'],
          difficulty: 'Extreme',
          introDescription: 'Push boundaries with wild, explicit fantasies involving intense acts, supernatural scenarios, and extreme roleplay situations.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingLightning, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingDemon, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingPortal, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.fantasyElements}>
              <View style={styles.extremeIndicator}>
                <Text style={styles.extremeText}>⚡ Intensity Level: Extreme</Text>
              </View>
              <View style={styles.fantasyMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#DC2626' }]} />
                </View>
                <Text style={styles.meterText}>Fantasy Intensity</Text>
              </View>
            </View>
          ),
        };
      case 'public-play':
        return {
          name: 'Public Play',
          icon: '🌆',
          color: '#10B981',
          gradient: ['#10B981', '#059669', '#047857'],
          difficulty: 'Hard',
          introDescription: 'Experience discreet thrills in semi-public settings, escalating to explicit risks and outdoor adventures.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingCity, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingRisk, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingAdventure, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.publicPlayElements}>
              <View style={styles.riskIndicator}>
                <Text style={styles.riskText}>🌆 Risk Level: High</Text>
              </View>
              <View style={styles.publicMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#10B981' }]} />
                </View>
                <Text style={styles.meterText}>Public Exposure</Text>
              </View>
            </View>
          ),
        };
      case 'light-restraints':
        return {
          name: 'Light Restraints',
          icon: '🔗',
          color: '#EC4899',
          gradient: ['#EC4899', '#DB2777', '#BE185D'],
          difficulty: 'Hard',
          introDescription: 'Explore gentle bindings and restraints for heightened sensation and deeper submission in a safe, loving environment.',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingChain, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingRope, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
              <Animated.View style={[styles.floatingLock, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.3, 0.7] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.restraintsElements}>
              <View style={styles.bondageIndicator}>
                <Text style={styles.bondageText}>🔗 Bondage Level: Light</Text>
              </View>
              <View style={styles.restraintMeter}>
                <View style={styles.meterBar}>
                  <View style={[styles.meterFill, { backgroundColor: '#EC4899' }]} />
                </View>
                <Text style={styles.meterText}>Restraint Control</Text>
              </View>
            </View>
          ),
        };
      default:
        return {
          name: 'Adventure',
          icon: '🎯',
          color: '#DC143C',
          gradient: ['#DC143C', '#B22222', '#8B0000'],
          difficulty: 'Medium',
          floatingElements: (
            <>
              <Animated.View style={[styles.floatingTarget, { opacity: glowAnim }]} />
              <Animated.View style={[styles.floatingStar, { opacity: glowAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0.2, 0.6] }) }]} />
            </>
          ),
          specialElements: (
            <View style={styles.defaultElements}>
              <View style={styles.adventureIndicator}>
                <Text style={styles.adventureText}>🎯 Adventure Mode</Text>
              </View>
            </View>
          ),
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No cards available for this category.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background */}
      <LinearGradient
        colors={['#000000', '#1A0000', '#330000']}
        style={styles.background}
      />

      {/* Header - Only show when not in intro */}
      {!showIntro && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.categoryName}>{categoryInfo.name}</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{currentCardIndex + 1} of {totalCards}</Text>
          </View>
        </View>
      )}



      {/* Full Page Dare */}
      <View style={styles.dareContainer}>
        {/* Background Theme - App Theme */}
        <LinearGradient
          colors={['#000000', '#1a0000', '#330000']}
          style={styles.dareBackground}
        />
        
        {/* Intro Screen */}
        {showIntro ? (
          <Animated.View 
            style={[
              styles.introContainer,
              {
                opacity: cardRevealAnim.interpolate({
                  inputRange: [0, 0.1],
                  outputRange: [1, 0],
                }),
                transform: [{
                  scale: cardRevealAnim.interpolate({
                    inputRange: [0, 0.1],
                    outputRange: [1, 0.95],
                  }),
                }],
              },
            ]}
          >
            {/* Sexy Background Elements */}
            <View style={styles.sexyBackgroundElements}>
              <Animated.View 
                style={[
                  styles.sexyGlowOrb,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.4, 0.8],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    }],
                  },
                ]}
              />
              <Animated.View 
                style={[
                  styles.sexyPulseRing,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.2, 0.6],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [1, 1.4],
                      }),
                    }],
                  },
                ]}
              />
            </View>

            {/* Enhanced Category Image with Sexy Effects */}
            <Animated.View 
              style={[
                styles.categoryImageContainer,
                {
                  transform: [{
                    scale: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1, 1.05],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(220, 20, 60, 0.3)', 'rgba(178, 34, 34, 0.2)', 'rgba(139, 0, 0, 0.3)']}
                style={styles.categoryImage}
              >
                <Image 
                  source={require('../../assets/images/mild-seduction.png')}
                  style={styles.categoryImagePNG}
                  resizeMode="cover"
                />
                {/* Sexy glow overlay */}
                <Animated.View 
                  style={[
                    styles.sexyImageGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [0.3, 0.7],
                      }),
                    },
                  ]}
                />
                {/* Subtle overlay for better integration */}
                <View style={styles.imageOverlay} />
              </LinearGradient>
            </Animated.View>
            
            {/* Enhanced Intro Content with Sexy Typography */}
            <Animated.View 
              style={[
                styles.introContent,
                {
                  transform: [{
                    translateY: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0, -5],
                    }),
                  }],
                },
              ]}
            >
              <Text style={styles.introTitle}>{categoryInfo.name}</Text>
              <Text style={styles.introSubtitle}>Ready to explore?</Text>
              <Text style={styles.introDescription}>{categoryInfo.introDescription}</Text>
              
              {/* Sexy category stats */}
              <View style={styles.categoryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{totalCards}</Text>
                  <Text style={styles.statLabel}>Challenges</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{categoryInfo.difficulty || 'Medium'}</Text>
                  <Text style={styles.statLabel}>Level</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>🔥</Text>
                  <Text style={styles.statLabel}>Hot</Text>
                </View>
              </View>
            </Animated.View>
            
            {/* Enhanced Start Deck Button with Sexy Effects */}
            <Animated.View
              style={[
                styles.startDeckButtonContainer,
                {
                  transform: [{
                    scale: glowAnim.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [1, 1.02],
                    }),
                  }],
                },
              ]}
            >
              {/* Journey title outside button */}
              <Text style={styles.journeyTitle}>Begin Your Journey</Text>
              
              <TouchableOpacity 
                style={styles.startDeckButton} 
                onPress={() => animateButtonPress(startDeck)}
              >
                <LinearGradient
                  colors={['#DC143C', '#B22222', '#8B0000']}
                  style={styles.startDeckButtonGradient}
                >
                  {/* Sexy shimmer effect */}
                  <Animated.View
                    style={[
                      styles.sexyButtonShimmer,
                      {
                        transform: [{ translateX: glowAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [-200, 250],
                        }) }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['transparent', 'rgba(255, 255, 255, 0.6)', 'transparent']}
                      style={styles.sexyShimmerGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                  
                  <Text style={styles.startDeckButtonText}>Start Exploring</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        ) : (
          <>
            {/* Card Flip Animation - Only show when showCardReveal is true */}
            {showCardReveal && (
              <Animated.View 
                style={[
                  styles.cardFlipContainer,
                  {
                    transform: [
                      { translateY: cardRevealAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height * 0.5, 0],
                      })},
                      { translateX: cardSlideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width * 0.3, 0],
                      })},
                      { scale: cardScaleAnim },
                      { rotate: cardRotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-15deg', '0deg'],
                      })},
                    ],
                    opacity: cardOpacityAnim,
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(220, 20, 60, 0.8)', 'rgba(178, 34, 34, 0.7)', 'rgba(139, 0, 0, 0.8)']}
                  style={styles.cardFlipGradient}
                >
                  {/* Glow effect overlay */}
                  <Animated.View 
                    style={[
                      styles.cardGlowOverlay,
                      {
                        opacity: cardGlowAnim,
                        transform: [{ scale: cardGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }) }],
                      },
                    ]}
                  />
                  <View style={styles.cardFlipContent}>
                    <Text style={styles.cardFlipTitle}>First Challenge</Text>
                    <Text style={styles.cardFlipSubtitle}>Get ready for your first intimate adventure...</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}
            
            {/* Animation test indicator */}
            {showCardReveal && (
              <View style={styles.animationTest}>
                <Text style={styles.animationTestText}>
                  Anim: {cardRevealAnim._value.toFixed(2)} | 
                  Scale: {cardScaleAnim._value.toFixed(2)} | 
                  Opacity: {cardOpacityAnim._value.toFixed(2)}
                </Text>
              </View>
            )}
            
            {/* Main Deck Content - Only show when not showing intro and not showing card reveal */}
            {(!showIntro && !showCardReveal) && currentCard && (
              <View style={styles.mainDeckContainer}>
                {/* Floating Theme Elements */}
                {categoryInfo.floatingElements}
                
                {/* Sensual Background Patterns */}
                <View style={styles.sensualPatterns}>
                  <Animated.View 
                    style={[
                      styles.patternCircle1,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.1, 0.2],
                        }),
                      },
                    ]}
                  />
                  <Animated.View 
                    style={[
                      styles.patternCircle2,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0.3, 1],
                          outputRange: [0.15, 0.25],
                        }),
                      },
                    ]}
                  />
                </View>
                
                {/* Dare Content */}
                <Animated.View 
                  style={[
                    styles.dareContent,
                    {
                      transform: [
                        { translateX: nextCardSlideAnim.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: [-width * 0.5, 0, width * 0.5],
                        }) },
                      ],
                      opacity: nextCardOpacityAnim,
                    },
                  ]}
                >
                  {/* Card Header with Icon and Title */}
                  <Animated.View 
                    style={[
                      styles.cardHeader,
                      {
                        transform: [{ scale: nextCardOpacityAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }) }],
                      },
                    ]}
                  >
                    <View style={styles.cardIconContainer}>
                      <Text style={styles.cardIcon}>{currentCard.icon}</Text>
                    </View>
                    <Text style={styles.cardTitle}>{currentCard.title}</Text>
                    <View style={styles.cardDifficultyContainer}>
                      <Text style={styles.cardDifficulty}>{currentCard.difficulty}</Text>
                      <Text style={styles.cardDuration}>• {currentCard.duration}</Text>
                    </View>
                  </Animated.View>
                  
                  {/* Dare Text Card - Main Content */}
                  <View style={styles.dareTextContainer}>
                    {/* Subtle Background Pattern */}
                    <View style={styles.dareBackgroundPattern} />
                    <Text style={styles.dareText}>{currentCard.description}</Text>
                  </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View 
                  style={[
                    styles.actionButtonsContainer,
                    {
                      transform: [{ scale: buttonPressAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => animateButtonPress(nextCard)}
                  >
                    <LinearGradient
                      colors={['#DC143C', '#B22222', '#8B0000']}
                      style={styles.actionButtonGradient}
                    >
                      {/* Glossy Overlay */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.3)', 'transparent', 'rgba(255, 255, 255, 0.1)']}
                        style={styles.glossyOverlay}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                      />
                      {/* Shimmer Effect */}
                      <Animated.View
                        style={[
                          styles.buttonShimmer,
                          {
                            transform: [{ translateX: glowAnim.interpolate({
                              inputRange: [0.3, 1],
                              outputRange: [-200, 250],
                            }) }],
                          },
                        ]}
                      >
                        <LinearGradient
                          colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
                          style={styles.shimmerGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        />
                      </Animated.View>
                      <Text style={styles.actionButtonText}>Next Prompt</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Completion Celebration */}
      {showCompletion && (
        <View style={styles.completionOverlay}>
          <LinearGradient
            colors={categoryInfo.gradient}
            style={styles.completionCard}
          >
            <Text style={styles.completionIcon}>🎉</Text>
            <Text style={styles.completionTitle}>Challenge Complete!</Text>
            <Text style={styles.completionSubtitle}>
              You've completed all {totalCards} challenges in {categoryInfo.name}
            </Text>
            <TouchableOpacity
              style={styles.completionButton}
              onPress={() => router.back()}
            >
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                style={styles.completionButtonGradient}
              >
                <Text style={styles.completionButtonText}>Back to Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}



      {/* Floating Elements */}
      <View style={styles.floatingElements}>
        <Animated.View
          style={[
            styles.floatingCircle,
            {
              opacity: glowAnim,
              transform: [{ scale: glowAnim.interpolate({
                inputRange: [0.3, 1],
                outputRange: [0.8, 1.2],
              })}],
            },
          ]}
        />
      </View>

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
            <LinearGradient
              colors={['#DC143C', '#B22222', '#8B0000']}
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Drag Handle */}
              <View style={styles.dragHandle} />
              
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Unlock Premium Categories</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowPremiumModal(false)}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
              
              {/* Modal Body */}
              <View style={styles.premiumModalBody}>
                <Text style={styles.premiumModalDescription}>
                  This category is part of our premium collection. Upgrade now to access all premium categories and unlock unlimited intimate experiences!
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
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
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },

  dareContainer: {
    flex: 1,
    position: 'relative',
  },
  introContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 50, // Reduced from 60 to save space
    paddingBottom: 30, // Reduced from 40 to save space
    position: 'relative',
  },
  categoryImageContainer: {
    width: width * 0.6, // Further reduced from 0.7 to save space
    height: width * 0.6, // Further reduced from 0.7 to save space
    borderRadius: 25,
    marginBottom: 20, // Further reduced from 30 to save space
    overflow: 'hidden',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(220, 20, 60, 0.5)',
    position: 'relative',
  },
  categoryImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  categoryImageIcon: {
    fontSize: 100,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  categoryImagePNG: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 25,
  },
  cardFlipContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  cardFlipGradient: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.4)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  cardFlipContent: {
    alignItems: 'center',
    padding: 40,
  },
  cardFlipTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardFlipSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  animationTest: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 2000,
  },
  animationTestText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },

  introContent: {
    alignItems: 'center',
    marginBottom: 20, // Reduced from 30 to save space
    paddingHorizontal: 10,
    width: '100%',
  },
  introTitle: {
    fontSize: 38, // Reduced from 42 to save space
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10, // Reduced from 15 to save space
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 1,
    lineHeight: 42, // Reduced from 48 to save space
  },
  introSubtitle: {
    fontSize: 22, // Reduced from 24 to save space
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8, // Reduced from 10 to save space
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  introDescription: {
    fontSize: 16, // Reduced from 18 to save space
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22, // Reduced from 26 to save space
    marginBottom: 15, // Reduced from 20 to save space
    paddingHorizontal: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    maxWidth: width * 0.9,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12, // Reduced from 15 to save space
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  journeyTitle: {
    fontSize: 22, // Reduced from 24 to save space
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 15, // Reduced from 20 to save space
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  startDeckButtonContainer: {
    width: width * 0.8,
    alignItems: 'center',
    marginTop: 20, // Added margin to separate from content above
  },
  startDeckButton: {
    width: '100%',
    height: 50, // Reduced from 60 since we only have text now
    borderRadius: 25, // Adjusted for new height
    overflow: 'hidden',
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 20,
  },
  startDeckButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 0, // Remove padding to let flexbox handle centering
  },
  startDeckButtonText: {
    fontSize: 20, // Increased from 18 since we have more space now
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    textAlign: 'center', // Ensure center alignment
    lineHeight: 20, // Match font size for perfect centering
  },
  startDeckSubtext: {
    fontSize: 12, // Reduced from 14 to fit better
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 3, // Reduced from 5 for better spacing
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  startDeckIcon: {
    fontSize: 32, // Reduced from 40 to fit better
    color: '#FFFFFF',
    marginBottom: 0, // Remove margin to let flexbox handle spacing
    lineHeight: 32, // Match font size for perfect centering
  },
  dareBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dareContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15, // Adjusted for better spacing balance
    paddingBottom: 20, // Reduced bottom padding
    minHeight: height * 0.5, // Ensure proper height for content distribution
  },

  dareTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 40,
    borderRadius: 24,
    marginTop: 8, // Added small margin for balanced spacing
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
    width: width * 0.9,
    minHeight: height * 0.35, // Further reduced to prevent excessive height
    justifyContent: 'center',
    alignItems: 'center',
  },
  dareText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.6,
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 25,
    maxWidth: width * 0.8,
  },
  dareTextGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    zIndex: 1,
  },
  dareBackgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    backgroundColor: 'rgba(220, 20, 60, 0.03)',
    zIndex: 1,
  },

  cardHeader: {
    alignItems: 'center',
    marginBottom: 15, // Added small margin for visual separation
    marginTop: 0, // Removed top margin for visible shift
    paddingHorizontal: 20,
  },
  cardIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardDifficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDifficulty: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },


  actionButtonsContainer: {
    alignItems: 'center',
    marginTop: 30, // Increased from 20 to create better spacing
    marginBottom: 20,
  },
  
  actionButton: {
    width: width * 0.7,
    height: 55,
    borderRadius: 27.5,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#DC143C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glossyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    zIndex: 2,
  },
  buttonShimmer: {
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
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.6,
  },
  
  // Themed Elements Styles
  mildSeductionElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  romanceIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  romanceText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  intimacyMeter: {
    alignItems: 'center',
  },
  meterBar: {
    width: 120,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    width: '70%',
    backgroundColor: '#FBBF24',
    borderRadius: 3,
  },
  meterText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  
  foreplayElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  sensationIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  sensationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buildUpMeter: {
    alignItems: 'center',
  },
  
  dominationElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  powerIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  powerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  controlMeter: {
    alignItems: 'center',
  },
  
  restraintsElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  bondageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  bondageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  restraintMeter: {
    alignItems: 'center',
  },
  
  roleplayElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  fantasyIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  fantasyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  roleplayMeter: {
    alignItems: 'center',
  },
  
  publicPlayElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  riskIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  publicMeter: {
    alignItems: 'center',
  },
  
  teasingElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  frustrationIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  frustrationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  denialMeter: {
    alignItems: 'center',
  },
  
  fantasyElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  extremeIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  extremeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fantasyMeter: {
    alignItems: 'center',
  },
  
  defaultElements: {
    alignItems: 'center',
    marginTop: 20,
  },
  adventureIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  adventureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    top: height * 0.3,
    right: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(220, 20, 60, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.15)',
  },
  
  // Themed Floating Elements
  floatingHeart: {
    position: 'absolute',
    top: height * 0.2,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 3,
    borderColor: 'rgba(220, 20, 60, 0.7)',
    shadowColor: 'rgba(220, 20, 60, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  floatingRose: {
    position: 'absolute',
    top: height * 0.6,
    right: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 3,
    borderColor: 'rgba(220, 20, 60, 0.7)',
    shadowColor: 'rgba(220, 20, 60, 0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 6,
  },
  floatingSparkle: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.7,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: 'rgba(255, 255, 255, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  floatingKiss: {
    position: 'absolute',
    top: height * 0.15,
    left: 30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(236, 72, 153, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.6)',
  },
  floatingLip: {
    position: 'absolute',
    top: height * 0.7,
    right: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(219, 39, 119, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(219, 39, 119, 0.6)',
  },
  floatingCrown: {
    position: 'absolute',
    top: height * 0.1,
    left: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  floatingStar: {
    position: 'absolute',
    top: height * 0.5,
    right: 60,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  floatingPower: {
    position: 'absolute',
    top: height * 0.8,
    left: width * 0.6,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  floatingChain: {
    position: 'absolute',
    top: height * 0.15,
    left: 40,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(236, 72, 153, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.6)',
  },
  floatingRope: {
    position: 'absolute',
    top: height * 0.6,
    right: 50,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(219, 39, 119, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(219, 39, 119, 0.6)',
  },
  floatingLock: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.7,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(190, 24, 93, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(190, 24, 93, 0.6)',
  },
  floatingMask: {
    position: 'absolute',
    top: height * 0.2,
    left: 50,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(245, 158, 11, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.6)',
  },
  floatingDrama: {
    position: 'absolute',
    top: height * 0.6,
    right: 60,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(217, 119, 6, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(217, 119, 6, 0.6)',
  },
  floatingStage: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(180, 83, 9, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(180, 83, 9, 0.6)',
  },
  floatingCity: {
    position: 'absolute',
    top: height * 0.15,
    left: 45,
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.6)',
  },
  floatingRisk: {
    position: 'absolute',
    top: height * 0.65,
    right: 55,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(5, 150, 105, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(5, 150, 105, 0.6)',
  },
  floatingAdventure: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.65,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(4, 120, 87, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(4, 120, 87, 0.6)',
  },
  floatingFire: {
    position: 'absolute',
    top: height * 0.2,
    left: 55,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(249, 115, 22, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(249, 115, 22, 0.6)',
  },
  floatingTimer: {
    position: 'absolute',
    top: height * 0.65,
    right: 65,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(234, 88, 12, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(234, 88, 12, 0.6)',
  },
  floatingEdge: {
    position: 'absolute',
    top: height * 0.4,
    left: width * 0.7,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(194, 65, 12, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(194, 65, 12, 0.6)',
  },
  floatingLightning: {
    position: 'absolute',
    top: height * 0.15,
    left: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(220, 38, 38, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 38, 38, 0.6)',
  },
  floatingDemon: {
    position: 'absolute',
    top: height * 0.7,
    right: 70,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(185, 28, 28, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(185, 28, 28, 0.6)',
  },
  floatingPortal: {
    position: 'absolute',
    top: height * 0.45,
    left: width * 0.75,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(153, 27, 27, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(153, 27, 27, 0.6)',
  },
  floatingTarget: {
    position: 'absolute',
    top: height * 0.25,
    left: 40,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(220, 20, 60, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(220, 20, 60, 0.6)',
  },
  
  // Sensual Background Patterns
  sensualPatterns: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  patternCircle1: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(220, 20, 60, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.08)',
  },
  patternCircle2: {
    position: 'absolute',
    bottom: height * 0.15,
    left: width * 0.15,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(220, 20, 60, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(220, 20, 60, 0.06)',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  completionCard: {
    width: width * 0.8,
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  completionIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  completionButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  completionButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cardGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    zIndex: 1,
    backgroundColor: 'rgba(220, 20, 60, 0.5)',
    opacity: 0.5,
  },

  mainDeckContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30, // Adjusted from 20 to create better spacing from header
  },

  // New styles for intro page enhancements
  sexyBackgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1, // Ensure it's behind other content
  },
  sexyGlowOrb: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    opacity: 0.8,
  },
  sexyPulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    opacity: 0.6,
  },
  sexyImageGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    backgroundColor: 'rgba(220, 20, 60, 0.3)',
    opacity: 0.7,
  },
  sexyButtonShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  sexyShimmerGradient: {
    width: 200,
    height: '100%',
  },

  // Premium Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  premiumModalContent: {
    maxHeight: height * 0.75,
    backgroundColor: '#DC143C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalGradient: {
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 0,
    borderRadius: 2,
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
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 24,
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
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 10,
  },

});

