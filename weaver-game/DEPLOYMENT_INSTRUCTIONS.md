# Weaver Game Deployment Instructions

## ✅ Code is in the Repository

The weaver-game has been added to the main repository at `aayu203-blip.github.io`.

## Configure Vercel Project Settings

Since `partstrading.com` is connected to this repository, you need to configure Vercel to handle the Next.js app:

### Option 1: Configure in Vercel Dashboard (Recommended)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select the `aayu203-blip.github.io` project (or the project connected to partstrading.com)
3. Go to **Settings** → **General**
4. Scroll to **Build & Development Settings**
5. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `weaver-game`
   - **Build Command**: `npm run build` (leave default)
   - **Output Directory**: `.next` (leave default)
   - **Install Command**: `npm install` (leave default)

6. Go to **Settings** → **Environment Variables**
7. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyBBb94IbmgKmnRG6FJRcTlnfP2NQZrnMU0`
   - Select: ✅ Production, ✅ Preview, ✅ Development
   - Click **Save**

8. Go to **Settings** → **Rewrites**
   - Add rewrite:
     - **Source**: `/weaver`
     - **Destination**: `/weaver-game`
   - Add rewrite:
     - **Source**: `/weaver/:path*`
     - **Destination**: `/weaver-game/:path*`

9. **Redeploy** the project (or push a new commit to trigger auto-deploy)

### Option 2: Use vercel.json (Alternative)

If the dashboard approach doesn't work, we can update vercel.json with proper configuration for handling both static files and the Next.js app.

## After Deployment

Once configured and deployed, the weaver game will be available at:
**https://partstrading.com/weaver**

## Troubleshooting

- If `/weaver` returns 404, check that the Root Directory is set to `weaver-game` in Vercel settings
- If API calls fail, verify the `GEMINI_API_KEY` environment variable is set
- Check Vercel build logs to ensure the Next.js app builds successfully

