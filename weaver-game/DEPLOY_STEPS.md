# 🚀 Deployment Steps for Weaver Game

## Your API Key is Ready!
API Key: `AIzaSyBBb94IbmgKmnRG6FJRcTlnfP2NQZrnMU0`

## Step 1: Deploy Weaver Game to Vercel

### Option A: Via Vercel Dashboard (Easiest - Recommended)

1. **Push to GitHub:**
   ```bash
   cd weaver-game
   git init
   git add .
   git commit -m "Add Weaver game"
   git remote add origin https://github.com/YOUR_USERNAME/weaver-game.git
   git push -u origin main
   ```
   (Create the repo on GitHub first if needed)

2. **Deploy on Vercel:**
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `weaver-game` repository
   - Click "Import"

3. **Configure Project:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add:
     - **Name:** `GEMINI_API_KEY`
     - **Value:** `AIzaSyBBb94IbmgKmnRG6FJRcTlnfP2NQZrnMU0`
   - Select: ✅ Production, ✅ Preview, ✅ Development
   - Click "Add"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - **Copy the deployment URL** (e.g., `weaver-game-abc123.vercel.app` or just `weaver-game.vercel.app`)

### Option B: Via Vercel CLI

```bash
cd weaver-game
npm install -g vercel
vercel login
vercel env add GEMINI_API_KEY production
# When prompted, paste: AIzaSyBBb94IbmgKmnRG6FJRcTlnfP2NQZrnMU0
vercel env add GEMINI_API_KEY preview
# Paste the same key
vercel env add GEMINI_API_KEY development
# Paste the same key
vercel --prod
```

## Step 2: Update Main Site's vercel.json

I've already updated your main site's `vercel.json` file at:
`aayu203-blip.github.io/vercel.json`

**IMPORTANT:** After deploying the weaver game, you'll need to update the destination URL in the rewrites. 

Replace `weaver-game.vercel.app` with your actual deployment URL from Step 1.

The current rewrites look like:
```json
"rewrites": [
  {
    "source": "/weaver",
    "destination": "https://weaver-game.vercel.app/weaver"
  },
  {
    "source": "/weaver/:path*",
    "destination": "https://weaver-game.vercel.app/weaver/:path*"
  }
]
```

## Step 3: Redeploy Main Site

After updating the vercel.json with the correct weaver deployment URL:

```bash
cd aayu203-blip.github.io
git add vercel.json
git commit -m "Add weaver game rewrites"
git push
```

Vercel will auto-deploy with the new rewrites.

## Step 4: Test!

Visit: **https://partstrading.com/weaver** (or your main domain/weaver)

---

## Quick Checklist

- [ ] Deploy weaver-game to Vercel
- [ ] Add GEMINI_API_KEY environment variable
- [ ] Note the weaver deployment URL
- [ ] Update main site's vercel.json with correct weaver URL
- [ ] Commit and push main site changes
- [ ] Test at partstrading.com/weaver

---

## Troubleshooting

**If /weaver returns 404:**
- Check that the weaver game is deployed and accessible
- Verify the destination URL in vercel.json matches your weaver deployment
- Make sure you redeployed the main site after updating vercel.json

**If API calls fail:**
- Verify GEMINI_API_KEY is set in Vercel environment variables
- Check browser console for errors
- Ensure the API key has proper permissions

