import {
    startGameService,
    startRoundService,
    myRoundService,
    hitService,
    standService,
} from "../services/game.service.js";

export const startGameController = async (req, res) => {
    try {
        const data = await startGameService();

        res.status(201).json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

export const startRoundController = async (req, res) => {
    try {
        const data = await startRoundService(req.player, req.body);

        res.status(201).json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            error: err.message,
        });
    }
};

export const myRoundController = async (req, res) => {
    try {
        const data = await myRoundService(req.player);

        if (!data) {
            return res.json({
                success: true,
                round: null,
            });
        }

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};

export const hitController = async (req, res) => {
    try {
        const data = await hitService(req.player);

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            error: err.message,
        });
    }
};

export const standController = async (req, res) => {
    try {
        const data = await standService(req.player);

        res.json({
            success: true,
            data,
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            error: err.message,
        });
    }
};
