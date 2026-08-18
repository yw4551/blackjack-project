import { Router } from "express";
import { startGameController } from "../controllers/game.controller.js";

const router = Router();

router.post("/start-game", startGameController);

export default router;
