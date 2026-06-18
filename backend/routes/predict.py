from fastapi import APIRouter, File, UploadFile, Form
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import uuid
import cv2
import os
import download_model

from utils.gradcam import make_gradcam_heatmap
from utils.report_generator import generate_medical_report
from utils.pdf_generator import generate_pdf_report

from database import conn, cursor

router = APIRouter()

# Load trained model
model = load_model("model/pneumonia_model.h5", compile=False)

IMG_SIZE = 224

# Create folders if not exist
os.makedirs("heatmaps", exist_ok=True)
os.makedirs("reports", exist_ok=True)


def preprocess_image(image):
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    user_email: str = Form(...)
):

    # Read uploaded image
    image_bytes = await file.read()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    
    # Preprocess image
    processed_image = preprocess_image(image)

    # Model prediction
    prediction = float(model.predict(processed_image)[0][0])

    # More conservative threshold
    PNEUMONIA_THRESHOLD = 0.75

    # Confidence calibration
    if prediction >= PNEUMONIA_THRESHOLD:
        result = "Pneumonia"

        # Scale confidence more realistically
        confidence = 70 + ((prediction - PNEUMONIA_THRESHOLD) / (1 - PNEUMONIA_THRESHOLD)) * 30

    else:
        result = "Normal"

        # Normal confidence scaling
        confidence = 70 + ((PNEUMONIA_THRESHOLD - prediction) / PNEUMONIA_THRESHOLD) * 30

    # Clamp values
    confidence = max(70, min(confidence, 99.5))

    # Generate Grad-CAM heatmap
    heatmap = make_gradcam_heatmap(
        processed_image,
        model,
        "Conv_1"
    )

    # Unique ID
    unique_id = str(uuid.uuid4())

    # File paths
    original_path = f"heatmaps/{unique_id}_original.jpg"
    heatmap_path = f"heatmaps/{unique_id}_heatmap.jpg"
    pdf_path = f"reports/{unique_id}_report.pdf"

    # Save original image
    image.save(original_path)

    # Read with OpenCV
    original = cv2.imread(original_path)

    # Resize heatmap
    heatmap_resized = cv2.resize(
        heatmap,
        (original.shape[1], original.shape[0])
    )

    # Convert to color
    heatmap_resized = np.uint8(255 * heatmap_resized)

    heatmap_colored = cv2.applyColorMap(
        heatmap_resized,
        cv2.COLORMAP_JET
    )

    # Overlay heatmap
    superimposed_img = cv2.addWeighted(
        original,
        0.6,
        heatmap_colored,
        0.4,
        0
    )

    # Save heatmap
    cv2.imwrite(heatmap_path, superimposed_img)

    # Generate medical report
    medical_report = generate_medical_report(
        result,
        confidence
    )

    # Generate PDF report
    pdf_data = {
        "prediction": result,
        "confidence": round(confidence, 2),
        "severity": medical_report["severity"],
        "risk_level": medical_report["risk_level"],
        "report": medical_report["report"],
        "recommendation": medical_report["recommendation"],
        "heatmap_path": heatmap_path
    }

    generate_pdf_report(pdf_data, pdf_path)

    # Save to database
    cursor.execute("""
    INSERT INTO predictions (
        user_email,
        prediction,
        confidence,
        severity,
        risk_level,
        report,
        recommendation,
        heatmap_image,
        pdf_report
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_email,
        result,
        round(confidence, 2),
        medical_report["severity"],
        medical_report["risk_level"],
        medical_report["report"],
        medical_report["recommendation"],
        heatmap_path,
        pdf_path
    ))

    conn.commit()

    # Return response
    return {
        "prediction": result,
        "confidence": round(confidence, 2),
        "severity": medical_report["severity"],
        "risk_level": medical_report["risk_level"],
        "report": medical_report["report"],
        "recommendation": medical_report["recommendation"],
        "heatmap_image": f"http://127.0.0.1:8000/{heatmap_path}",
        "pdf_report": f"http://127.0.0.1:8000/{pdf_path}",
        
    }