# Velvet - Intimate Connection App 💕

A React Native app built with Expo for couples to explore and enhance their intimate connection.

## Features

- 🔥 Intimate content and games
- 💎 Premium subscriptions via RevenueCat
- 🎯 Personalized recommendations
- 🔒 Privacy-first design
- 📊 Analytics and user tracking
- 🍎 iOS support (Android coming soon)

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create `.env` file with RevenueCat API key

   ```bash
   cp .env.example .env
   # Edit .env and add your RevenueCat API key
   ```

3. Start the development server

   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Building for iOS

This app requires native code (RevenueCat SDK), so you must use EAS Build:

```bash
# Development build
eas build --profile development --platform ios

# Preview build
eas build --profile preview --platform ios

# Production build
eas build --profile production --platform ios
```

## Documentation

- **[RevenueCat Setup](./REVENUECAT_SETUP.md)** - Integration guide and architecture
- **[Testing Guide](./TESTING.md)** - How to test subscriptions in sandbox
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Firebase configuration
- **[IAP Integration](./IAP_INTEGRATION.md)** - Legacy IAP docs
- **[IAP Testing](./IAP_TESTING_GUIDE.md)** - Legacy testing guide

## Tech Stack

- **Framework:** Expo (React Native)
- **Navigation:** Expo Router
- **Subscriptions:** RevenueCat
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Analytics:** Custom analytics service
- **State Management:** React Context
- **Styling:** React Native StyleSheet

## Project Structure

```
velvet/
├── app/                    # Expo Router pages
├── src/
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts (Auth, RevenueCat, IAP)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Core libraries (RevenueCatManager)
│   ├── screens/            # Screen components
│   ├── services/           # Services (Analytics, IAP)
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
├── .env                    # Environment variables (gitignored)
└── ...config files
```

## Environment Variables

Create a `.env` file with:

```env
REVENUECAT_API_KEY=your_ios_api_key_here
```

See [REVENUECAT_SETUP.md](./REVENUECAT_SETUP.md) for details.

## Subscription Products

Configured in App Store Connect:
- **Monthly:** `com.ritzakku.velvet.Monthly`
- **Annual:** `com.ritzakku.velvet.Annual`
- **Lifetime:** `com.ritzakku.velvet.Lifetime`

## Scripts

```bash
# Start development
npm start

# Build for iOS
npm run build:dev:ios          # Development
npm run build:preview:ios      # Preview
npm run build:prod:ios         # Production

# Submit to App Store
npm run submit:ios

# Linting
npm run lint
```

## GitHub Actions / CI/CD Setup

Your existing `react-native-cicd.yml` workflow is configured for automated builds to TestFlight.

### RevenueCat Setup for CI/CD:

1. **Create EAS Secret** (stores RevenueCat API key):
   ```bash
   ./setup-eas-secret.sh
   ```
   
   Or manually:
   ```bash
   npx eas-cli env:create --name REVENUECAT_API_KEY --value appl_BQMzwpJqCjLlTkdtLqggdfrziiQ --scope project
   ```

2. **Verify it's set**:
   ```bash
   npx eas-cli env:list
   ```

That's it! Your existing workflow will automatically use this secret during builds because `eas.json` is configured to inject it.

See [EAS_SECRET_SETUP.md](./EAS_SECRET_SETUP.md) for detailed instructions.

## Learn more

### Expo Resources
- [Expo documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Router](https://expo.github.io/router/docs/)

### RevenueCat Resources
- [RevenueCat Docs](https://docs.revenuecat.com/)
- [React Native SDK](https://docs.revenuecat.com/docs/reactnative)
- [Dashboard](https://app.revenuecat.com/)

### Testing
- [Sandbox Testing](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_in_sandbox)
- [TestFlight](https://developer.apple.com/testflight/)

## Support

For questions or issues:
1. Check the documentation files in this repo
2. Review RevenueCat dashboard logs
3. Check Xcode console for detailed errors

---

**Bundle ID:** `com.ritzakku.velvet`  
**Minimum iOS:** 13.0  
**Current Version:** 1.0.0
