import time
from hx711 import HX711

class Scale:
    def __init__(self, dout=5, pd_sck=7):
        self.hx = HX711(dout, pd_sck)
        self.calibration_factor = -7050.0  # Ajustar según calibración
        
    def get_raw_value(self):
        return self.hx.get_raw_data(num_measures=3)[0]
    
    def get_weight(self):
        try:
            raw_value = self.get_raw_value()
            weight = (raw_value - self.offset) / self.calibration_factor
            return round(weight, 2)
        except:
            return None
    
    def tare(self):
        self.offset = self.get_raw_value()
    
    def calibrate(self, known_weight):
        raw_value = self.get_raw_value()
        self.calibration_factor = (raw_value - self.offset) / known_weight
