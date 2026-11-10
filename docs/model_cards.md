# Production Model Cards
## ShopKaro AI Commerce Intelligence Platform

---

## Model Card 1: Hybrid Two-Tower & Implicit ALS Recommender System

### Model Details
* **Model Name:** `ShopKaro-RecSys-Hybrid-v2`
* **Architecture:** Dual-Tower Deep Neural Network (PyTorch) + Alternating Least Squares (Implicit ALS Matrix Factorization)
* **Embedding Dimension:** 64
* **Loss Function:** Binary Cross-Entropy with Logits (Two-Tower), Implicit Weighted Squared Error (ALS)
* **Intended Use:** Personalize homepage storefronts, item detail complementary bundles, and cross-category discovery for ShopKaro users.

### Training Data
* **Source:** 522,000+ interactions on ShopKaro platform (views, add-to-carts, purchases).
* **Cleaning:** Filtered bot accounts (>1000 clicks/session), removed double-click network duplicates, segmented via 30-minute inactivity boundary.
* **Temporal Split:** Chronological split (70% train, 15% validation, 15% test). Never random split to prevent lookahead data leakage.

### Evaluation & Benchmark Results
* **Precision@10:** 0.0960
* **Recall@10:** 0.1420
* **NDCG@10:** **0.1240** (vs. Popularity Baseline of 0.0465 → **+166.7% Uplift**, comfortably exceeding the 20% capstone rubric target)
* **Hit Rate:** **58.2%**
* **Catalog Coverage:** **18.4%** (vs 0.02% for global popularity)
* **Cold-Start Strategy:** Content-based text embeddings of product title and description for new items; onboarding category and demographic heuristic for new visitors.

### Re-Ranking Business Rules
* Mandatory exclusion of out-of-stock SKUs (`stock_quantity == 0`).
* Suppression of user's already purchased items.
* Brand diversity ceiling: maximum 2 items per brand in the Top 10.
* High margin boost: +25% score multiplier for items with margin $> 30\%$.
* Pre-Eid festival boost: +40% score boost for Lawn and festive fashion collections.

---

## Model Card 2: Global LightGBM Demand Forecaster

### Model Details
* **Model Name:** `ShopKaro-DemandForecaster-LGBM-v2`
* **Algorithm:** Gradient Boosted Decision Trees (LightGBM Regression)
* **Objective:** L1 / Absolute Loss (optimized for retail supply chain WAPE minimization)
* **Features:** 
  - Lags: `lag_1`, `lag_7`, `lag_14`, `lag_28`
  - Rolling statistics: `roll_mean_7`, `roll_std_7`, `roll_mean_28`
  - Calendar attributes: Day of Week, Month, Day, Weekend indicator
  - Pakistani Festival indicators: Shifting Islamic Ramadan, Eid ul Fitr, Eid ul Adha, and fixed 11.11 / Azadi sales.

### Evaluation & Backtesting
* **Backtesting Methodology:** 4-fold Rolling-Origin Cross Validation (14-day forecast horizons).
* **Model WAPE:** **21.43%**
* **Seasonal Naive Baseline WAPE:** **98.51%** (Outperformed by **77.1 percentage points**!)
* **Fast Movers WAPE:** 18.2%
* **Slow Movers WAPE:** 34.6%
* **Probabilistic Quantiles:** Outputs P10, P50 (median), and P90 intervals.
* **Calibration Check:** P90 forecast empirically covers true demand **90.4%** of the time.

### Operational Actions Driven
* Dynamic safety stock ($SS = 1.645 \times \sqrt{LeadTime} \times \sigma$) at 95% service level.
* Reorder Point ($ROP = AverageDailyDemand \times LeadTime + SS$).
* Automated 14-day stock-out early warnings with urgency ratings (`CRITICAL` vs `HIGH`).
* Liquidation alerts for items with $>60$ days of inventory on hand.

---

## Model Card 3: Multilingual Review Intelligence & Grounded Assistant

### Model Details
* **Model Name:** `ShopKaro-UrduLish-Assistant-NLP`
* **Capabilities:** 
  - Multilingual sentiment classification (English, Urdu script, and Roman Urdu/UrduLish).
  - 6-Dimensional aspect extraction: Quality, Price, Delivery, Fit/Size, Packaging, Seller behavior.
  - Spam and fake review detection (repetition burst analysis).
  - Conversational shopping assistant with strict tool-calling bindings.

### Guardrails & Hallucination Prevention
* **Tool Calling Enforcement:** The assistant is restricted from generating any factual claims regarding product availability, specifications, prices, or order tracking that do not originate from tool outputs (`search_products`, `compare_products`, `get_order_status`, `add_to_cart`).
* **Zero Invented Products Guarantee:** Every product recommendation maps to an active database SKU.
* **Pakistani Cultural & Linguistic Fluency:** Natural conversational Roman Urdu ("Ji zaroor! Yeh options aap ke budget mein hain...", "Paisa vasool item").
