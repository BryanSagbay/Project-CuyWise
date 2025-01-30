import cv2
from ultralytics import YOLO
import base64

model = YOLO('classification.pt')

def detect_cuy(frame):
    results = model.predict(frame, conf=0.7)
    
    if results and len(results[0]) > 0:
        top_result = results[0][0]
        class_name = model.names[top_result.boxes.cls[0].item()]
        confidence = top_result.boxes.conf[0].item()
        
        # Convertir imagen a base64
        _, buffer = cv2.imencode('.jpg', frame)
        imagen_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return class_name, confidence, imagen_base64
    return None, None, None
