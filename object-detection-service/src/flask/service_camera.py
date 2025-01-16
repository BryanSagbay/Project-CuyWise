from ultralytics import YOLO

# Cargar el modelo entrenado
model = YOLO('../models/model_clasification.pt')

# Usar la cámara
results = model.predict(source=0, show=True)

# Mostrar resultados
print(results)

# Cerrar la cámara
model.close()