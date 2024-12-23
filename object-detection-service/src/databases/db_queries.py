from sqlalchemy.orm import Session
from sqlalchemy import text

# Función para obtener todos los animales
def obtener_animales(db: Session):
    query = text('SELECT * FROM "Animales"')
    result = db.execute(query).fetchall()
    return result

# Función para insertar una nueva medición
def insertar_medicion(db: Session, animal_id: int, peso: float, imagen_base64: str, fecha_medicion: str):
    query = text("""
        INSERT INTO "Mediciones" (animal_id, peso, imagen_base64, fecha_medicion)
        VALUES (:animal_id, :peso, :imagen_base64, :fecha_medicion)
    """)
    db.execute(query, {
        "animal_id": animal_id,
        "peso": peso,
        "imagen_base64": imagen_base64,
        "fecha_medicion": fecha_medicion
    })
    db.commit()

# Función para registrar un evento
def registrar_evento(db: Session, animal_id: int, tipo_evento: str, descripcion: str, fecha_evento: str):
    query = text("""
        INSERT INTO "Eventos" (animal_id, tipo_evento, descripcion, fecha_evento)
        VALUES (:animal_id, :tipo_evento, :descripcion, :fecha_evento)
    """)
    db.execute(query, {
        "animal_id": animal_id,
        "tipo_evento": tipo_evento,
        "descripcion": descripcion,
        "fecha_evento": fecha_evento
    })
    db.commit()
