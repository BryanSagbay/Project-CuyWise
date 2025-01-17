from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask import jsonify
from flask import jsonify
import threading
import cv2
import time
import base64
from src.services.service_detection import start_detection

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200"])  # Permitir solo conexiones de Angular

socketio = SocketIO(app, cors_allowed_origins="http://localhost:4200")

camera_on = False
camera_event = threading.Event()  # Event para controlar el flujo de la cámara

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print("Cliente conectado.")

def video_stream():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: No se pudo abrir la cámara.")
        return

    while camera_event.is_set():
        ret, frame = cap.read()
        if not ret:
            print("Error: No se pudo leer el frame.")
            continue

        # Llama a la detección
        detected, cuy_name, img_base64, peso = start_detection(frame)

        if detected:
            print(f"{cuy_name} detectado, Peso: {peso}")
        else:
            # Si no se detecta nada, convierte el frame en base64
            _, buffer = cv2.imencode('.jpg', frame)
            img_base64 = base64.b64encode(buffer).decode('utf-8')

        # Emitir el frame al cliente
        socketio.emit('video_frame', img_base64)

        # Reducir la frecuencia de emisión para no sobrecargar la red
        time.sleep(0.1)

    cap.release()


@app.route('/start_camera', methods=['POST'])
def start_camera():
    if camera_event.is_set():
        return jsonify({"message": "Camera already running"}), 400

    camera_event.set()
    threading.Thread(target=video_stream, daemon=True).start()
    return jsonify({"message": "Camera started"}), 200

@app.route('/stop_camera', methods=['POST'])
def stop_camera():
    if not camera_event.is_set():
        return jsonify({"message": "Camera not running"}), 400

    camera_event.clear()
    return jsonify({"message": "Camera stopped"}), 200

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)
