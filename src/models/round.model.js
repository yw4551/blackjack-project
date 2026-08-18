import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    rank: {
        type: String,
        enum: [
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "A",
            "J",
            "Q",
            "K",
        ],
    },
    suit: {
        type: String,
        enum: ["hearts", "diamonds", "clubs", "spades"],
    },
});

const roundSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
    },
    bet: {
        type: Number,
        min: 0,
    },
    playerCards: [cardSchema],
    dealerCards: [cardSchema],
    status: {
        type: String,
        enum: [
            "in_progress",
            "player_bust",
            "dealer_bust",
            "player_win",
            "dealer_win",
            "push",
        ],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Round = mongoose.model("Round", roundSchema);

export default Round;
