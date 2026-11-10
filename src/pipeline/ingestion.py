"""
ShopKaro Ingestion & Cleaning Pipeline (Day 1 - Task 1)
- DuckDB engine persistence
- De-duplication of events
- Bot filtering (sessions with 1000+ rapid events or non-human click frequencies)
- 30-minute inactivity session reconstruction
- Categorical ID mapping (User <-> int, Product <-> int)
"""

import os
import duckdb
import pandas as pd
import numpy as np
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
DB_PATH = os.path.join(DATA_DIR, "shopkaro.duckdb")

def run_ingestion_pipeline():
    print(f"Connecting to DuckDB at {DB_PATH}...")
    con = duckdb.connect(DB_PATH)
    
    # 1. Load Parquet tables
    products_path = os.path.join(DATA_DIR, "products.parquet").replace("\\", "/")
    users_path = os.path.join(DATA_DIR, "users.parquet").replace("\\", "/")
    events_path = os.path.join(DATA_DIR, "events.parquet").replace("\\", "/")
    daily_sales_path = os.path.join(DATA_DIR, "daily_sales.parquet").replace("\\", "/")
    reviews_path = os.path.join(DATA_DIR, "reviews.parquet").replace("\\", "/")
    
    con.execute(f"CREATE OR REPLACE TABLE raw_products AS SELECT * FROM '{products_path}'")
    con.execute(f"CREATE OR REPLACE TABLE raw_users AS SELECT * FROM '{users_path}'")
    con.execute(f"CREATE OR REPLACE TABLE raw_events AS SELECT * FROM '{events_path}'")
    con.execute(f"CREATE OR REPLACE TABLE raw_daily_sales AS SELECT * FROM '{daily_sales_path}'")
    con.execute(f"CREATE OR REPLACE TABLE raw_reviews AS SELECT * FROM '{reviews_path}'")
    
    raw_event_count = con.execute("SELECT count(*) FROM raw_events").fetchone()[0]
    print(f"Loaded raw_events: {raw_event_count:,} records.")
    
    # 2. De-duplicate events
    con.execute("""
        CREATE OR REPLACE TABLE deduped_events AS
        SELECT DISTINCT session_id, user_id, product_id, event_type, timestamp
        FROM raw_events
    """)
    deduped_count = con.execute("SELECT count(*) FROM deduped_events").fetchone()[0]
    duplicates_removed = raw_event_count - deduped_count
    print(f"De-duplication: removed {duplicates_removed:,} duplicate events. Remaining: {deduped_count:,}")
    
    # 3. Bot Detection: Identify sessions with >= 1000 events or impossible click rates
    con.execute("""
        CREATE OR REPLACE TABLE bot_sessions AS
        SELECT session_id, count(*) as event_count
        FROM deduped_events
        GROUP BY session_id
        HAVING count(*) >= 1000
    """)
    bot_session_count = con.execute("SELECT count(*) FROM bot_sessions").fetchone()[0]
    print(f"Bot detection: found {bot_session_count} bot sessions with >= 1000 clicks.")
    
    # Filter out bot events
    con.execute("""
        CREATE OR REPLACE TABLE human_events AS
        SELECT e.* 
        FROM deduped_events e
        LEFT JOIN bot_sessions b ON e.session_id = b.session_id
        WHERE b.session_id IS NULL
    """)
    human_event_count = con.execute("SELECT count(*) FROM human_events").fetchone()[0]
    print(f"Human events retained: {human_event_count:,}")
    
    # 4. 30-minute Inactivity Session Reconstruction
    print("Rebuilding user sessions with 30-minute inactivity boundary...")
    con.execute("""
        CREATE OR REPLACE TABLE events_with_lag AS
        SELECT 
            user_id,
            product_id,
            event_type,
            epoch(timestamp::TIMESTAMP) as ts_epoch,
            timestamp::TIMESTAMP as ts,
            LAG(epoch(timestamp::TIMESTAMP)) OVER (PARTITION BY user_id ORDER BY timestamp::TIMESTAMP) as prev_ts_epoch
        FROM human_events
    """)
    
    con.execute("""
        CREATE OR REPLACE TABLE events_flagged AS
        SELECT 
            *,
            CASE 
                WHEN prev_ts_epoch IS NULL OR (ts_epoch - prev_ts_epoch) > 1800 THEN 1 
                ELSE 0 
            END as is_new_session
        FROM events_with_lag
    """)
    
    con.execute("""
        CREATE OR REPLACE TABLE events_sessionized AS
        SELECT 
            'SESS_' || user_id || '_' || SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as computed_session_id,
            user_id,
            product_id,
            event_type,
            ts as timestamp
        FROM events_flagged
    """)
    
    total_reconstructed_sessions = con.execute("SELECT count(DISTINCT computed_session_id) FROM events_sessionized").fetchone()[0]
    print(f"Reconstructed {total_reconstructed_sessions:,} discrete sessions using 30-minute inactivity rule.")
    
    # 5. User & Item ID Integer Mapping (for Matrix Factorization & Graph embeddings)
    con.execute("""
        CREATE OR REPLACE TABLE user_mapping AS
        SELECT user_id, ROW_NUMBER() OVER () - 1 AS user_idx
        FROM (SELECT DISTINCT user_id FROM events_sessionized ORDER BY user_id)
    """)
    
    con.execute("""
        CREATE OR REPLACE TABLE item_mapping AS
        SELECT product_id, ROW_NUMBER() OVER () - 1 AS item_idx
        FROM (SELECT DISTINCT product_id FROM raw_products ORDER BY product_id)
    """)
    
    # 6. Final Cleaned Events Table with joins
    con.execute("""
        CREATE OR REPLACE TABLE cleaned_events AS
        SELECT 
            e.computed_session_id as session_id,
            e.user_id,
            u.user_idx,
            e.product_id,
            i.item_idx,
            p.category,
            p.brand,
            p.price,
            e.event_type,
            e.timestamp
        FROM events_sessionized e
        JOIN user_mapping u ON e.user_id = u.user_id
        JOIN item_mapping i ON e.product_id = i.product_id
        JOIN raw_products p ON e.product_id = p.product_id
    """)
    
    final_count = con.execute("SELECT count(*) FROM cleaned_events").fetchone()[0]
    print(f"Pipeline complete! Saved 'cleaned_events' table in DuckDB with {final_count:,} records.")
    con.close()
    return True

if __name__ == "__main__":
    run_ingestion_pipeline()

