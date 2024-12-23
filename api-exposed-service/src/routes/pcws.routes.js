import { Router } from "express";
import { getPCWS, getPCWSforId } from "../controllers/pcws.controller.js";

const router = Router(); 

/**
 * @swagger
 * /pcws:
 *   get:
 *     summary: Se obtiene los datos de la API
 *     responses:
 *       200:
 *         description: Mensaje obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Se obtiene los datos de la API!"
 */
router.get("/pcws", getPCWS);

/**
 * @swagger
 * /pcws/{id}:
 *   get:
 *     summary: Obtener el dato por id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cuy o registro a buscar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Mensaje obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Se obtiene el dato según el id que buscas!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     animal_id:
 *                       type: integer
 *                       example: 1
 *                     nombre_animal:
 *                       type: string
 *                       example: "cuy 1"
 *                     raza_animal:
 *                       type: string
 *                       example: "criollo"
 *                     fecha_registro_animal:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-23T15:20:16.750Z"
 *                     activo_animal:
 *                       type: boolean
 *                       example: true
 *                     medicion_id:
 *                       type: integer
 *                       example: 1
 *                     peso_medicion:
 *                       type: number
 *                       format: float
 *                       example: 120
 *                     imagen_medicion:
 *                       type: string
 *                       example: "data:image/jpeg;base64"
 *                     fecha_medicion:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-23T15:25:38.282Z"
 *                     evento_id:
 *                       type: integer
 *                       example: 1
 *                     tipo_evento:
 *                       type: string
 *                       example: "Registro"
 *                     descripcion_evento:
 *                       type: string
 *                       example: "Se obtiene los datos del cuy"
 *                     fecha_evento:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-23T15:21:39.639Z"
 *             example:
 *               message: "Se obtiene el dato según el id que buscas!"
 *               data:
 *                 animal_id: 1
 *                 nombre_animal: "cuy 1"
 *                 raza_animal: "criollo"
 *                 fecha_registro_animal: "2024-12-23T15:20:16.750Z"
 *                 activo_animal: true
 *                 medicion_id: 1
 *                 peso_medicion: 120
 *                 imagen_medicion: "data:image/jpeg;base64"
 *                 fecha_medicion: "2024-12-23T15:25:38.282Z"
 *                 evento_id: 1
 *                 tipo_evento: "Registro"
 *                 descripcion_evento: "Se obtiene los datos del cuy"
 *                 fecha_evento: "2024-12-23T15:21:39.639Z"
 */
router.get("/pcws/:id", getPCWSforId);


export default router;
