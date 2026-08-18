export const generateCard = () => {
    const ranks = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const selectedRank = ranks[Math.floor(Math.random() * ranks.length)];
    const selectedSuit = suits[Math.floor(Math.random() * suits.length)];

    return {
        rank: selectedRank,
        suit: selectedSuit,
    };
};
