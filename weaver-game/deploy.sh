#!/bin/bash

# The Weaver Game - Quick Deploy Script
# This script helps deploy to Vercel with proper environment variables

echo "🚀 Deploying The Weaver Game to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Please create .env.local with your GEMINI_API_KEY"
    echo ""
    read -p "Do you want to set the API key now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Gemini API Key: " api_key
        echo "GEMINI_API_KEY=$api_key" > .env.local
        echo "✅ Created .env.local"
    else
        echo "❌ Please create .env.local before deploying"
        exit 1
    fi
fi

# Read API key from .env.local
source .env.local
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY not found in .env.local"
    exit 1
fi

echo "📦 Setting up environment variables in Vercel..."
vercel env add GEMINI_API_KEY production <<< "$GEMINI_API_KEY" || echo "⚠️  Environment variable might already exist"

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Click on your project"
echo "3. Go to Settings → Domains"
echo "4. Add domain: weaver.partstrading.com"
echo "5. Add CNAME record in your DNS:"
echo "   Type: CNAME"
echo "   Name: weaver"
echo "   Value: cname.vercel-dns.com"

