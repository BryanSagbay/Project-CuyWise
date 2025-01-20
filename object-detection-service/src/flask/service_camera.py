from ultralytics import YOLO

# Cargar el modelo entrenado
model = YOLO('../models/model_clasification.pt')

results = model.predict(source=0, show=True)

print(results)

model.close()