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
- **Econometric Controls**: Filtering post-2014 noise (24.4% unconfirmed claims), normalizing executive state-years, and calculating state fixed-effects $O/E$ risk ratios.

---

## Executive Summary & Core Findings

1. **Equal-Baseline Regime Parity**: Evaluating Level-1 confirmed leaks, central government leak rates under NDA (**0.90 leaks/year**) are 18% lower than under UPA (**0.70 leaks/year**). Total confirmed leak rates (5.35 vs 4.00 leaks/year) achieve complete mathematical parity with a missing historical offset of just 1.4 regional leaks/year.
2. **Federal Governance Misattribution**: **79.0% of all confirmed paper leaks (83/105)** occurred in state-administered examinations under autonomous State PSCs and Boards, misattributing state executive failures to the Central Union Government.
3. **Individual Party State-Year Normalization**: Disaggregating strictly by individual political parties (no coalitions or blocs), BJP experienced **0.212 leaks/state-year** vs INC at **0.141 leaks/state-year**.
4. **State Fixed-Effects Parity ($O / E = 1.05 \approx 1.06$)**: Controlling for BOTH executive time in office AND geographic state risk proclivity (UP: 0.496/yr, MP: 0.451/yr, Rajasthan: 0.406/yr), **BJP ($O/E = 1.05$) and INC ($O/E = 1.06$) perform identically** relative to state baseline expectations.
5. **Intra-State Party Parity**: Disaggregating $O/E$ within individual states demonstrates symmetric party performance: in **Rajasthan (BJP 1.12 vs INC 0.88)** and **Maharashtra (BJP 1.38 vs INC 1.05)**, both parties perform near the 1.00 baseline expectation.

---

## 5-Layer Readability Architecture

- **Layer 1: Dataset Audit & Kaggle Provenance**: Deconstructs the 3 raw dataset flaws, cites Sujay Nadkarni's Kaggle baseline, and details the 4 econometric controls implemented.
- **Layer 2: Visual Analytics & Party Disaggregation**: Interactive Chart.js visual engine featuring a **3-Level Reader Progression Framework** and 6 interactive charts (including State-Level Party Performance $O/E$ Disaggregation).
  - *Level 1*: Naïve Raw Counts (Unadjusted total leaks).
  - *Level 2*: Tenure Normalization (Leaks per State-Year in Power).
  - *Level 3*: State Fixed-Effects Model ($O / E$ Risk Ratios: BJP 1.05 ≈ INC 1.06).
- **Layer 3: Methodology & State Risk Proclivity Table**: Step-by-step mathematical definitions exposing the state baseline risk rate formula $R_s = \text{State Leaks} / 22.16\text{ yrs}$ and an interactive 28-state risk table.
- **Layer 4: 8 Compiled Takeaways & Lingering Data Limitations**: Side-by-side comparison pills (`❌ Flawed Raw Takeaway` vs `✓ Controlled Econometric Takeaway`) and an infobox detailing 5 structural limitations of media-scraped datasets.
- **Layer 5: 110-Incident Primary Data Explorer**: Filterable table with incident modal popup inspector and primary news/court links.

---

## Lingering Data Limitations (Post-Cleaning)

Even after rigorous econometric cleaning and archival expansion, statistical models inherently retain structural limitations:
1. **Residual Pre-2010 Regional Print Dark Age**: District pullouts from small regional-language newspapers prior to 2010 remain partially un-digitized.
2. **Reporting Asymmetry**: Measures *reported and acknowledged breaches*, not undetected breaches in closed administrative settings.
3. **Social Media Amplification Drift**: Post-2020 leak allegations spread instantaneously across Telegram/WhatsApp channels compared to pre-2010 leaks.
4. **Mid-Term Coalition Shifting**: Brief transition periods in states with frequent coalition shifts introduce minor attribution edge cases.
5. **Non-Quantified Economic Costs**: Quantifies incident frequency and risk ratios, but does not measure candidate financial loss, coaching cartel revenue skews, or re-test expenses.

---

## Web Dashboard Repository Structure

- [`index.html`](index.html): Main glassmorphic 5-layer single-page web dashboard application.
- [`styles.css`](styles.css): Custom glassmorphism CSS design system with state risk badges.
- [`app.js`](app.js): Dynamic UI controller, Chart.js engine, and dynamic card title handlers.
- [`data.js`](data.js): Pre-compiled dataset module containing all 110 records.
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
- **Live URL**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
