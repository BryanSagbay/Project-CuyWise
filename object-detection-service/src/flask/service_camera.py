# Description: This file is used to test the YOLO model with the camera.
from ultralytics import YOLO

model = YOLO('/home/bryan/Documents/Proyects/Project-CuyWise/object-detection-service/src/models/model_clasification.pt')

results = model.predict(source=0, show=True)

# imprimir resultados en consola
print(results)

# cerrar
model.close()