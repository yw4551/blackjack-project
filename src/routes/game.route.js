import { Router } from "express";
import {
    startGameController,
    startRoundController,
    myRoundController,
    hitController,
    standController,
} from "../controllers/game.controller.js";
import { playerMiddleware } from "../middleware/player.middleware.js";

const router = Router();

router.post("/start-game", startGameController);
router.post("/start-round", playerMiddleware, startRoundController);
router.get("/my-round", playerMiddleware, myRoundController);
router.post("/hit", playerMiddleware, hitController);
router.post("/stand", playerMiddleware, standController);

export default router;
