from ultralytics import YOLO
import cv2
import time
import random
import serial
from threading import Thread
from collections import deque
import psycopg2
import base64
from datetime import datetime

# -------- CONFIG DB (Neon) --------
DB_CONFIG = {
    'dbname': '',
    'user': '',
    'password': '',
    'host': '',
    'port': '',
    'sslmode': ''
}

# Mapeo clases YOLO -> IDs en tabla animales
MAPEO_ANIMALES = {
    'cuy1': 1,
    'cuy2': 2
}

# -------- CONEXIÓN A BD --------
def obtener_conexion():
    return psycopg2.connect(**DB_CONFIG)

# -------- GUARDAR MEDICIÓN --------
def guardar_medicion(peso, frame, animal_nombre):
    # Validar peso antes de guardar
    if peso <= 0 or peso > 5000:
        print(f"⚠️ Peso fuera de rango, no se guarda: {peso:.2f} g")
        return

    # Convertir frame a base64
    _, buffer = cv2.imencode('.jpg', frame)
    imagen_base64 = base64.b64encode(buffer).decode('utf-8')

    animal_id = MAPEO_ANIMALES.get(animal_nombre)
    if not animal_id:
        print(f"⚠️ Animal {animal_nombre} no encontrado en mapeo.")
        return

    try:
        with obtener_conexion() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO "medicion" ("peso", "imagen_base64", "fecha_medicion", "animal_id")
                    VALUES (%s, %s, %s, %s)
                """, (peso, imagen_base64, datetime.now().date(), animal_id))
            conn.commit()
        print(f"💾 Medición guardada en DB para {animal_nombre} ({peso:.2f} g)")
    except Exception as e:
        guardar_evento_error(f"Error guardando medición: {e}", animal_nombre)

# -------- GUARDAR SOLO ERRORES EN EVENTO --------
def guardar_evento_error(descripcion, animal_nombre=None):
    animal_id = MAPEO_ANIMALES.get(animal_nombre) if animal_nombre else None
    try:
        with obtener_conexion() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO "evento" ("tipo_evento", "descripcion", "fecha_evento", "animal_id")
                    VALUES ('ERROR', %s, %s, %s)
                """, (descripcion, datetime.now().date(), animal_id))
            conn.commit()
        print(f"📑 Error registrado en DB: {descripcion}")
    except Exception as e:
        print(f"❌ Error guardando evento en DB: {e}")

# -------- CONFIG YOLO --------
CONF_THRESHOLD = 0.7
model = YOLO("cuywise_v2.pt")
colors = {class_id: [random.randint(0, 255) for _ in range(3)] for class_id in model.names.keys()}

# -------- ARDUINO SERIAL --------
def detectar_puerto():
    posibles_puertos = ["/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyTHS1"]
    for puerto in posibles_puertos:
        try:
            arduino = serial.Serial(puerto, 9600, timeout=1)
            print(f"✅ Conectado exitosamente a {puerto}")
            return arduino
        except serial.SerialException:
            pass
    print("⚠️ No se encontró un puerto válido.")
    return None

arduino = detectar_puerto()
if arduino is None:
    exit()

# -------- VARIABLES --------
isRun = True
peso_actual = None
ultimo_envio = 0
COOLDOWN = 5
MIN_PESO = 110
lecturas_peso = deque(maxlen=5)
mostrar_estado_puerta = False
tiempo_mostrar_estado = 0

# -------- HILO LECTURA PESO --------
def leer_datos():
    global peso_actual
    time.sleep(1)
    arduino.reset_input_buffer()

    while isRun:
        try:
            line = arduino.readline().decode('utf-8').strip()
            if line:
                try:
                    valor = float(line) - 1
                    lecturas_peso.append(valor)
                    if len(lecturas_peso) == lecturas_peso.maxlen:
                        promedio = sum(lecturas_peso) / len(lecturas_peso)
                        peso_actual = promedio
                        print(f"📡 Peso estabilizado: {peso_actual:.2f} g")
                except ValueError:
                    print(f"⚠️ Mensaje del Arduino: {line}")
        except Exception as e:
            guardar_evento_error(f"Error lectura serial: {e}")

thread = Thread(target=leer_datos, daemon=True)
thread.start()

# -------- LOOP PRINCIPAL --------
cap = cv2.VideoCapture(2)
last_print_time = time.time()

try:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Detección YOLO
        results = model(frame, verbose=False)
        detecciones_validas = []
        for box in results[0].boxes:
            conf = float(box.conf[0])
            if conf >= CONF_THRESHOLD:
                detecciones_validas.append(box)

        # Dibujar detecciones
        frame_with_boxes = frame.copy()
        for box in detecciones_validas:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            conf = float(box.conf[0])
            color = colors[class_id]

            cv2.rectangle(frame_with_boxes, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame_with_boxes, f"{class_name} {conf:.2f}",
                        (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        # Control envío con peso
        if detecciones_validas and peso_actual is not None:
            ahora = time.time()
            class_id = int(detecciones_validas[0].cls[0])
            class_name = model.names[class_id]

            if peso_actual >= MIN_PESO:
                if ahora - ultimo_envio >= COOLDOWN:
                    # Enviar 1 al Arduino
                    arduino.write(b'1')
                    print(f"➡️ Enviado '1': Abrir puerta para {class_name} con {peso_actual:.2f} g")

                    # Guardar medición en DB
                    guardar_medicion(peso_actual, frame_with_boxes, class_name)

                    mostrar_estado_puerta = True
                    tiempo_mostrar_estado = ahora

                    ultimo_envio = ahora
                    peso_actual = None
                    lecturas_peso.clear()
            else:
                print(f"⚠️ Peso menor al mínimo ({MIN_PESO} g): {peso_actual:.2f} g")

        # Mostrar peso en pantalla
        if peso_actual is not None:
            color_peso = (0, 255, 0) if peso_actual >= MIN_PESO else (0, 0, 255)
            cv2.putText(frame_with_boxes, f"Peso: {peso_actual:.2f} g", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color_peso, 2)

        if mostrar_estado_puerta and (time.time() - tiempo_mostrar_estado <= 1):
            cv2.putText(frame_with_boxes, "PUERTA ABIERTA", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 0), 3)
        elif mostrar_estado_puerta and (time.time() - tiempo_mostrar_estado > 1):
            mostrar_estado_puerta = False

        cv2.imshow("YOLO Inference", frame_with_boxes)

        # Mensajes periódicos
        if time.time() - last_print_time >= 2:
            if len(detecciones_validas) > 0:
                print(f"Detecciones (> {int(CONF_THRESHOLD*100)}% confianza):")
                for box in detecciones_validas:
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id]
                    conf = float(box.conf[0])
                    print(f"- {class_name} ({conf:.2f})")
            else:
                print("Sin detecciones válidas")
            last_print_time = time.time()

        # Teclas control
        key = cv2.waitKey(1) & 0xFF
        if key == 27:
            break
        elif key == 82:
            CONF_THRESHOLD = min(1.0, CONF_THRESHOLD + 0.05)
        elif key == 84:
            CONF_THRESHOLD = max(0.0, CONF_THRESHOLD - 0.05)

except KeyboardInterrupt:
    pass

# -------- CIERRE --------
isRun = False
thread.join()
cap.release()
arduino.close()
cv2.destroyAllWindows()
print("✅ Programa finalizado.")
