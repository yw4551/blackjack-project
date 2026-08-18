import Player from "../models/player.model.js";

export const startGameController = async (req, res) => {
    try {
        const newPlayer = new Player();
        const savedPlayer = await newPlayer.save();

        res.status(201).json({
            success: true,
            data: {
                playerId: savedPlayer._id,
                chips: savedPlayer.chips,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
};
