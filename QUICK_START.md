# RevenueCat Quick Start Guide 🚀

A quick reference for getting started with RevenueCat in Velvet.

## ✅ Setup Complete

The RevenueCat integration is fully implemented and ready for testing!

## 📋 What Was Installed

- ✅ `react-native-purchases` - RevenueCat SDK
- ✅ `react-native-dotenv` - Environment variable support
- ✅ RevenueCat Manager - Core logic
- ✅ RevenueCat Context - React integration
- ✅ New Payment Screen - With RevenueCat offerings

## 🔑 Your Configuration

**Bundle ID:** `com.ritzakku.velvet`

**Products (App Store Connect):**
- Monthly: `com.ritzakku.velvet.Monthly`
- Annual: `com.ritzakku.velvet.Annual`
- Lifetime: `com.ritzakku.velvet.Lifetime`

**RevenueCat Offering:** `default`

**Packages:**
- `$rc_monthly` → Monthly
- `$rc_annual` → Annual
- `$rc_lifetime` → Lifetime

**API Key:** Already configured in `.env` ✅

## 🚀 Next Steps

### 1. Verify Setup

Check that `.env` file exists:
```bash
cat .env
```

You should see:
```
REVENUECAT_API_KEY=appl_BQMzwpJqCjLlTkdtLqggdfrziiQ
```

### 2. Build the App

You **must** use EAS Build (RevenueCat requires native code):

```bash
# For testing with sandbox
eas build --profile development --platform ios
```

This will take 10-20 minutes. You'll get a download link when done.

### 3. Install on Device

**Option A: TestFlight (Recommended)**
```bash
eas submit --platform ios
```

**Option B: Direct Install**
- Download the `.ipa` from EAS
- Install via Xcode or Apple Configurator

### 4. Test Purchases

1. **Create sandbox tester** in App Store Connect:
   - Go to Users and Access → Sandbox
   - Create a new tester with a unique email

2. **On your iOS device:**
   - Settings → App Store → Sign Out
   - Don't sign in yet

3. **Launch the app:**
   - Navigate to payment screen
   - Select a subscription
   - Tap purchase button
   - Sign in with sandbox tester when prompted
   - Verify `[Sandbox]` appears in payment sheet
   - Complete purchase (it's free in sandbox)

4. **Verify in RevenueCat:**
   - Go to https://app.revenuecat.com/
   - Navigate to Customers
   - Your sandbox purchase should appear

### 5. Test Restore

1. Delete the app
2. Reinstall it
3. Navigate to payment screen
4. Tap "Restore Purchases"
5. Premium access should be restored

## 📚 Documentation

- **[REVENUECAT_SETUP.md](./REVENUECAT_SETUP.md)** - Complete integration guide
- **[TESTING.md](./TESTING.md)** - Detailed testing instructions
- **[REVENUECAT_MIGRATION_SUMMARY.md](./REVENUECAT_MIGRATION_SUMMARY.md)** - What changed

## 🔧 Useful Commands

```bash
# Build for testing
eas build --profile development --platform ios

# Build for TestFlight
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios

# Check build status
eas build:list

# View logs
eas build:view [build-id]
```

## ❓ Common Issues

### "Cannot connect to App Store"
- Sign out of App Store in device settings
- Use a valid sandbox tester account

### "Product not available"
- Verify products are "Ready to Submit" in App Store Connect
- Wait a few hours (Apple's servers sync slowly)
- Check product IDs match exactly

### "RevenueCat not initialized"
- Verify `.env` file exists
- Check API key is correct
- Rebuild the app

## 🎯 Quick Testing Checklist

Before submitting to App Store:

- [ ] Sandbox tester created
- [ ] App built with EAS
- [ ] Installed on device
- [ ] Can make test purchase
- [ ] Purchase shows in RevenueCat dashboard
- [ ] Premium features unlock
- [ ] Restore purchases works
- [ ] Can navigate app with premium access
- [ ] No crashes or errors

## 📱 Payment Screen Features

The new payment screen shows:
- ✅ All three subscription options from RevenueCat
- ✅ Prices from App Store Connect
- ✅ Premium benefits
- ✅ "Most Popular" badge on Annual
- ✅ Restore Purchases button
- ✅ Security notice
- ✅ Beautiful UI with animations

## 🔐 Security

✅ API key in `.env` (gitignored)  
✅ No hardcoded keys  
✅ Server-side validation  
✅ HTTPS only  
✅ No payment data stored  

## 🚨 Important Notes

1. **Expo Go won't work** - Must use EAS Build
2. **Sandbox only for testing** - No real charges
3. **Subscriptions renew fast** - 5 min for monthly in sandbox
4. **Sign out of real App Store** - Before testing
5. **Products must be "Ready to Submit"** - Not "Approved"

## 🎉 You're Ready!

Everything is set up. Just build and test!

**Build command:**
```bash
eas build --profile development --platform ios
```

While it builds, review [TESTING.md](./TESTING.md) for the complete testing guide.

---

**Need help?** Check the documentation files or RevenueCat dashboard logs.

**Happy testing!** 🚀

