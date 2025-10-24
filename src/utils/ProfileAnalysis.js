// Comprehensive Matrix-Based Profile Analysis System

// Slider range divisions for comfort level (0-10)
export const COMFORT_LEVEL_RANGES = {
  VERY_LOW: {
    min: 0,
    max: 2,
    label: 'Very Uncomfortable',
    traits: ['shy', 'reserved', 'needs-gentle-approach'],
  },
  LOW: {
    min: 3,
    max: 4,
    label: 'Uncomfortable',
    traits: ['cautious', 'needs-reassurance', 'gradual-progress'],
  },
  MODERATE: {
    min: 5,
    max: 6,
    label: 'Moderately Comfortable',
    traits: ['balanced', 'open-to-exploration', 'communicative'],
  },
  HIGH: {
    min: 7,
    max: 8,
    label: 'Comfortable',
    traits: ['confident', 'adventurous', 'expressive'],
  },
  VERY_HIGH: {
    min: 9,
    max: 10,
    label: 'Very Comfortable',
    traits: ['bold', 'experimental', 'leadership'],
  },
};

// Enhancement commitment ranges (0-100)
export const ENHANCEMENT_RANGES = {
  LOW: {
    min: 0,
    max: 20,
    label: 'Casual Interest',
    traits: ['low-commitment', 'exploratory', 'flexible'],
  },
  MODERATE: {
    min: 21,
    max: 40,
    label: 'Moderate Interest',
    traits: ['balanced-approach', 'selective', 'measured'],
  },
  HIGH: {
    min: 41,
    max: 60,
    label: 'High Interest',
    traits: ['committed', 'focused', 'dedicated'],
  },
  VERY_HIGH: {
    min: 61,
    max: 80,
    label: 'Very High Interest',
    traits: ['highly-committed', 'intensive', 'goal-oriented'],
  },
  EXTREME: {
    min: 81,
    max: 100,
    label: 'Extreme Commitment',
    traits: ['maximum-commitment', 'transformative', 'all-in'],
  },
};

// Comprehensive persona matrix
export const PERSONA_MATRIX = {
  // Single people personas
  'self-explorer': {
    name: 'Self Explorer',
    description:
      "You're on a journey of self-discovery, learning about your desires and building confidence",
    traits: ['curious', 'self-aware', 'learning', 'gentle', 'introspective'],
    triggers: ['single', 'self-discovery', 'mild', 'knowledge'],
    recommendations: [
      'Self-Discovery Guide',
      'Confidence Building',
      'Mindful Exploration',
    ],
    color: '#6366F1',
  },
  'confident-solo': {
    name: 'Confident Solo',
    description:
      "You're comfortable with yourself and focused on building confidence for future relationships",
    traits: ['confident', 'self-assured', 'prepared', 'independent', 'strong'],
    triggers: ['single', 'confidence-building', 'high-comfort', 'future-ready'],
    recommendations: [
      'Confidence Mastery',
      'Future Relationship Prep',
      'Self-Love Practices',
    ],
    color: '#10B981',
  },
  'future-ready': {
    name: 'Future Ready',
    description:
      "You're preparing yourself for future relationships with knowledge and self-awareness",
    traits: ['prepared', 'knowledgeable', 'strategic', 'mature', 'ready'],
    triggers: ['single', 'future-relationship', 'spicy', 'communication'],
    recommendations: [
      'Relationship Readiness',
      'Communication Skills',
      'Intimacy Knowledge',
    ],
    color: '#EC4899',
  },
  'adventurous-single': {
    name: 'Adventurous Single',
    description:
      "You're exploring bold experiences and pushing boundaries in your solo journey",
    traits: ['adventurous', 'bold', 'experimental', 'fearless', 'creative'],
    triggers: ['single', 'exploration', 'extreme', 'variety'],
    recommendations: [
      'Adventure Exploration',
      'Bold Experiences',
      'Creative Techniques',
    ],
    color: '#EF4444',
  },
  'mindful-solo': {
    name: 'Mindful Solo',
    description:
      'You focus on quality self-pleasure and mindful exploration of your desires',
    traits: ['mindful', 'quality-focused', 'present', 'satisfied', 'balanced'],
    triggers: ['single', 'self-pleasure', 'moderate-comfort', 'quality'],
    recommendations: [
      'Mindful Practices',
      'Quality Techniques',
      'Self-Pleasure Mastery',
    ],
    color: '#8B5CF6',
  },
  // Couple personas
  'gentle-explorer': {
    name: 'Gentle Explorer',
    description:
      'You prefer intimate, tender experiences that build emotional connection',
    traits: ['mild', 'emotional', 'tender', 'romantic', 'patient'],
    triggers: ['mild', 'dating', 'communication', 'emotional-connection'],
    recommendations: ['Mild Seduction', 'Sensory Play', 'Emotional Intimacy'],
    color: '#10B981',
  },
  'passionate-adventurer': {
    name: 'Passionate Adventurer',
    description:
      'You crave excitement and variety in your intimate experiences',
    traits: [
      'spicy',
      'adventurous',
      'variety-seeking',
      'energetic',
      'spontaneous',
    ],
    triggers: ['spicy', 'committed', 'variety', 'roleplay'],
    recommendations: ['Roleplay', 'Adventure Cards', 'Variety Packs'],
    color: '#F59E0B',
  },
  'mysterious-seductress': {
    name: 'Mysterious Seductress',
    description: 'You enjoy the art of seduction and building anticipation',
    traits: [
      'teasing',
      'mysterious',
      'anticipation',
      'sophisticated',
      'strategic',
    ],
    triggers: ['extreme', 'engaged', 'teasing', 'power-play'],
    recommendations: [
      'Teasing & Denial',
      'Power Dynamics',
      'Seduction Techniques',
    ],
    color: '#8B5CF6',
  },
  'wild-dreamer': {
    name: 'Wild Dreamer',
    description: "You have bold fantasies and aren't afraid to explore them",
    traits: ['extreme', 'fantasy-driven', 'bold', 'uninhibited', 'creative'],
    triggers: ['extreme', 'married', 'public-play', 'bondage'],
    recommendations: ['Fantasy Extreme', 'Public Play', 'Advanced Techniques'],
    color: '#EF4444',
  },
  'sensual-master': {
    name: 'Sensual Master',
    description: 'You focus on the art of pleasure and sensory experiences',
    traits: ['sensory', 'skilled', 'patient', 'focused', 'perfectionist'],
    triggers: ['spicy', 'long-term', 'sensory', 'quality'],
    recommendations: ['Sensory Play', 'Massage Techniques', 'Pleasure Mastery'],
    color: '#EC4899',
  },
  'intimate-communicator': {
    name: 'Intimate Communicator',
    description: 'You believe great intimacy comes from great communication',
    traits: [
      'communicative',
      'empathetic',
      'understanding',
      'patient',
      'supportive',
    ],
    triggers: ['mild', 'married', 'communication', 'emotional-connection'],
    recommendations: [
      'Communication Cards',
      'Emotional Intimacy',
      'Couples Therapy',
    ],
    color: '#06B6D4',
  },
};

// Challenge-based insights
export const CHALLENGE_INSIGHTS = {
  // Single people challenges
  'self-confidence': {
    title: 'Confidence Builder',
    insight:
      "You're working on building self-confidence, which is the foundation of healthy relationships and self-pleasure.",
    tips: [
      'Practice self-affirmations',
      'Celebrate small wins',
      'Focus on your strengths',
    ],
    recommendations: [
      'Confidence Building',
      'Self-Love Practices',
      'Body Positivity',
    ],
  },
  knowledge: {
    title: 'Knowledge Seeker',
    insight:
      "You're eager to learn about your body and desires, showing great self-awareness and growth mindset.",
    tips: ['Read educational content', 'Explore mindfully', 'Ask questions'],
    recommendations: [
      'Educational Content',
      'Self-Discovery Guide',
      'Body Knowledge',
    ],
  },
  exploration: {
    title: 'Exploration Enthusiast',
    insight:
      "You're ready to try new things and expand your horizons, showing courage and openness.",
    tips: ['Start small', 'Be patient with yourself', 'Trust your instincts'],
    recommendations: [
      'Adventure Exploration',
      'Variety Techniques',
      'Safe Experimentation',
    ],
  },
  'communication-single': {
    title: 'Future Communication Champion',
    insight:
      "You're preparing for future relationships by learning to communicate about intimacy.",
    tips: [
      'Practice expressing needs',
      'Learn active listening',
      'Build emotional vocabulary',
    ],
    recommendations: [
      'Communication Skills',
      'Relationship Readiness',
      'Emotional Intelligence',
    ],
  },
  'routine-single': {
    title: 'Routine Breaker',
    insight:
      "You're ready to add variety to your solo experiences and break out of patterns.",
    tips: [
      'Try new locations',
      'Experiment with timing',
      'Introduce surprises',
    ],
    recommendations: [
      'Variety Techniques',
      'Creative Exploration',
      'Surprise Elements',
    ],
  },
  // Couple challenges
  communication: {
    title: 'Communication Champion',
    insight:
      'You recognize that great intimacy starts with great communication. Your openness to discussing needs shows emotional maturity.',
    tips: [
      'Practice active listening',
      'Use "I feel" statements',
      'Schedule regular check-ins',
    ],
    recommendations: [
      'Communication Cards',
      'Emotional Intimacy',
      'Couples Workbook',
    ],
  },
  time: {
    title: 'Time Management Master',
    insight:
      'You understand that quality time together is precious. Your awareness of this challenge shows you value your relationship.',
    tips: [
      'Schedule intimate time',
      'Create rituals',
      'Maximize quality over quantity',
    ],
    recommendations: [
      'Quick Connection',
      'Time-Efficient Techniques',
      'Ritual Building',
    ],
  },
  'desire-mismatch': {
    title: 'Desire Harmony Seeker',
    insight:
      "You're working to bridge the gap in desire levels, which shows deep care for your partner's needs.",
    tips: [
      'Find common ground',
      'Explore different types of intimacy',
      'Focus on emotional connection',
    ],
    recommendations: [
      'Desire Matching',
      'Variety Exploration',
      'Emotional Connection',
    ],
  },
  'routine-couple': {
    title: 'Routine Breaker',
    insight:
      "You're ready to shake things up and bring fresh energy to your intimate life.",
    tips: [
      'Try new locations',
      'Experiment with timing',
      'Introduce surprises',
    ],
    recommendations: ['Variety Packs', 'Adventure Cards', 'Surprise Elements'],
  },
  'emotional-connection': {
    title: 'Emotional Intimacy Builder',
    insight:
      'You understand that physical intimacy is enhanced by emotional closeness and vulnerability.',
    tips: [
      'Share vulnerabilities',
      'Practice gratitude',
      'Create emotional safety',
    ],
    recommendations: [
      'Emotional Intimacy',
      'Vulnerability Exercises',
      'Connection Building',
    ],
  },
};

// Frequency-based insights
export const FREQUENCY_INSIGHTS = {
  // Single people frequency
  'single-daily': {
    title: 'Daily Self-Explorer',
    insight:
      'Your regular self-exploration shows you prioritize self-care and understanding your desires.',
    tips: ['Maintain variety', 'Focus on quality', 'Listen to your body'],
    recommendations: [
      'Variety Techniques',
      'Quality Practices',
      'Body Awareness',
    ],
  },
  'single-weekly': {
    title: 'Weekly Solo Enthusiast',
    insight:
      'You maintain a healthy rhythm of self-exploration that works for your lifestyle.',
    tips: ['Make it special', 'Plan ahead', 'Stay present'],
    recommendations: ['Ritual Building', 'Mindful Practices', 'Quality Time'],
  },
  'single-monthly': {
    title: 'Monthly Explorer',
    insight:
      'You take time for yourself when needed, showing self-awareness and balance.',
    tips: [
      'Quality over quantity',
      'Make it meaningful',
      'Create anticipation',
    ],
    recommendations: [
      'Special Techniques',
      'Meaningful Practices',
      'Anticipation Building',
    ],
  },
  'single-rarely': {
    title: 'Beginning Explorer',
    insight:
      "You're just starting your journey of self-discovery, which shows courage and openness.",
    tips: ['Start gently', 'Be patient', 'Celebrate progress'],
    recommendations: [
      'Beginner Guide',
      'Gentle Introduction',
      'Confidence Building',
    ],
  },
  // Couple frequency
  daily: {
    title: 'Daily Intimacy Enthusiast',
    insight:
      'Your high frequency shows you prioritize intimacy in your relationship. This creates strong bonds and deep connection.',
    tips: ['Maintain variety', 'Focus on quality', 'Keep communication open'],
    recommendations: [
      'Variety Packs',
      'Advanced Techniques',
      'Communication Tools',
    ],
  },
  weekly: {
    title: 'Weekly Connection Builder',
    insight:
      'You maintain a healthy rhythm of intimacy that works for your lifestyle while keeping the spark alive.',
    tips: ['Make it special', 'Plan ahead', 'Stay present'],
    recommendations: [
      'Special Occasion Cards',
      'Planning Tools',
      'Mindfulness Techniques',
    ],
  },
  monthly: {
    title: 'Monthly Intimacy Focuser',
    insight:
      'You prefer quality over quantity, making each intimate moment meaningful and memorable.',
    tips: ['Make it count', 'Create anticipation', 'Focus on connection'],
    recommendations: [
      'Special Occasion Cards',
      'Anticipation Building',
      'Quality Focus',
    ],
  },
  rarely: {
    title: 'Intimacy Rekindler',
    insight:
      "You're ready to reignite the spark and bring intimacy back to the forefront of your relationship.",
    tips: ['Start small', 'Be patient', 'Communicate openly'],
    recommendations: [
      'Gentle Start',
      'Communication Cards',
      'Rekindling Techniques',
    ],
  },
};

// Turn-ons based insights
export const TURN_ONS_INSIGHTS = {
  'dirty-talk': {
    title: 'Verbal Intimacy Lover',
    insight:
      'You understand the power of words in creating arousal and connection. Verbal communication enhances physical intimacy.',
    tips: [
      'Start with compliments',
      'Express desires clearly',
      'Use your voice',
    ],
    recommendations: [
      'Dirty Talk Cards',
      'Communication Tools',
      'Voice Techniques',
    ],
  },
  roleplay: {
    title: 'Fantasy Explorer',
    insight:
      'You enjoy stepping into different roles and scenarios, which adds excitement and variety to your intimate life.',
    tips: ['Start simple', 'Communicate boundaries', 'Have fun with it'],
    recommendations: [
      'Roleplay Scenarios',
      'Costume Ideas',
      'Fantasy Building',
    ],
  },
  foreplay: {
    title: 'Foreplay Enthusiast',
    insight:
      'You understand that great sex starts long before the bedroom. Your focus on foreplay shows emotional intelligence.',
    tips: ['Take your time', 'Focus on the journey', 'Build anticipation'],
    recommendations: [
      'Foreplay Techniques',
      'Sensory Play',
      'Anticipation Building',
    ],
  },
  sensory: {
    title: 'Sensory Explorer',
    insight:
      'You appreciate the full spectrum of physical sensations and understand how they enhance intimacy.',
    tips: [
      'Use different textures',
      'Explore temperatures',
      'Engage all senses',
    ],
    recommendations: [
      'Sensory Play',
      'Texture Exploration',
      'Multi-Sensory Techniques',
    ],
  },
  'power-play': {
    title: 'Power Dynamics Explorer',
    insight:
      'You enjoy the psychological aspects of intimacy and understand how power dynamics can enhance connection.',
    tips: ['Communicate clearly', 'Set boundaries', 'Switch roles'],
    recommendations: [
      'Power Play Cards',
      'Communication Tools',
      'Role Switching',
    ],
  },
  'public-play': {
    title: 'Adventure Seeker',
    insight:
      'You enjoy the thrill of public intimacy and understand how risk can enhance arousal.',
    tips: ['Start subtle', 'Know your limits', 'Stay safe'],
    recommendations: [
      'Public Play Ideas',
      'Safety Guidelines',
      'Adventure Planning',
    ],
  },
  bondage: {
    title: 'Trust Builder',
    insight:
      'You understand that bondage requires deep trust and communication, which strengthens your relationship.',
    tips: [
      'Start with soft restraints',
      'Communicate constantly',
      'Build trust gradually',
    ],
    recommendations: ['Bondage Basics', 'Trust Building', 'Safety First'],
  },
  teasing: {
    title: 'Anticipation Master',
    insight:
      'You understand the power of anticipation and how it can make intimate moments more intense.',
    tips: ['Build tension slowly', 'Use your imagination', 'Enjoy the process'],
    recommendations: [
      'Teasing Techniques',
      'Anticipation Building',
      'Denial Play',
    ],
  },
};

// Fantasy settings insights
export const FANTASY_INSIGHTS = {
  bedroom: {
    title: 'Classic Romantic',
    insight:
      'You appreciate the comfort and intimacy of your private space, where you can fully express yourselves.',
    tips: ['Create ambiance', 'Keep it clean', 'Make it special'],
    recommendations: ['Bedroom Setup', 'Ambiance Ideas', 'Comfort Focus'],
  },
  kitchen: {
    title: 'Spontaneous Explorer',
    insight:
      'You enjoy breaking out of routine and finding intimacy in unexpected places.',
    tips: ['Be creative', 'Stay safe', 'Have fun'],
    recommendations: ['Kitchen Play', 'Spontaneous Ideas', 'Safety Tips'],
  },
  shower: {
    title: 'Sensual Cleaner',
    insight:
      'You understand how water and touch can create intimate, cleansing experiences.',
    tips: ['Use waterproof toys', 'Focus on touch', 'Stay safe'],
    recommendations: ['Shower Techniques', 'Water Play', 'Sensual Cleaning'],
  },
  office: {
    title: 'Professional Seductress',
    insight:
      'You enjoy the thrill of mixing professional and personal, creating exciting tension.',
    tips: ['Be discreet', 'Know your limits', 'Have fun'],
    recommendations: ['Office Play', 'Discretion Tips', 'Tension Building'],
  },
  outdoors: {
    title: 'Nature Lover',
    insight:
      'You find intimacy in natural settings, connecting with your partner and the environment.',
    tips: ['Check privacy', 'Be prepared', 'Respect nature'],
    recommendations: ['Outdoor Play', 'Nature Connection', 'Privacy Tips'],
  },
  'luxury-hotel': {
    title: 'Luxury Seeker',
    insight:
      'You appreciate the finer things and understand how luxury can enhance intimate experiences.',
    tips: ['Plan ahead', 'Create ambiance', 'Enjoy the moment'],
    recommendations: ['Luxury Ideas', 'Hotel Play', 'Special Occasions'],
  },
  car: {
    title: 'Adventure Seeker',
    insight:
      'You enjoy the excitement and spontaneity of intimate moments in unconventional places.',
    tips: ['Be safe', 'Check privacy', 'Have fun'],
    recommendations: ['Car Play', 'Safety Tips', 'Adventure Ideas'],
  },
  'public-place': {
    title: 'Thrill Seeker',
    insight:
      'You enjoy the excitement and risk of public intimacy, which can heighten arousal.',
    tips: ['Be discreet', 'Know your limits', 'Stay safe'],
    recommendations: ['Public Play', 'Discretion Tips', 'Safety Guidelines'],
  },
};

// Generate comprehensive profile analysis
export const generateComprehensiveAnalysis = (answers) => {
  const analysis = {
    persona: null,
    traits: [],
    insights: [],
    recommendations: [],
    challenges: [],
    strengths: [],
    personalizedMessage: '',
    tags: [],
  };

  // Determine comfort level range
  const comfortLevel = answers.comfortLevel || 5;
  const comfortRange = Object.values(COMFORT_LEVEL_RANGES).find(
    (range) => comfortLevel >= range.min && comfortLevel <= range.max
  );
  if (comfortRange) {
    analysis.traits.push(...comfortRange.traits);
    analysis.tags.push(comfortRange.label.toLowerCase().replace(' ', '-'));
  }

  // Determine enhancement range
  const enhancement = answers.enhancement || 50;
  const enhancementRange = Object.values(ENHANCEMENT_RANGES).find(
    (range) => enhancement >= range.min && enhancement <= range.max
  );
  if (enhancementRange) {
    analysis.traits.push(...enhancementRange.traits);
    analysis.tags.push(enhancementRange.label.toLowerCase().replace(' ', '-'));
  }

  // Determine primary persona
  const personaKey = determinePersona(answers);
  analysis.persona = PERSONA_MATRIX[personaKey];
  if (analysis.persona) {
    analysis.traits.push(...analysis.persona.traits);
    analysis.tags.push(analysis.persona.name.toLowerCase().replace(' ', '-'));
  }

  // Add challenge insights
  const challengeKey = answers.biggestChallenge || answers.singleChallenge;
  if (challengeKey) {
    const challengeInsight = CHALLENGE_INSIGHTS[challengeKey];
    if (challengeInsight) {
      analysis.insights.push(challengeInsight);
      analysis.challenges.push(challengeKey);
    }
  }

  // Add frequency insights
  if (answers.intimacyFrequency || answers.singleFrequency) {
    const frequency = answers.intimacyFrequency || answers.singleFrequency;
    const frequencyKey =
      answers.relationshipStatus === 'single'
        ? `single-${frequency}`
        : frequency;
    const frequencyInsight = FREQUENCY_INSIGHTS[frequencyKey];
    if (frequencyInsight) {
      analysis.insights.push(frequencyInsight);
    }
  }

  // Add turn-ons insights
  if (answers.turnOns && answers.turnOns.length > 0) {
    answers.turnOns.forEach((turnOn) => {
      const turnOnInsight = TURN_ONS_INSIGHTS[turnOn];
      if (turnOnInsight) {
        analysis.insights.push(turnOnInsight);
        analysis.tags.push(turnOn);
      }
    });
  }

  // Add fantasy settings insights
  if (answers.fantasy && answers.fantasy.length > 0) {
    answers.fantasy.forEach((fantasy) => {
      const fantasyInsight = FANTASY_INSIGHTS[fantasy];
      if (fantasyInsight) {
        analysis.insights.push(fantasyInsight);
        analysis.tags.push(fantasy);
      }
    });
  }

  // Generate personalized message
  analysis.personalizedMessage = generatePersonalizedMessage(analysis, answers);

  // Generate recommendations
  analysis.recommendations = generateRecommendations(analysis, answers);

  return analysis;
};

// Determine persona based on answers
const determinePersona = (answers) => {
  const desire = answers.desire || 'mild';
  const relationship = answers.relationshipStatus || 'dating';
  const challenge =
    answers.biggestChallenge || answers.singleChallenge || 'communication';
  const turnOns = answers.turnOns || [];
  const comfortLevel = answers.comfortLevel || 5;
  const singleGoal = answers.singleGoal;

  // Single people persona logic
  if (relationship === 'single') {
    if (singleGoal === 'self-discovery' && desire === 'mild') {
      return 'self-explorer';
    } else if (singleGoal === 'confidence-building' && comfortLevel >= 7) {
      return 'confident-solo';
    } else if (singleGoal === 'future-relationship' && desire === 'spicy') {
      return 'future-ready';
    } else if (singleGoal === 'exploration' && desire === 'extreme') {
      return 'adventurous-single';
    } else if (singleGoal === 'self-pleasure' && comfortLevel >= 5) {
      return 'mindful-solo';
    }
    return 'self-explorer'; // Default for single
  }

  // Couple persona logic (existing logic)
  if (desire === 'mild' && challenge === 'communication') {
    return 'intimate-communicator';
  } else if (desire === 'spicy' && turnOns.includes('sensory')) {
    return 'sensual-master';
  } else if (desire === 'extreme' && turnOns.includes('public-play')) {
    return 'wild-dreamer';
  } else if (desire === 'spicy' && turnOns.includes('roleplay')) {
    return 'passionate-adventurer';
  } else if (desire === 'mild' && comfortLevel >= 7) {
    return 'gentle-explorer';
  } else if (desire === 'extreme' && relationship === 'married') {
    return 'mysterious-seductress';
  }

  // Default fallback
  return 'gentle-explorer';
};

// Generate personalized message
const generatePersonalizedMessage = (analysis, answers) => {
  const persona = analysis.persona;
  const challenge = analysis.insights.find(
    (i) =>
      i.title.includes('Champion') ||
      i.title.includes('Master') ||
      i.title.includes('Seeker')
  );
  const frequency = analysis.insights.find(
    (i) =>
      i.title.includes('Enthusiast') ||
      i.title.includes('Builder') ||
      i.title.includes('Focuser') ||
      i.title.includes('Rekindler')
  );

  let message = `You're a ${persona.name} who `;

  if (challenge) {
    message += challenge.insight + ' ';
  }

  if (frequency) {
    message += frequency.insight + ' ';
  }

  message += `Your unique combination of traits makes you perfect for ${persona.recommendations.join(', ')}.`;

  return message;
};

// Generate recommendations
const generateRecommendations = (analysis, answers) => {
  const recommendations = new Set();

  // Add persona recommendations
  if (analysis.persona) {
    analysis.persona.recommendations.forEach((rec) => recommendations.add(rec));
  }

  // Add challenge recommendations
  analysis.insights.forEach((insight) => {
    if (insight.recommendations) {
      insight.recommendations.forEach((rec) => recommendations.add(rec));
    }
  });

  // Add turn-ons recommendations
  if (answers.turnOns) {
    answers.turnOns.forEach((turnOn) => {
      const insight = TURN_ONS_INSIGHTS[turnOn];
      if (insight && insight.recommendations) {
        insight.recommendations.forEach((rec) => recommendations.add(rec));
      }
    });
  }

  return Array.from(recommendations).slice(0, 8); // Limit to 8 recommendations
};
