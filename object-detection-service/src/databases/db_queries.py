from sqlalchemy import Table, Column, Integer, String, Float, Boolean, Text, DateTime, MetaData
from databases.db_conection import engine
from datetime import datetime

metadata = MetaData()

# Definir la tabla de Animales
animales_table = Table(
    'Animales', metadata,
    Column('id', Integer, primary_key=True),
    Column('nombre', String, nullable=False),
    Column('raza', String, nullable=True),
    Column('criadero', String, nullable=True),
    Column('fecha_registro', DateTime, default=datetime.utcnow),
    Column('activo', Boolean, default=True)
)

# Definir la tabla de Mediciones
mediciones_table = Table(
    'Mediciones', metadata,
    Column('id', Integer, primary_key=True),
    Column('animal_id', Integer, nullable=False),
    Column('peso', Float, nullable=False),
    Column('imagen_base64', Text, nullable=True),
    Column('fecha_medicion', DateTime, default=datetime.utcnow)
)

# Definir la tabla de Eventos
eventos_table = Table(
    'Eventos', metadata,
    Column('id', Integer, primary_key=True),
    Column('animal_id', Integer, nullable=False),
    Column('tipo_evento', String, nullable=False),
    Column('descripcion', Text, nullable=True),
    Column('fecha_evento', DateTime, default=datetime.utcnow)
)

# Crear las tablas en la base de datos
metadata.create_all(engine)

# Función para guardar un nuevo animal en la tabla Animales
def save_animal(nombre, raza, criadero):
    with engine.connect() as conn:
        # Insertar un nuevo animal
        conn.execute(animales_table.insert().values(
            nombre=nombre,
            raza=raza,
            criadero=criadero,
            fecha_registro=datetime.utcnow(),
            activo=True
        ))
        conn.commit()

# Función para guardar una medición en la tabla Mediciones
def save_medicion(animal_id, peso, imagen_base64):
    with engine.connect() as conn:
        # Insertar una nueva medición para un animal
        conn.execute(mediciones_table.insert().values(
            animal_id=animal_id,
            peso=peso,
            imagen_base64=imagen_base64,
            fecha_medicion=datetime.utcnow()
        ))
        conn.commit()

# Función para guardar un evento en la tabla Eventos
def save_evento(animal_id, tipo_evento, descripcion):
    with engine.connect() as conn:
        # Insertar un nuevo evento para un animal
        conn.execute(eventos_table.insert().values(
            animal_id=animal_id,
            tipo_evento=tipo_evento,
            descripcion=descripcion,
            fecha_evento=datetime.utcnow()
        ))
        conn.commit()

# Función para obtener un animal por su id
def get_animal_by_id(animal_id):
    with engine.connect() as conn:
        result = conn.execute(animales_table.select().where(animales_table.c.id == animal_id)).fetchone()
        return result
