
# detector.py
from ultralytics import YOLO
import cv2
from balanza import obtener_peso
from database import registrar_medicion, registrar_evento, obtener_id_animal

def detectar_cuyes():
    model = YOLO('models/classification.pt')
    cap = cv2.VideoCapture(0)
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        
        results = model(frame)
