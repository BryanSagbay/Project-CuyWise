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

tengo que desarrollar un sistema de monitoreo y toma de peso, es decir el asunto trata de lo siguiente, tengo una balanza modulo hx711 y una jetson nano orin donde estoy ahorita trabajando ten en cuenta que para conectar a los pines estoy usando jetson.gpio, el flujo es el siguiente el animal para esste proyecto de investigacion es el cuy, este animal cuy va a proceder a estar monitoreo es decir yo tengo un modelo YOLO preentrenado con datos de los 5 cuyes es decir ese modelo tiene 5 clases cuy1, cuy2, cuy3, cuy4, cuy5 es decir va a estar monitoreando a esos 5 cuys la camara, entonces este va estar con el modelo yolo detectando el cuy1 o si es el cuy2 o cuy3 asi sucesivamente, entonces una vez que este detecte el cuy es decir cuy1 va a proceder a tomar el peso ya que la camara va a estar aputando a la balanza es decir cuando se detecte el cuy el cuy va a estar ya sobre la balanza y estos datos se deben guardar tanto peso, una imagen y el id del cuy, este es la base de datos que tengo y esta debe guardar todos esos datos por cuy detectado:
CREATE TABLE "Animales" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "raza" VARCHAR,
    "criadero" VARCHAR,
    "fecha_registro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "Mediciones" (
    "id" SERIAL PRIMARY KEY,
    "animal_id" INTEGER NOT NULL,
    "peso" FLOAT NOT NULL,
    "imagen_base64" TEXT,
    "fecha_medicion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("animal_id") REFERENCES "Animales" ("id")
);

CREATE TABLE "Eventos" (
    "id" SERIAL PRIMARY KEY,
    "animal_id" INTEGER NOT NULL,
    "tipo_evento" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "fecha_evento" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("animal_id") REFERENCES "Animales" ("id")
);
entonces bien ahora quiero desarrollar todo eso en python como puedo hacerlo
