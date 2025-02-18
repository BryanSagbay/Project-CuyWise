import serial
import time
from threading import Thread

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
if arduino is None:
    exit()

isRun = True  

def leer_datos():
    time.sleep(1)
    arduino.reset_input_buffer()
    while isRun:
        try:
            line = arduino.readline().decode('utf-8').strip()
            time.sleep(1)
            if line:
                valor = float(line) - 1  
                print(f"📡 Datos recibidos: {valor}")
        except ValueError:
            print(f"⚠️ Dato inválido recibido: {line}")
        except Exception as e:
            print(f"❌ Error de lectura: {e}")

thread = Thread(target=leer_datos, daemon=True)
thread.start()

try:
    input("🔴 Presiona Enter para salir...\n")
except KeyboardInterrupt:
    pass

isRun = False
thread.join()
arduino.close()
print("✅ Conexión cerrada. Programa finalizado.")
