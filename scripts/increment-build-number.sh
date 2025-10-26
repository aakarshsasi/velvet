#!/bin/bash

# Script to increment iOS build number in app.json and Info.plist
# This ensures each build has a unique build number

set -e

echo "📱 Incrementing build number..."

# Get current build number from app.json
CURRENT_BUILD=$(cat app.json | grep -o '"buildNumber": "[^"]*"' | cut -d'"' -f4)

if [ -z "$CURRENT_BUILD" ]; then
    echo "❌ Error: Could not find buildNumber in app.json"
    exit 1
fi

# Increment build number
NEW_BUILD=$((CURRENT_BUILD + 1))

echo "Current build: $CURRENT_BUILD → New build: $NEW_BUILD"

# Update app.json
sed -i '' "s/\"buildNumber\": \"$CURRENT_BUILD\"/\"buildNumber\": \"$NEW_BUILD\"/g" app.json

# Update Info.plist
sed -i '' "s/<string>$CURRENT_BUILD<\/string>/<string>$NEW_BUILD<\/string>/g" ios/velvet/Info.plist

echo "✅ Build number updated to $NEW_BUILD"
echo "📝 Updated files:"
echo "   - app.json"
echo "   - ios/velvet/Info.plist"

