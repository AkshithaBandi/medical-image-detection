import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import load_model

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score
)

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Load trained model
model = load_model("model/pneumonia_model.h5")

# Test dataset path
test_dir = "../dataset/chest_xray/test"

IMG_SIZE = 224
BATCH_SIZE = 32

# Preprocess test images
test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='binary',
    shuffle=False
)

# Predict
predictions = model.predict(test_generator)

# Convert probabilities to classes
y_pred = (predictions > 0.5).astype(int).flatten()

# True labels
y_true = test_generator.classes

# Accuracy
accuracy = accuracy_score(y_true, y_pred)

print(f"\nAccuracy: {accuracy * 100:.2f}%\n")

# Classification Report
print("Classification Report:\n")

print(classification_report(
    y_true,
    y_pred,
    target_names=['NORMAL', 'PNEUMONIA']
))

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(6, 5))

sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Blues',
    xticklabels=['NORMAL', 'PNEUMONIA'],
    yticklabels=['NORMAL', 'PNEUMONIA']
)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")

plt.show()