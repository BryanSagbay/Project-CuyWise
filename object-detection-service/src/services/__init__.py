
# detector.py
from ultralytics import YOLO
import cv2
from balanza import obtener_peso
from database import registrar_medicion, registrar_evento, obtener_id_animal

def detectar_cuyes():
    model = YOLO('models/classification.pt')
    cap = cv2.VideoCapture(0)
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
        
        results = model(frame)
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                label = result.names[int(box.cls)]
                confidence = box.conf[0].item()
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f'{label}: {confidence:.2f}', (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                print(f"{result.idx}: {frame.shape[0]}x{frame.shape[1]} 1 {label}, {confidence:.2f}")
                peso = obtener_peso()
                print(f"Peso detectado: {peso}g")
                
                animal_id = obtener_id_animal(label)
                if animal_id:
                    registrar_medicion(animal_id, peso)
                    registrar_evento(animal_id, "Registro de peso", f"Peso registrado: {peso}g")
                    print("Guardado con éxito en la base de datos")
                else:
                    print("Error: No se encontró el ID del animal en la base de datos")
        
        cv2.imshow('Monitoreo de Cuyes', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

# balanza.py
import time
import Jetson.GPIO as GPIO
from hx711 import HX711

def obtener_peso():
    hx = HX711(5, 7)
    hx.set_reading_format("MSB", "MSB")
    time.sleep(0.5)
    peso = hx.get_weight(5)
    hx.power_down()
    hx.power_up()
    return max(0, int(peso))


