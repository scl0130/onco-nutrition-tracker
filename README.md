# OncoNutrition Tracker (MVP)

Website MVP for macro/diet tracking across 10 common cancers with:
- `on chemo` and `off chemo` recommendation modes
- Kidney cancer `on dialysis` and `off dialysis` mode
- Per-recommendation evidence citations
- Daily macro tracking with local browser storage

## Run
Open `index.html` directly in a browser, or run:

```bash
cd /Users/chunglee/Desktop/Project
python3 -m http.server 8081
```

Then open `http://localhost:8081`.

If refresh shows "site cannot be reached", the local server process is not running. Start it again with the command above.

## Publish (public URL)
For a stable URL, deploy this static folder to Netlify:
1. Go to https://app.netlify.com/drop
2. Drag and drop the `/Users/chunglee/Desktop/Project` folder.
3. Netlify returns a public URL (you can later set a custom domain in Site settings).

## Publish with GitHub Pages
This project includes a workflow at `.github/workflows/deploy-pages.yml` that deploys on every push to `main`.

1. Create a new empty GitHub repo (for example: `onco-nutrition-tracker`).
2. Run:

```bash
cd /Users/chunglee/Desktop/Project
git init
git add .
git commit -m "Initial site with GitHub Pages deploy"
git branch -M main
git remote add origin https://github.com/<your-username>/onco-nutrition-tracker.git
git push -u origin main
```

3. In the GitHub repo:
   - Go to `Settings` -> `Pages`
   - Under Build and deployment, set `Source` to `GitHub Actions`
4. Open the `Actions` tab and confirm the deploy workflow succeeds.
5. Your site URL will be:
   - `https://<your-username>.github.io/onco-nutrition-tracker/`

## Medical disclaimer
This app is educational and not medical advice. Patients should consult their oncologist, renal team, and registered dietitian for individualized recommendations.

## Data model
- Recommendation/source data: `recommendations.js`
- UI behavior and tracking logic: `app.js`

## Source policy
Current recommendations cite government and/or peer-reviewed references. When adding new rules, attach at least one source per rule in `sourceIds`.
