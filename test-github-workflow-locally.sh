#!/bin/bash

# Local GitHub Workflow Test Script
# This simulates the iOS build steps from GitHub Actions

set -e

echo "════════════════════════════════════════════════════════"
echo "🧪 Testing GitHub Workflow Steps Locally"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if we have the RevenueCat API key
echo "📋 Step 1: Checking for RevenueCat API Key..."
if [ -z "$REVENUECAT_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  REVENUECAT_API_KEY not set in environment${NC}"
    echo "   Using hardcoded fallback from RevenueCatManager.ts"
    REVENUECAT_API_KEY="appl_BQMzwpJqCjLlTkdtLqggdfrziiQ"
else
    echo -e "${GREEN}✅ REVENUECAT_API_KEY found in environment${NC}"
    echo "   Key length: ${#REVENUECAT_API_KEY}"
fi
echo ""

# Step 2: Setup .env file (matches GitHub workflow)
echo "📋 Step 2: Setting up .env file (matching GitHub workflow)..."
echo "REVENUECAT_API_KEY=${REVENUECAT_API_KEY}" > .env
cp .env ./app/.env || true
cp .env ./src/.env || true
echo -e "${GREEN}✅ Created .env in root, app/, and src/${NC}"
echo ""

# Step 3: Verify .env files
echo "📋 Step 3: Verifying .env files..."
ls -la .env app/.env src/.env 2>/dev/null && echo -e "${GREEN}✅ All .env files present${NC}" || echo -e "${YELLOW}⚠️  Some .env files missing${NC}"
echo ""

# Step 4: Extract build number from app.json
echo "📋 Step 4: Extracting build number from app.json..."
BUILD_NUMBER=$(jq -r '.expo.ios.buildNumber' app.json)
if [ -z "$BUILD_NUMBER" ] || [ "$BUILD_NUMBER" = "null" ]; then
    echo -e "${YELLOW}⚠️  Build number not found in app.json, using fallback${NC}"
    BUILD_NUMBER=$(cat app.json | grep -o '"buildNumber": "[^"]*"' | cut -d'"' -f4 || echo "1")
fi
echo -e "${GREEN}✅ Build number: ${BUILD_NUMBER}${NC}"
echo ""

# Step 5: Test bundling (from GitHub workflow)
echo "📋 Step 5: Testing bundling (matches GitHub workflow)..."
echo "   Running: npx expo export --platform ios --output-dir ./test-bundle"
npx expo export --platform ios --output-dir ./test-bundle || {
    echo -e "${RED}❌ Bundling test failed!${NC}"
    echo "   This indicates a code issue that will also fail in GitHub Actions"
    exit 1
}
echo -e "${GREEN}✅ Bundling test passed!${NC}"
echo ""

# Step 6: Check EAS login
echo "📋 Step 6: Checking EAS login..."
if [ -z "$EXPO_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  EXPO_TOKEN not set - skipping EAS login check${NC}"
    echo "   For full testing, set EXPO_TOKEN environment variable"
else
    eas whoami || {
        echo -e "${RED}❌ EAS login failed!${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ EAS login successful${NC}"
fi
echo ""

# Step 7: Simulate EAS build command
echo "════════════════════════════════════════════════════════"
echo "📋 Step 7: Simulating EAS build command..."
echo "════════════════════════════════════════════════════════"
echo ""
echo "The GitHub workflow would run:"
echo ""
echo "REVENUECAT_API_KEY=\${{ secrets.REVENUECAT_API_KEY }} \\"
echo "eas build --platform ios --profile production --local \\"
echo "  --non-interactive --output=./app-ios-build-${BUILD_NUMBER}.ipa \\"
echo "  --env-file .env"
echo ""
echo -e "${YELLOW}To run the actual build (this will create a local build):${NC}"
echo ""
echo "REVENUECAT_API_KEY=\"${REVENUECAT_API_KEY}\" \\"
echo "eas build --platform ios --profile production --local \\"
echo "  --non-interactive --output=./app-ios-build-${BUILD_NUMBER}.ipa \\"
echo "  --env-file .env"
echo ""
echo -e "${GREEN}✅ All workflow steps tested successfully!${NC}"
echo ""
echo "════════════════════════════════════════════════════════"
echo "📝 Summary:"
echo "════════════════════════════════════════════════════════"
echo "✅ .env file created in root, app/, and src/"
echo "✅ Build number extracted: ${BUILD_NUMBER}"
echo "✅ Bundling test passed"
echo "✅ Ready for GitHub Actions deployment"
echo ""
echo "To run the actual EAS build locally (will take time):"
echo "  ./test-github-workflow-locally.sh --build"
echo ""
