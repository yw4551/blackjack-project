import Player from "../models/player.model.js";

export const playerMiddleware = async (req, res, next) => {
    try {
        const player = req.headers["x-player-id"];
        const inDb = await Player.findById(player);

        if (!inDb) {
            return res.status(401).json({
                success: false,
                error: "Player not found",
            });
        }

        req.player = inDb;
        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
