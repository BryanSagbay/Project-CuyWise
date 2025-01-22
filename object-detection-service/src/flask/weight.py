from hx711 import HX711

# Función para detectar peso con el módulo HX711
def medir_peso():
    try:
        # Inicializar el sensor HX711 (ajusta los pines según tu configuración)
        hx = HX711(dout_pin=29, pd_sck_pin=31)
        hx.set_scale(7050)  # Ajustar escala según tu calibración
        hx.tare()  # Tarar la balanza antes de medir

        # Obtener un promedio de 10 lecturas
        peso = hx.get_units(10)  
        print(f"Peso detectado: {peso} gramos")
        return peso
    except Exception as e:
        print(f"Error al medir peso: {e}")
        return None
