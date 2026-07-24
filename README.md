# India Public-Examination Integrity Incidents: A Statistical Audit & Dual-Regime Analysis (2004–2026)

[![Live Dashboard](https://img.shields.io/badge/Live_Dashboard-GitHub_Pages-06b6d4?style=for-the-badge&logo=github)](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
[![Dataset](https://img.shields.io/badge/Dataset-110_Records-10b981?style=for-the-badge)](paper_leaks_enriched.csv)
[![Baseline Dataset](https://img.shields.io/badge/Baseline_Kaggle-Sujay_Nadkarni-6366f1?style=for-the-badge)](https://www.kaggle.com/datasets/sujaynadkarni/india-paper-leaks-from-2004-to-2026)

An interactive web dashboard and econometric study evaluating reported public-examination integrity incidents in India across the UPA (2004–2014) and NDA-II (2014–2026) political regimes.

👉 **Live Interactive Dashboard**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)

---

## Dataset Provenance & Kaggle Citation

This study builds upon the pioneer open-source dataset compiled by **Sujay Nadkarni** on Kaggle:  
📌 **Dataset Citation**: Sujay Nadkarni, ["India Paper Leaks from 2004 to 2026"](https://www.kaggle.com/datasets/sujaynadkarni/india-paper-leaks-from-2004-to-2026), Kaggle.

Our project audits Nadkarni's baseline by:
- **Construct Validity Subtyping**: Distinguishing broad *Reported Examination-Integrity Incidents* (89 Confirmed out of 110 Total) from narrow *Reported Question-Paper Leaks* (61 Confirmed out of 74 Total).
- **Econometric Controls**: Filtering unconfirmed noise (21 claims removed), normalizing executive state-years across all 31 States & UTs, and calculating Indirect Standardization (O/E) risk ratios.

---

## Executive Summary & Core Findings

1. **Central Question-Paper Leak Parity**: Isolating centrally administered examinations narrowly classified as Question-Paper Leaks reveals **UPA 0.50 leaks/year (5 in 10 yrs) vs NDA-II 0.58 leaks/year (7 in 12.16 yrs)** — with a rate ratio of **1.15 (95% CI [0.37 – 3.63])**, establishing sample-limited parity!
2. **Sample Attribution Scope**: **79.8% of confirmed incidents included in this dataset (71/89)** were assigned to state-level institutions under autonomous State PSCs and Boards.
3. **Descriptive Party State-Year Normalization**: Disaggregating strictly by individual political parties via dynamic date-range interval lookup across all 31 States & UTs:
   - *Broad Construct*: BJP experienced 0.183 incidents/state-year vs INC at 0.075 incidents/state-year (Poisson Rate Ratio = 2.45, 95% CI [1.33, 4.53]).
   - *Narrow Question-Paper Leak Subtype*: BJP experienced 0.135 leaks/state-year vs INC at 0.064 leaks/state-year (Poisson Rate Ratio = 1.88, **95% CI [0.95, 3.75]** — spans 1.00, meaning the difference is **not statistically significant**).
4. **Stratified Baseline Risk Indirect Standardization (O / E = 1.10 vs 0.83)**: Controlling for BOTH executive time in office AND geographic state risk proclivity (UP: 0.496/yr, MP: 0.451/yr, Rajasthan: 0.406/yr), both BJP (O/E = 1.10) and INC (O/E = 0.83) perform near state baseline expectations.
5. **Consolidated Triple-Controlled Risk Model (O / E<sub>full</sub> = 1.01 vs 0.91)**: Simultaneously controlling for time in office, geographic baseline risk, and exam conduct volume yields a Consolidated Risk Ratio of **1.11 (95% CI [0.60 – 2.05])** — proving no statistically significant partisan difference exists.

---

## 6-Layer Readability Architecture

- **Layer 1: Dataset Audit & Kaggle Provenance**: Deconstructs raw dataset flaws, cites Sujay Nadkarni's Kaggle baseline, and details the econometric controls implemented.
- **Layer 2: Visual Analytics & 5-Level Reader Progression**: Interactive Chart.js visual engine featuring a **5-Level Reader Progression Framework** and 8 interactive charts (including State-Level Party Performance O/E Disaggregation and Party Risk Ratio Convergence Engine).
- **Layer 3: Methodology & State Baseline Risk Table**: Step-by-step mathematical definitions exposing the state baseline risk rate formula $R_s = \text{State Leaks} / 22.16\text{ yrs}$ and an interactive 28-state risk table.
- **Layer 4: Compiled Takeaways & Methodological Limitations**: Side-by-side comparison pills (`❌ Flawed Raw Takeaway` vs `✓ Controlled Econometric Takeaway`) with Poisson Rate Ratio 95% CIs and an infobox detailing structural limitations.
- **Layer 5: 110-Incident Authenticated Data Explorer**: Filterable table with incident modal popup inspector and primary news/court links.
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
- [`paper_leaks.csv`](paper_leaks.csv): Updated baseline dataset.
- [`data/state_tenures.csv`](data/state_tenures.csv): State executive tenure database (2004–2026).
- [`data/sourced_exam_counts.csv`](data/sourced_exam_counts.csv): Official State PSC Annual Report notification counts.
- [`scripts/reproduce_audit.py`](scripts/reproduce_audit.py): Automated end-to-end Python reproducibility script.
- [`.nojekyll`](.nojekyll): GitHub Pages Jekyll bypass flag.
- [`.gitignore`](.gitignore): Clean exclusion list for internal processing scripts and cache files.

---

## Deployment Configuration

This repository is configured for automatic deployment via **GitHub Pages**:
- **Source**: `Deploy from a branch`
- **Branch**: `main`
- **Folder**: `/ (root)`
- **Live URL**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
