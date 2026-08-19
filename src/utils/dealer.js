import { calculateHandValue } from "./hand.js";
import { generateCard } from "./card.js";

export const playDealerTurn = (dealerCards) => {
    let total = calculateHandValue(dealerCards);

    while (total < 17) {
        const newCard = generateCard();
        dealerCards.push(newCard);
        total = calculateHandValue(dealerCards);
    }

    return dealerCards;
};
