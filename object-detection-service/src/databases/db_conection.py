from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv


# Cargar variables de entorno
load_dotenv()
# URL de la base de datos desde el archivo .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Crear el motor de conexión para interactuar con la base de datos
engine = create_engine(DATABASE_URL)

# Probar la conexión a la base de datos
try:
    with engine.connect() as connection:
        print("Conexión a la base de datos exitosa.")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")

# Crear la sesión para las operaciones de la base de datos
Session = sessionmaker(bind=engine)

# Función para obtener la sesión de la base de datos
def get_db():
    session = Session()
    try:
        yield session
    finally:
        session.close()