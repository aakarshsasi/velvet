# RevenueCat TestFlight Debug Guide

## Problem
RevenueCat works locally but fails on TestFlight with "Invalid API Key" error.

## Root Cause Analysis

### How the API Key is Loaded

The RevenueCat API key can come from three sources:
1. **From `@env` module** - Read by babel plugin at **compile time** (preferred for CI/CD)
2. **From `process.env`** - Read at **runtime** (works for local development)
3. **Hardcoded fallback** - Only for debugging (should NOT be used in production)

### The Issue

When building with GitHub Actions:
1. `.env` file is created during the CI/CD build
2. Babel processes TypeScript/JavaScript files during bundling
3. The babel `react-native-dotenv` plugin reads `.env` file at compile time
4. If the `.env` file isn't present when babel processes the files, or if there's a caching issue, the API key won't be embedded in the bundle

### Why It Works Locally but Fails on TestFlight

- **Local**: You have a `.env` file in your project root, and babel reads it successfully
- **TestFlight**: The `.env` file is created in CI/CD, but there might be:
  - Timing issues (babel processes files before .env is created)
  - Caching issues (old bundle being reused)
  - Environment variable not being passed correctly to the EAS build process

## Solutions Added

### 1. Enhanced Logging

Added comprehensive logging to `RevenueCatManager.ts` to diagnose exactly where the API key is coming from:

```typescript
console.log('🔑 API KEY SOURCE DEBUG');
console.log('REVENUECAT_API_KEY from @env module:', REVENUECAT_API_KEY ? `${REVENUECAT_API_KEY.substring(0, 15)}...` : 'undefined');
console.log('process.env.REVENUECAT_API_KEY:', process.env.REVENUECAT_API_KEY ? `${process.env.REVENUECAT_API_KEY.substring(0, 15)}...` : 'undefined');
```

### 2. Enhanced CI/CD Verification

Added verification steps to GitHub Actions workflow to ensure:
- `.env` file exists before build starts
- API key is present in `.env` file
- Environment variable is set correctly
- API key format is valid (starts with "appl_")

### 3. Better Error Messages

If the API key is missing, the app will now provide clear instructions on how to fix it.

## How to Diagnose the Issue

### Step 1: Check TestFlight Build Logs

Look for these log entries in the TestFlight app:

```
🚀 ============= REVENUECAT INITIALIZATION START =============
🔑 API KEY SOURCE DEBUG
REVENUECAT_API_KEY from @env module: undefined
process.env.REVENUECAT_API_KEY: undefined
```

This will tell you if the API key is:
- ✅ Being read from `@env` (babel build-time) - GOOD
- ✅ Being read from `process.env` (runtime) - GOOD
- ❌ Not being read at all - PROBLEM

### Step 2: Check GitHub Actions Build Logs

Look for these sections in the build logs:

```
🔐 Setting up RevenueCat API key for EAS build...
🔑 API Key length: XX characters
🔑 API Key starts with: appl_
✅ .env file exists
✅ REVENUECAT_API_KEY found in .env
```

If you see any warnings or errors in this section, that's the root cause.

## Potential Solutions

### Solution 1: Ensure .env Exists Before npm install

The babel plugin reads `.env` during the initial npm install/bundling phase. Make sure `.env` exists before that.

**In GitHub Actions**:
```yaml
- name: Create .env before install
  run: |
    echo "REVENUECAT_API_KEY=${{ secrets.REVENUECAT_API_KEY }}" > .env

- name: Install dependencies
  run: npm ci
```

### Solution 2: Use Runtime Environment Variable

Instead of relying on babel to read `.env` at compile time, pass the API key as a runtime environment variable:

**In eas.json**:
```json
{
  "build": {
    "production": {
      "env": {
        "REVENUECAT_API_KEY": "$REVENUECAT_API_KEY"
      }
    }
  }
}
```

Then update `RevenueCatManager.ts` to prioritize `process.env`:

```typescript
let apiKey = process.env.REVENUECAT_API_KEY || REVENUECAT_API_KEY;
```

### Solution 3: Clear Build Cache

Sometimes old bundles are cached. Try:

1. In GitHub Actions, add cache clearing:
```yaml
- name: Clear Metro bundler cache
  run: |
    rm -rf node_modules/.cache
    rm -rf .expo
    npx expo start --clear
```

2. Or manually run in your CI:
```bash
rm -rf node_modules/.cache
npm cache clean --force
npx expo export --clear
```

### Solution 4: Verify Secret is Set Correctly

Make sure the GitHub secret `REVENUECAT_API_KEY` is set correctly:

1. Go to: https://github.com/YOUR_REPO/settings/secrets
2. Check if `REVENUECAT_API_KEY` exists
3. Verify it matches the key from RevenueCat dashboard (starts with `appl_`)

## Testing Checklist

After implementing fixes, verify:

- [ ] `.env` file is created before bundling starts
- [ ] API key is present in `.env` file (check build logs)
- [ ] API key starts with `appl_` (iOS format)
- [ ] No cache-related issues (Metro bundler cache cleared)
- [ ] TestFlight app shows API key in logs (with better logging added)
- [ ] RevenueCat initialization succeeds

## Next Steps

1. **Push your code** - The enhanced logging will help us identify the issue
2. **Run CI/CD** - Check the build logs for verification output
3. **Test on TestFlight** - Look for the new debug logs
4. **Report findings** - Share the logs showing where the API key is coming from

## Expected Behavior

With the enhanced logging, you should see one of these patterns:

### ✅ Success Pattern (Build-time)
```
🔑 API KEY SOURCE DEBUG
REVENUECAT_API_KEY from @env module: appl_XyzAbc123...
process.env.REVENUECAT_API_KEY: undefined
✅ Valid API key found from: @env (babel build-time)
```

### ✅ Success Pattern (Runtime)
```
🔑 API KEY SOURCE DEBUG
REVENUECAT_API_KEY from @env module: undefined
process.env.REVENUECAT_API_KEY: appl_XyzAbc123...
✅ Valid API key found from: process.env (runtime)
```

### ❌ Failure Pattern
```
🔑 API KEY SOURCE DEBUG
REVENUECAT_API_KEY from @env module: undefined
process.env.REVENUECAT_API_KEY: undefined
⚠️ No API key from environment, using HARDCODED fallback
```

## Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/docs/react-native)
- [react-native-dotenv GitHub](https://github.com/goatandsheep/react-native-dotenv)
- [EAS Build Environment Variables](https://docs.expo.dev/build-reference/variables/)

