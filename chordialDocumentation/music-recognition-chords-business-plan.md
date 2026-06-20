# Business Plan: ChordFinder Studio

## Concept

ChordFinder Studio is a mobile-first web app for musicians who hear a song, record a short clip, identify the title, and immediately see a playable chord chart. The initial product focuses on guitar, piano, and worship/band-practice workflows where speed matters more than full sheet music.

The prototype in this folder demonstrates the core flow: record or upload audio, recognize a song, load a chord chart, transpose it, and print it.

## Product

### Core Workflow

1. User records 8-15 seconds of music or uploads a recorded clip.
2. Recognition service returns title, artist, album, identifiers, and confidence.
3. App searches a licensed/public-domain chord chart source by title and artist.
4. User sees the chart in-app with transpose, print, save, and setlist tools.

### MVP Features

- Audio recording and upload.
- Song recognition through AudD or ACRCloud.
- Chord chart display using ChordPro-style rendering.
- Transpose controls.
- Provider links when an exact chart cannot be legally embedded.
- User library for saved charts.
- Manual correction when recognition returns the wrong title.

### Later Features

- Setlists, capo suggestions, Nashville numbers, tempo and key detection.
- User-imported ChordPro files.
- Band sharing and rehearsal mode.
- Partner catalog for fully licensed charts.
- AI-assisted chord extraction for songs without charts, clearly labeled as generated.

## Market

The target users are hobby musicians, church bands, cover bands, music teachers, and beginner guitar/piano players. Their current workflow is fragmented: identify the song in one app, search the web in another, then fight through inconsistent chord pages. ChordFinder Studio wins by collapsing that into one fast, practice-oriented flow.

Recognition vendors make the technical launch feasible. AudD states that it recognizes audio files, recordings, and streams against a 160M-song database and lists public pricing beginning at $5 per 1,000 requests with 300 free requests. ACRCloud advertises music recognition against a database of over 150M tracks and a 14-day free trial.

## Business Model

### Freemium

- Free: 10 recognitions/month, public-domain charts, manual search links.
- Plus: $5.99/month for 200 recognitions, saved charts, transpose, setlists.
- Pro Band: $14.99/month for shared setlists, rehearsal notes, PDF export.

### B2B

- Music teachers: classroom licenses.
- Churches and rehearsal studios: group accounts.
- API/white-label: recognition-to-chart workflow for learning apps.

### Unit Economics

Using AudD's public pay-as-you-go price of $5 per 1,000 requests, recognition costs about $0.005 per lookup before volume discounts. At $5.99/month, a user consuming 100 recognitions/month creates roughly $0.50 in direct recognition cost, leaving room for payment fees, hosting, support, and content licensing.

## Content And Legal Strategy

Chord charts and lyrics can be copyrighted, even when they are freely visible online. The product should not scrape or republish copyrighted charts without permission. The safest launch path is:

- Bundle public-domain/traditional charts for demo and free use.
- Let users import their own ChordPro charts.
- Link out to free chart pages when embedding is not licensed.
- Negotiate catalog partnerships for in-app display.
- For generated charts, show chords without copied lyrics unless rights are cleared.

This approach keeps the app useful while reducing takedown and platform-review risk.

## Go-To-Market

### Beachhead

Start with guitarists and worship-band musicians because they search for chord charts frequently, value transpose/capo tools, and share setlists.

### Channels

- Short videos: "hear song, get chart in 10 seconds."
- SEO pages for public-domain and traditional songs.
- Music teacher referrals.
- Church musician communities.
- Integrations with ChordPro, Planning Center-style workflows, and PDF export.

### Launch Milestones

- Month 1: Browser MVP, recognition provider integration, public-domain chart library.
- Month 2: Accounts, saved charts, setlists, analytics, payment testing.
- Month 3: Mobile polish, teacher/church pilot, legal review of chart sourcing.
- Month 4-6: Licensed catalog partnerships and AI chord extraction beta.

## Operations

### Technical Stack

- Frontend: responsive web app/PWA.
- Backend: recognition proxy, chart-source adapters, user library, billing.
- Recognition: AudD for quick MVP; evaluate ACRCloud for scale, accuracy, and commercial terms.
- Chart format: ChordPro internally, because it is text-based and supports metadata, sections, transpose, and print/export workflows.

### Key Metrics

- Recognition success rate.
- Chart match rate.
- Time from recording to chart.
- Free-to-paid conversion.
- Monthly recognitions per paid user.
- Saved charts and setlists per active user.
- Takedown/content complaint rate.

## Risks

- Content rights: mitigate with licensed charts, public-domain content, imports, and link-out fallback.
- Recognition accuracy: allow manual correction and compare vendors.
- API cost spikes: throttle free usage and negotiate volume pricing.
- Browser recording limitations: ship a PWA first, native apps later if retention supports it.
- Chord quality variance: support ratings, edits, and verified charts.

## Funding Need

An efficient MVP can be built by a small team:

- 1 full-stack engineer.
- 1 product/design generalist.
- Part-time music content/legal support.

Initial budget target: $75K-$150K for 4-6 months, covering development, recognition usage, hosting, payment setup, legal review, and acquisition tests.

## Recommendation

Build the MVP around legal chart handling from day one. The strongest wedge is not "Shazam plus scraped chords"; it is a trustworthy musician workflow that recognizes a song, finds the best legally available chart path, and turns it into a rehearsal-ready tool.

## Sources Checked

- AudD Music Recognition API: https://audd.io/
- ACRCloud Music Recognition: https://www.acrcloud.com/music-recognition/
- ChordPro format overview: https://www.chordpro.org/
