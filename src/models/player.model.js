import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    chips: {
        type: Number,
        min: 0,
        default: 1000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Player = mongoose.model("Player", playerSchema);

export default Player;
