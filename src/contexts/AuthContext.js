import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import AnalyticsService from '../services/AnalyticsService';

const AuthContext = createContext({
  user: null,
  isPremium: false,
  hasCompletedOnboarding: false,
  signUp: () => {},
  signIn: () => {},
  logout: () => {},
  upgradeToPremium: () => {},
  markOnboardingCompleted: () => {},
  loading: true
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Check premium status
        await checkPremiumStatus(user.uid);
      } else {
        setUser(null);
        setIsPremium(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const checkPremiumStatus = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsPremium(userData.isPremium || false);
        setHasCompletedOnboarding(userData.hasCompletedOnboarding || false);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
      setHasCompletedOnboarding(false);
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Get user profile from AsyncStorage if available
      const userProfile = await AsyncStorage.getItem('userProfile');
      const onboardingAnswers = await AsyncStorage.getItem('onboardingAnswers');
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName,
        isPremium: false,
        hasCompletedOnboarding: userProfile ? true : false, // If they have a profile, onboarding is complete
        userProfile: userProfile ? JSON.parse(userProfile) : null,
        onboardingAnswers: onboardingAnswers ? JSON.parse(onboardingAnswers) : null,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      
      // If user has a profile, mark onboarding as completed in AsyncStorage
      if (userProfile) {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      }
      
      // Link anonymous user data to authenticated user
      await AnalyticsService.linkAnonymousUser(user.uid);
      
      // Track successful signup
      AnalyticsService.trackSignUp('email', true);
      AnalyticsService.setUserId(user.uid);
      AnalyticsService.setUserProperties({
        user_id: user.uid,
        email_domain: email.split('@')[1] || 'unknown',
        account_created: new Date().toISOString(),
        has_profile: !!userProfile
      });

      // Sync analytics data to Firestore
      AnalyticsService.syncAnalyticsToFirestore();
      
      return user;
    } catch (error) {
      AnalyticsService.trackSignUp('email', false, error);
      AnalyticsService.trackError(error, 'signup', 'error');
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date()
      });
      
      // Check both Firestore and AsyncStorage for onboarding status
      await checkPremiumStatus(user.uid);
      
      // Also check AsyncStorage as fallback
      const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (hasCompletedOnboarding === 'true') {
        setHasCompletedOnboarding(true);
      }
      
      // Track successful sign in
      AnalyticsService.trackSignIn('email', true);
      AnalyticsService.setUserId(user.uid);

      // Sync analytics data to Firestore
      AnalyticsService.syncAnalyticsToFirestore();
      
      return user;
    } catch (error) {
      AnalyticsService.trackSignIn('email', false, error);
      AnalyticsService.trackError(error, 'signin', 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      
      // Track logout
      AnalyticsService.trackSignOut();
      
      // Clear local state
      setUser(null);
      setIsPremium(false);
      setHasCompletedOnboarding(false);
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('hasCompletedOnboarding');
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('onboardingAnswers');
    } catch (error) {
      AnalyticsService.trackError(error, 'logout', 'error');
      throw error;
    }
  };

  const upgradeToPremium = async (purchaseData = null) => {
    if (!user) return;
    
    try {
      const updateData = {
        isPremium: true,
        premiumUpgradedAt: new Date()
      };

      // Add purchase data if provided
      if (purchaseData) {
        updateData.purchaseData = {
          productId: purchaseData.productId,
          transactionId: purchaseData.transactionId,
          purchaseTime: purchaseData.purchaseTime,
          purchaseToken: purchaseData.purchaseToken,
          orderId: purchaseData.orderId
        };
      }

      await updateDoc(doc(db, 'users', user.uid), updateData);
      setIsPremium(true);
      
      // Track premium upgrade success
      const value = purchaseData?.productId?.includes('yearly') ? 99.99 : 9.99;
      AnalyticsService.trackPremiumUpgradeSuccess('auth_context', 'in_app_purchase', value, 'USD');
      AnalyticsService.setUserProperties({
        is_premium: true,
        premium_upgraded_at: new Date().toISOString(),
        purchase_method: 'in_app_purchase'
      });
    } catch (error) {
      AnalyticsService.trackPremiumUpgradeFailure('auth_context', 'in_app_purchase', error);
      AnalyticsService.trackError(error, 'premium_upgrade', 'error');
      throw error;
    }
  };

  const markOnboardingCompleted = async () => {
    if (!user) return;
    
    try {
      // Get the user profile from AsyncStorage
      const userProfile = await AsyncStorage.getItem('userProfile');
      const onboardingAnswers = await AsyncStorage.getItem('onboardingAnswers');
      const analysisData = await AsyncStorage.getItem('analysisData');
      
      if (userProfile) {
        const profileData = JSON.parse(userProfile);
        const analysis = analysisData ? JSON.parse(analysisData) : null;
        
        // Save both the onboarding completion status and the profile data
        await updateDoc(doc(db, 'users', user.uid), {
          hasCompletedOnboarding: true,
          userProfile: profileData,
          onboardingAnswers: onboardingAnswers ? JSON.parse(onboardingAnswers) : null,
          analysis: analysis, // Save comprehensive analysis
          onboardingCompletedAt: new Date()
        });
        
        // Also update AsyncStorage to mark onboarding as completed
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      } else {
        // Just mark as completed if no profile data
        await updateDoc(doc(db, 'users', user.uid), {
          hasCompletedOnboarding: true,
          onboardingCompletedAt: new Date()
        });
        
        // Also update AsyncStorage
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isPremium,
    hasCompletedOnboarding,
    signUp,
    signIn,
    logout,
    upgradeToPremium,
    markOnboardingCompleted,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
