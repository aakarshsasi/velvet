# RevenueCat Testing Guide for Velvet iOS App

This guide walks you through testing RevenueCat subscription purchases in sandbox mode before submitting to the App Store.

## Prerequisites

- Xcode installed on your Mac
- EAS CLI installed (`npm install -g eas-cli`)
- Apple Developer account with access to App Store Connect
- Physical iOS device or iOS Simulator (16.0+)

## Table of Contents

1. [Setting Up Sandbox Tester Accounts](#1-setting-up-sandbox-tester-accounts)
2. [Building the App for Testing](#2-building-the-app-for-testing)
3. [Installing the Test Build](#3-installing-the-test-build)
4. [Testing Purchases](#4-testing-purchases)
5. [Testing Restore Purchases](#5-testing-restore-purchases)
6. [Verifying Purchases in RevenueCat Dashboard](#6-verifying-purchases-in-revenuecat-dashboard)
7. [Troubleshooting](#7-troubleshooting)
8. [Expected Behavior in Sandbox](#8-expected-behavior-in-sandbox)

---

## 1. Setting Up Sandbox Tester Accounts

Sandbox testers are special test accounts that let you test in-app purchases without real money.

### Creating a Sandbox Tester

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to **Users and Access**
3. Select **Sandbox** tab
4. Click the **+** button to add a new sandbox tester
5. Fill in the details:
   - **First Name**: Test
   - **Last Name**: User (or any name you prefer)
   - **Email**: Use a NEW email that has never been used for any Apple ID
     - Example: `velvet.test1@example.com`
     - **Important**: This email must be unique and not associated with any existing Apple ID
   - **Password**: Choose a secure password
   - **Country**: Select your testing region
   - **App Store Territory**: Same as country
6. Click **Create**

### Important Notes

- Create multiple sandbox testers if you want to test different scenarios
- The email doesn't need to be real - Apple won't send verification emails
- Keep track of your sandbox tester credentials securely

---

## 2. Building the App for Testing

You need to build the app using EAS Build (Expo Application Services) since RevenueCat requires native code.

### Option A: Development Build (Recommended for Testing)

```bash
# Make sure you're in the project directory
cd /path/to/velvet

# Build for iOS development
eas build --profile development --platform ios
```

**What this does:**
- Creates a development build that includes the RevenueCat SDK
- Allows hot reloading and debugging
- Can be installed on registered devices

### Option B: Preview Build (For Testing Like Production)

```bash
# Build a preview version
eas build --profile preview --platform ios
```

**What this does:**
- Creates a build similar to production
- Good for final testing before submission
- No debugging capabilities

### Build Process

1. EAS CLI will ask you to log in (if not already)
2. It will build the app in the cloud (takes ~10-20 minutes)
3. Once complete, you'll get a download link
4. Download the `.ipa` or use TestFlight

---

## 3. Installing the Test Build

### Method 1: Using TestFlight (Recommended)

1. After the build completes, submit to TestFlight:
   ```bash
   eas submit --platform ios
   ```
2. Wait for Apple's review (usually <30 minutes for TestFlight)
3. Open TestFlight app on your iOS device
4. Install the Velvet app

### Method 2: Direct Installation (Development Build Only)

1. Register your device in Apple Developer Portal
2. Download the `.ipa` file from EAS
3. Install using Xcode or Apple Configurator

---

## 4. Testing Purchases

### Preparation

1. **On your iOS device**, go to Settings
2. Scroll down and tap **App Store**
3. Tap on your Apple ID at the top
4. Tap **Sign Out** (this signs you out of the real App Store)
5. **DO NOT sign in with sandbox account yet**

### Testing Flow

1. **Launch the Velvet app**
2. Navigate through the onboarding to reach the payment screen
3. Select a subscription plan (Monthly, Annual, or Lifetime)
4. Tap the purchase button
5. **Apple's payment sheet will appear**
6. You'll be prompted to sign in - **NOW sign in with your sandbox tester account**
7. The sandbox tester email will appear at the top of the payment sheet (showing `[Sandbox]`)
8. Confirm the purchase (it's free in sandbox mode)
9. The purchase should complete and you should see a success message

### What to Verify

✅ Payment sheet shows `[Sandbox]` and sandbox tester email  
✅ Subscription details display correctly (price, duration)  
✅ Purchase completes without errors  
✅ App unlocks premium features  
✅ Success message appears  
✅ App navigates to home screen  

---

## 5. Testing Restore Purchases

Restore purchases is crucial for users who:
- Reinstall the app
- Switch devices
- Lost access to premium features

### Test Procedure

1. **After making a purchase**, delete the Velvet app from your device
2. Reinstall the app (from TestFlight or development build)
3. Launch the app and navigate to the payment screen
4. Tap **"Restore Purchases"** button
5. You may be prompted to sign in with your sandbox account again
6. The app should restore your premium access

### What to Verify

✅ Restore button is visible and accessible  
✅ Restore process completes without errors  
✅ Premium access is restored  
✅ Success message appears  
✅ App recognizes the active subscription  

---

## 6. Verifying Purchases in RevenueCat Dashboard

RevenueCat tracks all purchases in real-time, even in sandbox mode.

### Viewing Sandbox Purchases

1. Log in to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Select your **Velvet** project
3. Go to **Customers** in the left sidebar
4. You should see your sandbox tester's customer record
   - Customer ID will be the RevenueCat-generated anonymous ID or your user ID
5. Click on the customer to view details:
   - **Active Entitlements**: Should show active subscription
   - **Purchase History**: Should show the sandbox purchase
   - **Product ID**: Should match your product (e.g., `com.ritzakku.velvet.Monthly`)

### What to Look For

✅ Customer record exists  
✅ Active entitlement is present  
✅ Product ID matches your offering  
✅ Purchase timestamp is recent  
✅ Environment shows "sandbox"  

---

## 7. Troubleshooting

### Problem: "Cannot connect to App Store"

**Solutions:**
- Ensure you're signed out of your real Apple ID in device settings
- Make sure you're using a valid sandbox tester account
- Check your internet connection
- Restart the app

### Problem: "This product is not available"

**Solutions:**
- Verify product IDs in App Store Connect match RevenueCat exactly:
  - `com.ritzakku.velvet.Monthly`
  - `com.ritzakku.velvet.Annual`
  - `com.ritzakku.velvet.Lifetime`
- Ensure products are in "Ready to Submit" state
- Check that the bundle ID in the app matches App Store Connect: `com.ritzakku.velvet`
- Wait a few hours after creating products (Apple's servers may take time to sync)

### Problem: "Purchase failed" or error alert

**Solutions:**
- Check console logs in Xcode for detailed error messages
- Verify RevenueCat API key is correct in `.env` file
- Ensure RevenueCat offering is configured with correct package identifiers
- Try with a different sandbox tester account

### Problem: Purchases not showing in RevenueCat Dashboard

**Solutions:**
- Wait a few minutes (there can be a delay)
- Ensure the app successfully initialized RevenueCat (check console logs)
- Verify the API key is correct
- Check that you're looking at the correct project in RevenueCat

### Problem: "Already purchased" error

**Solutions:**
- Sandbox subscriptions need to be cancelled manually
- Go to Settings → App Store → Sandbox Account → Manage
- Cancel any active subscriptions
- Or create a new sandbox tester account

---

## 8. Expected Behavior in Sandbox

Sandbox testing differs from production in several ways:

### Subscription Durations (Accelerated)

In sandbox, subscriptions renew much faster for testing:

| Production Duration | Sandbox Duration |
|---------------------|------------------|
| 1 month | 5 minutes |
| 1 year | 1 hour |
| Lifetime | N/A (permanent) |

**What this means:**
- A monthly subscription will renew every 5 minutes in sandbox
- An annual subscription will renew every hour in sandbox
- Subscriptions will auto-renew up to 6 times, then stop

### Price Display

- Prices show correctly from App Store Connect
- Payment is simulated (no actual charge)
- Sandbox tester sees `[Sandbox]` in payment sheet

### Cancellation

- Subscriptions can be managed in Settings → App Store → Sandbox Account
- Or they'll expire after 6 renewals automatically

### Receipt Validation

- RevenueCat automatically validates receipts
- You should see entitlements activate immediately after purchase

---

## Quick Testing Checklist

Use this checklist to verify everything works:

### Initial Setup
- [ ] Sandbox tester account created in App Store Connect
- [ ] Products in "Ready to Submit" state
- [ ] RevenueCat offering configured with correct packages
- [ ] `.env` file contains correct API key
- [ ] App built with EAS Build

### Purchase Flow
- [ ] Payment screen displays all three subscription options
- [ ] Prices display correctly
- [ ] Can select different subscription plans
- [ ] Purchase button is enabled
- [ ] Payment sheet appears with `[Sandbox]` label
- [ ] Purchase completes successfully
- [ ] Success message appears
- [ ] Premium features unlock
- [ ] Customer appears in RevenueCat Dashboard

### Restore Flow
- [ ] Restore button is visible
- [ ] Restore works after reinstalling app
- [ ] Premium access is restored correctly
- [ ] Success message appears after restore

### Edge Cases
- [ ] Cancel purchase flow works (no errors)
- [ ] Handle "already purchased" scenario
- [ ] Network error handling works
- [ ] App doesn't crash on any purchase error

---

## Production Testing (Before Launch)

Before submitting to App Store:

1. **Test with real money** (optional but recommended):
   - Use TestFlight with production build
   - Make a real purchase with your personal account
   - Immediately request a refund from Apple

2. **Verify all analytics events**:
   - Check that purchases are tracked
   - Verify conversion funnels work
   - Ensure premium upgrade events fire

3. **Test on multiple iOS versions**:
   - iOS 16, 17, 18 (latest versions)
   - Different iPhone models

4. **Final checks**:
   - Remove any test/debug code
   - Verify error messages are user-friendly
   - Test with poor internet connection
   - Ensure privacy policy is linked

---

## Need Help?

### Resources
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Apple's Sandbox Testing Guide](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_in_sandbox)
- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)

### Common Commands

```bash
# Build for development
eas build --profile development --platform ios

# Build for preview
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios

# View build logs
eas build:list
```

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` file to git
- Never share your RevenueCat API keys publicly
- Keep sandbox tester credentials secure
- Don't use real payment methods in sandbox testing

---

**Happy Testing!** 🎉

If you encounter any issues not covered in this guide, check the RevenueCat Dashboard logs and Xcode console for detailed error messages.

