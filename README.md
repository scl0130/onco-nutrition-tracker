# OncoNutrition Tracker

Static multi-page web app for oncology nutrition tracking with profile-aware guidance, daily logging, and evidence-linked recommendations.

## Current App Structure
- `index.html`: Dashboard (primary landing page)
- `tracker.html`: Food logging and daily target management
- `profile.html`: Profile + treatment setup + symptom capture + optional account/auth panel
- `app-main.js`: Main app logic for all three pages
- `sourcesRegistry.js`: Single source of truth for citations (strict allowlist domains)
- `recommendationValidator.js`: Recommendation/source validation on page load
- `recommendations.js`: Policy-based recommendation catalog and trigger logic
- `styles.css`: Shared styles and responsive layout

## Current Features
- 3-page architecture with persistent top navigation (Dashboard, Track Food, Profile)
- Guest mode by default (no login required)
- Optional secure auth with Supabase Email/Password (configured from Profile page)
- User-scoped local storage (guest vs logged-in account data kept separate)
- Profile capture:
  - age, sex, height, weight, activity level
  - cancer type, treatment type, treatment mode
  - kidney dialysis status (kidney cancer context)
  - appetite and recent unintentional weight change
  - expanded symptoms with "No particular symptoms" option
- Dashboard:
  - nutrition status, risk, progress rings, evidence-backed recommendations
  - profile summary card
  - daily weight logging form + weight trend chart
- Tracker:
  - date-specific macro targets + meal logging
  - auto-populate macros from food name + grams
  - live food suggestions dropdown while typing
  - quick-add curated foods
- Food lookup pipeline:
  1. Curated in-app food list
  2. USDA FoodData Central search
  3. OpenFoodFacts fallback
- Profile-based macro target calculation (sex/age/height/weight/activity/treatment-aware)
  - If user manually saves targets for a day, that day is treated as manual override
- Recommendation source policy enforcement:
  - Every recommendation must include sourceIds from `sourcesRegistry.js`
  - Every recommendation card includes expandable `Sources`
  - Validation blocks recommendation rendering if source rules fail
  - References panel groups all sources by evidence type

## Local Run
Open files directly in browser, or run a static server:

```bash
cd /Users/chunglee/Desktop/Project
python3 -m http.server 8081
```

Then open `http://localhost:8081`.

## Secure Auth Setup (Supabase)
Auth is optional. App works in guest mode without this.

1. Create a Supabase project and enable Email/Password auth.
2. Configure allowed URLs in Supabase Authentication settings.
3. On `profile.html`, open "Secure auth configuration (Supabase)" and enter:
   - Supabase URL
   - Supabase anon key
4. Save config, then use Sign up / Log in forms.

## USDA API Key (Optional)
- On `tracker.html`, use "USDA API key (optional)".
- If blank, app uses USDA `DEMO_KEY` (rate-limited).

## Persistence / Storage Notes
- Data is saved in browser `localStorage`.
- Keys are scoped per user id when logged in; guest data is scoped under `guest`.
- Clearing browser storage removes local data.

## Deploy
GitHub Pages workflow is included at `.github/workflows/deploy-pages.yml` and deploys on push to `main`.

## Medical Disclaimer
This app is educational and not medical advice. Patients should consult their oncologist and registered dietitian for individualized recommendations.
