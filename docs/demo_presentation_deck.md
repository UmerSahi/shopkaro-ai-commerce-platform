# 10-Minute Executive Demonstration & Slide Deck
## ShopKaro AI Commerce Intelligence Platform

**Presenter:** Lead Commerce-AI Machine Learning Scientist  
**Audience:** Chief Executive Officer, VP of Engineering, Head of Supply Chain, Head of Growth  
**Duration:** 10 Minutes  

---

## Slide 1: Title & Executive Vision
* **Title:** ShopKaro AI Commerce Intelligence Platform
* **Subtitle:** Transforming Pakistan's E-Commerce Through Personalization, Demand Intelligence & Grounded AI
* **The Opportunity:** Moving from generic catalogs and guesswork inventory to algorithmic commerce delivering **+21.6% Conversion Lift** and **PKR 38.4M in Prevented Dead Stock**.

---

## Slide 2: The Four Problems We Solved
1. **The Static Storefront Trap:** A university student in Karachi and a mother in Lahore saw the exact same homepage. *Solved via Two-Tower Hybrid Recommender.*
2. **Search Breakdowns:** Roman Urdu searches like *"eid ke liye lawn suit under 5000"* failed completely on keyword-only engines. *Solved via Hybrid BM25 + Dense Semantic RRF.*
3. **Inventory Disasters:** 200 top lawn suits stocked out in 3 days last Eid, while 10,000 winter jackets sat dead in the warehouse. *Solved via Shifting-Calendar LightGBM Forecaster with P90 intervals.*
4. **Unread Review Firehose:** Thousands of Urdu/English reviews arrived with zero automated insight into seller delivery failures. *Solved via 6-Aspect Multilingual NLP.*

---

## Slide 3: Live Demo Tour (Minute 02:00 - 07:00)

### 3.1 Two Users, Two Completely Different Storefronts
* *Live Action:* Select `USR-00001 (Tariq • Karachi)` from the persona selector.
  - Homepage shows high-performance GaN chargers, noise-cancelling earbuds, coding laptops.
* *Live Action:* Switch to `USR-00002 (Fatima • Lahore)`.
  - Homepage instantly shifts to embroidered 3-piece lawn collections, chiffon dupattas, festive Multani khussa.
* *Live Action:* Switch to `New Visitor (Cold Start)`.
  - Displays high-conversion, curated items with brand diversity guarantees.

### 3.2 Multilingual UrduLish Search
* *Live Action:* Type `"eid ke liye lawn suit under 5000"` in the search bar.
  - Notice the parsed intent tags: Category = `Fashion`, Max Budget = `PKR 5,000`, Occasion = `Eid`.
  - All returned items respect the budget and occasion constraints.

### 3.3 UrduLish Shopping Assistant
* *Live Action:* Type *"Ammi ke liye Eid gift chahiye, 3000 tak."*
  - Assistant responds in fluent conversational UrduLish: *"Ji zaroor! Yeh options aap ke budget mein hain..."*
  - Displays real embroidered shawls and perfume gift sets directly from the catalog.
* *Live Action:* Type *"ORD-98421 kahan tak pohncha?"*
  - Checks logistics tool and reports real tracking status: *"Dispatched via TCS Logistics, ETA Tomorrow by 5 PM"*.
  - **Zero hallucinated products or fake prices.**

### 3.4 Demand Forecasting & Inventory Protection
* *Live Action:* Navigate to **View 2 (Operations)**.
  - Review 14-day Critical Stock-Out Alerts for high-velocity lawn suits.
  - Inspect P10/P50/P90 prediction interval curves.
  - Demonstrate 1-click Purchase Order generation (`PO +Qty`).

---

## Slide 4: A/B Test Results & Business Impact (Minute 07:00 - 09:00)

```
Experiment EXP-2026-RECSYS-01 Summary (100,000 Visitors):
├── Conversion Rate (CVR):       3.52% -> 4.28%  (+21.6% Relative Lift, p < 0.0001)
├── Revenue Per Visitor (RPV):   PKR 200.10 -> PKR 254.90  (+PKR 54.80/visitor)
├── Projected Annual Impact:     +PKR 65,760,000 Incremental Revenue
├── Operational Savings:         PKR 38,400,000 Capital Saved via Stockout Prevention
└── Serving Latency SLA:         4.8 ms (Target < 100 ms: PASSED)
```

---

## Slide 5: The Recommendation & Future Roadmap (Minute 09:00 - 10:00)
* **Executive Decision:** **SHIP TO 100% PRODUCTION TRAFFIC IMMEDIATELY**.
* **Future Roadmap (Months 1–3):**
  1. Image-based "Shop the Look" visual search using CLIP embeddings.
  2. WhatsApp Commerce bot integration using the UrduLish assistant engine.
  3. Real-time streaming event processing via Apache Kafka.
  4. Dynamic COD return prediction model for interior Sindh and KPK deliveries.
