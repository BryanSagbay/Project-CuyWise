from hx711 import HX711
import Jetson.GPIO as GPIO
import time

# Definir pines en Jetson Nano Orin
DT = 29  # Pin 29 (GPIO01) - Data
SCK = 31  # Pin 31 (GPIO11) - Clock

def medir_peso():
    try:
        GPIO.cleanup()  # Liberar GPIO antes de iniciar

        # Inicializar el HX711
        hx = HX711(DT, SCK)
        hx.set_reference_unit(1)  # Ajusta este valor después de calibrar
        hx.reset()
        hx.tare()  # Tarar la balanza antes de medir

        print("Coloca un peso en la balanza...")
        time.sleep(2)

        # Obtener un promedio de 10 lecturas
        peso = hx.get_weight(10)
        print(f"Peso detectado: {peso:.2f} gramos")

        return peso

    except Exception as e:
        print(f"Error al medir peso: {e}")
        return None

    finally:
        hx.power_down()
        hx.power_up()
        GPIO.cleanup()  # Asegurar que los GPIO se liberen

# Ejecutar la medición de peso en bucle
if __name__ == "__main__":
    while True:
        peso = medir_peso()
        time.sleep(2)  # Esperar antes de la próxima medición
