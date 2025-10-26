#!/bin/bash

# EAS Build Hook: Generate .env file from environment variables
# This script runs before npm install during EAS builds

set -e  # Exit immediately if any command fails

echo "🔧 EAS Build: Creating .env file from environment variables..."

# Check if REVENUECAT_API_KEY is set
if [ -z "$REVENUECAT_API_KEY" ]; then
  echo "❌ ERROR: REVENUECAT_API_KEY environment variable is not set!"
  echo "Please ensure the EAS secret is configured:"
  echo "  npx eas-cli env:create --name REVENUECAT_API_KEY --value <your-key> --scope project --environment production"
  exit 1
fi

echo "✅ REVENUECAT_API_KEY found (length: ${#REVENUECAT_API_KEY} characters)"

# Create .env file
cat > .env << EOF
REVENUECAT_API_KEY=${REVENUECAT_API_KEY}
EOF

echo "✅ .env file created successfully"
echo "📋 Contents verification:"
grep -c "REVENUECAT_API_KEY" .env && echo "   ✓ REVENUECAT_API_KEY present in .env"

