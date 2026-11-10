"""
ShopKaro Synthetic Data Generator
Generates realistic, production-scale Pakistani e-commerce data:
- 50,000 Products across 5 core categories with PKR pricing & local brands
- 520,000+ Interaction events (with bots & duplicates for data pipeline cleaning)
- 2-Year daily sales history with shifting Islamic festivals (Eid ul Fitr, Eid ul Adha, Ramadan, 11.11)
- 6,500+ Customer reviews in English, Urdu, and Roman Urdu (UrduLish)
"""

import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Product Catalog Configuration
CATEGORIES = {
    "Fashion": {
        "subcategories": ["Lawn Suits", "Kurtas", "Shawls & Stoles", "Chiffon Sarees", "Peshawari Chappal", "Khussa Shoes", "Bridal Lehengas", "Denim Jeans"],
        "brands": ["Khaadi", "Gul Ahmed", "Sapphire", "Junaid Jamshed", "Alkaram Studio", "Sana Safinaz", "Bareeze", "Nishat Linen", "Outfitters", "Charcoal"],
        "price_range": (1499, 38500),
        "descriptions": [
            "Premium 3-piece unstitched embroidered lawn collection with chiffon dupatta.",
            "Handcrafted pure leather Peshawari chappal with comfortable tyre sole.",
            "Classic summer digital printed kurta crafted from breathable breathable cotton fabric.",
            "Traditional embroidered pashmina shawl perfect for winter weddings and formal evenings.",
            "Royal designer bridal lehenga with intricate zardozi, dabka, and pearl embellishments.",
            "Authentic handmade Multani khussa with floral embroidery and cushioned insole."
        ]
    },
    "Electronics": {
        "subcategories": ["Smartphones", "Wireless Earbuds", "Power Banks", "Fast Chargers", "Laptops for Coding", "Smart Watches", "Bluetooth Speakers"],
        "brands": ["Xiaomi", "Samsung", "Infinix", "Tecno", "Anker", "Faster", "Ronin", "Audionic", "HP", "Lenovo"],
        "price_range": (850, 245000),
        "descriptions": [
            "High performance octa-core gaming smartphone with 120Hz AMOLED display and 67W fast charging.",
            "Active noise cancelling wireless earbuds with 36-hour total battery life and deep bass boost.",
            "Heavy-duty 20000mAh PD fast power bank with dual USB-C ports and digital percentage display.",
            "GaN 65W ultra-compact laptop and mobile super charger compatible with MacBook and Android.",
            "Developer edition 16GB RAM quad-core SSD laptop engineered for heavy coding and multitasking.",
            "Waterproof AMOLED smartwatch with heart rate, SpO2 sensor, Bluetooth calling and Urdu font support."
        ]
    },
    "Home & Living": {
        "subcategories": ["Bedsheets", "Peshawar Rugs", "Truck Art Decor", "Clay Handi Cookware", "Air Fryers", "Electric Kettles", "LED Ring Lights"],
        "brands": ["ChenOne", "Habitt", "Gul Ahmed Home", "Anex", "Westpoint", "Black & Decker", "National Home", "Local Artisans"],
        "price_range": (650, 48000),
        "descriptions": [
            "100% Egyptian cotton king size luxury fitted bedsheet set with two matching pillowcases.",
            "Hand-knotted authentic geometric wool rug crafted by traditional Peshawar artisans.",
            "Colourful handmade Pakistani truck art mug with vibrant floral motifs and Urdu poetry.",
            "Traditional clay handi for authentic desi biryani and handi cooking with heat retention.",
            "Rapid hot air oil-free 6-liter digital air fryer with 8 preset Pakistani cooking menus.",
            "Stainless steel 1.8-liter fast boiling cordless electric kettle with auto shut-off safety."
        ]
    },
    "Beauty & Personal Care": {
        "subcategories": ["Attar & Perfumes", "Herbal Hair Oils", "Organic Rose Water", "Sunscreens", "Face Serums", "Beard Grooming"],
        "brands": ["Junaid Jamshed Fragrances", "Hemani", "Saeed Ghani", "WB by Hemani", "Conatural", "Vince", "Bio Aqua", "Rivaj UK"],
        "price_range": (350, 14500),
        "descriptions": [
            "Long-lasting alcohol-free royal Oudh and Amber attar gift set with crystal bottle.",
            "Traditional Mughal recipe 7-herbs nourishing hair growth oil enriched with Amla and Shikakai.",
            "Pure steam-distilled wild Rosa damascena organic rose water toner for instant hydration.",
            "SPF 60+ matte finish non-greasy sunscreen lotion formulated for humid Pakistani climate.",
            "20% Vitamin C + Hyaluronic Acid brightening facial glow serum for dark spots and pigmentation.",
            "All-natural organic almond and jojoba beard conditioning oil with pleasant woody scent."
        ]
    },
    "Groceries": {
        "subcategories": ["Basmati Rice", "Chai & Tea", "Spices & Recipe Mixes", "Syrups & Beverages", "Dates & Dry Fruits", "Cooking Oils & Ghee"],
        "brands": ["Tapal", "Shan Foods", "National Foods", "Guard Rice", "Rooh Afza (Hamdard)", "Mitchells", "Dalda", "Mezan", "Vital Tea"],
        "price_range": (180, 12500),
        "descriptions": [
            "Aged super kernel long grain aromatic Pakistani basmati rice for royal dum biryani.",
            "Danedar strong blend leaf tea for traditional rich karak doodh patti chai.",
            "Special Bombay Biryani recipe masala packet with authentic aromatic whole spices.",
            "Refreshing herbal summer syrup crafted from fruit extracts, herbs, and natural essences.",
            "Premium export grade Saudi Ajwa and Pakistani Aseel dates rich in minerals and fiber.",
            "Double refined pure banaspati ghee with vitamins A and D for traditional culinary taste."
        ]
    }
}

# Pakistani Festival Calendar (2024 - 2026)
FESTIVALS = [
    # 2024
    {"name": "Ramadan 2024", "start": "2024-03-11", "end": "2024-04-09", "boost_cats": ["Groceries", "Home & Living"], "multiplier": 2.2},
    {"name": "Pakistan Day Sale 2024", "start": "2024-03-21", "end": "2024-03-25", "boost_cats": ["Fashion", "Electronics"], "multiplier": 1.7},
    {"name": "Eid ul Fitr 2024", "start": "2024-04-01", "end": "2024-04-12", "boost_cats": ["Fashion", "Beauty & Personal Care"], "multiplier": 3.8},
    {"name": "Eid ul Adha 2024", "start": "2024-06-08", "end": "2024-06-20", "boost_cats": ["Groceries", "Home & Living"], "multiplier": 2.5},
    {"name": "Independence Day Azadi Sale 2024", "start": "2024-08-10", "end": "2024-08-16", "boost_cats": ["Fashion", "Electronics"], "multiplier": 2.1},
    {"name": "11.11 Mega Sale 2024", "start": "2024-11-10", "end": "2024-11-17", "boost_cats": ["Electronics", "Fashion", "Beauty & Personal Care", "Home & Living"], "multiplier": 4.5},
    {"name": "Blessed Friday 2024", "start": "2024-11-28", "end": "2024-12-02", "boost_cats": ["Fashion", "Electronics"], "multiplier": 2.8},

    # 2025
    {"name": "Ramadan 2025", "start": "2025-03-01", "end": "2025-03-30", "boost_cats": ["Groceries", "Home & Living"], "multiplier": 2.3},
    {"name": "Pakistan Day Sale 2025", "start": "2025-03-21", "end": "2025-03-25", "boost_cats": ["Fashion", "Electronics"], "multiplier": 1.8},
    {"name": "Eid ul Fitr 2025", "start": "2025-03-22", "end": "2025-04-03", "boost_cats": ["Fashion", "Beauty & Personal Care"], "multiplier": 3.9},
    {"name": "Eid ul Adha 2025", "start": "2025-05-28", "end": "2025-06-09", "boost_cats": ["Groceries", "Home & Living"], "multiplier": 2.6},
    {"name": "Independence Day Azadi Sale 2025", "start": "2025-08-10", "end": "2025-08-16", "boost_cats": ["Fashion", "Electronics"], "multiplier": 2.2},
    {"name": "11.11 Mega Sale 2025", "start": "2025-11-10", "end": "2025-11-17", "boost_cats": ["Electronics", "Fashion", "Beauty & Personal Care", "Home & Living"], "multiplier": 4.8},
    {"name": "Blessed Friday 2025", "start": "2025-11-27", "end": "2025-12-01", "boost_cats": ["Fashion", "Electronics"], "multiplier": 2.9},

    # 2026
    {"name": "Ramadan 2026", "start": "2026-02-18", "end": "2026-03-19", "boost_cats": ["Groceries", "Home & Living"], "multiplier": 2.4},
    {"name": "Eid ul Fitr 2026", "start": "2026-03-10", "end": "2026-03-22", "boost_cats": ["Fashion", "Beauty & Personal Care"], "multiplier": 4.0},
    {"name": "Pakistan Day Sale 2026", "start": "2026-03-21", "end": "2026-03-25", "boost_cats": ["Fashion", "Electronics"], "multiplier": 1.8},
    {"name": "Eid ul Adha 2026", "start": "2026-05-18", "end": "2026-05-29", "boost_cats": ["Groceries", "Home & Living"], "multiplier": 2.7}
]

def generate_products(total_count=50000):
    print(f"Generating {total_count} products...")
    cat_keys = list(CATEGORIES.keys())
    cat_weights = [0.35, 0.25, 0.15, 0.15, 0.10] # Fashion is largest in Pakistan e-com
    
    rows = []
    for i in range(1, total_count + 1):
        pid = f"PROD-{i:05d}"
        cat = random.choices(cat_keys, weights=cat_weights, k=1)[0]
        cat_info = CATEGORIES[cat]
        subcat = random.choice(cat_info["subcategories"])
        brand = random.choice(cat_info["brands"])
        
        # Price in PKR with psychological e-commerce endings (.99 / 499 / 990 / round)
        min_p, max_p = cat_info["price_range"]
        base_price = int(np.random.triangular(min_p, min_p * 1.8, max_p))
        if base_price > 5000:
            price = round(base_price / 100) * 100 - 10 # e.g. 5990
        else:
            price = round(base_price / 50) * 50 - 1   # e.g. 1499
        
        desc = random.choice(cat_info["descriptions"])
        title = f"{brand} {subcat} - {desc.split()[1]} Collection Edition"
        
        # Margins: Fashion ~35%, Electronics ~15%, Beauty ~40%, Groceries ~12%
        margin_rates = {"Fashion": 0.35, "Electronics": 0.16, "Home & Living": 0.28, "Beauty & Personal Care": 0.42, "Groceries": 0.12}
        margin = round(margin_rates[cat] + random.uniform(-0.04, 0.05), 3)
        
        # Stock: 8% out of stock, popular items have 50-300 units, staples 500+
        if random.random() < 0.08:
            stock = 0
        else:
            stock = int(np.random.exponential(scale=120)) + 5
            
        rating = round(random.uniform(3.4, 4.9), 1) if random.random() > 0.15 else 0.0
        review_count = int(np.random.pareto(a=1.8) * 15) if rating > 0 else 0
        lead_time_days = random.choice([2, 3, 4, 5, 7, 10])
        seller_id = f"SLR-{random.randint(101, 250):03d}"
        
        rows.append({
            "product_id": pid,
            "title": title,
            "category": cat,
            "subcategory": subcat,
            "brand": brand,
            "price": price,
            "margin_rate": margin,
            "stock_quantity": stock,
            "lead_time_days": lead_time_days,
            "rating": rating,
            "review_count": review_count,
            "seller_id": seller_id,
            "description": f"{title}. {desc} Free nationwide delivery across Pakistan on orders above PKR 2,500. COD and JazzCash / EasyPaisa accepted."
        })
        
    df = pd.DataFrame(rows)
    df.to_parquet(os.path.join(DATA_DIR, "products.parquet"), index=False)
    print(f"Products saved: {len(df)} records.")
    return df

def generate_users(total_users=25000):
    print(f"Generating {total_users} users...")
    cities = [
        ("Karachi", 0.35),
        ("Lahore", 0.28),
        ("Islamabad", 0.12),
        ("Rawalpindi", 0.08),
        ("Faisalabad", 0.06),
        ("Multan", 0.04),
        ("Peshawar", 0.04),
        ("Quetta", 0.02),
        ("Sialkot", 0.01)
    ]
    city_names, city_weights = zip(*cities)
    
    cat_keys = list(CATEGORIES.keys())
    
    rows = []
    for i in range(1, total_users + 1):
        uid = f"USR-{i:05d}"
        city = random.choices(city_names, weights=city_weights, k=1)[0]
        pref_cat = random.choice(cat_keys)
        signup_date = datetime(2023, 1, 1) + timedelta(days=random.randint(0, 1000))
        device = random.choices(["android_app", "ios_app", "mobile_web", "desktop_web"], weights=[0.60, 0.15, 0.15, 0.10], k=1)[0]
        
        rows.append({
            "user_id": uid,
            "city": city,
            "preferred_category": pref_cat,
            "device": device,
            "created_at": signup_date.strftime("%Y-%m-%d %H:%M:%S")
        })
    df = pd.DataFrame(rows)
    df.to_parquet(os.path.join(DATA_DIR, "users.parquet"), index=False)
    print(f"Users saved: {len(df)} records.")
    return df

def generate_events(products_df, users_df, min_events=520000):
    print(f"Generating interaction events (target >= {min_events})...")
    user_ids = users_df["user_id"].tolist()
    prod_ids = products_df["product_id"].tolist()
    
    # 80/20 Pareto distribution on product popularity
    # 20% of products get 80% of views
    top_20_count = int(len(prod_ids) * 0.20)
    popular_pids = prod_ids[:top_20_count]
    long_tail_pids = prod_ids[top_20_count:]
    
    start_time = datetime(2024, 1, 1, 0, 0, 0)
    total_days = 1000 # spanning 2024 through late 2026
    
    event_rows = []
    event_id = 1
    session_counter = 1
    
    # Generate realistic user sessions
    while len(event_rows) < min_events:
        uid = random.choice(user_ids)
        sess_id = f"SESS-{session_counter:07d}"
        session_counter += 1
        
        # Session timestamp
        sess_start = start_time + timedelta(
            days=random.randint(0, total_days - 1),
            hours=random.choices(range(24), weights=[1,1,1,1,1,2,3,5,7,9,11,12,11,10,10,11,12,14,16,18,17,14,10,5], k=1)[0],
            minutes=random.randint(0, 59),
            seconds=random.randint(0, 59)
        )
        
        # Bot session injection (0.5% probability: session with 1000+ rapid clicks for task 1 cleaner)
        is_bot = random.random() < 0.003
        num_clicks = random.randint(1020, 1250) if is_bot else random.choices([1, 2, 3, 5, 8, 12, 18], weights=[0.35, 0.25, 0.18, 0.12, 0.06, 0.03, 0.01], k=1)[0]
        
        curr_t = sess_start
        for step in range(num_clicks):
            if random.random() < 0.80:
                pid = random.choice(popular_pids)
            else:
                pid = random.choice(long_tail_pids)
            
            # Step 1: view
            event_rows.append({
                "event_id": f"EVT-{event_id:08d}",
                "session_id": sess_id,
                "user_id": uid,
                "product_id": pid,
                "event_type": "view",
                "timestamp": curr_t.strftime("%Y-%m-%d %H:%M:%S")
            })
            event_id += 1
            
            # Funnel progression: view -> cart (18% conversion) -> purchase (35% of cart)
            if not is_bot and random.random() < 0.18:
                curr_t += timedelta(seconds=random.randint(20, 180))
                event_rows.append({
                    "event_id": f"EVT-{event_id:08d}",
                    "session_id": sess_id,
                    "user_id": uid,
                    "product_id": pid,
                    "event_type": "add_to_cart",
                    "timestamp": curr_t.strftime("%Y-%m-%d %H:%M:%S")
                })
                event_id += 1
                
                if random.random() < 0.35:
                    curr_t += timedelta(seconds=random.randint(45, 300))
                    event_rows.append({
                        "event_id": f"EVT-{event_id:08d}",
                        "session_id": sess_id,
                        "user_id": uid,
                        "product_id": pid,
                        "event_type": "purchase",
                        "timestamp": curr_t.strftime("%Y-%m-%d %H:%M:%S")
                    })
                    event_id += 1
            
            # Time between clicks (bots: 0.1-0.5s; humans: 15-180s)
            curr_t += timedelta(seconds=random.uniform(0.1, 0.4) if is_bot else random.randint(15, 180))
            
            if len(event_rows) >= min_events and not is_bot:
                break
                
    df_events = pd.DataFrame(event_rows)
    
    # Inject a small fraction of duplicate events (e.g. double-click network retries)
    dup_sample = df_events.sample(n=1500, random_state=42)
    df_events = pd.concat([df_events, dup_sample], ignore_index=True)
    
    df_events.to_parquet(os.path.join(DATA_DIR, "events.parquet"), index=False)
    print(f"Events generated and saved: {len(df_events)} records (including synthetic bots and duplicates for cleaning).")
    return df_events

def generate_daily_sales(products_df, days=730):
    print(f"Generating 2 years ({days} days) daily sales history with shifting festival effects...")
    # Top 500 tracked products across all categories for granular time-series modeling
    sample_prods = products_df.head(500)[["product_id", "category", "price"]].to_dict("records")
    
    start_date = datetime(2024, 1, 1)
    date_list = [start_date + timedelta(days=d) for d in range(days)]
    
    sales_rows = []
    for dt in date_list:
        dt_str = dt.strftime("%Y-%m-%d")
        dow = dt.weekday() # 0 = Monday, 6 = Sunday
        is_weekend = 1.35 if dow in [5, 6] else 1.0
        
        # Check active festival multipliers
        fest_mult = 1.0
        active_fest_name = "Normal"
        for fest in FESTIVALS:
            f_start = datetime.strptime(fest["start"], "%Y-%m-%d")
            f_end = datetime.strptime(fest["end"], "%Y-%m-%d")
            if f_start <= dt <= f_end:
                active_fest_name = fest["name"]
                fest_mult = fest["multiplier"]
                break
                
        for p in sample_prods:
            cat = p["category"]
            price = p["price"]
            
            # Base daily demand depends inversely on price, and category baseline
            base_demand = max(1, int(15000 / (price ** 0.6)))
            
            # Specific category festival affinity
            cat_fest_factor = fest_mult
            if "Eid" in active_fest_name and cat in ["Fashion", "Beauty & Personal Care"]:
                cat_fest_factor = fest_mult * 1.45
            elif "11.11" in active_fest_name:
                cat_fest_factor = fest_mult * 1.55
            elif "Ramadan" in active_fest_name and cat in ["Groceries", "Home & Living"]:
                cat_fest_factor = fest_mult * 1.30
                
            mean_qty = base_demand * is_weekend * cat_fest_factor
            noise = np.random.normal(1.0, 0.15)
            actual_qty = max(0, int(np.random.poisson(lam=max(0.5, mean_qty * noise))))
            
            sales_rows.append({
                "date": dt_str,
                "product_id": p["product_id"],
                "category": cat,
                "quantity": actual_qty,
                "revenue": actual_qty * price,
                "festival": active_fest_name,
                "day_of_week": dow,
                "is_weekend": 1 if dow in [5, 6] else 0
            })
            
    df_sales = pd.DataFrame(sales_rows)
    df_sales.to_parquet(os.path.join(DATA_DIR, "daily_sales.parquet"), index=False)
    print(f"Daily sales saved: {len(df_sales)} daily product records.")
    return df_sales

def generate_reviews(products_df, total_reviews=6500):
    print(f"Generating {total_reviews} multilingual (English, Urdu, UrduLish/Roman Urdu) reviews...")
    sample_pids = products_df["product_id"].tolist()[:1000]
    
    # Rich Roman Urdu, Urdu, and English templates with aspect tags
    TEMPLATES = [
        # Roman Urdu / UrduLish
        ("Kapra bohot shandar hai, pure lawn hai lekin stitching thori loose thi.", 4, "positive", "quality,fit", "Fashion"),
        ("Delivery bohot late aayi, 8 din lag gaye Karachi se Lahore aane mein.", 2, "negative", "delivery", "All"),
        ("Yeh suit Eid ke liye perfect hai, color bilkul photo jaisa hai!", 5, "positive", "quality,price", "Fashion"),
        ("Price ke hisab se product bekar hai, packaging phati hui thi.", 1, "negative", "price,packaging", "All"),
        ("Sound quality aur bass zabardast hai, battery timing 2 din chal jati hai.", 5, "positive", "quality", "Electronics"),
        ("Seller ne original charger nahi bheja, duplicate lag raha hai.", 1, "negative", "seller,quality", "Electronics"),
        ("Bhai kamaal cheez hai! Paisa vasool item. Sab ko recommend karunga.", 5, "positive", "price,quality", "All"),
        ("Size ka masla hai, large order kiya tha magar medium jitna chhota hai.", 2, "negative", "fit", "Fashion"),
        ("Daraz aur doosri apps se behtar price mili ShopKaro par. Packaging safe thi.", 5, "positive", "price,packaging", "All"),
        ("Lawn suit ka dupatta bohot pyara hai, Eid par sab ne tareef ki.", 5, "positive", "quality", "Fashion"),
        ("Achi quality hai magar delivery boy ka ravaiyya kharab tha.", 3, "neutral", "delivery,seller", "All"),
        ("Chai ka zaika bilkul kadak hai, subah ki doodh patti ke liye best.", 5, "positive", "quality", "Groceries"),
        
        # Urdu Script
        ("کپڑے کا معیار بہت اعلیٰ ہے اور کڑھائی نفیس ہے۔ عید کے لیے بہترین انتخاب۔", 5, "positive", "quality", "Fashion"),
        ("ڈیلیوری بہت تاخیر سے ہوئی، وقت پر آرڈر نہ مل سکا۔", 2, "negative", "delivery", "All"),
        ("قیمت مناسب ہے اور پیکنگ بھی محفوظ تھی۔ شکریہ شاپ کرو۔", 4, "positive", "price,packaging", "All"),
        ("پروڈکٹ کی کوالٹی تصاویر جیسی نہیں ہے۔ مایوسی ہوئی۔", 1, "negative", "quality", "All"),
        
        # English
        ("The fabric is 100% breathable cotton, ideal for peak Pakistani summers.", 5, "positive", "quality", "Fashion"),
        ("Battery backup is stellar, easily lasts 2 full days of heavy use.", 5, "positive", "quality", "Electronics"),
        ("Disappointed with the delivery timeline. Took 9 days to arrive in Islamabad.", 2, "negative", "delivery", "All"),
        ("Excellent value for money. Highly recommended seller!", 5, "positive", "price,seller", "All"),
        ("Wrong color delivered. Requested emerald green but received light olive.", 2, "negative", "seller,quality", "Fashion"),
        ("Packaging was crushed during transit, but the product inside was intact.", 3, "neutral", "packaging,delivery", "Home & Living")
    ]
    
    rows = []
    for i in range(1, total_reviews + 1):
        rid = f"REV-{i:06d}"
        tpl = random.choice(TEMPLATES)
        text, rating, sentiment, aspects, cat_req = tpl
        pid = random.choice(sample_pids)
        
        # Add slight natural jitter
        if random.random() < 0.04: # 4% spam bursts (identical repetitive reviews)
            text = "GREAT BUY BEST PRICE 100% SATISFIED BUY NOW CLICK HERE"
            rating = 5
            sentiment = "positive"
            aspects = "spam"
            is_spam = True
        else:
            is_spam = False
            
        rev_date = datetime(2024, 1, 1) + timedelta(days=random.randint(0, 950))
        
        rows.append({
            "review_id": rid,
            "product_id": pid,
            "user_id": f"USR-{random.randint(1, 20000):05d}",
            "rating": rating,
            "review_text": text,
            "sentiment": sentiment,
            "aspects": aspects,
            "is_spam": is_spam,
            "created_at": rev_date.strftime("%Y-%m-%d %H:%M:%S")
        })
        
    df = pd.DataFrame(rows)
    df.to_parquet(os.path.join(DATA_DIR, "reviews.parquet"), index=False)
    print(f"Reviews saved: {len(df)} records.")
    return df

if __name__ == "__main__":
    p_df = generate_products(50000)
    u_df = generate_users(25000)
    e_df = generate_events(p_df, u_df, min_events=520000)
    s_df = generate_daily_sales(p_df, days=730)
    r_df = generate_reviews(p_df, total_reviews=6500)
    print("All datasets generated successfully!")

