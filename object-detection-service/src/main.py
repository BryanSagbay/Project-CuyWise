from flask import Flask, request, jsonify
from services.service_event import handle_camera_event
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/camera-event', methods=['POST'])
def camera_event():
    """
    Endpoint para manejar la cámara.
    """
    data = request.get_json()
    action = data.get("action")
    if not action:
        return jsonify({"status": "error", "message": "Acción requerida."}), 400

    result = handle_camera_event(action)
    return jsonify(result), 200 if result["status"] == "success" else 400

if __name__ == "__main__":
    app.run(debug=True)
