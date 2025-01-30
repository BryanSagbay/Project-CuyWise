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


import time
from database import create_tables, insert_medicion, insert_evento, get_animal_id
from vision import detect_cuy
from scale import Scale

def main():
    # Configuración inicial
    create_tables()
    scale = Scale()
    scale.tare()
    
    # Configurar tiempos
    last_detection = 0
    cooldown = 30  # segundos entre mediciones
    
    # Iniciar detección
    detection_gen = detect_cuy()
    
    try:
        for class_name, confidence, imagen_base64, frame in detection_gen:
            current_time = time.time()
            
            if class_name and (current_time - last_detection) > cooldown:
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
                    
                    last_detection = current_time
                    
    except KeyboardInterrupt:
        print("\nSistema detenido por el usuario")
    finally:
        model.close()

if __name__ == "__main__":
    main()
