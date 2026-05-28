from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter

import os

def generate_pdf_report(data, output_path):

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter
    )

    styles = getSampleStyleSheet()

    elements = []

    title = Paragraph(
        "<b>AI Medical Diagnosis Report</b>",
        styles['Title']
    )

    elements.append(title)
    elements.append(Spacer(1, 20))

    fields = [
        ("Prediction", data["prediction"]),
        ("Confidence", f'{data["confidence"]}%'),
        ("Severity", data["severity"]),
        ("Risk Level", data["risk_level"]),
        ("Report", data["report"]),
        ("Recommendation", data["recommendation"])
    ]

    for label, value in fields:

        text = Paragraph(
            f"<b>{label}:</b> {value}",
            styles['BodyText']
        )

        elements.append(text)
        elements.append(Spacer(1, 12))

    # Add heatmap image
    if os.path.exists(data["heatmap_path"]):

        heatmap = Image(
            data["heatmap_path"],
            width=400,
            height=300
        )

        elements.append(Spacer(1, 20))

        heatmap_title = Paragraph(
            "<b>Grad-CAM Heatmap</b>",
            styles['Heading2']
        )

        elements.append(heatmap_title)
        elements.append(Spacer(1, 10))
        elements.append(heatmap)

    doc.build(elements)