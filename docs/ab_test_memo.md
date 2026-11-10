# Executive A/B Experiment Memo: Ship or Don't Ship?

**To:** Leadership Team & CEO, ShopKaro  
**From:** Lead Commerce-AI Machine Learning Scientist  
**Experiment Reference:** `EXP-2026-RECSYS-01`  
**Test Window:** 14 Consecutive Days (Pre-Eid Cycle, Full 2-Week Seasonality Captured)  
**Recommendation:** **✅ SHIP TO 100% PRODUCTION TRAFFIC**

---

### 1. Executive Summary & Core Hypothesis
We tested the hypothesis that replacing ShopKaro's legacy static popularity homepage with our **Personalized Hybrid Two-Tower Recommendation Engine** would eliminate customer choice paralysis, increase long-tail catalog discovery, and drive higher purchase conversion without impairing page load speeds.

The experiment was run across **100,000 visitors** (50,000 Control vs. 50,000 Treatment) with a 50/50 randomized hash split. The treatment decisively outperformed the control across all primary commerce KPIs at $p < 0.0001$.

---

### 2. Primary Metrics & Statistical Rigor

| Metric | Control (Popularity) | Treatment (AI Recommender) | Relative Lift | 95% Confidence Interval | p-Value | Significant? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Conversion Rate (CVR)** | 3.49% | **4.08%** | **+16.71%** | [0.347%, 0.821%] | $p < 0.0001$ | **YES (Stat-Sig)** |
| **Revenue / Visitor (RPV)** | PKR 204.87 | **PKR 261.74** | **+27.76%** | [PKR 39.1, PKR 74.65] | $p < 0.0001$ | **YES (Stat-Sig)** |

---

### 3. Guardrail Metrics & Technical Health
* **Latency SLA:** Maintained mean serving latency of **42.02 ms** and P95 latency of **51.85 ms**, safely beneath the **100 ms client SLA**.
* **Return / Discontinuation Rate:** No statistically meaningful deviation (+0.12%, within noise threshold).
* **Cart Abandonment:** Decreased by **4.8%**, indicating higher intent and relevance of presented recommendations.

---

### 4. Methodological Safeguards Against Common Pitfalls
1. **Peeking Avoidance:** Fixed horizon testing rule enforced via power analysis ($n=50,000$ per variant computed prior to experiment initiation; no early stopping).
2. **Novelty & Primacy Effects:** Analyzed day-by-day conversion cohorts; lift held stable from Day 3 through Day 14, ruling out temporary novelty spikes.
3. **Multiple Testing Correction:** Family-wise error rate protected using Benjamini-Hochberg FDR procedure.

---

### 5. Financial Impact & Business Case
* **Projected Incremental Annual Revenue:** **PKR 682,497,310.0** (calculated on 1.0M monthly active buyers).
* **Return on AI Cloud Investment (ROI):** **14.2x against AI cloud infrastructure spend**.
* **Operational Action:** Immediate full rollout to 100% of ShopKaro production traffic.
