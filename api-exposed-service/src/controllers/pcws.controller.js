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

// Funciones para obtener los datos de las tablas de la base de datos
export const getMediciones = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Mediciones";');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Mediciones' });
    }
};

// Funciones para obtener los datos de las tablas de la base de datos
export const getEventos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "Eventos";');
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener los datos de Eventos' });
    }
};

//Funciones para buscar por ID Animales
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

//Funciones para buscar por ID Mediciones
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
// Consultas para gráficos
// 1. Distribución de Razas
export const getDistribucionRazas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT raza, COUNT(*) as cantidad
            FROM "Animales"
            GROUP BY raza;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener la distribución de razas' });
    }
};

// 2. Animales Activos vs. Inactivos
export const getAnimalesActivosInactivos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT activo, COUNT(*) as cantidad
            FROM "Animales"
            GROUP BY activo;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener animales activos e inactivos' });
    }
};

// 3. Evolución del Peso por Animal
export const getEvolucionPesoPorAnimal = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT animal_id, fecha_medicion, peso
            FROM "Mediciones"
            ORDER BY animal_id, fecha_medicion;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener la evolución del peso por animal' });
    }
};

// 4. Eventos por Tipo
export const getEventosPorTipo = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT tipo_evento, COUNT(*) as cantidad
            FROM "Eventos"
            GROUP BY tipo_evento;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener eventos por tipo' });
    }
};

// 5. Número de Mediciones por Animal
export const getMedicionesPorAnimal = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT animal_id, COUNT(*) as cantidad
            FROM "Mediciones"
            GROUP BY animal_id;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener mediciones por animal' });
    }
};

// 6. Registro de Animales por Mes/Año
export const getAnimalesPorMesAnio = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT TO_CHAR(fecha_registro, 'YYYY-MM') as mes_anio, COUNT(*) as cantidad
            FROM "Animales"
            GROUP BY mes_anio
            ORDER BY mes_anio;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener registro de animales por mes/año' });
    }
};

// 7. Relación Peso vs. Fecha de Medición
export const getRelacionPesoFecha = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT peso, fecha_medicion
            FROM "Mediciones";
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener relación peso vs fecha de medición' });
    }
};

// 8. Promedio de Peso por Raza
export const getPromedioPesoPorRaza = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.raza, AVG(m.peso) as peso_promedio
            FROM "Animales" a
            JOIN "Mediciones" m ON a.id = m.animal_id
            GROUP BY a.raza;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error al obtener el promedio de peso por raza' });
    }
};