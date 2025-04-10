import serial

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

serialArduino = detectar_puerto()

def showMenu():
    try:
        while True:
            print('inserta un numero (1 para encender, 0 para apagar):')
            led = int(input())
            if led == 1:
                serialArduino.write(b'1')  
                print('Prender')
            elif led == 0:
                serialArduino.write(b'0') 
                print('Apagar')
            elif led == 2:
          
                serialArduino.write(b'2')  
                print('Prender')
            elif led == 4:
                serialArduino.write(b'4') 
                print('Revertir')
            elif led == 3:
                serialArduino.write(b'3') 
                print('Apagar')
            else:
                print('Opcion invalida. Introduce numero de 0 o 4.')
                break
    except ValueError:
        print('Entrada invalida. Debes introducir un numero entero.')

showMenu()
