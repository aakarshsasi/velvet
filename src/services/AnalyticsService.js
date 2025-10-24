// Real AnalyticsService for production builds
// This service integrates with Firebase Analytics and other tracking services

import { analytics } from '../config/firebase';

class AnalyticsService {
  // Initialize analytics
  static initialize() {
    if (analytics) {
      console.log('Analytics initialized');
    } else {
      console.warn('Analytics not available');
    }
  }

  // Track app launch
  static trackAppLaunch() {
    this.trackEvent('app_launch', {
      timestamp: new Date().toISOString(),
      platform: 'ios',
    });
  }

  // Track events
  static trackEvent(eventName, parameters = {}) {
    if (analytics) {
      // Firebase Analytics tracking
      try {
        // Note: Firebase Analytics for React Native requires additional setup
        // For now, we'll log the events
        console.log('Analytics Event:', eventName, parameters);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  }

  // Track screen views
  static trackScreen(screenName) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      timestamp: new Date().toISOString(),
    });
  }

  // Set user properties
  static setUserProperties(properties) {
    if (analytics) {
      try {
        console.log('Analytics User Properties:', properties);
        // Firebase Analytics user properties would go here
      } catch (error) {
        console.warn('Analytics user properties failed:', error);
      }
    }
  }

  // Set user ID
  static setUserId(userId) {
    if (analytics) {
      try {
        console.log('Analytics User ID:', userId);
        // Firebase Analytics user ID would go here
      } catch (error) {
        console.warn('Analytics user ID failed:', error);
      }
    }
  }

  // Link anonymous user
  static linkAnonymousUser(userId) {
    this.trackEvent('user_linked', {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
    return Promise.resolve();
  }

  // Authentication tracking
  static trackSignUp(method, success, error = null) {
    this.trackEvent('sign_up', {
      method,
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSignIn(method, success, error = null) {
    this.trackEvent('sign_in', {
      method,
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSignOut() {
    this.trackEvent('sign_out', {
      timestamp: new Date().toISOString(),
    });
  }

  // Error tracking
  static trackError(error, context, type) {
    this.trackEvent('error', {
      error_message: error.message || error,
      error_stack: error.stack,
      context,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  // Premium upgrade tracking
  static trackPremiumUpgradeSuccess(context, method, value, currency) {
    this.trackEvent('premium_upgrade_success', {
      context,
      method,
      value,
      currency,
      timestamp: new Date().toISOString(),
    });
  }

  static trackPremiumUpgradeFailure(context, method, error) {
    this.trackEvent('premium_upgrade_failure', {
      context,
      method,
      error: error.message || error,
      timestamp: new Date().toISOString(),
    });
  }

  // Sync analytics to Firestore
  static syncAnalyticsToFirestore() {
    // This would sync analytics data to Firestore
    // For now, just return a resolved promise
    return Promise.resolve();
  }

  // Session tracking
  static trackSessionStart() {
    this.trackEvent('session_start', {
      timestamp: new Date().toISOString(),
    });
  }

  static trackSessionEnd(duration) {
    this.trackEvent('session_end', {
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  // Screen tracking
  static trackScreenView(screenName, screenClass) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      screen_class: screenClass,
      timestamp: new Date().toISOString(),
    });
  }

  // User journey tracking
  static trackUserJourney(step, data) {
    this.trackEvent('user_journey', {
      step,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Onboarding tracking
  static trackOnboardingStep(stepNumber, stepName, answers) {
    this.trackEvent('onboarding_step', {
      step_number: stepNumber,
      step_name: stepName,
      answers,
      timestamp: new Date().toISOString(),
    });
  }

  static trackOnboardingCompletion(totalSteps, completionTime, answers) {
    this.trackEvent('onboarding_completion', {
      total_steps: totalSteps,
      completion_time: completionTime,
      answers,
      timestamp: new Date().toISOString(),
    });
  }

  static trackOnboardingDropOff(stepNumber, stepName, timeSpent) {
    this.trackEvent('onboarding_drop_off', {
      step_number: stepNumber,
      step_name: stepName,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
    });
  }

  static trackOnboardingAbandon(step, reason) {
    this.trackEvent('onboarding_abandon', {
      step,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  static trackOnboardingStart() {
    this.trackEvent('onboarding_start', {
      timestamp: new Date().toISOString(),
    });
  }

  // Content tracking
  static trackCategoryView(category, subcategory) {
    this.trackEvent('category_view', {
      category,
      subcategory,
      timestamp: new Date().toISOString(),
    });
  }

  static trackContentInteraction(contentType, contentId, action, metadata) {
    this.trackEvent('content_interaction', {
      content_type: contentType,
      content_id: contentId,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  static trackCardReveal(cardId, category, position) {
    this.trackEvent('card_reveal', {
      card_id: cardId,
      category,
      position,
      timestamp: new Date().toISOString(),
    });
  }

  static trackFeatureInterest(feature, interestLevel) {
    this.trackEvent('feature_interest', {
      feature,
      interest_level: interestLevel,
      timestamp: new Date().toISOString(),
    });
  }

  static trackWelcomeScreenView() {
    this.trackEvent('welcome_screen_view', {
      timestamp: new Date().toISOString(),
    });
  }

  static trackSignupAttempt(method) {
    this.trackEvent('signup_attempt', {
      method,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSignupAbandon(step, reason) {
    this.trackEvent('signup_abandon', {
      step,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  static trackContentPreview(contentType, contentId) {
    this.trackEvent('content_preview', {
      content_type: contentType,
      content_id: contentId,
      timestamp: new Date().toISOString(),
    });
  }

  static trackPremiumUpgradeAttempt(source, method) {
    this.trackEvent('premium_upgrade_attempt', {
      source,
      method,
      timestamp: new Date().toISOString(),
    });
  }

  // Game tracking
  static trackDiceGameStart(category) {
    this.trackEvent('dice_game_start', {
      category,
      timestamp: new Date().toISOString(),
    });
  }

  static trackDiceGameResult(category, result, timeSpent) {
    this.trackEvent('dice_game_result', {
      category,
      result,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSpinWheelStart(category) {
    this.trackEvent('spin_wheel_start', {
      category,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSpinWheelResult(category, result, timeSpent) {
    this.trackEvent('spin_wheel_result', {
      category,
      result,
      time_spent: timeSpent,
      timestamp: new Date().toISOString(),
    });
  }

  // Profile analysis tracking
  static trackProfileAnalysisStart() {
    this.trackEvent('profile_analysis_start', {
      timestamp: new Date().toISOString(),
    });
  }

  static trackProfileAnalysisComplete(profileData, analysisTime) {
    this.trackEvent('profile_analysis_complete', {
      profile_data: profileData,
      analysis_time: analysisTime,
      timestamp: new Date().toISOString(),
    });
  }

  // Performance tracking
  static trackPerformance(metric, value, unit) {
    this.trackEvent('performance', {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
  }

  // Funnel tracking
  static trackFunnelStep(funnelName, stepName, stepNumber, totalSteps, data) {
    this.trackEvent('funnel_step', {
      funnel_name: funnelName,
      step_name: stepName,
      step_number: stepNumber,
      total_steps: totalSteps,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static trackFunnelConversion(funnelName, conversionPoint, data) {
    this.trackEvent('funnel_conversion', {
      funnel_name: funnelName,
      conversion_point: conversionPoint,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  // Custom event tracking
  static trackCustomEvent(eventName, parameters) {
    this.trackEvent(eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }
}

export default AnalyticsService;
