# ChordFinder Studio - Vercel Deployment Guide

## What You Have

A fully functional Next.js app implementing the MVP of ChordFinder Studio with:
- ✅ Audio recording from microphone
- ✅ Audio file upload
- ✅ Mock song recognition (ready for API integration)
- ✅ Chord chart display with transpose functionality
- ✅ Save/load charts from local library
- ✅ Print-ready chord layouts
- ✅ Responsive mobile-first design

## Quick Start (Local)

### 1. Set up the project structure
```
chordfinder-studio/
├── app/
│   ├── page.jsx
│   ├── layout.jsx
│   └── globals.css
├── components/
│   └── ChordFinderStudio.jsx
├── public/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── .gitignore
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run locally
```bash
npm run dev
```
Visit `http://localhost:3000`

## Deploy to Vercel

### Option A: Git + Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/chordfinder-studio.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework preset: **Next.js**
   - Click "Deploy"

### Option B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts. Your app will be live in ~60 seconds.

## Next Steps: Integrating Real APIs

### 1. Add Song Recognition (AudD or ACRCloud)

**For AudD:**
```bash
npm install audd.io
```

Update `components/ChordFinderStudio.jsx`, in the `recognizeSong()` function:

```javascript
const recognizeSong = async () => {
  if (!audioBlob) {
    setError('No audio to recognize');
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('api_token', process.env.NEXT_PUBLIC_AUDD_API_KEY);

    const response = await fetch('https://api.audd.io/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.result) {
      const result = {
        title: data.result.title,
        artist: data.result.artist,
        confidence: data.result.score / 100,
        id: `${data.result.title.toLowerCase()}-${data.result.artist.toLowerCase()}`.replace(/\s+/g, '-'),
      };
      setRecognitionResult(result);
      // Load chart...
    } else {
      setError('Song not recognized. Try another clip.');
    }
  } catch (err) {
    setError('Recognition failed. Try again.');
  } finally {
    setLoading(false);
  }
};
```

**Environment Setup:**
1. Get API key from https://audd.io/
2. Create `.env.local`:
   ```
   NEXT_PUBLIC_AUDD_API_KEY=your_api_key_here
   ```
3. Add to Vercel Dashboard:
   - Settings → Environment Variables
   - Key: `NEXT_PUBLIC_AUDD_API_KEY`
   - Value: Your API key

### 2. Add Real Chord Database

Replace the `MOCK_CHARTS` object with API calls to:
- **Ultimate Guitar** (API or scraping with permission)
- **Chordify** (API partner)
- **Chordify Charts API** (commercial license)

Example structure:
```javascript
const fetchChordChart = async (title, artist) => {
  const response = await fetch(
    `/api/charts?title=${title}&artist=${artist}`
  );
  return response.json();
};
```

Create `app/api/charts/route.js`:
```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  // Call your chord database API here
  // (Ultimate Guitar, Chordify, etc.)

  return Response.json({ /* chart data */ });
}
```

### 3. Add User Authentication & Storage

Install Supabase (free tier):
```bash
npm install @supabase/supabase-js
```

Create `lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

Add to Vercel env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then in your app:
```javascript
// Save to database instead of localStorage
const saveChart = async () => {
  const { data, error } = await supabase
    .from('saved_charts')
    .insert([{ user_id: user.id, ...currentChart, transpose }]);
  if (!error) setSavedCharts([...savedCharts, data[0]]);
};
```

### 4. Add Payment (Stripe)

```bash
npm install @stripe/stripe-js
```

Create a subscription endpoint in `app/api/create-checkout/route.js` for Plus ($5.99/mo) and Pro Band ($14.99/mo) tiers.

## Project Structure After Completion

```
chordfinder-studio/
├── app/
│   ├── layout.jsx
│   ├── page.jsx
│   ├── globals.css
│   └── api/
│       ├── charts/route.js
│       ├── recognize/route.js
│       └── checkout/route.js
├── components/
│   ├── ChordFinderStudio.jsx
│   ├── Recording.jsx
│   ├── ChartDisplay.jsx
│   └── Library.jsx
├── lib/
│   ├── supabase.js
│   ├── stripe.js
│   └── recognition.js
├── public/
│   └── favicon.ico
├── .env.local
├── package.json
├── tailwind.config.js
└── vercel.json (optional, for advanced config)
```

## Key Milestones

| Timeline | Task |
|----------|------|
| Week 1 | Deploy MVP with mock data to Vercel ✅ |
| Week 2 | Integrate AudD/ACRCloud recognition |
| Week 3 | Add real chord database API |
| Week 4 | User auth + saved charts database |
| Week 5 | Stripe payments for freemium model |
| Week 6 | Polish, SEO, launch |

## Important Notes

- **Chord Chart Licensing**: Before adding real charts, ensure legal compliance (use licensed APIs, public domain, or with explicit permission)
- **Audio Processing**: For production, consider processing on a backend server for security
- **Mobile PWA**: Add `manifest.json` for offline support
- **Analytics**: Integrate Vercel Analytics or Segment

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [AudD API](https://audd.io/docs)
- [ACRCloud API](https://www.acrcloud.com/music-recognition/)
- [ChordPro Format](https://www.chordpro.org/)

## Support

Questions? Check:
1. Your `.env.local` variables are set
2. API keys are valid and not rate-limited
3. Vercel logs: `vercel logs <deployment-url>`
4. Local dev: `npm run dev` + browser console

Good luck! 🎸
