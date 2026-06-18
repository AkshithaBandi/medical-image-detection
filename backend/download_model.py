import os
import requests

MODEL_URL = "https://huggingface.co/akshitha2907/pneumonia-detection-model/blob/main/pneumonia_model.h5"

MODEL_PATH = "model/pneumonia_model.h5"

if not os.path.exists(MODEL_PATH):
    print("Downloading model...")

    os.makedirs("model", exist_ok=True)

    response = requests.get(MODEL_URL)

    with open(MODEL_PATH, "wb") as f:
        f.write(response.content)

    print("Model downloaded.")