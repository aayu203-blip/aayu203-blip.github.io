# Quick Setup Guide

## Steps to Run

1. **Navigate to the project directory:**
   ```bash
   cd weaver-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   # Create the file
   touch .env.local
   ```

   Then add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   **To get your API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in and create a new API key
   - Copy the key into `.env.local`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
weaver-game/
├── app/
│   ├── api/
│   │   └── adventure/
│   │       └── route.ts          # API endpoint for Gemini integration
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main game interface
├── lib/
│   ├── systemPrompt.ts           # The Weaver system prompt
│   └── visuals.ts                # Mode styles mapping
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Key Features Implemented

✅ Next.js 14 with App Router and TypeScript  
✅ Tailwind CSS for styling  
✅ Framer Motion for smooth animations  
✅ Google Gemini AI integration (gemini-1.5-flash)  
✅ 5 distinct world modes with visual themes  
✅ Text animations (letter-by-letter)  
✅ Scattered choice buttons  
✅ Stats tracking (Attention, Restraint, Resonance)  
✅ Ending sequence with "Rest" button  

## Troubleshooting

- **API Key not working?** Make sure `.env.local` is in the root directory and the key is correct
- **Build errors?** Run `npm install` again to ensure all dependencies are installed
- **Port already in use?** Next.js will automatically try the next available port

