# src/services/service_weight.py
"""
Este servicio se encarga de interactuar con el sensor de peso HX711 para obtener medidas de peso
y asociarlas con los animales detectados previamente. Los datos se guardan en la base de datos.
"""
import time
from datetime import datetime
from hx711 import HX711 
from src.databases.db_connection import insert_measurement, insert_event
from src.services.service_detection import get_current_animal_id  # Importar función para obtener el ID actual

# Pines del HX711
DT_PIN = 29
CLK_PIN = 31


def setup_hx711():
    """
    Configura el sensor HX711 y calibra.
    """
    hx = HX711(dout_pin=DT_PIN, pd_sck_pin=CLK_PIN)

    # Establecer factor de conversión (valor de calibración)
    hx.set_scale_ratio(-7050)  # Ajusta según tu sensor y calibración específica

    return hx


def measure_weight(hx):
    """
    Realiza una medición de peso con el sensor HX711.
    """
    try:
        weight = hx.get_weight_mean(times=10)  # Promedio de 10 lecturas para mayor precisión
        return round(weight, 2)  # Redondear a 2 decimales
    except Exception as e:
        print(f"Error al medir peso: {e}")
        return None


def run_weight_service():
    """
    Servicio principal para medir peso y guardar datos en la base de datos.
    """
    hx = setup_hx711()
    print("Sensor de peso configurado. Comenzando medición...")

    while True:
        weight = measure_weight(hx)

        if weight is not None:
            print(f"Peso medido: {weight}g")

            # Obtener el ID del animal detectado por el servicio de detección
            current_animal_id = get_current_animal_id()

            if current_animal_id is not None:
                try:
                    # Insertar medición en la base de datos
                    insert_measurement(
                        animal_id=current_animal_id,
                        weight=weight,
                        image_base64=None,  # Agregar imagen si es necesario
                        measurement_date=datetime.now()
                    )

                    # Registrar evento exitoso
                    insert_event(
                        animal_id=current_animal_id,
                        event_type="Medición de peso",
                        description=f"Peso registrado: {weight}g",
                        event_date=datetime.now()
                    )

                except Exception as e:
                    print(f"Error al guardar datos en la base de datos: {e}")
            else:
                print("No se detectó ningún animal. Esperando detección...")

        else:
            print("No se pudo medir el peso correctamente.")

        # Esperar antes de la siguiente medición
        time.sleep(2)
