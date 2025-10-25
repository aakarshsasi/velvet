#!/bin/bash

# Setup EAS Secret for RevenueCat
# This script helps you set up the RevenueCat API key as an EAS secret

set -e

echo "🔐 EAS Secret Setup for RevenueCat"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if eas-cli is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}Error: npx not found. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking EAS login status...${NC}"
if npx eas-cli whoami &> /dev/null; then
    echo -e "${GREEN}✓ Already logged in to EAS${NC}"
    npx eas-cli whoami
else
    echo -e "${RED}✗ Not logged in to EAS${NC}"
    echo -e "${BLUE}Logging in...${NC}"
    npx eas-cli login
fi

echo ""
echo -e "${BLUE}Step 2: Creating EAS environment variable...${NC}"
echo "This will store your RevenueCat API key securely on EAS servers."
echo ""

# Create the secret
npx eas-cli env:create \
  --name REVENUECAT_API_KEY \
  --value appl_BQMzwpJqCjLlTkdtLqggdfrziiQ \
  --scope project

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ EAS secret created successfully!${NC}"
else
    echo ""
    echo -e "${RED}✗ Failed to create EAS secret${NC}"
    echo "This might be because the secret already exists."
    echo "You can check existing secrets with: npx eas-cli env:list"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Verifying secret...${NC}"
npx eas-cli env:list

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Get your Expo token: npx eas-cli token:create"
echo "2. Add EXPO_TOKEN to GitHub Secrets (Settings → Secrets → Actions)"
echo "3. Push to GitHub to trigger the workflow"
echo ""
echo "Your builds will now have access to the RevenueCat API key! 🎉"

