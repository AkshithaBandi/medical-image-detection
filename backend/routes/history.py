from fastapi import APIRouter

from database import conn, cursor

router = APIRouter()


@router.get("/history/{user_email}")
def get_history(user_email: str):

    cursor.execute("""
    SELECT *
    FROM predictions
    WHERE user_email=?
    ORDER BY created_at DESC
    """, (user_email,))

    rows = cursor.fetchall()

    history = []

    for row in rows:

        history.append({
            "id": row[0],
            "user_email": row[1],
            "prediction": row[2],
            "confidence": row[3],
            "severity": row[4],
            "risk_level": row[5],
            "report": row[6],
            "recommendation": row[7],
            "heatmap_image": f"http://127.0.0.1:8000/{row[8]}",
            "pdf_report": f"http://127.0.0.1:8000/{row[9]}",
            "created_at": row[10]
        })

    return history