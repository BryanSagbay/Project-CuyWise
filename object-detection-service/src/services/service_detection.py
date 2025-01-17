import cv2
from ultralytics import YOLO
import base64
from io import BytesIO
from PIL import Image

model = YOLO('/home/bryan/Documents/Proyects/Project-CuyWise/object-detection-service/src/models/model_clasification.pt')

# Definir las clases de cuyes
CUY_CLASSES = ['cuy1', 'cuy2', 'cuy3', 'cuy4', 'cuy5']

# Función para iniciar la detección
def start_detection(frame):
    # Realizar la detección y clasificación con el modelo
    results = model(frame)  # Pasamos el frame de la cámara al modelo YOLO
    
    # Verificamos si se han detectado objetos
    if results and hasattr(results[0], 'boxes') and results[0].boxes is not None:  # Verificamos si hay boxes detectadas
        boxes = results[0].boxes  # Coordenadas de las cajas
        labels = results[0].names  # Nombres de las clases detectadas
        probs = results[0].probs  # Probabilidades de las clases detectadas

        # Si probs es None, lo manejamos adecuadamente
        if probs is None:
            print("No se han detectado probabilidades válidas. Revisando resultados...")
            print(f"Resultados: {results}")  # Para depuración
            return False, None, None, None

        for i, box in enumerate(boxes):
            label = labels[int(box.cls)]  # Obtener la etiqueta de la clase
            confidence = probs[i] if probs is not None else 0  # Usar probs para obtener la confianza de la predicción

            # Verificar si la clase detectada es uno de los cuyes (clases 'cuy1', 'cuy2', 'cuy3', 'cuy4', 'cuy5')
            if label in CUY_CLASSES and confidence > 0.5:  # Si es un cuy con suficiente confianza
                print(f"{label} detectado con confianza: {confidence}")

                # El modelo nos devuelve el nombre de la clase, que es el nombre del cuy
                cuy_name = label  # El nombre del cuy es el label del modelo
                img_base64 = convert_image_to_base64(frame)  # Convertir la imagen a base64 para enviarla al frontend
                #peso = get_weight()  # Aquí tomarías el peso (simulado o con un sistema real)

                # Guardamos la información del cuy y la medición en la base de datos
                #process_and_save(frame, cuy_name)  # Guardamos la información en la base de datos

                return True, cuy_name, img_base64

    # Si no se detectó nada relevante o no se encontró probabilidad válida
    print("No se detectaron objetos relevantes o no se encontraron probabilidades válidas.")
    return False, None, None, None

# Función para convertir la imagen a base64 (para enviar al frontend)
def convert_image_to_base64(image):
    pil_image = Image.fromarray(image)  # Convertir la imagen de OpenCV a PIL
    buffered = BytesIO()
    pil_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")  # Convertir a base64
    return img_str
