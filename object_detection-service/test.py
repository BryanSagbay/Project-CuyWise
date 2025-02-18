import psycopg
import cv2
import time
import base64
import numpy as np
import threading
import serial
from ultralytics import YOLO

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
peso_actual = 0.0 

def leer_peso():
    global peso_actual
    if not arduino:
        return

    time.sleep(1)
    arduino.reset_input_buffer()
    
    while True:
        try:
            line = arduino.readline().decode('utf-8').strip()
            if line:
                peso_actual = float(line) - 1 
                print(f"📡 Peso actualizado: {peso_actual} kg")
            time.sleep(1)  
        except ValueError:
            print(f"⚠️ Dato inválido recibido: {line}")
        except Exception as e:
            print(f"❌ Error de lectura: {e}")

thread_peso = threading.Thread(target=leer_peso, daemon=True)
thread_peso.start()

class VideoStream:
    def __init__(self, source=0):
        self.cap = cv2.VideoCapture(source)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        self.ret, self.frame = self.cap.read()
        self.stopped = False
        self.lock = threading.Lock() 
        threading.Thread(target=self.update, args=()).start()

    def update(self):
        while not self.stopped:
            ret, frame = self.cap.read()
            if ret:
                with self.lock:
                    self.ret, self.frame = ret, frame  

    def read(self):
        with self.lock:
            return self.ret, self.frame  

    def stop(self):
        self.stopped = True
        self.cap.release()
        cv2.destroyAllWindows() 

conn = psycopg.connect(
    host="localhost", 
    port="5432", 
    dbname="cuywise", 
    user="postgres", 
    password="100"
)
cursor = conn.cursor()

cursor.execute('SELECT "id", "nombre" FROM "Animales"')
animales_dict = {nombre.lower(): id for id, nombre in cursor.fetchall()}

model = YOLO('model_clasification.pt')

vs = VideoStream()
time.sleep(2)  

ventana_abierta = False 
ultima_detencion = {}  
while True:
    ret, frame = vs.read()
    if not ret:
        break

    results = model.predict(frame, show=False)
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id].lower()

            if class_name in animales_dict:
                animal_id = animales_dict[class_name]
                
                tiempo_actual = time.time()
                tiempo_ultima = ultima_detencion.get(animal_id, 0)

                if tiempo_actual - tiempo_ultima > 2:  
                    ultima_detencion[animal_id] = tiempo_actual

                    _, buffer = cv2.imencode('.jpg', frame)
                    img_base64 = base64.b64encode(buffer).decode('utf-8')

                    try:
                        cursor.execute("""
                            INSERT INTO "Mediciones" (animal_id, detection, peso, imagen_base64, frame, time_ms)
                            VALUES (%s, %s, %s, %s, %s, %s)
                        """, (animal_id, class_name, peso_actual, img_base64, 0, result.speed['inference']))
                        conn.commit()

                        cursor.execute("""
                            INSERT INTO "Eventos" (animal_id, tipo_evento, descripcion)
                            VALUES (%s, %s, %s)
                        """, (animal_id, "Detección registrada", f"Se detectó un {class_name} con peso de {peso_actual:.2f} kg"))
                        conn.commit()

                        print(f"{class_name} detectado 🐹 - Peso: {peso_actual:.2f} kg - Imagen guardada")

                    except Exception as e:
                        cursor.execute("""
                            INSERT INTO "Eventos" (animal_id, tipo_evento, descripcion)
                            VALUES (%s, %s, %s)
                        """, (animal_id, "Error", f"Error al guardar detección de {class_name}: {str(e)}"))
                        conn.commit()

                        print(f"Error al guardar detección de {class_name}: {e}")

                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f"{class_name} ({peso_actual:.2f} kg)", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    if not ventana_abierta:
        cv2.namedWindow("Detección de Animales", cv2.WINDOW_NORMAL) 
        ventana_abierta = True

    cv2.imshow("Detección de Animales", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

vs.stop()
cursor.close()
conn.close()
if arduino:
    arduino.close()
print("✅ Conexión cerrada. Programa finalizado.")
