import { Router } from "express";
import {
    startGameController,
    startRoundController,
} from "../controllers/game.controller.js";
import { playerMiddleware } from "../middleware/player.middleware.js";

const router = Router();

router.post("/start-game", startGameController);
router.post("/start-round", playerMiddleware, startRoundController);

export default router;
