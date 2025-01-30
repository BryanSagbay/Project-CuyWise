import os
from dotenv import load_dotenv
from src.flask.service_camera import model_YOLO
#from src.services.service_detection import run_detection_service
#from src.services.service_weight import run_weight_service

def main():
    # Carga variables de entorno
    load_dotenv()

    print("Iniciando el sistema...")

    try:
        # Iniciar servicios
        print("Iniciando servicio de detección...")
        model_YOLO()

        #print("Iniciando servicio de pesaje...")
        #run_weight_service()
    except Exception as e:
        print(f"Error al iniciar el sistema: {e}")

if __name__ == "__main__":
    main()

import cv2
import time
from database import create_tables, insert_medicion, insert_evento, get_animal_id
from vision import detect_cuy
from scale import Scale

def main():
    # Configuración inicial
    create_tables()
    scale = Scale()
    scale.tare()
    
    cap = cv2.VideoCapture(0)
    last_detection = time.time()
    cooldown = 30  # segundos entre mediciones
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error en la cámara")
            break
        
        class_name, confidence, imagen_base64 = detect_cuy(frame)
        
        if class_name and (time.time() - last_detection) > cooldown:
            animal_id = get_animal_id(class_name)
            
            if animal_id:
                # Tomar medición del peso
                weight = None
                attempts = 0
                
                while attempts < 5 and not weight:
                    weight = scale.get_weight()
                    attempts += 1
                    time.sleep(0.5)
                
                if weight:
                    if insert_medicion(animal_id, weight, imagen_base64):
                        insert_evento(animal_id, 'pesaje_exitoso', 
                                    f"Peso registrado: {weight} kg")
                        print(f"Medición exitosa para {class_name}: {weight} kg")
                    else:
                        insert_evento(animal_id, 'error_peso', 
                                    "Error al guardar medición")
                else:
                    insert_evento(animal_id, 'error_peso', 
                                "No se pudo obtener el peso")
                    print("Error al obtener el peso")
                
                last_detection = time.time()
        
        # Mostrar vista previa
        cv2.imshow('Monitoreo Cuyes', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
