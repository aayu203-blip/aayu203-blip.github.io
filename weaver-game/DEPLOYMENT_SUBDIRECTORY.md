# Deploying to partstrading.com/weaver

This guide shows how to deploy The Weaver game as a subdirectory on your main domain.

## Option 1: Deploy as Separate Vercel Project + Rewrites (Recommended)

Since you want `partstrading.com/weaver`, the easiest approach is to deploy the Weaver app as a separate Vercel project and configure your main site to proxy requests.

### Step 1: Deploy Weaver Game

1. **Deploy to Vercel:**
   ```bash
   cd weaver-game
   vercel login
   vercel env add GEMINI_API_KEY  # Add your API key
   vercel --prod
   ```

2. **Note the deployment URL** (e.g., `weaver-game-xyz.vercel.app`)

### Step 2: Configure Main Site Rewrites

Update your main site's `vercel.json` (in the partstrading.com project) to add rewrites:

```json
{
  "rewrites": [
    {
      "source": "/weaver/:path*",
      "destination": "https://weaver-game-xyz.vercel.app/weaver/:path*"
    }
  ]
}
```

Or if you want to handle both the root and all paths:

```json
{
  "rewrites": [
    {
      "source": "/weaver",
      "destination": "https://weaver-game-xyz.vercel.app/weaver"
    },
    {
      "source": "/weaver/:path*",
      "destination": "https://weaver-game-xyz.vercel.app/weaver/:path*"
    }
  ]
}
```

### Step 3: Redeploy Main Site

After updating `vercel.json`, redeploy your main site:
```bash
cd path/to/main/site
vercel --prod
```

---

## Option 2: Deploy as Monorepo (Advanced)

If your main site is also a Next.js app on Vercel, you can use a monorepo structure:

```
partstrading-site/
├── apps/
│   ├── main/          # Your existing site
│   └── weaver/        # The weaver game
└── vercel.json
```

But this requires restructuring your existing site.

---

## Option 3: Use Vercel's Team/Project Structure

1. Deploy weaver-game as a separate project in Vercel
2. In your main site's Vercel project settings, use rewrites to proxy `/weaver` to the weaver project

---

## Important Notes

- The Next.js config already has `basePath: '/weaver'` configured
- All assets and routes will be prefixed with `/weaver`
- The API routes will be at `/weaver/api/adventure`
- Make sure your main site's vercel.json properly rewrites the paths

---

## Testing Locally with Base Path

To test the subdirectory setup locally:

```bash
cd weaver-game
npm run dev
```

Then visit: `http://localhost:3000/weaver`

---

## DNS/SSL

- No DNS changes needed (using existing domain)
- SSL certificate automatically handled by Vercel
- Both sites share the same domain, so no CNAME setup required

