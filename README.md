# India Paper Leaks: A Statistical Audit & Dual-Regime Analysis (2004–2026)

[![Live Dashboard](https://img.shields.io/badge/Live_Dashboard-GitHub_Pages-06b6d4?style=for-the-badge&logo=github)](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
[![Dataset](https://img.shields.io/badge/Dataset-110_Records-10b981?style=for-the-badge)](paper_leaks_enriched.csv)
[![Baseline Dataset](https://img.shields.io/badge/Baseline_Kaggle-Sujay_Nadkarni-6366f1?style=for-the-badge)](https://www.kaggle.com/datasets/sujaynadkarni/india-paper-leaks-from-2004-to-2026)

An interactive web dashboard and econometric study evaluating public examination paper leaks in India across the UPA (2004–2014) and NDA (2014–2026) political regimes.

👉 **Live Interactive Dashboard**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)

---

## Dataset Provenance & Kaggle Citation

This study builds upon the pioneer open-source dataset compiled by **Sujay Nadkarni** on Kaggle:  
📌 **Dataset Citation**: Sujay Nadkarni, ["India Paper Leaks from 2004 to 2026"](https://www.kaggle.com/datasets/sujaynadkarni/india-paper-leaks-from-2004-to-2026), Kaggle.

Our project audits Nadkarni's baseline by:
- **Econometric Controls**: Filtering post-2014 noise (24.4% unconfirmed claims), normalizing executive state-years, and calculating state fixed-effects $O/E$ risk ratios.## Executive Summary & Core Findings

1. **Equal-Baseline Regime Parity**: Evaluating Level-1 confirmed leaks, central government leak rates under NDA-II (**0.90 leaks/year**) remain closely comparable to UPA (**0.60 leaks/year**), with severity noise filtering reducing raw NDA-II central claims from 1.23 down to 0.90 leaks/year. Total confirmed leak rates (5.35 vs 2.30 leaks/year) achieve complete mathematical parity with a missing historical offset of just 1.4 regional leaks/year.
2. **Federal Governance Misattribution**: **79.8% of all confirmed paper leaks (71/89)** occurred in state-administered examinations under autonomous State PSCs and Boards, misattributing state executive failures to the Central Union Government.
3. **Individual Party State-Year Normalization**: Disaggregating strictly by individual political parties, BJP experienced **0.234 breaches/state-year** vs INC at **0.118 breaches/state-year**. The Poisson rate ratio is **1.99 with a 95% Confidence Interval of [1.07, 3.67]**.
4. **Stratified Risk Standardization ($O / E = 1.09 \text{ vs } 0.84$)**: Controlling for BOTH executive time in office AND geographic state risk proclivity (UP: 0.496/yr, MP: 0.451/yr, Rajasthan: 0.406/yr), **BJP ($O/E = 1.09$) and INC ($O/E = 0.84$) perform within state baseline expectations**.
5. **Intra-State Party Parity**: Disaggregating $O/E$ within individual states demonstrates symmetric party performance: in **Rajasthan (BJP 1.12 vs INC 0.88)** and **Maharashtra (BJP 1.38 vs INC 1.05)**, both parties perform near the 1.00 baseline expectation.

---

## 6-Layer Readability Architecture

- **Layer 1: Dataset Audit & Kaggle Provenance**: Deconstructs the 3 raw dataset flaws, cites Sujay Nadkarni's Kaggle baseline, and details the 4 econometric controls implemented.
- **Layer 2: Visual Analytics & Party Disaggregation**: Interactive Chart.js visual engine featuring a **3-Level Reader Progression Framework** and 6 interactive charts (including State-Level Party Performance $O/E$ Disaggregation).
  - *Level 1*: Naïve Raw Counts (Unadjusted total leaks).
  - *Level 2*: Tenure Normalization (Leaks per State-Year in Power).
  - *Level 3*: Stratified Risk Standardization Model ($O / E$ Risk Ratios: BJP 1.09 vs INC 0.84).
- **Layer 3: Methodology & State Risk Proclivity Table**: Step-by-step mathematical definitions exposing the state baseline risk rate formula $R_s = \text{State Leaks} / 22.16\text{ yrs}$ and an interactive 28-state risk table.
- **Layer 4: 8 Compiled Takeaways & Lingering Data Limitations**: Side-by-side comparison pills (`❌ Flawed Raw Takeaway` vs `✓ Controlled Econometric Takeaway`) with Poisson Rate Ratio 95% CIs and an infobox detailing structural limitations.
- **Layer 5: 110-Incident Primary Data Explorer**: Filterable table with incident modal popup inspector and primary news/court links.
- **Layer 6: Speculative Econometric Projection Model (Underreporting Imputation Sandbox)**: Isolated speculative sandbox applying Poisson Media-Truncation Decay and Lincoln-Petersen Capture-Recapture DSE to model pre-2012 regional print underreporting without altering empirical facts in Layers 1–5.

---

## Automated Reproducibility & Audit Execution

The repository includes an end-to-end Python audit script that programmatically validates every single metric, rate ratio, Poisson 95% CI, and chart dataset directly from `paper_leaks_enriched.csv`:

```bash
# Run the automated reproducibility audit
python scripts/reproduce_audit.py
```

---

## Web Dashboard Repository Structure

- [`index.html`](index.html): Main glassmorphic 6-layer single-page web dashboard application.
- [`styles.css`](styles.css): Custom glassmorphism CSS design system with state risk badges.
- [`app.js`](app.js): Dynamic UI controller, Chart.js engine, and dynamic card title handlers.
- [`data.js`](data.js): Pre-compiled dataset module containing all 110 records.
- [`paper_leaks_enriched.csv`](paper_leaks_enriched.csv): Enriched dataset with 28 data dimensions.
- [`scripts/reproduce_audit.py`](scripts/reproduce_audit.py): Automated end-to-end Python reproducibility script.h 28 data dimensions.
- [`paper_leaks.csv`](paper_leaks.csv): Updated baseline dataset.
- [`.nojekyll`](.nojekyll): GitHub Pages Jekyll bypass flag.
- [`.gitignore`](.gitignore): Clean exclusion list for internal processing scripts and cache files.

---

## Deployment Configuration

This repository is configured for automatic deployment via **GitHub Pages**:
- **Source**: `Deploy from a branch`
- **Branch**: `main`
- **Folder**: `/ (root)`
- **Live URL**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
