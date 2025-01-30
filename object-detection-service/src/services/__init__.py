import sqlite3
from datetime import datetime

class DatabaseManager:
    def __init__(self, db_name='cuyes_monitoring.db'):
        self.conn = sqlite3.connect(db_name)
        self.create_tables()
        self.initialize_animals()
        
    def create_tables(self):
        cursor = self.conn.cursor()
        
        # Tabla Animales
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Animales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                raza TEXT,
                criadero TEXT,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                activo BOOLEAN DEFAULT TRUE
            )
        ''')
        
        # Tabla Mediciones
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Mediciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                peso REAL NOT NULL,
                imagen_base64 TEXT,
                fecha_medicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES Animales(id)
            )
        ''')
        
        # Tabla Eventos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Eventos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                tipo_evento TEXT NOT NULL,
                descripcion TEXT,
                fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES Animales(id)
            )
        ''')
        self.conn.commit()

    def initialize_animals(self):
        cursor = self.conn.cursor()
        
        # Verificar si ya existen los cuyes
        cursor.execute('SELECT COUNT(*) FROM Animales')
        count = cursor.fetchone()[0]
        
        if count == 0:
            cuyes = [
                ('cuy1', 'Raza1', 'Criadero Principal'),
                ('cuy2', 'Raza2', 'Criadero Principal'),
                ('cuy3', 'Raza3', 'Criadero Secundario'),
                ('cuy4', 'Raza1', 'Criadero Principal'),
                ('cuy5', 'Raza2', 'Criadero Secundario')
            ]
            
            cursor.executemany('''
                INSERT INTO Animales (nombre, raza, criadero)
                VALUES (?, ?, ?)
            ''', cuyes)
            self.conn.commit()

    def log_event(self, animal_id, event_type, description=None):
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO Eventos (animal_id, tipo_evento, descripcion)
            VALUES (?, ?, ?)
        ''', (animal_id, event_type, description))
        self.conn.commit()

    def save_measurement(self, animal_id, weight, image_base64=None):
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO Mediciones (animal_id, peso, imagen_base64)
            VALUES (?, ?, ?)
        ''', (animal_id, weight, image_base64))
        self.conn.commit()

    def close(self):
        self.conn.close()

# Para probar la base de datos
if __name__ == '__main__':
    db = DatabaseManager()
    db.log_event(1, 'Prueba', 'Evento de prueba inicial')
    db.close()
    print("Base de datos configurada exitosamente!")
