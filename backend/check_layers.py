from tensorflow.keras.models import load_model

model = load_model("model/pneumonia_model.h5")

for layer in model.layers:
    print(layer.name)