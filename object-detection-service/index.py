from src.databases.db_conexion import SessionLocal
from src.databases.db_queries import obtener_animales, insertar_medicion, registrar_evento

def main():
    # Crear una sesión
    db = SessionLocal()
    
    try:
        # Obtener todos los animales
        print("Animales registrados:")
        animales = obtener_animales(db)
        for animal in animales:
            print(animal)
    
    except Exception as e:
        print(f"Error durante la ejecución: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
