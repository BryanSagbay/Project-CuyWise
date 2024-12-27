import { Router } from "express";
import { getAnimales, getMediciones, getEventos, getAnimalById, getMedicionById, getEventoById  } from "../controllers/pcws.controller.js";

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

export default router;
