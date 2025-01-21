# Description: This file is used to test the YOLO model with the camera.
from ultralytics import YOLO

# cargar el modelo
model = YOLO('/home/bryan/Documents/Proyects/Project-CuyWise/object-detection-service/src/models/model_clasification.pt')

# cargar la cámara
results = model.predict(source=0, show=True)

print(results)

model.close()