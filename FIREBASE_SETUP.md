# Firebase Setup Guide for Velvet App

## 🔥 Firebase Integration Overview

The Velvet app is already configured with Firebase for:
- **User Authentication** (Email/Password)
- **User Profile Management** (Premium status tracking)
- **Data Persistence** (Firestore database)

## 📋 Prerequisites

1. **Firebase Account**: Create a free account at [firebase.google.com](https://firebase.google.com)
2. **Node.js & npm**: Ensure you have Node.js installed
3. **Expo CLI**: Install Expo CLI globally: `npm install -g @expo/cli`

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `velvet-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable it and click **Save**

### 3. Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select a location close to your users
4. Click **Done**

### 4. Set Up Security Rules

1. In Firestore Database, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** > **Web app**
4. Register app with name: `velvet-web`
5. Copy the config object

### 6. Update Configuration

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 🏗️ Project Structure

```
src/
├── config/
│   └── firebase.js          # Firebase configuration
├── contexts/
│   └── AuthContext.js       # Authentication context
├── screens/
│   ├── LoginScreen.js       # Login/Signup screen
│   ├── Home.js             # Main home screen
│   └── WelcomeScreen.js    # Welcome screen
└── app/
    └── _layout.tsx         # App layout with AuthProvider
```

## 🔐 Authentication Features

### User Management
- **Sign Up**: Create new accounts with email/password
- **Sign In**: Authenticate existing users
- **Profile Management**: Store user data in Firestore
- **Premium Status**: Track premium user status

### Data Structure
```javascript
// User document in Firestore
{
  email: "user@example.com",
  displayName: "User Name",
  isPremium: false,
  createdAt: Timestamp,
  lastLogin: Timestamp,
  premiumUpgradedAt: Timestamp // Optional
}
```

## 🎯 Premium Features

The app automatically tracks premium status:
- **Free Users**: Basic access to content
- **Premium Users**: Enhanced features and content
- **Upgrade Function**: Built-in premium upgrade functionality

## 🚨 Security Considerations

1. **Environment Variables**: Store Firebase config in environment variables for production
2. **Security Rules**: Implement proper Firestore security rules
3. **User Validation**: Validate user input on both client and server
4. **Rate Limiting**: Implement rate limiting for authentication attempts

## 🔧 Development vs Production

### Development
- Use test mode Firestore rules
- Enable all authentication methods
- Use development Firebase project

### Production
- Implement strict Firestore security rules
- Enable only necessary authentication methods
- Use production Firebase project
- Set up proper error monitoring

## 📱 Testing

1. **Start the app**: `npm start`
2. **Test authentication flow**:
   - Create new account
   - Sign in with existing account
   - Test premium upgrade
   - Verify data persistence

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase not initialized"**
   - Check if firebase.js is properly imported
   - Verify config values are correct

2. **"Permission denied"**
   - Check Firestore security rules
   - Verify user authentication state

3. **"Network error"**
   - Check internet connection
   - Verify Firebase project is active

### Debug Mode

Enable Firebase debug mode in development:
```javascript
// Add to firebase.js for development
if (__DEV__) {
  console.log('Firebase initialized in debug mode');
}
```

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase](https://rnfirebase.io/)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## 🎉 Next Steps

After setup:
1. Test all authentication flows
2. Implement premium feature gating
3. Add user profile management
4. Set up analytics and monitoring
5. Deploy to production

---

**Note**: Keep your Firebase config secure and never commit API keys to public repositories!
