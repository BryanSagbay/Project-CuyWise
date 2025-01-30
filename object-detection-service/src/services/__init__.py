# config.py
DB_CONFIG = {
    'dbname': 'cuyes_db',
    'user': 'usuario',
    'password': 'password',
    'host': 'localhost',
    'port': 5432
}

# detector.py
from ultralytics import YOLO
import cv2

def detectar_cuyes():
    model = YOLO('models/classification.pt')
    cap = cv2.VideoCapture(0)
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        
        results = model(frame)
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                label = result.names[int(box.cls)]
                confidence = box.conf[0].item()
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f'{label}: {confidence:.2f}', (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        cv2.imshow('Monitoreo de Cuyes', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

# balanza.py
import time
import RPi.GPIO as GPIO
from hx711 import HX711

def obtener_peso():
    hx = HX711(dout=5, pd_sck=7)
    hx.zero()
    time.sleep(0.5)
    peso = hx.get_weight(5)
    hx.power_down()
    return peso

# database.py
import psycopg2
from config import DB_CONFIG

def conectar_db():
    return psycopg2.connect(**DB_CONFIG)

def registrar_medicion(animal_id, peso):
    conn = conectar_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Mediciones (animal_id, peso) 
        VALUES (%s, %s)
    """, (animal_id, peso))
    conn.commit()
    cur.close()
    conn.close()

def registrar_evento(animal_id, tipo_evento, descripcion):
    conn = conectar_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Eventos (animal_id, tipo_evento, descripcion) 
        VALUES (%s, %s, %s)
    """, (animal_id, tipo_evento, descripcion))
    conn.commit()
    cur.close()
    conn.close()

# main.py
from detector import detectar_cuyes
from balanza import obtener_peso
from database import registrar_medicion, registrar_evento

def main():
    print("Iniciando sistema de monitoreo de cuyes...")
    detectar_cuyes()
    peso = obtener_peso()
    print(f"Peso detectado: {peso}g")
    registrar_medicion(animal_id=1, peso=peso)
    registrar_evento(animal_id=1, tipo_evento="Registro de peso", descripcion=f"Peso registrado: {peso}g")

if __name__ == "__main__":
    main()
