import time
import RPi.GPIO as GPIO
from hx711 import HX711

# Configuración de los pines
pinData = 3
pinClk = 2

# Parámetro de calibración
CALIBRACION = 20780.0

# Configuración de los pines GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Inicializar el objeto HX711
hx711 = HX711(pinData, pinClk)

# Calibración y tara
hx711.set_scale(CALIBRACION)
hx711.tare()

print("Comienza la lectura del sensor HX711")

# Bucle para leer el peso continuamente
while True:
    try:
        # Leer el peso en kg
        peso = hx711.get_units(1)  # Obtener una
