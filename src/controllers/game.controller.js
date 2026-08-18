import Player from "../models/player.model.js";
import Round from "../models/round.model.js";
import { generateCard } from "../utils/card.js";
import z, { date } from "zod";

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

export const startRoundController = async (req, res) => {
    const validatedBet = z.object({
        bet: z.number().positive(),
    });

    const result = validatedBet.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            error: "Invalid bet value",
        });
    }

    const player = req.player;

    if (result.data.bet > player.chips) {
        return res.status(400).json({
            success: false,
            error: "You cannot bet more then what you have",
        });
    }

    const activeRound = await Round.findOne({
        playerId: player._id,
        status: "in_progress",
    });

    if (activeRound) {
        return res.status(409).json({
            success: false,
            error: "You have an active game",
        });
    }

    player.chips = player.chips - result.data.bet;

    await player.save();

    const playerCards = [generateCard(), generateCard()];
    const dealerCards = [generateCard(), generateCard()];

    const round = new Round({
        playerId: player._id,
        bet: result.data.bet,
        playerCards,
        dealerCards,
        status: "in_progress",
    });

    const savedRound = await round.save();

    const response = {
        roundId: savedRound._id,
        playerCards: savedRound.playerCards,
        dealerUpCard: savedRound.dealerCards[0],
        chips: player.chips,
    };

    res.status(201).json({
        success: true,
        data: response,
    });
};

export const myRoundController = async (req, res) => {
    const player = req.player;

    const round = await Round.findOne({
        playerId: player._id,
        status: "in_progress",
    });

    if (!round) {
        return res.json({
            success: true,
            round: null,
        });
    }

    const response = {
        roundId: round._id,
        playerCards: round.playerCards,
        dealerUpCard: round.dealerCards[0],
        bet: round.bet,
        status: round.status,
    };

    res.json({
        success: true,
        data: response,
    });
};
