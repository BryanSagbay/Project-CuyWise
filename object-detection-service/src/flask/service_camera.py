from ultralytics import YOLO

model = YOLO('../models/model_clasification.pt')

# model = YOLO('yolov5s.pt')
results = model.predict(source=0, show=True)

print(results)

model.close()