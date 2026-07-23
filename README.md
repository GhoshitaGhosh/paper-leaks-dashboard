# India Paper Leaks: A Statistical Audit & Dual-Regime Analysis (2004–2026)

An interactive web dashboard and econometric report evaluating public examination paper leaks in India across the UPA (2004–2014) and NDA (2014–2026) political regimes.

---

## Key Features & Highlights

- **Interactive Dataset Mode Switcher**: Real-time toggle between **Raw Unadjusted Kaggle View** (86 vs 24 incidents) and **Enriched Controlled Baseline View** (Level-1 confirmed leaks, party-tenure normalization, and state fixed-effects risk models).
- **Flaws & Controls Breakdown**: Deconstructs pre-2014 media truncation, post-2014 social media noise (24.4% unconfirmed claims), and federal misattribution.
- **Dynamic Visual Analytics (Chart.js)**:
  - Annualized Leak Rates (UPA vs NDA)
  - State Party Leaks Normalized by State Executive Tenure (State-Years in Power)
  - State Fixed-Effects Risk Proclivity Model ($O/E$ Ratios: BJP 1.05 vs INC 1.06)
  - Functional Exam Categories & Modus Operandi Taxonomy Shifts
- **Interactive 126-Incident Data Explorer**: Full text search, multi-criteria filtering, and modal popup inspector with direct source URLs and arrest tallies.

---

## Datasets & Files Included

- [`index.html`](index.html): Main glassmorphic single-page web dashboard application.
- [`styles.css`](styles.css): Glassmorphism CSS design system with responsive layouts.
- [`app.js`](app.js): Dynamic UI, Chart.js controller, and filter/search handlers.
- [`data.js`](data.js): Pre-compiled dataset module containing all 126 records.
- [`paper_leaks_enriched.csv`](paper_leaks_enriched.csv): Enriched dataset with 28 data dimensions.
- [`paper_leaks.csv`](paper_leaks.csv): Updated baseline dataset.
- [`enrich_dataset.py`](enrich_dataset.py): Python script for data enrichment.
- [`analyze_regimes_normalized.py`](analyze_regimes_normalized.py): Equal-baseline regime analysis script.
- [`analyze_party_tenure_rate.py`](analyze_party_tenure_rate.py): Party tenure normalization script.
- [`analyze_state_fixed_effects.py`](analyze_state_fixed_effects.py): State fixed-effects risk model script.

---

## How to Deploy to GitHub Pages

1. **Initialize Git Repository** (if not already initialized):
   ```bash
   git init
   git add .
   git commit -m "Deploy Paper Leaks Statistical Audit Dashboard"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub: `https://github.com/<your-username>/<your-repo-name>`
   - Click **Settings** → **Pages** (under Code and automation).
   - Under **Build and deployment** → **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` branch and `/ (root)` folder, then click **Save**.
   - Your site will be live at: `https://<your-username>.github.io/<your-repo-name>/`
