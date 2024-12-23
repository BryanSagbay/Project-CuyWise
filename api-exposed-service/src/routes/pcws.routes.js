import { Router } from "express";
import { getPCWS, getPCWSforId } from "../controllers/pcws.controller.js";

const router = Router(); 

router.get("/pcws", getPCWS);

router.get("/pcws/:id", getPCWSforId);

export default router;
