from database import insertar_medicion, registrar_evento
from weight import medir_peso
import time
import base64
import cv2
from ultralytics import YOLO

# Función principal con YOLO
def model_YOLO():
    try:
        # Cargar el modelo YOLO
        model = YOLO('/home/bryan/Documents/Proyects/Project-CuyWise/object-detection-service/src/models/model_clasification.pt')

        # Iniciar captura de video
        cap = cv2.VideoCapture(0)

        # Tiempo de espera entre detecciones
        detection_interval = 3  # en segundos
        last_detection_time = 0  # Última detección registrada

        while True:
            current_time = time.time()
            # Verificar si ha pasado el tiempo suficiente desde la última detección
            if current_time - last_detection_time < detection_interval:
                continue

            ret, frame = cap.read()
            if not ret:
                print("Error al capturar el video.")
                registrar_evento(None, "Error", "Error al capturar el video.")
                break

            # Obtener resultados del modelo
            results = model.predict(source=frame, show=True)

            # Procesar resultados
            detected = False  # Bandera para determinar si se detectó algo
            for result in results:
                probs = result.probs

                if probs is not None:
                    for idx, prob in enumerate(probs):
                        # Verificar si se detecta un cuy
                        if prob.argmax() in range(5):  # Índices de cuy1 a cuy5
                            cuy_id = prob.argmax() + 1  # Ajustar para que los IDs sean de 1 a 5
                            print(f"¡Cuy {cuy_id} detectado!")
                            registrar_evento(cuy_id, "Detección", f"Se detectó el cuy con ID {cuy_id}")
                            detected = True

                            # Tomar el peso y guardar en la base de datos
                            peso = medir_peso()
                            if peso is not None:
                                # Convertir la imagen capturada a Base64
                                _, buffer = cv2.imencode('.jpg', frame)
                                imagen_base64 = base64.b64encode(buffer).decode('utf-8')

                                # Registrar en la base de datos
                                insertar_medicion(cuy_id, peso, imagen_base64)
                            else:
                                registrar_evento(cuy_id, "Error", "No se pudo medir el peso del cuy.")
                            break  # Salir del bucle si ya se procesó un cuy

            # Si se detectó algo, actualizar el tiempo de la última detección
            if detected:
                last_detection_time = time.time()

    except Exception as e:
        print(f"Error al iniciar el sistema: {e}")
        registrar_evento(None, "Error", f"Error al iniciar el sistema: {e}")

CREATE TABLE "Animales" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "raza" VARCHAR,
    "criadero" VARCHAR,
    "fecha_registro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "Mediciones" (

