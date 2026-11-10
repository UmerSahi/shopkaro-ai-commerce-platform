# Monitoring & Retraining Architecture Guide
## ShopKaro AI Commerce Intelligence Platform

### 1. Automated Retraining Schedules

| Subsystem | Retraining Cadence | Trigger Conditions | Computation Window | Cache Warming Action |
| :--- | :---: | :---: | :---: | :---: |
| **Recommendation Engine (Two-Tower & ALS)** | **Daily at 02:00 PKT** | Clicks/Purchases $> 10,000$ new events | Off-peak night window | Pre-computes Top 10,000 active users into Redis cache |
| **Demand Forecaster (LightGBM)** | **Weekly (Sunday 23:00 PKT)** | Monday morning procurement cycle | Trailing 730 days | Refreshes P10, P50, P90 demand curves and ROP alerts |
| **Hybrid Search Index (BM25 + Dense Vectors)** | **Daily at 04:00 PKT** | Catalog updates $> 100$ new SKUs | Incremental index update | Re-indexes tokens and recalculates IDF weights |
| **Customer Segments (RFM + K-Means)** | **Bi-Weekly** | New cohort month rollover | Rolling 90 days | Updates segment membership tags on user profiles |

---

### 2. Drift Detection & Model Governance

#### 2.1 Data Drift (Feature Distribution Shift)
* **Monitored Variables**: User session length, average price of viewed products, ratio of Roman Urdu vs English queries.
* **Statistical Detector**: Two-sample Kolmogorov-Smirnov (KS) test and Population Stability Index (PSI).
* **Threshold**: If $\text{PSI} > 0.25$, triggers automated alert to the MLOps on-call channel.

#### 2.2 Concept Drift (Preference Drift)
* **Festival Transitions**: Rapid demand shift from routine groceries to Eid lawn suits and festive clothing during the 15 days preceding Eid.
* **Mitigation**: Shifting festival calendar features (`is_eid`, `is_ramadan`, `is_11_11`) adjust multipliers dynamically based on the current date relative to shifting lunar dates.

---

### 3. Serving SLA & Redis Cache Management
* **Latency SLA**: $< 100\text{ ms}$ for 99% of recommendation calls.
* **Batch Pre-Computation**: Top 10,000 active user recommendations are computed overnight and written to Redis with a 24-hour TTL (`rec:{user_id}:top_k`).
* **Real-Time Session Modulation**: When a user registers 3 or more clicks in an active session, `/session/click` updates the user's session cache and dynamically blends similar products into the active feed without full model re-scoring.

