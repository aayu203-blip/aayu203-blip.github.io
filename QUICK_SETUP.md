# Quick Setup Guide - Follow These Steps

## You're Creating a NEW Project for Weaver Game

### Right Now in Vercel Dashboard:

1. **Project Name**: Change to `weaver-game` (or keep default, it's fine)

2. **Root Directory**: Change from `./` to `weaver-game`
   - Click on "./"
   - Type: `weaver-game`
   - This tells Vercel to build the Next.js app from that folder

3. **Framework Preset**: Should auto-detect "Next.js" - if not, select "Next.js"

4. **Environment Variables**: 
   - Click "Environment Variables" section
   - Click "Add"
   - Key: `GEMINI_API_KEY`
   - Value: `AIzaSyBBb94IbmgKmnRG6FJRcTlnfP2NQZrnMU0`
   - Check: Production, Preview, Development
   - Click "Add"

5. **Click "Deploy"** button

6. **Wait for deployment** (2-3 minutes)

7. **Copy the deployment URL** (e.g., `weaver-game-abc123.vercel.app`)

## Next Step (After Deployment):

You'll need to add rewrites to your MAIN project (the one connected to partstrading.com) to route `/weaver` to this new deployment.

But first, let's get this deployed! Follow the steps above. ✅

