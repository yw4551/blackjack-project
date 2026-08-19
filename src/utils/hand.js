export const calculateHandValue = (cards) => {
    let total = cards.reduce((sum, card) => {
        const val = card.rank.toUpperCase();
        if (val === "A") return sum + 11;
        if (["J", "Q", "K"].includes(val)) return sum + 10;
        return sum + Number(val);
    }, 0);

    if (total > 21) {
        let countA = cards.filter(
            (card) => card.rank.toUpperCase() === "A",
        ).length;

        while (total > 21 && countA > 0) {
            total -= 10;
            countA--;
        }
    }

    return total;
};
