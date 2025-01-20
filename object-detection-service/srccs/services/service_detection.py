import cv2
import torch
from datetime import datetime
from src.databases.db_connection import insert_event, insert_measurement

# Cargar el modelo YOLOv8
MODEL_PATH = "object-detection-service/src/models/model_clasification.pt"
model = torch.hub.load('ultralytics/yolov5', 'custom', path=MODEL_PATH)

# Clases del modelo
CLASSES = ['cuy1', 'cuy2', 'cuy3', 'cuy4', 'cuy5']


def detect_and_save():
    """
    Inicia la cámara y realiza detección en tiempo real.
    """
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        raise Exception("No se puede acceder a la cámara")

    print("Cámara iniciada. Presiona 'q' para salir.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error al capturar el frame de la cámara.")
            break

        # Realizar la detección
        results = model(frame)

        # Procesar resultados
        for det in results.xyxy[0]:  # Iterar sobre las detecciones
            x1, y1, x2, y2, conf, cls = det
            class_name = CLASSES[int(cls)]
            print(f"Detectado: {class_name} con confianza {conf:.2f}")

            # Guardar evento en la base de datos
            insert_event(
                animal_id=int(cls),
                event_type="Detección",
                description=f"Detectado {class_name} con confianza {conf:.2f}",
                event_date=datetime.now()
            )

            # Dibujar el cuadro de detección en la imagen
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cv2.putText(frame, f"{class_name} {conf:.2f}", (int(x1), int(y1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # Mostrar la imagen
        cv2.imshow('Detección', frame)

        # Salir si se presiona 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


def run_detection_service():
    """
    Servicio principal para ejecutar la detección.
    """
    try:
        detect_and_save()
    except Exception as e:
        print(f"Error en el servicio de detección: {e}")