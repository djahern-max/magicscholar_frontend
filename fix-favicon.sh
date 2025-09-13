#!/bin/bash
# Run this from your magicscholar_frontend directory

echo "🔍 Checking for conflicting favicon files..."

# Check for favicon in public directory
if [ -f "public/favicon.ico" ]; then
    echo "✅ Found favicon.ico in public directory"
else
    echo "❌ No favicon.ico found in public directory"
fi

# Check for any favicon pages in src/app
find src/app -name "*favicon*" -type f
if [ $? -eq 0 ]; then
    echo "⚠️  Found favicon-related files in app directory - these might conflict"
fi

# Clean up any duplicate or conflicting favicon files
echo "🧹 Cleaning up potential conflicts..."

# Remove any favicon route handlers that might exist
rm -f src/app/favicon.ico/route.ts 2>/dev/null
rm -f src/app/favicon.ico/page.tsx 2>/dev/null
rm -f src/app/favicon.ico.tsx 2>/dev/null

# Ensure we have a proper favicon in public
if [ ! -f "public/favicon.ico" ]; then
    echo "📥 Creating default favicon.ico..."
    # You can replace this with your actual favicon file
    touch public/favicon.ico
fi

echo "✅ Favicon cleanup complete!"
