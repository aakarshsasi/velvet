import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    auth,
    createUserWithEmailAndPassword,
    db,
    doc,
    getDoc,
    onAuthStateChanged,
    setDoc,
    signInWithEmailAndPassword,
    signOut,
    updateDoc,
    updateProfile,
} from '../config/firebase';
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
  loading: true,
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
        onboardingAnswers: onboardingAnswers
          ? JSON.parse(onboardingAnswers)
          : null,
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      // If user has a profile, mark onboarding as completed in AsyncStorage
      if (userProfile) {
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      }

      // Link anonymous user data to authenticated user
      await AnalyticsService.linkAnonymousUser(user.uid);

      // Link questionnaire data to user account
      const anonymousId = await AsyncStorage.getItem('anonymousId');
      if (anonymousId) {
        await linkAnonymousQuestionnaireData(anonymousId, user.uid);
      }

      // Track successful signup
      AnalyticsService.trackSignUp('email', true);
      AnalyticsService.setUserId(user.uid);
      AnalyticsService.setUserProperties({
        user_id: user.uid,
        email_domain: email.split('@')[1] || 'unknown',
        account_created: new Date().toISOString(),
        has_profile: !!userProfile,
      });

      // Sync analytics data to Firestore
      AnalyticsService.syncAnalyticsToFirestore();

      return user;
    } catch (error) {
      AnalyticsService.trackSignUp('email', false, error);
      AnalyticsService.trackError(error, 'signup', 'error');

      // Handle specific Firebase Auth errors
      let errorMessage = 'Failed to create account';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage =
          'This email is already registered. Please try signing in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage =
          'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage =
          'Email/password accounts are not enabled. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date(),
      });

      // Check both Firestore and AsyncStorage for onboarding status
      await checkPremiumStatus(user.uid);

      // Also check AsyncStorage as fallback
      const hasCompletedOnboarding = await AsyncStorage.getItem(
        'hasCompletedOnboarding'
      );
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

      // Handle specific Firebase Auth errors
      let errorMessage = 'Failed to sign in';

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
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
        premiumUpgradedAt: new Date(),
      };

      // Add purchase data if provided
      if (purchaseData) {
        // Only include defined values to avoid undefined errors
        const purchaseDataObj = {};
        if (purchaseData.productId) purchaseDataObj.productId = purchaseData.productId;
        if (purchaseData.transactionId) purchaseDataObj.transactionId = purchaseData.transactionId;
        if (purchaseData.purchaseTime) purchaseDataObj.purchaseTime = purchaseData.purchaseTime;
        if (purchaseData.purchaseToken) purchaseDataObj.purchaseToken = purchaseData.purchaseToken;
        if (purchaseData.orderId) purchaseDataObj.orderId = purchaseData.orderId;
        if (purchaseData.purchaseDate) purchaseDataObj.purchaseDate = purchaseData.purchaseDate;
        
        // Only add if we have at least productId
        if (Object.keys(purchaseDataObj).length > 0) {
          updateData.purchaseData = purchaseDataObj;
        }
      }

      await updateDoc(doc(db, 'users', user.uid), updateData);
      setIsPremium(true);

      // Track premium upgrade success
      const value = purchaseData?.productId?.includes('yearly') ? 99.99 : 9.99;
      AnalyticsService.trackPremiumUpgradeSuccess(
        'auth_context',
        'in_app_purchase',
        value,
        'USD'
      );
      AnalyticsService.setUserProperties({
        is_premium: true,
        premium_upgraded_at: new Date().toISOString(),
        purchase_method: 'in_app_purchase',
      });
    } catch (error) {
      AnalyticsService.trackPremiumUpgradeFailure(
        'auth_context',
        'in_app_purchase',
        error
      );
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
      const anonymousId = await AsyncStorage.getItem('anonymousId');
      const pendingQuestionnaireData = await AsyncStorage.getItem(
        'questionnaireDataPending'
      );

      if (userProfile) {
        const profileData = JSON.parse(userProfile);
        const analysis = analysisData ? JSON.parse(analysisData) : null;

        // Save both the onboarding completion status and the profile data
        await updateDoc(doc(db, 'users', user.uid), {
          hasCompletedOnboarding: true,
          userProfile: profileData,
          onboardingAnswers: onboardingAnswers
            ? JSON.parse(onboardingAnswers)
            : null,
          analysis: analysis, // Save comprehensive analysis
          onboardingCompletedAt: new Date(),
          anonymousId: anonymousId, // Link to anonymous questionnaire data
        });

        // Also update AsyncStorage to mark onboarding as completed
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      } else {
        // Just mark as completed if no profile data
        await updateDoc(doc(db, 'users', user.uid), {
          hasCompletedOnboarding: true,
          onboardingCompletedAt: new Date(),
        });

        // Also update AsyncStorage
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
      }

      // Link anonymous questionnaire data to user account (for all users)
      if (anonymousId) {
        await linkAnonymousQuestionnaireData(anonymousId, user.uid);
      }

      // If there's pending questionnaire data (from permission denied), try to save it now
      if (pendingQuestionnaireData) {
        await savePendingQuestionnaireData(pendingQuestionnaireData, user.uid);
      }
    } catch (error) {
      throw error;
    }
  };

  // Save pending questionnaire data when user signs up
  const savePendingQuestionnaireData = async (pendingDataString, userId) => {
    try {
      const { collection, addDoc, serverTimestamp } = await import(
        'firebase/firestore'
      );
      const { db } = await import('../config/firebase');

      const pendingData = JSON.parse(pendingDataString);

      await addDoc(collection(db, 'questionnaire_responses'), {
        ...pendingData,
        userId: userId, // Link to authenticated user
        hasSignedUp: true,
        linkedAt: serverTimestamp(),
      });

      // Clear the pending data
      await AsyncStorage.removeItem('questionnaireDataPending');

      console.log('Pending questionnaire data saved to Firebase');
    } catch (error) {
      console.error('Error saving pending questionnaire data:', error);
      // Don't throw error - this shouldn't block the user flow
    }
  };

  // Link anonymous questionnaire data to user account
  const linkAnonymousQuestionnaireData = async (anonymousId, userId) => {
    try {
      console.log('Attempting to link anonymous questionnaire data:', {
        anonymousId,
        userId,
      });

      const { collection, query, where, getDocs, updateDoc, doc } =
        await import('firebase/firestore');
      const { db } = await import('../config/firebase');

      // Try to find by document ID first (new structure)
      try {
        const docRef = doc(db, 'questionnaire_responses', anonymousId);
        await updateDoc(docRef, {
          userId: userId, // Link to authenticated user
          hasSignedUp: true,
          linkedAt: new Date(),
        });
        console.log('Questionnaire data linked by document ID');
        return;
      } catch (docError) {
        console.log('Document not found by ID, trying query...');
      }

      // Fallback: Find by anonymousId field (old structure)
      const q = query(
        collection(db, 'questionnaire_responses'),
        where('anonymousId', '==', anonymousId)
      );
      const querySnapshot = await getDocs(q);

      console.log('Found questionnaire documents:', querySnapshot.docs.length);

      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        console.log('Updating document:', docSnapshot.id);

        await updateDoc(docSnapshot.ref, {
          userId: userId, // Link to authenticated user
          hasSignedUp: true,
          linkedAt: new Date(),
        });

        console.log(
          'Anonymous questionnaire data linked to user account successfully'
        );
      } else {
        console.log(
          'No questionnaire data found for anonymousId:',
          anonymousId
        );
      }
    } catch (error) {
      console.error('Error linking anonymous questionnaire data:', error);
      // Don't throw error - this shouldn't block the user flow
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
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
