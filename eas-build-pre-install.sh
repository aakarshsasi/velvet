#!/bin/bash

# EAS Build Hook: Verify .env file exists
# This script runs before npm install during EAS builds

set -e  # Exit immediately if any command fails

echo "🔧 EAS Build: Checking for .env file..."
echo "📍 Current directory: $(pwd)"
echo "📍 Files in directory: $(ls -la | grep -E '\.env' || echo 'No .env files')"
echo "📍 Environment variable check: $([[ -n "$REVENUECAT_API_KEY" ]] && echo "SET (length: ${#REVENUECAT_API_KEY})" || echo "NOT SET")"

# Check if .env file exists
if [ -f .env ]; then
  echo "✅ .env file exists"
  
  # Verify REVENUECAT_API_KEY is present
  if grep -q "REVENUECAT_API_KEY" .env; then
    echo "✅ REVENUECAT_API_KEY found in .env"
    API_KEY_VALUE=$(grep REVENUECAT_API_KEY .env | cut -d'=' -f2)
    echo "   Key length: ${#API_KEY_VALUE} characters"
    echo "   Key starts with: ${API_KEY_VALUE:0:10}"
    echo "   Key ends with: ${API_KEY_VALUE: -10}"
    grep "REVENUECAT_API_KEY" .env | sed 's/REVENUECAT_API_KEY=\(.\{10\}\).*$/REVENUECAT_API_KEY=\1***/' || true
  else
    echo "❌ ERROR: REVENUECAT_API_KEY not found in .env file"
    exit 1
  fi
else
  echo "⚠️  .env file not found - checking for environment variable..."
  
  # Try to create from environment variable if available
  if [ -n "$REVENUECAT_API_KEY" ]; then
    echo "✅ REVENUECAT_API_KEY found in environment (length: ${#REVENUECAT_API_KEY} characters)"
    echo "   Key starts with: ${REVENUECAT_API_KEY:0:10}"
    echo "   Key ends with: ${REVENUECAT_API_KEY: -10}"
    echo "REVENUECAT_API_KEY=${REVENUECAT_API_KEY}" > .env
    echo "✅ .env file created from environment variable"
  else
    echo "❌ ERROR: No .env file and REVENUECAT_API_KEY environment variable not set!"
    echo "   This usually means:"
    echo "   1. The .env file was not created in the previous step"
    echo "   2. The REVENUECAT_API_KEY secret is not configured in GitHub"
    echo "   3. The env: section in eas.json is not set up correctly"
    exit 1
  fi
fi

echo "✅ .env file ready for build"
echo "📄 Final .env file contents (masked):"
cat .env | sed 's/\(.\{10\}\).*/\1***/' || true

