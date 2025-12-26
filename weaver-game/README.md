# The Weaver

A quiet, surreal, text-based narrative experience built with Next.js 14, TypeScript, and Tailwind CSS.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

3. **Create `.env.local` file:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## How It Works

The Weaver is a narrative game that adapts to your choices through five distinct world modes:

- **DOMESTIC**: High restraint, ordinary spaces with subtle magic
- **LIMINAL**: Balanced, threshold spaces where time behaves oddly
- **MYTHIC**: High resonance, ancient landscapes with quiet wonder
- **ARCHIVAL**: High attention, bookstores and memory structures
- **COSMIC STILLNESS**: All stats high, vast night skies and silence

Your choices affect three stats (Attention, Restraint, Resonance) which determine which mode you experience.

## Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Google Gemini AI (gemini-1.5-flash)
- clsx & tailwind-merge (styling utilities)

