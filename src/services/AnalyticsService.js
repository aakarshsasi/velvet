import AsyncStorage from '@react-native-async-storage/async-storage';

class AnalyticsService {
  // Generate anonymous user ID for pre-signup tracking
  static async getAnonymousUserId() {
    try {
      let anonymousId = await AsyncStorage.getItem('anonymous_user_id');
      if (!anonymousId) {
        // Generate a unique anonymous ID
        anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('anonymous_user_id', anonymousId);
        console.log('📊 Generated anonymous user ID:', anonymousId);
      }
      return anonymousId;
    } catch (error) {
      console.error('Error generating anonymous user ID:', error);
      return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  // Get current user ID (authenticated or anonymous)
  static async getCurrentUserId() {
    try {
      // First check if user is authenticated
      const auth = await import('../config/firebase');
      if (auth.auth.currentUser) {
        return auth.auth.currentUser.uid;
      }
      // If not authenticated, return anonymous ID
      return await this.getAnonymousUserId();
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return await this.getAnonymousUserId();
    }
  }

  // Link anonymous user data to authenticated user
  static async linkAnonymousUser(authenticatedUserId) {
    try {
      const anonymousId = await AsyncStorage.getItem('anonymous_user_id');
      if (anonymousId) {
        // Store the link for future reference
        await AsyncStorage.setItem('user_id_link', JSON.stringify({
          anonymousId,
          authenticatedUserId,
          linkedAt: new Date().toISOString()
        }));
        
        // Track the linking event
        await this.storeAnalyticsEvent('anonymous_user_linked', {
          anonymous_id: anonymousId,
          authenticated_user_id: authenticatedUserId,
          timestamp: new Date().toISOString()
        });
        
        console.log('📊 Linked anonymous user to authenticated user');
      }
    } catch (error) {
      console.error('Error linking anonymous user:', error);
    }
  }

  // Helper method to store analytics data locally
  static async storeAnalyticsEvent(eventName, eventData) {
    try {
      const userId = await this.getCurrentUserId();
      const event = {
        event_name: eventName,
        event_data: {
          ...eventData,
          user_id: userId,
          is_anonymous: !eventData.user_id || eventData.user_id.startsWith('anon_')
        },
        timestamp: new Date().toISOString()
      };

      // Store locally
      const existingEvents = await AsyncStorage.getItem('analytics_events');
      const events = existingEvents ? JSON.parse(existingEvents) : [];
      events.push(event);
      await AsyncStorage.setItem('analytics_events', JSON.stringify(events));

      console.log(`📊 Analytics Event: ${eventName}`, eventData);
    } catch (error) {
      console.error('Analytics storage error:', error);
    }
  }

  // Screen tracking
  static trackScreenView(screenName, screenClass = null) {
    try {
      this.storeAnalyticsEvent('screen_view', {
        screen_name: screenName,
        screen_class: screenClass || screenName,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Screen View: ${screenName}`);
    } catch (error) {
      console.error('Analytics screen view error:', error);
    }
  }

  // User journey tracking
  static trackUserJourney(step, data = {}) {
    try {
      this.storeAnalyticsEvent('user_journey', {
        step,
        ...data
      });
      console.log(`📊 User Journey: ${step}`, data);
    } catch (error) {
      console.error('Analytics user journey error:', error);
    }
  }

  // Pre-signup tracking methods
  static trackAppLaunch() {
    try {
      this.storeAnalyticsEvent('app_launch', {
        launch_time: new Date().toISOString(),
        platform: 'ios'
      });
      console.log('📊 App Launch Tracked');
    } catch (error) {
      console.error('Analytics app launch error:', error);
    }
  }

  static trackWelcomeScreenView() {
    try {
      this.storeAnalyticsEvent('welcome_screen_view', {
        screen_name: 'WelcomeScreen',
        timestamp: new Date().toISOString()
      });
      console.log('📊 Welcome Screen View Tracked');
    } catch (error) {
      console.error('Analytics welcome screen error:', error);
    }
  }

  static trackOnboardingStart() {
    try {
      this.storeAnalyticsEvent('onboarding_start', {
        timestamp: new Date().toISOString()
      });
      console.log('📊 Onboarding Start Tracked');
    } catch (error) {
      console.error('Analytics onboarding start error:', error);
    }
  }

  static trackOnboardingAbandon(step, reason = 'unknown') {
    try {
      this.storeAnalyticsEvent('onboarding_abandon', {
        step,
        reason,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Onboarding Abandoned at step ${step}: ${reason}`);
    } catch (error) {
      console.error('Analytics onboarding abandon error:', error);
    }
  }

  static trackSignupAttempt(method = 'email') {
    try {
      this.storeAnalyticsEvent('signup_attempt', {
        method,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Signup Attempt: ${method}`);
    } catch (error) {
      console.error('Analytics signup attempt error:', error);
    }
  }

  static trackSignupAbandon(step, reason = 'unknown') {
    try {
      this.storeAnalyticsEvent('signup_abandon', {
        step,
        reason,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Signup Abandoned at step ${step}: ${reason}`);
    } catch (error) {
      console.error('Analytics signup abandon error:', error);
    }
  }

  static trackContentPreview(contentType, contentId) {
    try {
      this.storeAnalyticsEvent('content_preview', {
        content_type: contentType,
        content_id: contentId,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Content Preview: ${contentType} - ${contentId}`);
    } catch (error) {
      console.error('Analytics content preview error:', error);
    }
  }

  static trackFeatureInterest(feature, interestLevel = 'view') {
    try {
      this.storeAnalyticsEvent('feature_interest', {
        feature,
        interest_level: interestLevel,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Feature Interest: ${feature} - ${interestLevel}`);
    } catch (error) {
      console.error('Analytics feature interest error:', error);
    }
  }

  // Onboarding tracking
  static trackOnboardingStep(stepNumber, stepName, answers = {}) {
    try {
      this.storeAnalyticsEvent('onboarding_step', {
        step_number: stepNumber,
        step_name: stepName,
        answers: JSON.stringify(answers),
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Onboarding Step: ${stepName} (${stepNumber})`);
    } catch (error) {
      console.error('Analytics onboarding error:', error);
    }
  }

  static trackOnboardingCompletion(totalSteps, completionTime, answers) {
    try {
      this.storeAnalyticsEvent( 'onboarding_completed', {
        total_steps: totalSteps,
        completion_time_seconds: completionTime,
        answers: JSON.stringify(answers),
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Onboarding Completed in ${completionTime}s`);
    } catch (error) {
      console.error('Analytics onboarding completion error:', error);
    }
  }

  static trackOnboardingDropOff(stepNumber, stepName, timeSpent) {
    try {
      this.storeAnalyticsEvent( 'onboarding_drop_off', {
        step_number: stepNumber,
        step_name: stepName,
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Onboarding Drop-off: ${stepName} (${stepNumber})`);
    } catch (error) {
      console.error('Analytics onboarding drop-off error:', error);
    }
  }

  // Authentication tracking
  static trackSignUp(method = 'email', success = true, error = null) {
    try {
      this.storeAnalyticsEvent( 'sign_up', {
        method,
        success,
        error: error?.message || null,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Sign Up: ${method} - ${success ? 'Success' : 'Failed'}`);
    } catch (err) {
      console.error('Analytics sign up error:', err);
    }
  }

  static trackSignIn(method = 'email', success = true, error = null) {
    try {
      this.storeAnalyticsEvent( 'login', {
        method,
        success,
        error: error?.message || null,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Sign In: ${method} - ${success ? 'Success' : 'Failed'}`);
    } catch (err) {
      console.error('Analytics sign in error:', err);
    }
  }

  static trackSignOut() {
    try {
      this.storeAnalyticsEvent( 'logout', {
        timestamp: new Date().toISOString()
      });
      console.log('📊 Sign Out');
    } catch (error) {
      console.error('Analytics sign out error:', error);
    }
  }

  // Category and content exploration tracking
  static trackCategoryView(category, subcategory = null) {
    try {
      this.storeAnalyticsEvent( 'category_view', {
        category,
        subcategory,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Category View: ${category}${subcategory ? ` - ${subcategory}` : ''}`);
    } catch (error) {
      console.error('Analytics category view error:', error);
    }
  }

  static trackContentInteraction(contentType, contentId, action, metadata = {}) {
    try {
      this.storeAnalyticsEvent( 'content_interaction', {
        content_type: contentType,
        content_id: contentId,
        action,
        ...metadata,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Content Interaction: ${action} - ${contentType}:${contentId}`);
    } catch (error) {
      console.error('Analytics content interaction error:', error);
    }
  }

  static trackCardReveal(cardId, category, position) {
    try {
      this.storeAnalyticsEvent( 'card_reveal', {
        card_id: cardId,
        category,
        position,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Card Revealed: ${cardId} in ${category}`);
    } catch (error) {
      console.error('Analytics card reveal error:', error);
    }
  }

  // Premium conversion tracking
  static trackPremiumUpgradeAttempt(source, method = 'in_app') {
    try {
      this.storeAnalyticsEvent( 'premium_upgrade_attempt', {
        source,
        method,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Premium Upgrade Attempt: ${source} via ${method}`);
    } catch (error) {
      console.error('Analytics premium upgrade attempt error:', error);
    }
  }

  static trackPremiumUpgradeSuccess(source, method = 'in_app', value = 0, currency = 'USD') {
    try {
      this.storeAnalyticsEvent( 'purchase', {
        transaction_id: `premium_${Date.now()}`,
        value,
        currency,
        source,
        method,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Premium Upgrade Success: ${source} via ${method}`);
    } catch (error) {
      console.error('Analytics premium upgrade success error:', error);
    }
  }

  static trackPremiumUpgradeFailure(source, method = 'in_app', error) {
    try {
      this.storeAnalyticsEvent( 'premium_upgrade_failure', {
        source,
        method,
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Premium Upgrade Failure: ${source} via ${method}`);
    } catch (err) {
      console.error('Analytics premium upgrade failure error:', err);
    }
  }

  // Game and feature tracking
  static trackDiceGameStart(category) {
    try {
      this.storeAnalyticsEvent( 'dice_game_start', {
        category,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Dice Game Started: ${category}`);
    } catch (error) {
      console.error('Analytics dice game start error:', error);
    }
  }

  static trackDiceGameResult(category, result, timeSpent) {
    try {
      this.storeAnalyticsEvent( 'dice_game_result', {
        category,
        result,
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Dice Game Result: ${category} - ${result}`);
    } catch (error) {
      console.error('Analytics dice game result error:', error);
    }
  }

  static trackSpinWheelStart(category) {
    try {
      this.storeAnalyticsEvent( 'spin_wheel_start', {
        category,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Spin Wheel Started: ${category}`);
    } catch (error) {
      console.error('Analytics spin wheel start error:', error);
    }
  }

  static trackSpinWheelResult(category, result, timeSpent) {
    try {
      this.storeAnalyticsEvent( 'spin_wheel_result', {
        category,
        result,
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Spin Wheel Result: ${category} - ${result}`);
    } catch (error) {
      console.error('Analytics spin wheel result error:', error);
    }
  }

  // Profile and analysis tracking
  static trackProfileAnalysisStart() {
    try {
      this.storeAnalyticsEvent( 'profile_analysis_start', {
        timestamp: new Date().toISOString()
      });
      console.log('📊 Profile Analysis Started');
    } catch (error) {
      console.error('Analytics profile analysis start error:', error);
    }
  }

  static trackProfileAnalysisComplete(profileData, analysisTime) {
    try {
      this.storeAnalyticsEvent( 'profile_analysis_complete', {
        persona: profileData?.persona?.name || 'Unknown',
        comfort_level: profileData?.comfortLevel || 0,
        desire_level: profileData?.desireLevel || 'unknown',
        analysis_time_seconds: analysisTime,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Profile Analysis Complete: ${profileData?.persona?.name}`);
    } catch (error) {
      console.error('Analytics profile analysis complete error:', error);
    }
  }

  // Error and performance tracking
  static trackError(error, context, severity = 'error') {
    try {
      this.storeAnalyticsEvent( 'app_error', {
        error_message: error?.message || 'Unknown error',
        error_code: error?.code || 'unknown',
        context,
        severity,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Error Tracked: ${context} - ${error?.message}`);
    } catch (err) {
      console.error('Analytics error tracking error:', err);
    }
  }

  static trackPerformance(metric, value, unit = 'ms') {
    try {
      this.storeAnalyticsEvent( 'performance_metric', {
        metric_name: metric,
        metric_value: value,
        unit,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Performance: ${metric} = ${value}${unit}`);
    } catch (error) {
      console.error('Analytics performance tracking error:', error);
    }
  }

  // User properties
  static setUserProperties(properties) {
    try {
      // Store user properties locally
      AsyncStorage.setItem('user_properties', JSON.stringify(properties));
      console.log('📊 User Properties Set:', properties);
    } catch (error) {
      console.error('Analytics user properties error:', error);
    }
  }

  static setUserId(userId) {
    try {
      // Store user ID locally
      AsyncStorage.setItem('user_id', userId);
      console.log('📊 User ID Set:', userId);
    } catch (error) {
      console.error('Analytics user ID error:', error);
    }
  }

  // Custom events
  static trackCustomEvent(eventName, parameters = {}) {
    try {
      this.storeAnalyticsEvent(eventName, parameters);
      console.log(`📊 Custom Event: ${eventName}`, parameters);
    } catch (error) {
      console.error('Analytics custom event error:', error);
    }
  }

  // Sync stored analytics events (placeholder for future implementation)
  static async syncAnalyticsToFirestore() {
    try {
      console.log('📊 Analytics sync placeholder - events stored locally');
    } catch (error) {
      console.error('Analytics sync error:', error);
    }
  }

  // Get analytics data for dashboard
  static async getAnalyticsData() {
    try {
      const storedEvents = await AsyncStorage.getItem('analytics_events');
      const events = storedEvents ? JSON.parse(storedEvents) : [];
      
      // Process events for dashboard
      const screenViews = events.filter(e => e.event_name === 'screen_view');
      const userJourney = events.filter(e => e.event_name === 'user_journey');
      const conversions = events.filter(e => e.event_name === 'premium_upgrade_success');
      
      return {
        totalEvents: events.length,
        screenViews: screenViews.length,
        conversions: conversions.length,
        events: events
      };
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return { totalEvents: 0, screenViews: 0, conversions: 0, events: [] };
    }
  }


  // Session tracking
  static trackSessionStart() {
    try {
      this.storeAnalyticsEvent( 'session_start', {
        timestamp: new Date().toISOString()
      });
      console.log('📊 Session Started');
    } catch (error) {
      console.error('Analytics session start error:', error);
    }
  }

  static trackSessionEnd(duration) {
    try {
      this.storeAnalyticsEvent( 'session_end', {
        duration_seconds: duration,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Session Ended: ${duration}s`);
    } catch (error) {
      console.error('Analytics session end error:', error);
    }
  }

  // Funnel tracking
  static trackFunnelStep(funnelName, stepName, stepNumber, totalSteps, data = {}) {
    try {
      this.storeAnalyticsEvent( 'funnel_step', {
        funnel_name: funnelName,
        step_name: stepName,
        step_number: stepNumber,
        total_steps: totalSteps,
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Funnel Step: ${funnelName} - ${stepName} (${stepNumber}/${totalSteps})`);
    } catch (error) {
      console.error('Analytics funnel step error:', error);
    }
  }

  static trackFunnelConversion(funnelName, conversionPoint, data = {}) {
    try {
      this.storeAnalyticsEvent( 'funnel_conversion', {
        funnel_name: funnelName,
        conversion_point: conversionPoint,
        ...data,
        timestamp: new Date().toISOString()
      });
      console.log(`📊 Funnel Conversion: ${funnelName} - ${conversionPoint}`);
    } catch (error) {
      console.error('Analytics funnel conversion error:', error);
    }
  }
}

export default AnalyticsService;
