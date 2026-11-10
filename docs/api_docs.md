# REST API Reference Manual
## ShopKaro AI Commerce Intelligence Platform

The ShopKaro AI platform exposes real-time RESTful microservices built on FastAPI with sub-10ms Redis-backed response times.

**Base URL:** `http://localhost:8000`  
**Interactive Swagger UI:** `http://localhost:8000/docs`

---

### 1. Health & Status
`GET /health`

Returns the operational health of loaded machine learning engines, catalog volume, and timestamps.

```json
{
  "status": "healthy",
  "service": "ShopKaro AI Commerce Intelligence Platform",
  "models_loaded": {
    "recommender": true,
    "forecasting": true,
    "search": true,
    "assistant": true
  },
  "catalog_size": 50000,
  "timestamp": 1794301824.12
}
```

---

### 2. Personalized Recommendations
`GET /recommendations/{user_id}`

Returns personalized product recommendations scored by the Two-Tower Deep Neural Network and refined by the business rules re-ranking engine.

**Query Parameters:**
* `top_k` (int, default=10): Number of recommendations to return.
* `occasion` (string, optional): Cultural occasion filter (e.g., `Eid`, `Wedding`).

**Sample Request:**
`GET /recommendations/USR-00001?top_k=4`

**Sample Response:**
```json
{
  "user_id": "USR-00001",
  "model_used": "hybrid_two_tower",
  "occasion_applied": null,
  "served_from_cache": true,
  "latency_ms": 4.82,
  "recommendations": [
    {
      "product_id": "PROD-00002",
      "title": "Anker Fast Chargers - GaN Edition",
      "category": "Electronics",
      "subcategory": "Fast Chargers",
      "brand": "Anker",
      "price": 4990,
      "rating": 4.8,
      "stock_quantity": 84
    }
  ]
}
```

---

### 3. Similar Products
`GET /similar/{product_id}`

Returns content-based similar items calculated using TF-IDF vector space embeddings of titles, categories, and descriptions.

**Sample Request:**
`GET /similar/PROD-00001?top_k=2`

---

### 4. Frequently Bought Together
`GET /bought-together/{product_id}`

Returns complementary association rules with natural UrduLish customer explanations.

**Sample Request:**
`GET /bought-together/PROD-00001`

**Sample Response:**
```json
{
  "anchor_product_id": "PROD-00001",
  "explanation": "Kyun ke aap ne 'Khaadi Lawn Suit...' pasand kiya, doosre khareedar aksar matching dupatta, khussa aur attar bhi sath cart mein add kartay hain.",
  "frequently_bought_together": [
    {
      "product_id": "PROD-00045",
      "title": "J. Junaid Jamshed Attar Royal Oudh",
      "category": "Beauty & Personal Care",
      "price": 2850
    }
  ]
}
```

---

### 5. Multilingual Hybrid Search
`GET /search`

Hybrid search combining BM25 keyword matching with dense semantic cosine similarity via Reciprocal Rank Fusion ($k=60$).

**Query Parameters:**
* `q` (string, required): Customer query in English, Urdu, or Roman Urdu.
* `top_k` (int, default=15): Number of items to retrieve.
* `user_id` (string, optional): Enables user profile personalization boost (+30%).

**Sample Request:**
`GET /search?q=eid ke liye lawn suit under 5000`

---

### 6. UrduLish Assistant Chat
`POST /assistant/chat`

Conversational AI agent equipped with grounded tool execution for product retrieval, order tracking, comparison, and cart updates.

**Request Body:**
```json
{
  "message": "Ammi ke liye Eid gift chahiye, 3000 tak.",
  "session_id": "sess_102",
  "user_id": "USR-00002"
}
```

**Response Body:**
```json
{
  "tool_called": "search_products",
  "reply": "Ji zaroor! Yeh 3 behtareen options aap ke matlooba criteria ke mutabiq dastiyab hain:\n1. Hemani Attar & Perfumes — PKR 2,699\n...",
  "data": { ... }
}
```

---

### 7. Demand Forecast
`GET /forecast/{product_id}`

Returns 14-day daily probabilistic forecasts (P10, P50, P90) alongside safety stock and reorder point (ROP) parameters.

---

### 8. Inventory & Stock-Out Alerts
`GET /inventory/alerts`

Returns critical stock-out alerts (<14 days), overstock markdown candidates, and pre-festival stocking plans.

