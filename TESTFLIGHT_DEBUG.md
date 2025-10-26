# TestFlight vs Preview Build Debugging

## 🎯 Quick Summary

**Preview Build (works)** → [https://expo.dev/accounts/velvetcouples/projects/velvet/builds/d00217a3-4eae-49a6-aae3-7cee41a853da](https://expo.dev/accounts/velvetcouples/projects/velvet/builds/d00217a3-4eae-49a6-aae3-7cee41a853da)  
**TestFlight Build (doesn't work)** → Production environment

## 📱 Using the Debug Console

### Activation

1. **Triple-tap** anywhere on the screen (3 quick taps)
2. The debug console will open showing all logs
3. Only works for:
   - Test account: `meow@gmail.com`
   - Development builds (`__DEV__` mode)

### Features

- **Real-time log capture**: All `console.log`, `console.error`, `console.warn` are captured
- **Filter by level**: Switch between ALL, LOG, WARN, ERROR
- **Copy logs**: Tap "📋 Copy" to copy all logs to clipboard
- **Clear logs**: Tap "🗑️ Clear" to reset the log buffer
- **Auto-scroll**: Automatically scrolls to latest log

### RevenueCat Logs

Look for logs starting with:
- `🚀 ============= REVENUECAT INITIALIZATION START =============`
- `🔑 API Key check:`
- `📱 Platform:`
- `📦 Pre-fetching offerings...`
- `📦 Offerings response:`
- `✅ Current offering found:` or `❌ No current offering found`

## 🔍 Why TestFlight Might Not Show IAPs

### Sandbox vs Production Environment

| Build Type | Environment | Products Source | Sign In Required |
|------------|-------------|-----------------|------------------|
| **Preview (adhoc)** | Sandbox | Sandbox products | Sandbox test account |
| **TestFlight** | Production* | Production products | Sandbox test account |

*Note: TestFlight technically uses production environment but can still access sandbox for testing

### Common Issues

#### 1. Products Not Approved

**Problem**: In-App Products must be approved before they appear in TestFlight

**Check**:
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to: My Apps → Velvet → In-App Purchases
3. Check status of each product:
   - ✅ "Ready to Submit" or "Approved" → Good
   - ❌ "Missing Metadata" or "Developer Action Needed" → Fix required

**Fix**:
- Complete all required metadata
- Add screenshots for each product
- Submit for review if needed

#### 2. RevenueCat Offering Configuration

**Problem**: Offering might not be marked as "Current" in production

**Check RevenueCat Dashboard**:
1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Navigate to: Projects → Velvet → Offerings
3. Verify:
   - At least one offering exists
   - It's marked as "Current"
   - Products are attached to the offering
   - Products match App Store Connect product IDs

**Expected Product IDs**:
```
- com.ritzakku.velvet.weekly (₹499/week)
- com.ritzakku.velvet.monthly (₹1499/month)  
- com.ritzakku.velvet.sixmonth (₹4999/6 months)
```

#### 3. Bundle ID Mismatch

**Check**: Ensure bundle ID is consistent everywhere
- App Store Connect: `com.ritzakku.velvet`
- RevenueCat: `com.ritzakku.velvet`
- app.json: `com.ritzakku.velvet`

#### 4. Sandbox Test Account Not Signed In

**Problem**: TestFlight needs sandbox account signed in on device

**Fix**:
1. Open Settings → App Store
2. Sign out of production Apple ID (if signed in)
3. Don't sign in with anything at Settings level
4. When you launch the app, iOS will prompt for sandbox account
5. Sign in with your sandbox test account (`meow@gmail.com`)

## 🧪 Debugging Steps

### Step 1: Check Console Logs

1. Install TestFlight build
2. Sign in with `meow@gmail.com`
3. Triple-tap to open debug console
4. Navigate to payment screen
5. Look for RevenueCat initialization logs

**Expected logs:**
```
🚀 ============= REVENUECAT INITIALIZATION START =============
🔑 API Key check: { exists: true, length: 40, prefix: 'appl_BQMzw', platform: 'ios' }
📱 Platform: ios
📦 Bundle ID: com.ritzakku.velvet
✅ RevenueCat SDK configured successfully
👤 Anonymous User ID: $RCAnonymousID:xxxxx
📦 Pre-fetching offerings...
✅ Current offering found: default_offering
📋 Available packages: [...]
```

**If you see this error:**
```
❌ No current offering found in RevenueCat
💡 This usually means:
1. No offering is set as "Current" in RevenueCat dashboard
2. Products are not synced from App Store Connect
3. There are issues with your RevenueCat configuration
```

### Step 2: Verify RevenueCat Configuration

1. Open RevenueCat Dashboard
2. Check Offerings tab
3. Verify products are listed
4. Check Customer History for your test user

### Step 3: Check App Store Connect

1. Verify products are "Ready to Submit" or "Approved"
2. Check bundle ID matches
3. Verify products are in the correct Agreement

### Step 4: Compare Preview vs TestFlight Logs

1. Install Preview build (working version)
2. Sign in with `meow@gmail.com`
3. Triple-tap to open debug console
4. Copy all logs
5. Repeat for TestFlight build
6. Compare the logs side-by-side

**Key differences to look for:**
- API key value (should be same)
- Offerings response (check if offerings array is empty)
- Product identifiers (should match)
- Error messages (specific to environment)

## 📝 Expected Log Comparison

### Preview Build (Working) ✅

```
🚀 ============= REVENUECAT INITIALIZATION START =============
🔑 API Key check: { exists: true, length: 40, prefix: 'appl_BQMzw', platform: 'ios' }
✅ RevenueCat SDK configured successfully
📦 Offerings response: { current: 'default_offering', all: ['default_offering'] }
✅ Current offering found: default_offering
📋 Available packages: [
  { identifier: '$rc_weekly', product: 'com.ritzakku.velvet.weekly', price: '₹499' },
  { identifier: '$rc_monthly', product: 'com.ritzakku.velvet.monthly', price: '₹1,499' },
  { identifier: '$rc_six_month', product: 'com.ritzakku.velvet.sixmonth', price: '₹4,999' }
]
```

### TestFlight Build (Not Working) ❌

```
🚀 ============= REVENUECAT INITIALIZATION START =============
🔑 API Key check: { exists: true, length: 40, prefix: 'appl_BQMzw', platform: 'ios' }
✅ RevenueCat SDK configured successfully
📦 Offerings response: { current: null, all: {} }
❌ No current offering found in RevenueCat
💡 This usually means:
1. No offering is set as "Current" in RevenueCat dashboard
2. Products are not synced from App Store Connect
3. There are issues with your RevenueCat configuration
```

## 🔧 Quick Fixes

### If Offerings are Empty

1. **Check RevenueCat Dashboard**:
   - Offerings tab → Ensure offering is marked as "Current"
   - Products tab → Verify products exist and are linked

2. **Re-sync Products**:
   - In RevenueCat: Products → Click "Sync" button
   - Wait a few minutes for sync to complete

3. **Verify Product Status in ASC**:
   - Products should be "Ready to Submit" minimum
   - Complete all missing metadata

### If Specific Products are Missing

1. Check product IDs match exactly between:
   - App Store Connect
   - RevenueCat Dashboard
   - Code (if any hardcoded IDs)

2. Ensure products are attached to the offering in RevenueCat

### If API Key Issues

1. Verify the same API key works in Preview build
2. Check EAS secret is correctly configured
3. Rebuild with: `eas build --platform ios --profile production`

## 📊 EAS Build Profiles

### Preview Profile (Used for adhoc builds)

```json
"preview": {
  "distribution": "internal",
  "ios": {
    "simulator": false,
    "credentialsSource": "remote"
  },
  "env": {
    "REVENUECAT_API_KEY": "@REVENUECAT_API_KEY"
  }
}
```

### Production Profile (Used for TestFlight)

```json
"production": {
  "distribution": "store",
  "ios": {
    "credentialsSource": "remote"
  },
  "env": {
    "REVENUECAT_API_KEY": "@REVENUECAT_API_KEY"
  }
}
```

Both use the same RevenueCat API key, so the difference must be in:
- App Store Connect configuration
- RevenueCat offering setup
- Product approval status

## 🎯 Action Plan

1. ✅ Install TestFlight build with debug console
2. ✅ Triple-tap to open console
3. ✅ Navigate to payment screen
4. ✅ Copy all logs (📋 Copy button)
5. ✅ Share logs to identify exact issue
6. ✅ Check RevenueCat Dashboard offerings
7. ✅ Verify App Store Connect product status
8. ✅ Compare with Preview build logs
9. ✅ Fix identified issues
10. ✅ Rebuild and test

## 📞 Support Resources

- [RevenueCat Documentation](https://docs.revenuecat.com)
- [Why Are Offerings Empty?](https://rev.cat/why-are-offerings-empty)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [RevenueCat Community](https://community.revenuecat.com)

## 🐛 Reporting Issues

When reporting issues, include:
1. Full debug console logs (📋 copied)
2. Build type (Preview/TestFlight/Local)
3. Test account used
4. Screenshots of RevenueCat dashboard
5. Product status from App Store Connect

