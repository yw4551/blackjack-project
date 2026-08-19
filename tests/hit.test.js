import test, { afterEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import Round from "../src/models/round.model.js";
import { hitController } from "../src/controllers/game.controller.js";
import { calculateHandValue } from "../src/utils/hand.js";

const req = {
    player: {
        _id: "player123",
        chips: 900,
    },
};

const createRes = () => {
    return {
        statusCode: null,
        body: null,

        status(code) {
            this.statusCode = code;
            return this;
        },

        json(data) {
            this.body = data;
            return this;
        },
    };
};

afterEach(() => {
    mock.restoreAll();
});

describe("hitController", () => {
    test("adds a card to player's hand", async () => {
        const res = createRes();

        const fakeRound = {
            playerCards: [
                { rank: "10", suit: "hearts" },
                { rank: "5", suit: "clubs" },
            ],
            status: "in_progress",
            save: async () => {},
        };

        mock.method(Round, "findOne", async () => {
            return fakeRound;
        });

        await hitController(req, res);

        const expectedTotal = calculateHandValue(fakeRound.playerCards);

        assert.equal(fakeRound.playerCards.length, 3);
        assert.equal(res.body.data.playerTotal, expectedTotal);
    });

    test.todo("player busts when total is above 21", async () => {
        const res = createRes();

        const fakeRound = {
            playerCards: [
                { rank: "10", suit: "hearts" },
                { rank: "5", suit: "clubs" },
            ],
            status: "in_progress",
            save: async () => {},
        };

        mock.method(Math, "random", () => 0.92);

        mock.method(Round, "findOne", () => {
            return fakeRound;
        });

        await hitController(req, res);

        assert.equal(res.body.data.status, "player_bust");
        assert.equal(res.body.data.playerTotal, 25);
    });

    test("returns 404 when there is no active round", async () => {
        const res = createRes();

        mock.method(Round, "findOne", async () => {
            return null;
        });

        await hitController(req, res);

        assert.equal(res.statusCode, 404);
        assert.equal(res.body.success, false);
        assert.equal(res.body.error, "No active round");
    });
});
