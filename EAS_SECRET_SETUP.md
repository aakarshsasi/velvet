# EAS Secret Setup for GitHub Actions

## Step 1: Create EAS Secret

Run this command in your terminal (you'll need to be logged in to EAS):

```bash
npx eas-cli env:create --name REVENUECAT_API_KEY --value appl_BQMzwpJqCjLlTkdtLqggdfrziiQ --scope project
```

**Note:** The newer command is `env:create` instead of the deprecated `secret:create`.

If you're not logged in, first run:
```bash
npx eas-cli login
```

## Step 2: Verify Secret Was Created

```bash
npx eas-cli env:list
```

You should see:
```
┌──────────────────────┬───────────────────────────────────────┬─────────┐
│ Name                 │ Value                                  │ Scope   │
├──────────────────────┼───────────────────────────────────────┼─────────┤
│ REVENUECAT_API_KEY   │ appl_BQMzwpJqCjLlTkdtLqggdfrziiQ      │ project │
└──────────────────────┴───────────────────────────────────────┴─────────┘
```

## Step 3: Setup GitHub Actions

Your `eas.json` is already configured! ✅

The environment variable will be automatically injected during builds:
- Development builds: `eas build --profile development`
- Preview builds: `eas build --profile preview`
- Production builds: `eas build --profile production`

## Step 4: Get Expo Token for GitHub Actions

You need an Expo token to authenticate GitHub Actions:

```bash
npx eas-cli whoami --json
```

This will output something like:
```json
{
  "username": "your-username",
  "id": "your-id"
}
```

To get your token, run:
```bash
npx eas-cli token:create
```

Or if you're already logged in:
```bash
cat ~/.expo/state.json
```

Look for the `"token"` field.

## Step 5: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `EXPO_TOKEN`
5. Value: Paste the token from Step 4
6. Click **Add secret**

## How It Works

```
GitHub Actions Triggered
         ↓
Checkout code (no .env)
         ↓
EAS Build starts
         ↓
Reads eas.json
         ↓
Sees env.REVENUECAT_API_KEY = "@REVENUECAT_API_KEY"
         ↓
Fetches secret from EAS servers
         ↓
Injects as environment variable
         ↓
Build succeeds! ✅
```

## Testing

After setup, test it works:

```bash
# Local build (will use .env file)
npx eas-cli build --platform ios --profile development --local

# Remote build (will use EAS secret)
npx eas-cli build --platform ios --profile preview
```

Both should work with the API key injected!

## GitHub Actions Workflow

Your existing `react-native-cicd.yml` workflow is already configured! ✅

The workflow will automatically use the EAS secret because:
1. Your `eas.json` has the `env` configuration with `"REVENUECAT_API_KEY": "@REVENUECAT_API_KEY"`
2. The workflow uses EAS CLI to build (`eas build --local`)
3. EAS injects the secret during build time

No changes needed to your workflow file!

## Troubleshooting

### "Command not found: eas"
Use `npx eas-cli` instead of just `eas`

### "Authentication required"
Run `npx eas-cli login` first

### "Secret not found"
Verify with `npx eas-cli env:list`

### Build fails with "REVENUECAT_API_KEY not found"
Make sure:
1. EAS secret is created
2. `eas.json` has the `env` configuration
3. Secret name matches exactly (case-sensitive)

## Summary

✅ `eas.json` updated with env configuration  
🔲 Create EAS secret (run command above)  
🔲 Verify secret created  
🔲 Get Expo token  
🔲 Add token to GitHub Secrets  
🔲 Create GitHub Actions workflow  
🔲 Test build  

---

**After completing these steps, your GitHub Actions will be able to build the app with the RevenueCat API key!** 🎉

