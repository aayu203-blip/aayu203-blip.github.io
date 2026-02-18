#!/bin/bash

# Script to set Vercel environment variables via API
# This requires Vercel CLI or can be run manually in dashboard

echo "Setting up Vercel environment variables..."
echo ""
echo "To set the environment variable in Vercel:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project (aayu203-blip.github.io)"
echo "3. Go to Settings → Environment Variables"
echo "4. Add:"
echo "   Key: GEMINI_API_KEY"
echo "   Value: [YOUR_API_KEY_HERE] (get from Google AI Studio)"
echo "   Environments: Production, Preview, Development"
echo "5. Click Save"
echo ""
echo "OR use Vercel CLI:"
echo "  vercel env add GEMINI_API_KEY production"
echo "  (paste: [YOUR_API_KEY_HERE] - get from Google AI Studio)"
echo ""


