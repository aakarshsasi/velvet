import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsService from '../services/AnalyticsService';

export const useAnalytics = () => {
  const { user, isPremium } = useAuth();
  const sessionStartTime = useRef(Date.now());

  // Set user properties when user changes
  useEffect(() => {
    if (user) {
      AnalyticsService.setUserId(user.uid);
      AnalyticsService.setUserProperties({
        user_id: user.uid,
        is_premium: isPremium,
        email_domain: user.email?.split('@')[1] || 'unknown',
        account_created: user.metadata?.creationTime || 'unknown'
      });
    }
  }, [user, isPremium]);

  // Track session start
  useEffect(() => {
    AnalyticsService.trackSessionStart();
    
    // Track session end when component unmounts
    return () => {
      const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 1000);
      AnalyticsService.trackSessionEnd(sessionDuration);
    };
  }, []);

  return {
    // Screen tracking
    trackScreen: (screenName, screenClass) => {
      AnalyticsService.trackScreenView(screenName, screenClass);
    },

    // User journey
    trackJourney: (step, data) => {
      AnalyticsService.trackUserJourney(step, data);
    },

    // Onboarding
    trackOnboardingStep: (stepNumber, stepName, answers) => {
      AnalyticsService.trackOnboardingStep(stepNumber, stepName, answers);
    },

    trackOnboardingCompletion: (totalSteps, completionTime, answers) => {
      AnalyticsService.trackOnboardingCompletion(totalSteps, completionTime, answers);
    },

    trackOnboardingDropOff: (stepNumber, stepName, timeSpent) => {
      AnalyticsService.trackOnboardingDropOff(stepNumber, stepName, timeSpent);
    },

    // Authentication
    trackSignUp: (method, success, error) => {
      AnalyticsService.trackSignUp(method, success, error);
    },

    trackSignIn: (method, success, error) => {
      AnalyticsService.trackSignIn(method, success, error);
    },

    trackSignOut: () => {
      AnalyticsService.trackSignOut();
    },

    // Content exploration
    trackCategoryView: (category, subcategory) => {
      AnalyticsService.trackCategoryView(category, subcategory);
    },

    trackContentInteraction: (contentType, contentId, action, metadata) => {
      AnalyticsService.trackContentInteraction(contentType, contentId, action, metadata);
    },

    trackCardReveal: (cardId, category, position) => {
      AnalyticsService.trackCardReveal(cardId, category, position);
    },

    // Premium conversion
    trackPremiumUpgradeAttempt: (source, method) => {
      AnalyticsService.trackPremiumUpgradeAttempt(source, method);
    },

    trackPremiumUpgradeSuccess: (source, method, value, currency) => {
      AnalyticsService.trackPremiumUpgradeSuccess(source, method, value, currency);
    },

    trackPremiumUpgradeFailure: (source, method, error) => {
      AnalyticsService.trackPremiumUpgradeFailure(source, method, error);
    },

    // Games and features
    trackDiceGameStart: (category) => {
      AnalyticsService.trackDiceGameStart(category);
    },

    trackDiceGameResult: (category, result, timeSpent) => {
      AnalyticsService.trackDiceGameResult(category, result, timeSpent);
    },

    trackSpinWheelStart: (category) => {
      AnalyticsService.trackSpinWheelStart(category);
    },

    trackSpinWheelResult: (category, result, timeSpent) => {
      AnalyticsService.trackSpinWheelResult(category, result, timeSpent);
    },

    // Profile analysis
    trackProfileAnalysisStart: () => {
      AnalyticsService.trackProfileAnalysisStart();
    },

    trackProfileAnalysisComplete: (profileData, analysisTime) => {
      AnalyticsService.trackProfileAnalysisComplete(profileData, analysisTime);
    },

    // Error and performance
    trackError: (error, context, severity) => {
      AnalyticsService.trackError(error, context, severity);
    },

    trackPerformance: (metric, value, unit) => {
      AnalyticsService.trackPerformance(metric, value, unit);
    },

    // Funnel tracking
    trackFunnelStep: (funnelName, stepName, stepNumber, totalSteps, data) => {
      AnalyticsService.trackFunnelStep(funnelName, stepName, stepNumber, totalSteps, data);
    },

    trackFunnelConversion: (funnelName, conversionPoint, data) => {
      AnalyticsService.trackFunnelConversion(funnelName, conversionPoint, data);
    },

    // Custom events
    trackCustomEvent: (eventName, parameters) => {
      AnalyticsService.trackCustomEvent(eventName, parameters);
    }
  };
};

export default useAnalytics;
