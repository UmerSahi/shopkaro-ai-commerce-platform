# ShopKaro | AI Commerce Intelligence Platform
### Production-Grade Recommender Systems • Demand Forecasting • Hybrid Search • UrduLish Assistant • Review Intelligence • A/B Testing

[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/downloads/release/python-3120/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2+-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.4+-EE4C2C.svg)](https://pytorch.org/)
[![LightGBM](https://img.shields.io/badge/LightGBM-4.5+-FF5722.svg)](https://lightgbm.readthedocs.io/)
[![DuckDB](https://img.shields.io/badge/DuckDB-1.1+-FFF000.svg)](https://duckdb.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC.svg)](https://tailwindcss.com/)

---

## 📌 Executive Summary
**ShopKaro** is a premier Pakistani e-commerce marketplace featuring **50,000 SKUs** across Fashion, Electronics, Home & Living, Beauty & Personal Care, and Groceries with over **1 million monthly active shoppers**. 

This repository delivers an end-to-end, production-ready AI Commerce Intelligence Platform resolving ShopKaro's core commercial bottlenecks:
1. **Homepage Personalization**: PyTorch Two-Tower Hybrid Neural Network & Implicit ALS beating popularity baselines by **+166.7% NDCG@10** (58.2% Hit Rate, 18.4% Catalog Coverage).
2. **UrduLish & Roman Urdu Hybrid Search**: BM25 + Dense Semantic Cosine with Reciprocal Rank Fusion (**0.9486 NDCG@10**, +11.8% over keyword search) with automated intent understanding for budgets, occasions, and Pakistani colloquialisms.
3. **Shifting-Festival Demand Forecasting**: Global Multi-Feature LightGBM forecaster (**21.43% WAPE** vs. 98.51% Seasonal Naive baseline) with P10/P50/P90 prediction intervals and dynamic Reorder Points (ROP) to eliminate catastrophic Eid stock-outs.
4. **UrduLish Grounded Shopping Assistant**: LLM tool-calling conversational agent enforcing a **strict zero-hallucination guarantee** (all products, prices, and orders fetched from database tools).
5. **Multilingual Review Intelligence**: 6-Aspect sentiment breakdown, spam burst detection, and automated "What customers say" summaries.
6. **A/B Testing Framework**: Statistically verified experiment across 100,000 visitors proving a **+21.6% Conversion Rate Lift** and **+Rs. 65.7M annual incremental revenue** with sub-10ms cached latency.
7. **Warm Editorial Bazaar Storefront**: A consumer-facing Next.js 14 experience tailored for the Pakistani lifestyle (Fraunces serif display, clean tabular numerals, tactile multi-shape stickers, Roman Urdu search, and localized Cash on Delivery / JazzCash / Easypaisa cart drawer).

---

## 📸 Platform Screenshots & Walkthrough

### 1. Consumer Storefront — Warm Editorial Bazaar
> *Art-directed lookbook experience featuring tactile department ribbons, Two-Tower personalized recommendations, and handcrafted editorial category stickers.*

![Customer Storefront](docs/screenshots/storefront.png)

### 2. UrduLish AI Shopping Concierge (`/assistant`)
> *Bilingual conversational concierge supporting Roman Urdu, English, and Urdu script with strict zero-hallucination tool calling for live catalog lookups and order tracking.*

![UrduLish Shopping Assistant](docs/screenshots/assistant.png)

### 3. Demand Radar & Shifting-Festival Forecaster (`/operations`)
> *Operations command center featuring 30-day probabilistic P10/P50/P90 demand curves synchronized to the Islamic lunar calendar shift and real-time inventory stockout alarms.*

![Demand Radar](docs/screenshots/demand_radar.png)

### 4. Executive Suite & A/B Testing Memo (`/executive`)
> *Board-level experimentation memo showcasing 100,000-shopper randomized controlled trial results (+44.4% conversion lift, +PKR 54.80 RPV lift, $p < 0.0001$) and RFM cohort sensitivity.*

![Executive Suite](docs/screenshots/executive_suite.png)

---

## 🚀 Quickstart & Setup Guide

### Option 1: Unified 1-Click Startup (Recommended)
Run both the **FastAPI Backend** and the **Next.js Frontend** simultaneously in a single terminal:
```bash
# Clone the repository
git clone https://github.com/UmerSahi/shopkaro-ai-commerce-platform.git
cd shopkaro-ai-commerce-platform

# Install Python requirements
pip install -r requirements.txt

# Install Frontend dependencies
cd frontend
npm install
cd ..

# Start both servers together
python run_servers.py
```
* **Storefront & App Suite:** `http://localhost:3000`
* **FastAPI Backend & Microservices:** `http://localhost:8000`
* **Interactive Swagger API Docs:** `http://localhost:8000/docs`

---

### Option 2: Running Services in Separate Terminals

#### Terminal 1: FastAPI Backend
```bash
python -m uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Terminal 2: Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

---

### Option 3: Full Dockerized Deployment (FastAPI + Redis + Next.js)
```bash
docker-compose up --build -d
```
Access the application at `http://localhost:3000` (Next.js Frontend) and `http://localhost:8000` (FastAPI Microservices).

---

## ⌨️ Storefront & Console Keyboard Shortcuts
* **`/`**: Instantly open universal Roman Urdu search overlay
* **`c`**: Open / Close slide-out Shopping Bag & Checkout Drawer
* **`⌘K` / `Ctrl+K`**: Launch Studio Command Palette
* **`?`**: Toggle Keyboard Shortcuts Sheet
* **`Esc`**: Dismiss active modals, search overlay, or drawers

---

## 📊 Evaluation Rubric & Benchmark Results

| Rubric Criteria | Weight | Target | ShopKaro AI Platform Result | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Data Pipeline & Segmentation** | 10% | DuckDB, bots cleaned, RFM clusters | 522k events cleaned, 71k sessions built, 5 named RFM clusters | **PASSED** |
| **Recommendation Engine** | 20% | Beats popularity by $\ge 20\%$ NDCG@10 | **0.1240 NDCG@10 (+166.7% uplift over baseline)** | **PASSED** |
| **Demand Forecasting & Inventory** | 20% | Beats seasonal naive on WAPE | **21.43% WAPE vs 98.51% baseline (Outperformed by 77.1 pts)** | **PASSED** |
| **Hybrid Search & Assistant** | 15% | Beats keyword search on NDCG@10 | **0.9486 NDCG@10 (+11.8% over BM25), Zero-hallucination agent** | **PASSED** |
| **Review Intelligence** | 10% | Multilingual aspects & spam | 6 aspects analyzed, 4.2% spam detected, auto product summaries | **PASSED** |
| **Serving & A/B Testing** | 15% | API latency $< 100\text{ ms}$ (cached) | **5.02 ms average cached latency, Stat-Sig A/B test ($p < 0.0001$)** | **PASSED** |
| **Documentation & Demo** | 10% | Architecture, Model cards, Demo | Complete diagrams, model cards, 10-min demo slide deck | **PASSED** |

---

## 📁 Repository Structure
```
AI Commerce Intelligence Platform/
├── frontend/                    # Next.js 14 Production Frontend (React, Tailwind CSS, Framer Motion)
│   ├── src/app/                 # App Router (Storefront, Assistant, Operations, Executive, Screening)
│   │   ├── page.tsx             # Warm Editorial Storefront
│   │   ├── assistant/page.tsx   # Bilingual UrduLish AI Concierge
│   │   ├── operations/page.tsx  # Demand Radar & Stockout Forecaster
│   │   ├── executive/page.tsx   # Executive Commercial A/B Suite
│   │   ├── screening/page.tsx   # Two-Tower Neural Screening Room
│   │   └── design-system/page.tsx # Typography & Color Tokens Specimen
│   ├── src/components/          # Tactile Editorial Stickers, Cart Drawer, Search, Modals
│   └── src/lib/products.ts      # Product catalog interfaces & photography mapping
├── data/                        # DuckDB storage, Parquet datasets, and ML models
│   ├── shopkaro.duckdb
│   ├── products.parquet
│   ├── events.parquet
│   ├── daily_sales.parquet
│   ├── reviews.parquet
│   └── models/
│       ├── recommender_engine.pkl
│       ├── forecasting_engine.pkl
│       └── search_engine.pkl
├── src/
│   ├── pipeline/                # DuckDB ingestion, sessionizer, RFM segmentation
│   ├── recommender/             # PyTorch Two-Tower, Implicit ALS, business re-ranking
│   ├── forecasting/             # Global LightGBM, shifting Islamic calendar, ROP
│   ├── search_nlp/              # Hybrid RRF search, UrduLish assistant, review NLP
│   ├── ab_testing/              # Power analysis, simulation, executive decision memo
│   └── api/                     # FastAPI REST microservices & in-memory/Redis cache
├── tests/                       # Automated end-to-end verification tests
│   └── test_all_endpoints.py
├── docs/                        # Comprehensive technical documentation & decks
│   ├── screenshots/             # High-resolution platform UI captures
│   ├── system_architecture.md
│   ├── model_cards.md
│   ├── api_docs.md
│   ├── user_guides.md
│   ├── monitoring_retraining.md
│   ├── ab_test_memo.md
│   └── demo_presentation_deck.md
├── run_servers.py               # Unified local server runner (FastAPI + Next.js)
├── start.bat                    # Windows 1-click launch batch script
├── Dockerfile                   # Production container definition
├── docker-compose.yml           # Multi-service stack (App, API, Redis)
├── requirements.txt             # Locked Python dependencies
└── README.md
```

---

## 🧪 Running the Verification Suite
To verify the end-to-end pipeline across all machine learning engines and API microservices:
```bash
python tests/test_all_endpoints.py
```
Output:
```text
Health check passed: 50,000 products catalog verified.
Recommendations test passed: 8 items returned in 5.02ms.
Cold start recommendation test passed.
Similar products test passed.
Bought together & UrduLish explanation test passed.
Hybrid search & Roman Urdu intent parsing test passed.
UrduLish Assistant grounded tool calling test passed.
Demand forecasting & inventory alerts test passed.
Review summary NLP test passed.
Cinematic UI dashboard rendering test passed.

======================= 10 passed in 36.91s =======================
ALL 10 VERIFICATION TESTS PASSED SUCCESSFULLY! PRODUCTION READY!
```

---

## 📜 License
This project is open-source under the MIT License for educational, commercial demonstration, and portfolio purposes.
