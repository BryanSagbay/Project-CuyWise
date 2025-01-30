import cv2
import psycopg2
from ultralytics import YOLO
import Jetson.GPIO as GPIO
from hx711 import HX711
import base64
import numpy as np
from datetime import datetime
import logging

# Configuración inicial
DATABASE_CONFIG = {
    "dbname": "cuy_monitoring",
    "user": "postgres",
    "password": "tu_password",
    "host": "localhost"
}

HX711_CONFIG = {
    "dout_pin": 5,
    "pd_sck_pin": 7
}

YOLO_MODEL_PATH = '../models/model_clasification.pt'

# Configurar logging
logging.basicConfig(level=logging.INFO)

def connect_db():
    try:
        conn = psycopg2.connect(**DATABASE_CONFIG)
        return conn, conn.cursor()
    except Exception as e:
        logging.error(f"Error de conexión a DB: {e}")
        raise

def initialize_database():
    conn, cursor = connect_db()
    try:
        # Crear tablas
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Animales (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR NOT NULL UNIQUE,
                raza VARCHAR,
                criadero VARCHAR,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                activo BOOLEAN DEFAULT TRUE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Mediciones (
                id SERIAL PRIMARY KEY,
                animal_id INTEGER NOT NULL,
                peso FLOAT NOT NULL,
                imagen_base64 TEXT,
                fecha_medicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES Animales (id)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Eventos (
                id SERIAL PRIMARY KEY,
                animal_id INTEGER NOT NULL,
                tipo_evento VARCHAR NOT NULL,
                descripcion TEXT,
                fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES Animales (id)
            )
        """)
        
        # Insertar cuyes iniciales
        for i in range(1, 6):
            cursor.execute("""
                INSERT INTO Animales (nombre) 
                VALUES (%s)
                ON CONFLICT (nombre) DO NOTHING
            """, (f'cuy{i}',))
        
        conn.commit()
    except Exception as e:
        logging.error(f"Error inicializando DB: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

class HX711Wrapper:
    def __init__(self, dout=5, pd_sck=7):
        self.hx = HX711(dout, pd_sck)
        self.scale = -440000  # Valor de calibración inicial (ajustar)
        self.offset = 0       # Realizar proceso de calibración
        
    def get_weight(self):
        try:
            value = self.hx.read()
            if value:
                return (value - self.offset) / self.scale
            return None
        except Exception as e:
            logging.error(f"Error lectura peso: {e}")
            return None

def log_event(cursor, animal_id, tipo_evento, descripcion=None):
    cursor.execute("""
        INSERT INTO Eventos (animal_id, tipo_evento, descripcion)
        VALUES (%s, %s, %s)
    """, (animal_id, tipo_evento, descripcion))

def log_medicion(cursor, animal_id, peso, imagen=None):
    cursor.execute("""
        INSERT INTO Mediciones (animal_id, peso, imagen_base64)
        VALUES (%s, %s, %s)
    """, (animal_id, peso, imagen))

def process_detection(frame, class_id, confidence, hx, conn):
    cursor = conn.cursor()
    try:
        nombre_cuy = f'cuy{class_id + 1}'
        
        # Obtener ID del animal
        cursor.execute("SELECT id FROM Animales WHERE nombre = %s", (nombre_cuy,))
        animal_id = cursor.fetchone()[0]
        
        # Tomar medición de peso
        peso = hx.get_weight()
        
        # Convertir imagen a base64
        _, buffer = cv2.imencode('.jpg', frame)
        imagen_base64 = base64.b64encode(buffer).decode('utf-8')
        
        if peso is not None:
            # Registrar medición
            log_medicion(cursor, animal_id, peso, imagen_base64)
            # Registrar evento
            log_event(cursor, animal_id, 'PESO_REGISTRADO', f'Peso: {peso} kg')
        else:
            log_event(cursor, animal_id, 'ERROR_PESO', 'Error al obtener el peso')
        
        conn.commit()
    except Exception as e:
        logging.error(f"Error procesando detección: {e}")
        conn.rollback()
    finally:
        cursor.close()

def main():
    initialize_database()
    conn, _ = connect_db()
    
    # Configurar HX711
    hx = HX711Wrapper(**HX711_CONFIG)
    
    # Cargar modelo YOLO
    model = YOLO(YOLO_MODEL_PATH)
    
    # Configurar cámara
    cap = cv2.VideoCapture(0)
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                logging.error("Error capturando frame")
                continue
            
            # Realizar detección
            results = model(frame, verbose=False)
            
            for result in results:
                boxes = result.boxes
                if boxes:
                    for box in boxes:
                        class_id = int(box.cls)
                        confidence = box.conf
                        
                        if confidence < 0.7:  # Umbral de confianza
                            continue
                            
                        process_detection(frame, class_id, confidence, hx, conn)
            
            cv2.imshow('Cuy Monitoring', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
                
    except KeyboardInterrupt:
        logging.info("Deteniendo sistema...")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        conn.close()
        GPIO.cleanup()

if __name__ == "__main__":
    main()
