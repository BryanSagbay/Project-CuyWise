import { Router } from "express";
import { 
    getAnimales, 
    getMediciones, 
    getEventos,
    getAnimalById, 
    getMedicionById, 
    getEventoById,   
    getDistribucionRazas,
    getAnimalesActivosInactivos,
    getEvolucionPesoPorAnimal,
    getEventosPorTipo,
    getMedicionesPorAnimal,
    getAnimalesPorMesAnio,
    getRelacionPesoFecha,
    getPromedioPesoPorRaza
} 
    from "../controllers/pcws.controller.js";

const router = Router();

/**
 * @swagger
 * /animales:
 *   get:
 *     summary: Obtener todos los datos de la tabla Animales
 *     responses:
 *       200:
 *         description: Lista de animales obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Cuy 1"
 *                   raza:
 *                     type: string
 *                     example: "Criollo"
 *                   criadero:
 *                     type: string
 *                     example: "Criadero A"
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-23T15:20:16.750Z"
 *                   activo:
 *                     type: boolean
 *                     example: true
 */
router.get("/animales", getAnimales);

/**
 * @swagger
 * /mediciones:
 *   get:
 *     summary: Obtener todos los datos de la tabla Mediciones
 *     responses:
 *       200:
 *         description: Lista de mediciones obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   peso:
 *                     type: number
 *                     format: float
 *                     example: 120
 *                   imagen_base64:
 *                     type: string
 *                     example: "data:image/jpeg;base64"
 *                   fecha_medicion:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-23T15:25:38.282Z"
 *                   animal_id:
 *                     type: integer
 *                     example: 1
 */
router.get("/mediciones", getMediciones);

/**
 * @swagger
 * /eventos:
 *   get:
 *     summary: Obtener todos los datos de la tabla Eventos
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   tipo_evento:
 *                     type: string
 *                     example: "Registro"
 *                   descripcion:
 *                     type: string
 *                     example: "Se obtiene los datos del evento"
 *                   fecha_evento:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-23T15:21:39.639Z"
 *                   animal_id:
 *                     type: integer
 *                     example: 1
 */
router.get("/eventos", getEventos);


/**
 * @swagger
 * /animales/{id}:
 *   get:
 *     summary: Obtener un animal por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del animal a buscar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Datos del animal obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Cuy 1"
 *                 raza:
 *                   type: string
 *                   example: "Criollo"
 *                 criadero:
 *                   type: string
 *                   example: "Criadero A"
 *                 fecha_registro:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-23T15:20:16.750Z"
 *                 activo:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Animal no encontrado
 */
router.get("/animales/:id", getAnimalById);

/**
 * @swagger
 * /mediciones/{id}:
 *   get:
 *     summary: Obtener una medición por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la medición a buscar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Datos de la medición obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 peso:
 *                   type: number
 *                   format: float
 *                   example: 120
 *                 imagen_base64:
 *                   type: string
 *                   example: "data:image/jpeg;base64"
 *                 fecha_medicion:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-23T15:25:38.282Z"
 *                 animal_id:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Medición no encontrada
 */
router.get("/mediciones/:id", getMedicionById);

/**
 * @swagger
 * /eventos/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del evento a buscar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Datos del evento obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 tipo_evento:
 *                   type: string
 *                   example: "Registro"
 *                 descripcion:
 *                   type: string
 *                   example: "Se obtiene los datos del evento"
 *                 fecha_evento:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-23T15:21:39.639Z"
 *                 animal_id:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Evento no encontrado
 */
router.get("/eventos/:id", getEventoById);

//Consulta para los graficos
/**
 * @swagger
 * /graficos/distribucion-razas:
 *   get:
 *     summary: Obtener la distribución de animales por razas
 *     responses:
 *       200:
 *         description: Datos de la distribución de razas
 */
router.get("/graficos/distribucion-razas", getDistribucionRazas);

/**
 * @swagger
 * /graficos/activos-inactivos:
 *   get:
 *     summary: Obtener la cantidad de animales activos e inactivos
 *     responses:
 *       200:
 *         description: Datos de animales activos e inactivos
 */
router.get("/graficos/activos-inactivos", getAnimalesActivosInactivos);

/**
 * @swagger
 * /graficos/evolucion-peso:
 *   get:
 *     summary: Obtener la evolución del peso de los animales por fecha
 *     responses:
 *       200:
 *         description: Datos de la evolución del peso por animal
 */
router.get("/graficos/evolucion-peso", getEvolucionPesoPorAnimal);

/**
 * @swagger
 * /graficos/eventos-tipo:
 *   get:
 *     summary: Obtener la cantidad de eventos por tipo
 *     responses:
 *       200:
 *         description: Datos de eventos por tipo
 */
router.get("/graficos/eventos-tipo", getEventosPorTipo);

/**
 * @swagger
 * /graficos/mediciones-por-animal:
 *   get:
 *     summary: Obtener el número de mediciones realizadas a cada animal
 *     responses:
 *       200:
 *         description: Datos de mediciones por animal
 */
router.get("/graficos/mediciones-por-animal", getMedicionesPorAnimal);

/**
 * @swagger
 * /graficos/animales-por-mes:
 *   get:
 *     summary: Obtener la cantidad de animales registrados por mes/año
 *     responses:
 *       200:
 *         description: Datos de animales registrados por mes/año
 */
router.get("/graficos/animales-por-mes", getAnimalesPorMesAnio);

/**
 * @swagger
 * /graficos/relacion-peso-fecha:
 *   get:
 *     summary: Obtener la relación entre peso y fecha de medición
 *     responses:
 *       200:
 *         description: Datos de peso vs fecha de medición
 */
router.get("/graficos/relacion-peso-fecha", getRelacionPesoFecha);

/**
 * @swagger
 * /graficos/promedio-peso-raza:
 *   get:
 *     summary: Obtener el promedio de peso por raza
 *     responses:
 *       200:
 *         description: Promedio de peso por raza
 */
router.get("/graficos/promedio-peso-raza", getPromedioPesoPorRaza);

export default router;
