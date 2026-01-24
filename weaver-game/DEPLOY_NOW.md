# 🚀 Deploy The Weaver Game NOW

## Easiest Method: Vercel Dashboard (No CLI Needed!)

### Step 1: Push to GitHub (5 minutes)

1. **Initialize git repository:**
   ```bash
   cd weaver-game
   git init
   git add .
   git commit -m "Initial commit: The Weaver game"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `weaver-game` (or any name you prefer)
   - Don't initialize with README
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/weaver-game.git
   git push -u origin main
   ```
   (Replace YOUR_USERNAME with your GitHub username)

### Step 2: Deploy on Vercel (3 minutes)

1. **Go to Vercel:**
   - Visit: https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `weaver-game` repository
   - Click "Import"

2. **Configure Project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (should be default)
   - **Output Directory:** `.next` (should be default)

3. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add new variable:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** (paste your Gemini API key here)
   - Select: ✅ Production, ✅ Preview, ✅ Development
   - Click "Add"

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - **Copy the deployment URL** (e.g., `weaver-game-abc123.vercel.app`)

### Step 3: Configure Main Site (2 minutes)

1. **Go to your main site's repository/folder** (the partstrading.com site)

2. **Update `vercel.json`:**
   
   Add this to your existing `vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/weaver",
         "destination": "https://YOUR-WEAVER-URL.vercel.app/weaver"
       },
       {
         "source": "/weaver/:path*",
         "destination": "https://YOUR-WEAVER-URL.vercel.app/weaver/:path*"
       }
     ]
   }
   ```
   
   Replace `YOUR-WEAVER-URL` with the actual URL from Step 2.

3. **Commit and push:**
   ```bash
   git add vercel.json
   git commit -m "Add weaver game rewrite"
   git push
   ```

4. **Vercel will auto-deploy** your main site with the new rewrites

### Step 4: Test!

Visit: **https://partstrading.com/weaver**

---

## Alternative: If you have Node.js/npm available

If you have Node.js installed, you can use the CLI method:

```bash
cd weaver-game
npm install -g vercel
vercel login
vercel env add GEMINI_API_KEY  # Paste your key when prompted
vercel --prod
```

Then follow Step 3 above to configure the main site.

---

## Need Your Gemini API Key?

Get it here: https://makersuite.google.com/app/apikey

