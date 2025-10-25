# Local Device Testing Guide

Test RevenueCat subscriptions on your physical device connected to your Mac.

## Prerequisites

✅ RevenueCat API key added to EAS secret  
✅ Sandbox tester created in App Store Connect  
✅ iOS device connected to Mac via USB  
✅ Device registered in Apple Developer Portal  

## Method 1: Local EAS Build (Recommended)

### Step 1: Connect Your Device

1. Connect your iPhone/iPad to your Mac via USB cable
2. Trust the computer on your device if prompted
3. Verify device is detected:
   ```bash
   xcrun devicectl list devices
   ```
   Or:
   ```bash
   xcrun xctrace list devices
   ```

### Step 2: Register Device in Apple Developer Portal

If not already registered:

```bash
# Get device UDID
xcrun xctrace list devices

# Or use Xcode: Window → Devices and Simulators
```

Then:
1. Go to https://developer.apple.com/account/resources/devices
2. Click "+" to register device
3. Enter device name and UDID
4. Save

### Step 3: Build Locally

```bash
# Build on your Mac and create IPA
eas build --platform ios --profile development --local
```

This will:
- Build on your Mac (not in cloud)
- Use your EAS secret (RevenueCat API key)
- Create an `.ipa` file
- Take ~10-20 minutes

### Step 4: Install on Device

After build completes, install using Xcode:

```bash
# Find the IPA file (usually in current directory)
ls -lh *.ipa

# Install via Xcode
# Option A: Drag & drop IPA to Devices window
# Option B: Use command line
xcrun devicectl device install app --device <DEVICE_ID> <IPA_FILE>
```

**Or use Apple Configurator 2:**
1. Open Apple Configurator 2
2. Select your device
3. Click "Add" → "Apps"
4. Select the `.ipa` file

### Step 5: Test Subscriptions

1. **Prepare device**:
   - Settings → App Store → Sign Out
   - Don't sign in yet

2. **Launch Velvet app** from device

3. **Navigate to payment screen**

4. **Select subscription and purchase**:
   - Apple payment sheet appears
   - Sign in with sandbox tester
   - Verify `[Sandbox]` appears
   - Complete purchase

5. **Verify premium access unlocked**

6. **Check RevenueCat Dashboard**:
   - https://app.revenuecat.com/
   - Customers → Find your test purchase

## Method 2: Expo Development Build (Alternative)

If you want hot-reloading during development:

### Step 1: Build Development Client

```bash
# Build development client
eas build --platform ios --profile development
```

When prompted, select your connected device or create an ad-hoc provisioning profile.

### Step 2: Install Development Client

After build completes, download and install the `.ipa` on your device.

### Step 3: Start Development Server

```bash
npm start
```

### Step 4: Connect and Test

1. Open the app on your device
2. It will connect to your dev server
3. You can make code changes and see them live
4. Test subscriptions with sandbox account

## Method 3: Direct Run (If prebuild done)

If you've run `npx expo prebuild`:

```bash
# Run directly on connected device
npx expo run:ios --device
```

This will:
- Build the app
- Install on connected device
- Launch automatically

**Note**: This requires native iOS project to exist in `ios/` folder.

## Testing Checklist

### Before Testing
- [ ] Device connected and trusted
- [ ] Device registered in Developer Portal
- [ ] Signed out of real Apple ID on device
- [ ] Sandbox tester credentials ready
- [ ] EAS secret created (`eas env:list` to verify)

### During Testing
- [ ] App launches successfully
- [ ] Navigate to payment screen
- [ ] All 3 subscriptions display (Monthly, Annual, Lifetime)
- [ ] Prices show correctly
- [ ] Tap purchase button
- [ ] Apple payment sheet shows `[Sandbox]`
- [ ] Sign in with sandbox tester
- [ ] Purchase completes
- [ ] Success message appears
- [ ] Premium features unlock

### After Purchase
- [ ] Check RevenueCat Dashboard for purchase
- [ ] Verify entitlement is active
- [ ] Test restore purchases (reinstall app)
- [ ] Try different subscription types

## Debugging

### View Console Logs

Open Xcode Console to see app logs:
```bash
# Open Console app or Xcode
# Window → Devices and Simulators → Select device → Open Console
```

Look for:
- RevenueCat initialization logs
- Purchase attempt logs
- Error messages

### Common Issues

**"Code signing failed"**
- Make sure device is registered
- Refresh provisioning profiles: `eas device:list`

**"App won't install"**
- Delete any existing version of the app
- Check device has enough storage
- Try restarting device

**"RevenueCat not initialized"**
- Verify EAS secret: `eas env:list`
- Check console logs for API key errors

**"Product not available"**
- Products must be "Ready to Submit" in App Store Connect
- Wait a few hours after creating products
- Verify bundle ID matches: `com.ritzakku.velvet`

## Quick Commands

```bash
# List connected devices
xcrun devicectl list devices

# Build locally
eas build --platform ios --profile development --local

# List registered devices in EAS
eas device:list

# Create development build (cloud)
eas build --platform ios --profile development

# Check EAS secrets
eas env:list

# Install IPA on device
xcrun devicectl device install app --device <DEVICE_ID> <IPA_FILE>
```

## Advantages of Local Testing

✅ **Faster iteration** - No waiting for cloud builds  
✅ **Console access** - See logs in real-time  
✅ **No build minutes used** - Free local builds  
✅ **Immediate testing** - Test right after build  
✅ **Debugging easier** - Can attach debugger  

## When to Use TestFlight

After local testing succeeds, use TestFlight for:
- Testing with multiple testers
- Testing production-like environment
- Final validation before App Store
- Testing on devices you don't have physical access to

## Next Steps

After successful local testing:
1. Test all subscription types
2. Test restore purchases
3. Verify analytics events
4. Build for TestFlight if everything works
5. Submit to App Store when ready

---

**Start Testing:**

```bash
# 1. Connect your device
# 2. Run local build
eas build --platform ios --profile development --local

# 3. Install and test!
```

