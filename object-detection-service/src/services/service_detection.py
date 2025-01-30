from ultralytics import YOLO
import cv2
import base64

model = YOLO('classification.pt')

def detect_cuy():
    # Configurar parámetros de YOLO
    args = {
        'source': 0,  # Usar cámara por defecto
        'stream': True,  # Para procesamiento en tiempo real
        'conf': 0.7,
        'show': True  # Mostrar ventana con detecciones
    }
    
    # Generador de resultados
    results_gen = model.predict(**args)
    
    for result in results_gen:
        frame = result.orig_img
        if len(result.boxes) > 0:
            # Tomar la primera detección
            box = result.boxes[0]
            class_id = int(box.cls)
            class_name = model.names[class_id]
            confidence = float(box.conf)
            
            # Convertir imagen a base64
            _, buffer = cv2.imencode('.jpg', frame)
            imagen_base64 = base64.b64encode(buffer).decode('utf-8')
            
            yield class_name, confidence, imagen_base64, frame
        else:
            yield None, None, None, frame
