# Description: This file is used to test the YOLO model with the camera.
from ultralytics import YOLO

model = YOLO('../models/model_clasification.pt')

results = model.predict(source=0, show=True)

print(results)

model.close()