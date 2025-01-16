from core.camera_controller import CameraController

# Instancia de la cámara
camera_controller = CameraController()

def handle_camera_event(action):
    """
    Maneja el evento de control de la cámara.
    :param action: Acción a realizar ('start' o 'stop').
    """
    if action == "start":
        camera_controller.start_camera()
        return {"status": "success", "message": "Cámara encendida."}
    elif action == "stop":
        camera_controller.stop_camera()
        return {"status": "success", "message": "Cámara apagada."}
    else:
        return {"status": "error", "message": "Acción no válida."}
