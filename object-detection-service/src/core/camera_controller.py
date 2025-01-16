import cv2

class CameraController:
    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.camera = cv2.VideoCapture()
        self.is_streaming = False

    def start_camera(self):
        if not self.camera.isOpened():
            self.camera.open(self.camera_index)

        if not self.camera.isOpened():
            raise Exception(f"Error al abrir la cámara en el índice {self.camera_index}. "
                            "Verifica que la cámara esté conectada y disponible.")
        
        self.is_streaming = True
        print("Cámara encendida. Presiona 'q' para cerrar el feed.")

        while self.is_streaming:
            ret, frame = self.camera.read()
            if not ret:
                print("No se puede leer el feed de la cámara.")
                break

            cv2.imshow("Feed", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        self.stop_camera()

    def stop_camera(self):
        self.is_streaming = False
        self.camera.release()
        cv2.destroyAllWindows()
