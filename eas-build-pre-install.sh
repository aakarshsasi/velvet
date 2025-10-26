#!/bin/bash

# EAS Build Hook: Verify .env file exists
# This script runs before npm install during EAS builds

set -e  # Exit immediately if any command fails

echo "🔧 EAS Build: Checking for .env file..."

# Check if .env file exists
if [ -f .env ]; then
  echo "✅ .env file exists"
  
  # Verify REVENUECAT_API_KEY is present
  if grep -q "REVENUECAT_API_KEY" .env; then
    echo "✅ REVENUECAT_API_KEY found in .env"
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
    echo "REVENUECAT_API_KEY=${REVENUECAT_API_KEY}" > .env
    echo "✅ .env file created from environment variable"
  else
    echo "❌ ERROR: No .env file and REVENUECAT_API_KEY environment variable not set!"
    exit 1
  fi
fi

echo "✅ .env file ready for build"

