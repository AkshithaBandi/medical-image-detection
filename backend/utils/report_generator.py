def generate_medical_report(prediction, confidence):

    # Severity Logic
    if prediction == "Pneumonia":

        if confidence >= 90:
            severity = "Severe"
            risk_level = "High"

        elif confidence >= 80:
            severity = "Moderate"
            risk_level = "Moderate"

        else:
            severity = "Mild"
            risk_level = "Low"

    else:

        severity = "Normal"
        risk_level = "Minimal"

    # Pneumonia Reports
    if prediction == "Pneumonia":

        if confidence >= 90:

            report = (
                "Significant pneumonia-related opacity patterns detected in portions "
                "of the lung fields. The AI model identified strong abnormal radiographic features."
            )

            recommendation = (
                "Prompt clinical evaluation and radiologist review are recommended."
            )

        elif confidence >= 80:

            report = (
                "Moderate pneumonia-associated visual abnormalities identified "
                "within the chest X-ray."
            )

            recommendation = (
                "Further diagnostic assessment and medical consultation are advised."
            )

        else:

            report = (
                "Mild pneumonia-like radiographic patterns detected with lower confidence."
            )

            recommendation = (
                "Clinical correlation and follow-up evaluation may be beneficial."
            )

    # Normal Reports
    else:

        if confidence >= 90:

            report = (
                "Chest X-ray appears within normal radiological limits with no significant "
                "pneumonia-related abnormalities detected."
            )

        elif confidence >= 80:

            report = (
                "No major pneumonia-associated findings identified in the chest X-ray."
            )

        else:

            report = (
                "Chest X-ray does not demonstrate strong evidence of pneumonia."
            )

        recommendation = (
            "If respiratory symptoms persist, professional medical consultation is recommended."
        )

    return {
        "severity": severity,
        "risk_level": risk_level,
        "report": report,
        "recommendation": recommendation
    }