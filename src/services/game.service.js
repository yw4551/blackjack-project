import z from "zod";
import Player from "../models/player.model.js";
import Round from "../models/round.model.js";
import { generateCard } from "../utils/card.js";
import { calculateHandValue } from "../utils/hand.js";
import { playDealerTurn } from "../utils/dealer.js";

export const startGameService = async () => {
    const newPlayer = new Player();
    const savedPlayer = await newPlayer.save();

    return {
        playerId: savedPlayer._id,
        chips: savedPlayer.chips,
    };
};

export const startRoundService = async (player, body) => {
    const validatedBet = z.object({
        bet: z.number().positive(),
    });

    const result = validatedBet.safeParse(body);

    if (!result.success) {
        const error = new Error("Invalid bet value");
        error.statusCode = 400;
        throw error;
    }

    const bet = result.data.bet;

    if (bet > player.chips) {
        const error = new Error("You cannot bet more then what you have");
        error.statusCode = 400;
        throw error;
    }

    const activeRound = await Round.findOne({
        playerId: player._id,
        status: "in_progress",
    });

    if (activeRound) {
        const error = new Error("You have an active game");
        error.statusCode = 409;
        throw error;
    }

    player.chips -= bet;

    await player.save();

    const playerCards = [generateCard(), generateCard()];

    const dealerCards = [generateCard(), generateCard()];

    const round = new Round({
        playerId: player._id,
        bet,
        playerCards,
        dealerCards,
        status: "in_progress",
    });

    const savedRound = await round.save();

    return {
        roundId: savedRound._id,
        playerCards: savedRound.playerCards,
        dealerUpCard: savedRound.dealerCards[0],
        chips: player.chips,
    };
};

export const myRoundService = async (player) => {
    const round = await Round.findOne({
        playerId: player._id,
        status: "in_progress",
    });

    if (!round) {
        return null;
    }

    return {
        roundId: round._id,
        playerCards: round.playerCards,
        dealerUpCard: round.dealerCards[0],
        bet: round.bet,
        status: round.status,
    };
};

export const hitService = async (player) => {
    const round = await Round.findOne({
        playerId: player._id,
        status: "in_progress",
    });

    if (!round) {
        const error = new Error("No active round");
        error.statusCode = 404;
        throw error;
    }

    const newCard = generateCard();

    round.playerCards.push(newCard);

    const playerTotal = calculateHandValue(round.playerCards);

    if (playerTotal > 21) {
        round.status = "player_bust";
    }

    await round.save();

    return {
        playerCards: round.playerCards,
        playerTotal,
        status: round.status,
        chips: player.chips,
    };
};

export const standService = async (player) => {
    const round = await Round.findOne({
        playerId: player._id,
        status: "in_progress",
    });

    if (!round) {
        const error = new Error("No active round");
        error.statusCode = 404;
        throw error;
    }

    const dealerCards = playDealerTurn(round.dealerCards);

    const dealerTotal = calculateHandValue(dealerCards);

    const playerTotal = calculateHandValue(round.playerCards);

    if (dealerTotal > 21) {
        round.status = "dealer_bust";
        player.chips += round.bet * 2;
    } else if (dealerTotal > playerTotal) {
        round.status = "dealer_win";
    } else if (playerTotal > dealerTotal) {
        round.status = "player_win";
        player.chips += round.bet * 2;
    } else {
        round.status = "push";
        player.chips += round.bet;
    }

    await round.save();
    await player.save();

    return {
        playerCards: round.playerCards,
        dealerCards,
        playerTotal,
        dealerTotal,
        status: round.status,
        chips: player.chips,
    };
};
