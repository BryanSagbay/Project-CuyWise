import { pool } from "../db.js";

export const getPCWS = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.id AS animal_id,
                a.nombre AS nombre_animal,
                a.raza AS raza_animal,
                a.criadero AS criadero_animal,
                a.fecha_registro AS fecha_registro_animal,
                a.activo AS activo_animal,
                m.id AS medicion_id,
                m.peso AS peso_medicion,
                m.imagen_base64 AS imagen_medicion,
                m.fecha_medicion AS fecha_medicion,
                e.id AS evento_id,
                e.tipo_evento AS tipo_evento,
                e.descripcion AS descripcion_evento,
                e.fecha_evento AS fecha_evento
            FROM 
                "Animales" a
            LEFT JOIN 
                "Mediciones" m ON a.id = m.animal_id
            LEFT JOIN 
                "Eventos" e ON a.id = e.animal_id;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
}

export const getPCWSforId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                a.id AS animal_id,
                a.nombre AS nombre_animal,
                a.raza AS raza_animal,
                a.criadero AS criadero_animal,
                a.fecha_registro AS fecha_registro_animal,
                a.activo AS activo_animal,
                m.id AS medicion_id,
                m.peso AS peso_medicion,
                m.imagen_base64 AS imagen_medicion,
                m.fecha_medicion AS fecha_medicion,
                e.id AS evento_id,
                e.tipo_evento AS tipo_evento,
                e.descripcion AS descripcion_evento,
                e.fecha_evento AS fecha_evento
            FROM 
                "Animales" a
            LEFT JOIN 
                "Mediciones" m ON a.id = m.animal_id
            LEFT JOIN 
                "Eventos" e ON a.id = e.animal_id
            WHERE 
                a.id = $1;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Animal no encontrado' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
}