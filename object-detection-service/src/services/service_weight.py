import psycopg2
from psycopg2 import Error

DATABASE_CONFIG = {
    "user": "postgres",
    "password": "tu_password",
    "host": "localhost",
    "port": "5432",
    "database": "monitoreo_cuyes"
}

def create_tables():
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Animales (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR NOT NULL UNIQUE,
                raza VARCHAR,
                criadero VARCHAR,
                fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                activo BOOLEAN DEFAULT TRUE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Mediciones (
                id SERIAL PRIMARY KEY,
                animal_id INTEGER NOT NULL,
                peso FLOAT NOT NULL,
                imagen_base64 TEXT,
                fecha_medicion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES Animales(id)
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Eventos (
                id SERIAL PRIMARY KEY,
                animal_id INTEGER NOT NULL,
                tipo_evento VARCHAR NOT NULL,
                descripcion TEXT,
                fecha_evento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (animal_id) REFERENCES Animales(id)
            )
        """)
        
        connection.commit()
        print("Tablas creadas exitosamente")
        
        # Insertar los 5 cuyes si no existen
        cursor.execute("SELECT nombre FROM Animales")
        existentes = [row[0] for row in cursor.fetchall()]
        
        for i in range(1,6):
            nombre = f'cuy{i}'
            if nombre not in existentes:
                cursor.execute(
                    "INSERT INTO Animales (nombre) VALUES (%s)",
                    (nombre,)
                )
        
        connection.commit()
        
    except (Exception, Error) as error:
        print("Error en la base de datos:", error)
    finally:
        if connection:
            cursor.close()
            connection.close()

def insert_medicion(animal_id, peso, imagen_base64):
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute(
            """INSERT INTO Mediciones (animal_id, peso, imagen_base64)
               VALUES (%s, %s, %s)""",
            (animal_id, peso, imagen_base64)
        )
        
        connection.commit()
        return True
    except (Exception, Error) as error:
        print("Error insertando medición:", error)
        return False
    finally:
        if connection:
            cursor.close()
            connection.close()

def insert_evento(animal_id, tipo_evento, descripcion):
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute(
            """INSERT INTO Eventos (animal_id, tipo_evento, descripcion)
               VALUES (%s, %s, %s)""",
            (animal_id, tipo_evento, descripcion)
        )
        
        connection.commit()
        return True
    except (Exception, Error) as error:
        print("Error insertando evento:", error)
        return False
    finally:
        if connection:
            cursor.close()
            connection.close()

def get_animal_id(nombre):
    try:
        connection = psycopg2.connect(**DATABASE_CONFIG)
        cursor = connection.cursor()
        
        cursor.execute(
            "SELECT id FROM Animales WHERE nombre = %s",
            (nombre,)
        )
        
        result = cursor.fetchone()
        return result[0] if result else None
    except (Exception, Error) as error:
        print("Error obteniendo ID del animal:", error)
        return None
    finally:
        if connection:
            cursor.close()
            connection.close()
