#!/bin/bash

# Script to increment iOS and Android build numbers
# Updates: app.json (iOS buildNumber & Android versionCode) and Info.plist CFBundleVersion

set -e

echo "📱 Incrementing build numbers..."

# Get current iOS build number from app.json
CURRENT_IOS_BUILD=$(cat app.json | grep -o '"buildNumber": "[^"]*"' | cut -d'"' -f4)

if [ -z "$CURRENT_IOS_BUILD" ]; then
    echo "❌ Error: Could not find buildNumber in app.json"
    exit 1
fi

# Get current Android version code from app.json
CURRENT_ANDROID_BUILD=$(cat app.json | grep -o '"versionCode": [0-9]*' | grep -o '[0-9]*')

if [ -z "$CURRENT_ANDROID_BUILD" ]; then
    echo "❌ Error: Could not find versionCode in app.json"
    exit 1
fi

# Increment build numbers
NEW_IOS_BUILD=$((CURRENT_IOS_BUILD + 1))
NEW_ANDROID_BUILD=$((CURRENT_ANDROID_BUILD + 1))

echo "📱 Current iOS build: $CURRENT_IOS_BUILD → New: $NEW_IOS_BUILD"
echo "🤖 Current Android build: $CURRENT_ANDROID_BUILD → New: $NEW_ANDROID_BUILD"

# Update iOS build number in app.json
sed -i '' "s/\"buildNumber\": \"$CURRENT_IOS_BUILD\"/\"buildNumber\": \"$NEW_IOS_BUILD\"/g" app.json

# Update Android version code in app.json
sed -i '' "s/\"versionCode\": $CURRENT_ANDROID_BUILD/\"versionCode\": $NEW_ANDROID_BUILD/g" app.json

# Update Info.plist CFBundleVersion - specifically target the line after CFBundleVersion key
sed -i '' "/<key>CFBundleVersion<\/key>/{n;s/<string>.*<\/string>/<string>$NEW_IOS_BUILD<\/string>/;}" ios/velvet/Info.plist

echo "✅ Build numbers updated:"
echo "   - iOS: $CURRENT_IOS_BUILD → $NEW_IOS_BUILD"
echo "   - Android: $CURRENT_ANDROID_BUILD → $NEW_ANDROID_BUILD"
echo "📝 Updated files:"
echo "   - app.json (iOS buildNumber & Android versionCode)"
echo "   - ios/velvet/Info.plist (CFBundleVersion)"

