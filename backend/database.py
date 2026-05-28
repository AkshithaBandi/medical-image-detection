import sqlite3

# Connect database
conn = sqlite3.connect(
    "predictions.db",
    check_same_thread=False
)

cursor = conn.cursor()

# Create predictions table
cursor.execute("""
CREATE TABLE IF NOT EXISTS predictions (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_email TEXT,

    prediction TEXT,

    confidence REAL,

    severity TEXT,

    risk_level TEXT,

    report TEXT,

    recommendation TEXT,

    heatmap_image TEXT,

    pdf_report TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# Create users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT UNIQUE,

    email TEXT UNIQUE,

    password TEXT
)
""")

# Commit changes
conn.commit()