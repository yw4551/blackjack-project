import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { playDealerTurn } from "../src/utils/dealer.js";
import { calculateHandValue } from "../src/utils/hand.js";

describe("playDealerTurn", () => {
    test("Dealer stops at 17", () => {
        const dealerCards = [
            { rank: "10", suit: "hearts" },
            { rank: "7", suit: "clubs" },
        ];

        const result = playDealerTurn(dealerCards);

        assert.equal(result.length, 2);
    });

    test("Dealer draws when total below 17", () => {
        const dealerCards = [
            { rank: "10", suit: "hearts" },
            { rank: "5", suit: "clubs" },
        ];

        const result = playDealerTurn(dealerCards);
        const total = calculateHandValue(result);

        assert(total >= 17);
    });

    test("Dealer stops when bust", () => {
        const dealerCards = [
            { rank: "K", suit: "hearts" },
            { rank: "Q", suit: "clubs" },
            { rank: "5", suit: "spades" },
        ];

        const result = playDealerTurn(dealerCards);
        const total = calculateHandValue(dealerCards);

        assert(total > 21);
        assert.equal(result.length, 3);
    });

    test("A becomes 1 when total is more than 21", () => {
        const dealerCards = [
            { rank: "A", suit: "hearts" },
            { rank: "A", suit: "clubs" },
            { rank: "5", suit: "spades" },
        ];

        const result = playDealerTurn(dealerCards);
        const total = calculateHandValue(result);

        assert.equal(total, 17);
    });
});
