import test, { afterEach, describe, mock } from "node:test";
import assert from "node:assert/strict";
import { standController } from "../src/controllers/game.controller.js";
import Round from "../src/models/round.model.js";

const createReq = () => {
    return {
        player: {
            _id: "player123",
            chips: 900,
            save: () => {},
        },
    };
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

describe("standController", () => {
    test("returns 404 when there is no active round", async () => {
        const req = createReq();
        const res = createRes();

        mock.method(Round, "findOne", async () => {
            return null;
        });

        await standController(req, res);

        assert.equal(res.statusCode, 404);
        assert.equal(res.body.success, false);
        assert.equal(res.body.error, "No active round");
    });

    test("dealer busts and player wins", async () => {
        const req = createReq();
        const res = createRes();
        const fakeRound = {
            playerCards: [
                { rank: "10", suit: "hearts" },
                { rank: "5", suit: "clubs" },
            ],
            dealerCards: [
                { rank: "Q", suit: "clubs" },
                { rank: "10", suit: "hearts" },
                { rank: "5", suit: "clubs" },
            ],
            bet: 100,
            status: "in_progress",
            save: () => {},
        };

        mock.method(Round, "findOne", async () => {
            return fakeRound;
        });

        await standController(req, res);

        assert.equal(res.body.data.status, "dealer_bust");
        assert.equal(res.body.data.playerTotal, 15);
        assert.equal(res.body.data.dealerTotal, 25);
        assert.equal(res.body.data.chips, 1100);
    });

    test("dealer wins", async () => {
        const req = createReq();
        const res = createRes();
        const fakeRound = {
            playerCards: [
                { rank: "9", suit: "hearts" },
                { rank: "5", suit: "clubs" },
            ],
            dealerCards: [
                { rank: "Q", suit: "clubs" },
                { rank: "6", suit: "hearts" },
                { rank: "2", suit: "hearts" },
            ],
            bet: 100,
            status: "in_progress",
            save: () => {},
        };

        mock.method(Round, "findOne", async () => {
            return fakeRound;
        });

        await standController(req, res);

        assert.equal(res.body.data.status, "dealer_win");
        assert.equal(res.body.data.playerTotal, 14);
        assert.equal(res.body.data.dealerTotal, 18);
        assert.equal(res.body.data.chips, 900);
    });

    test("player wins", async () => {
        const req = createReq();
        const res = createRes();
        const fakeRound = {
            playerCards: [
                { rank: "J", suit: "hearts" },
                { rank: "8", suit: "clubs" },
                { rank: "3", suit: "clubs" },
            ],
            dealerCards: [
                { rank: "8", suit: "clubs" },
                { rank: "10", suit: "hearts" },
            ],
            bet: 100,
            status: "in_progress",
            save: () => {},
        };

        mock.method(Round, "findOne", async () => {
            return fakeRound;
        });

        await standController(req, res);

        assert.equal(res.body.data.status, "player_win");
        assert.equal(res.body.data.playerTotal, 21);
        assert.equal(res.body.data.dealerTotal, 18);
        assert.equal(res.body.data.chips, 1100);
    });

    test("player and dealer are equal", async () => {
        const req = createReq();
        const res = createRes();
        const fakeRound = {
            playerCards: [
                { rank: "J", suit: "hearts" },
                { rank: "8", suit: "clubs" },
            ],
            dealerCards: [
                { rank: "8", suit: "clubs" },
                { rank: "10", suit: "hearts" },
            ],
            bet: 100,
            status: "in_progress",
            save: () => {},
        };

        mock.method(Round, "findOne", async () => {
            return fakeRound;
        });

        await standController(req, res);

        assert.equal(res.body.data.status, "push");
        assert.equal(res.body.data.playerTotal, 18);
        assert.equal(res.body.data.dealerTotal, 18);
        assert.equal(res.body.data.chips, 1000);
    });
});
