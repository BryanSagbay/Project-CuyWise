import os
import psycopg2
from psycopg2.extras import RealDictCursor
from urllib.parse import urlparse

# Extraer credenciales desde la URL de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL")
parsed_url = urlparse(DATABASE_URL)
DB_HOST = parsed_url.hostname
DB_PORT = parsed_url.port
DB_NAME = parsed_url.path[1:]  # Remover el primer '/'
DB_USER = parsed_url.username
DB_PASSWORD = parsed_url.password

def get_connection():
    """
    Establece y devuelve una conexión a la base de datos.
    """
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return connection
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise

def insert_measurement(animal_id, weight, image_base64, measurement_date):
    """
    Inserta una nueva medición en la tabla "Mediciones".
    """
    query = """
    INSERT INTO "Mediciones" (animal_id, peso, imagen_base64, fecha_medicion)
    VALUES (%s, %s, %s, %s)
    """
    values = (animal_id, weight, image_base64, measurement_date)

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                conn.commit()
                print("Medición insertada exitosamente.")
    except Exception as e:
        print(f"Error al insertar medición: {e}")


def insert_event(animal_id, event_type, description, event_date):
    """
    Inserta un nuevo evento en la tabla "Eventos".
    """
    query = """
    INSERT INTO "Eventos" (animal_id, tipo_evento, descripcion, fecha_evento)
    VALUES (%s, %s, %s, %s)
    """
    values = (animal_id, event_type, description, event_date)

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, values)
                conn.commit()
                print("Evento insertado exitosamente.")
    except Exception as e:
        print(f"Error al insertar evento: {e}")