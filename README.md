# India Paper Leaks: A Statistical Audit & Dual-Regime Analysis (2004–2026)

[![Live Dashboard](https://img.shields.io/badge/Live_Dashboard-GitHub_Pages-06b6d4?style=for-the-badge&logo=github)](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)

An interactive web dashboard and econometric report evaluating public examination paper leaks in India across the UPA (2004–2014) and NDA (2014–2026) political regimes.

👉 **Live Interactive Dashboard**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)

---

## Key Features & Highlights

- **Interactive Dataset Mode Switcher**: Real-time toggle between **Raw Unadjusted View** (86 vs 24 incidents) and **Enriched Controlled Baseline View** (Level-1 confirmed leaks, party-tenure normalization, and state fixed-effects risk models).
- **Flaws & Controls Breakdown**: Deconstructs pre-2014 media truncation, post-2014 social media noise (24.4% unconfirmed claims), and federal domain misattribution.
- **Dynamic Visual Analytics (Chart.js)**:
  - Annualized Leak Rates (UPA vs NDA)
  - State Party Leaks Normalized by State Executive Tenure (State-Years in Power)
  - State Fixed-Effects Risk Proclivity Model ($O/E$ Ratios: BJP 1.05 vs INC 1.06)
  - Functional Exam Categories & Modus Operandi Taxonomy Shifts
- **Interactive 126-Incident Data Explorer**: Full text search, multi-criteria filtering, and modal popup inspector with direct source URLs and arrest tallies.

---

## Web Dashboard Repository Structure

- [`index.html`](index.html): Main glassmorphic single-page web dashboard application.
- [`styles.css`](styles.css): Custom glassmorphism CSS design system.
- [`app.js`](app.js): Dynamic UI controller and Chart.js chart engine.
- [`data.js`](data.js): Pre-compiled dataset module containing all 126 records.
- [`paper_leaks_enriched.csv`](paper_leaks_enriched.csv): Enriched dataset with 28 data dimensions.
- [`paper_leaks.csv`](paper_leaks.csv): Updated baseline dataset.
- [`.nojekyll`](.nojekyll): GitHub Pages Jekyll bypass flag.
- [`.gitignore`](.gitignore): Clean exclusion list for internal processing scripts and cache files.

---

## Deployment Configuration

This repository is configured for automatic deployment via **GitHub Pages**:
- **Source**: `Deploy from a branch`
- **Branch**: `main`
- **Folder**: `/ (root)`
- **URL**: `https://GhoshitaGhosh.github.io/paper-leaks-dashboard/`
