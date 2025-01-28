import os
from dotenv import load_dotenv
from src.flask.service_camera import model_YOLO
from src.services.service_detection import run_detection_service
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
