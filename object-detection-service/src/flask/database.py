import psycopg2

DB_CONFIG = {
    'dbname': 'cuywise',
    'user': 'bryxn',
    'password': '2001',
    'host': 'localhost',
    'port': 5432
}

def registrar_evento(animal_id, tipo_evento, descripcion):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        INSERT INTO Eventos (animal_id, tipo_evento, descripcion)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (animal_id, tipo_evento, descripcion))
        conn.commit()

        print(f"Evento registrado: {tipo_evento} - {descripcion}")
    except Exception as e:
        print(f"Error al registrar evento: {e}")
    finally:
        cursor.close()
        conn.close()

# Función para insertar medición en la base de datos
def insertar_medicion(animal_id, peso, imagen_base64):
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
        INSERT INTO Mediciones (animal_id, peso, imagen_base64)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query, (animal_id, peso, imagen_base64))
        conn.commit()

        # Registrar evento relacionado con la medición
        registrar_evento(animal_id, "Medición", f"Se registró una medición de peso: {peso} gramos")
    except Exception as e:
        print(f"Error al insertar medición: {e}")
        registrar_evento(animal_id, "Error", f"Error al insertar medición: {e}")
    finally:
        cursor.close()
        conn.close()