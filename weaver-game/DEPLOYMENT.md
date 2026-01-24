# Deployment Guide - The Weaver Game

This guide will help you deploy The Weaver game to `partstrading.com/weaver`.

## Configuration

The project is configured with `basePath: '/weaver'` in `next.config.js`, so it will work at `partstrading.com/weaver`.

## Option 1: Deploy as Separate Vercel Project + Rewrites (Recommended)

**URL:** `partstrading.com/weaver`

This is the easiest method - deploy the Weaver app separately and configure your main site to proxy requests.

### Steps:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to the project:**
   ```bash
   cd weaver-game
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Set up environment variable in Vercel:**
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste your Gemini API key when prompted
   # Select: Production, Preview, and Development
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

6. **Note the deployment URL** from Vercel (e.g., `weaver-game-abc123.vercel.app`)

7. **Configure your main site** to proxy `/weaver` requests:
   
   Update your main site's `vercel.json` (the one for partstrading.com):
   
   ```json
   {
     "rewrites": [
       {
         "source": "/weaver/:path*",
         "destination": "https://weaver-game-abc123.vercel.app/weaver/:path*"
       }
     ]
   }
   ```
   
   Replace `weaver-game-abc123.vercel.app` with your actual deployment URL.

8. **Redeploy your main site:**
   ```bash
   cd path/to/your/main/site
   vercel --prod
   ```

---

## Option 2: Deploy via GitHub + Vercel

1. **Push to GitHub:**
   ```bash
   cd weaver-game
   git init
   git add .
   git commit -m "Initial commit: The Weaver game"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy
   - Note the deployment URL

3. **Configure main site rewrites** (same as Option 1, step 7-8)

---

## Quick Deploy (One Command)

If you just want to test it quickly:

```bash
cd weaver-game
vercel --prod --env GEMINI_API_KEY=your_api_key_here
```

Then add the domain in Vercel dashboard.

---

## Environment Variables

Make sure to set these in Vercel:
- `GEMINI_API_KEY` - Your Google Gemini API key

You can set them via:
- Vercel Dashboard → Project → Settings → Environment Variables
- Or via CLI: `vercel env add GEMINI_API_KEY`

---

## Post-Deployment Checklist

- [ ] Verify environment variable is set correctly in Vercel
- [ ] Note the Weaver app's Vercel deployment URL
- [ ] Update main site's vercel.json with rewrites
- [ ] Redeploy main site
- [ ] Test the game loads at `partstrading.com/weaver`
- [ ] Verify API calls work (check browser console)
- [ ] Test on mobile device
- [ ] Update any documentation with the new URL

---

## Troubleshooting

**Issue: API calls failing**
- Check that `GEMINI_API_KEY` is set in Vercel environment variables
- Verify the API key is correct and has permissions

**Issue: 404 on /weaver path**
- Verify rewrites are configured correctly in main site's vercel.json
- Check that the destination URL matches your Weaver deployment URL
- Make sure you redeployed the main site after adding rewrites
- Check Vercel function logs for rewrite errors

**Issue: Build fails**
- Check `package.json` has all dependencies
- Verify TypeScript configuration is correct
- Check build logs in Vercel dashboard

