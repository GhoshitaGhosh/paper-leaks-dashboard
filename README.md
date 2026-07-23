# India Paper Leaks: A Statistical Audit & Dual-Regime Analysis (2004–2026)

[![Live Dashboard](https://img.shields.io/badge/Live_Dashboard-GitHub_Pages-06b6d4?style=for-the-badge&logo=github)](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
[![Dataset](https://img.shields.io/badge/Dataset-126_Records-10b981?style=for-the-badge)](paper_leaks_enriched.csv)
[![License](https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge)](LICENSE)

An interactive web dashboard and econometric study evaluating public examination paper leaks in India across the UPA (2004–2014) and NDA (2014–2026) political regimes.

👉 **Live Interactive Dashboard**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)

---

## Executive Summary & Core Findings

1. **Equal-Baseline Regime Parity**: Evaluating Level-1 confirmed leaks, central government leak rates under NDA (**0.90 leaks/year**) are 18% lower than under UPA (**1.10 leaks/year**). Total confirmed leak rates (5.35 vs 4.00 leaks/year) achieve complete mathematical parity with a missing historical offset of just 1.4 regional leaks/year.
2. **Federal Governance Misattribution**: **79.0% of all confirmed paper leaks (83/105)** occurred in state-administered examinations under autonomous State PSCs and Boards, misattributing state executive failures to the Central Union Government.
3. **Individual Party State-Year Normalization**: Disaggregating strictly by individual political parties (no coalitions or blocs), BJP experienced **0.212 leaks/state-year** vs INC at **0.141 leaks/state-year**.
4. **State Fixed-Effects Parity ($O / E = 1.05 \approx 1.06$)**: Controlling for BOTH executive time in office AND geographic state risk proclivity (UP: 0.542/yr, MP: 0.451/yr, Rajasthan: 0.451/yr), **BJP ($O/E = 1.05$) and INC ($O/E = 1.06$) perform identically** relative to state baseline expectations.

---

## 5-Layer Readability Architecture

- **Layer 1: Dataset Audit & Statistical Corrections**: Deconstructs the 3 raw dataset flaws (pre-2014 media truncation, post-2014 noise inflation, federal misattribution) and details the 4 econometric controls implemented.
- **Layer 2: Visual Analytics & Party Disaggregation**: Interactive Chart.js visual engine featuring a **3-Level Reader Progression Framework**:
  - *Level 1*: Naïve Raw Counts (Unadjusted total leaks).
  - *Level 2*: Tenure Normalization (Leaks per State-Year in Power).
  - *Level 3*: State Fixed-Effects Model ($O / E$ Risk Ratios: BJP 1.05 ≈ INC 1.06).
- **Layer 3: Methodology & State Risk Proclivity Table**: Step-by-step mathematical definitions exposing the state baseline risk rate formula $R_s = \text{State Leaks} / 22.16\text{ yrs}$ and an interactive 28-state risk table.
- **Layer 4: Compiled Takeaways & Accuracy Comparison**: Side-by-side comparison pills (`❌ Flawed Raw Takeaway` vs `✓ Controlled Econometric Takeaway`) explaining why controlled analysis is methodologically superior.
- **Layer 5: 126-Incident Primary Data Explorer**: Filterable, searchable table and modal inspector with direct primary source links, FIR tallies, and notes.

---

## State Baseline Risk Proclivity ($R_s$) & Expected Leak Model ($E$)

$$\text{State Baseline Risk Rate } (R_s) = \frac{\text{Confirmed Leaks in State } s}{22.16 \text{ Total Years (2004–2026)}}$$

$$E_{\text{party}} = \sum_{s} \left( R_s \times \text{Years Party Governed State } s \right)$$

$$O / E = \frac{\text{Observed Confirmed Leaks under Party}}{\text{Expected Leaks based on specific states governed}}$$

| State Name | Confirmed Leaks (2004–2026) | State Baseline Risk Rate ($R_s$) | Risk Tier | Primary Executive Ruling Parties |
| :--- | :--- | :--- | :--- | :--- |
| **Uttar Pradesh** | 12 Incidents | `0.542 leaks/year` | **High Risk Hub** | SP (2004–07, 2012–17), BSP (2007–12), BJP (2017–26) |
| **Madhya Pradesh** | 10 Incidents | `0.451 leaks/year` | **High Risk Hub** | BJP (2004–18, 2020–26), INC (2018–20) |
| **Rajasthan** | 10 Incidents | `0.451 leaks/year` | **High Risk Hub** | INC (2008–13, 2018–23), BJP (2004–08, 2013–18, 2023–26) |
| **Bihar** | 7 Incidents | `0.316 leaks/year` | **High Risk Hub** | JD(U) / NDA (2005–26), RJD (2004–05) |
| **Telangana** | 5 Incidents | `0.226 leaks/year` | **Medium Risk** | BRS (2014–23), INC (2023–26) |
| **Maharashtra** | 4 Incidents | `0.181 leaks/year` | **Medium Risk** | INC / NCP (2004–14), BJP / Shiv Sena (2014–26) |

---

## Web Dashboard Repository Structure

- [`index.html`](index.html): Main glassmorphic 5-layer single-page web dashboard application.
- [`styles.css`](styles.css): Custom glassmorphism CSS design system with state risk badges.
- [`app.js`](app.js): Dynamic UI controller, Chart.js engine, and dynamic card title handlers.
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
- **Live URL**: [https://GhoshitaGhosh.github.io/paper-leaks-dashboard/](https://GhoshitaGhosh.github.io/paper-leaks-dashboard/)
