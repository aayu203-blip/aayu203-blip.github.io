# Quick Deploy Instructions

## Deploying to partstrading.com/weaver

### Step 1: Deploy Weaver Game

1. **Install Vercel CLI (if needed):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy the Weaver game:**
   ```bash
   cd weaver-game
   vercel login
   vercel env add GEMINI_API_KEY  # Paste your API key when prompted
   vercel --prod
   ```

3. **Copy the deployment URL** (e.g., `weaver-game-abc123.vercel.app`)

### Step 2: Configure Main Site

4. **Update your main site's `vercel.json`** (the partstrading.com project):
   ```json
   {
     "rewrites": [
       {
         "source": "/weaver/:path*",
         "destination": "https://YOUR-WEAVER-URL.vercel.app/weaver/:path*"
       }
     ]
   }
   ```
   Replace `YOUR-WEAVER-URL` with the URL from step 3.

5. **Redeploy your main site:**
   ```bash
   cd path/to/your/main/site
   vercel --prod
   ```

---

## Your New URL

Once deployed and rewrites configured:
**https://partstrading.com/weaver**

---

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.

