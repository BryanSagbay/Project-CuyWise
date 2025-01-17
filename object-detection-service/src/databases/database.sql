CREATE TABLE "Animales" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR NOT NULL,
    "raza" VARCHAR,
    "criadero" VARCHAR,
    "fecha_registro" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN DEFAULT TRUE
);

CREATE TABLE "Mediciones" (
    "id" SERIAL PRIMARY KEY,
    "animal_id" INTEGER NOT NULL,
    "peso" FLOAT NOT NULL,
    "imagen_base64" TEXT,
    "fecha_medicion" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("animal_id") REFERENCES "Animales" ("id")
);

CREATE TABLE "Eventos" (
    "id" SERIAL PRIMARY KEY,
    "animal_id" INTEGER NOT NULL,
    "tipo_evento" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "fecha_evento" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("animal_id") REFERENCES "Animales" ("id")
);
