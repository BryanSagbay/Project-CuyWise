import { pool } from "../db.js";

// Funciones para obtener los datos de las tablas de la base de datos
export const getAnimales = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Animales";');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Animales' });
    }
};

export const getMediciones = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Mediciones";');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Mediciones' });
    }
};

export const getEventos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Eventos";');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Eventos' });
    }
};


//Funciones para buscar por ID
export const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Animales" WHERE id = $1;', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Animales' });
    }
}

export const getMedicionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Mediciones" WHERE id = $1;', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Mediciones' });
    }
}

export const getEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM "Eventos" WHERE id = $1;', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Eventos' });
    }
}