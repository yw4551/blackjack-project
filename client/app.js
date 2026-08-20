const initializeGame = async () => {
    const playerId = localStorage.getItem("playerId");
    const chips = localStorage.getItem("chips");

    if (!playerId || !chips) {
        const result = await fetch("http://localhost:3000/start-game", {
            method: "POST",
        });

        const data = await result.json();

        localStorage.setItem("playerId", data.data.playerId);
        localStorage.setItem("chips", data.data.chips);

        return [data.data.playerId, data.data.chips];
    }

    return [playerId, Number(chips)];
};

const getMyRound = async () => {
    const response = await initializeGame();
    const playerId = response[0];

    const result = await fetch("http://localhost:3000/my-round", {
        headers: {
            "x-player-id": playerId,
        },
    });

    const data = await result.json();

    if (data.data) {
        return data.data;
    }

    return null;
};

const form = document.querySelector("form");
const betInput = document.querySelector("#bet-input");
const btns = document.querySelector("#btns");
const hitBtn = document.querySelector("#hit-btn");
const standBtn = document.querySelector("#stand-btn");
const formSection = document.querySelector("#start-round-form");
const playerCardsDiv = document.querySelector(".player-cards");
const dealerCardsDiv = document.querySelector(".dealer-cards");
const chips = document.querySelector(".chips");
const betDetails = document.querySelector(".bet-details");
const gameResult = document.querySelector("#game-result");

const renderGame = (round, currentChips) => {
    if (round === null) {
        formSection.style.display = "block";
        btns.style.display = "none";
        betInput.value = "";
        playerCardsDiv.innerHTML = "";
        dealerCardsDiv.innerHTML = "";
        gameResult.textContent = "";
        betDetails.textContent = "";
        chips.textContent = `Chips: ${currentChips}`;

        return;
    }

    formSection.style.display = "none";
    btns.style.display = "block";
    renderCards(round);
    chips.textContent = `Chips: ${round.chips ?? currentChips}`;

    if (round.bet !== undefined) {
        betDetails.textContent = `Bet: ${round.bet}`;
    }
};

const renderCards = (round) => {
    dealerCardsDiv.innerHTML = "";
    renderPlayerCards(round.playerCards);
    const dealerCard = round.dealerUpCard;
    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
        <p class="rank">${dealerCard.rank}</p>
        <p class="suit">${dealerCard.suit}</p>
    `;

    dealerCardsDiv.append(card);

    const hiddenCard = document.createElement("div");
    hiddenCard.className = "card hidden-card";
    hiddenCard.innerHTML = `
        <p class="rank">?</p>
        <p class="suit">?</p>
    `;

    dealerCardsDiv.append(hiddenCard);
};

const renderPlayerCards = (playerCards) => {
    playerCardsDiv.innerHTML = "";

    playerCards.forEach((cardData) => {
        const card = document.createElement("div");

        card.className = "card";
        card.innerHTML = `
            <p class="rank">${cardData.rank}</p>
            <p class="suit">${cardData.suit}</p>
        `;

        playerCardsDiv.append(card);
    });
};

const renderAllDealerCards = (dealerCards) => {
    dealerCardsDiv.innerHTML = "";

    dealerCards.forEach((cardData) => {
        const card = document.createElement("div");

        card.className = "card";
        card.innerHTML = `
            <p class="rank">${cardData.rank}</p>
            <p class="suit">${cardData.suit}</p>
        `;

        dealerCardsDiv.append(card);
    });
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const betValue = Number(betInput.value);
    const response = await initializeGame();
    const playerId = response[0];

    const result = await fetch("http://localhost:3000/start-round", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-player-id": playerId,
        },

        body: JSON.stringify({
            bet: betValue,
        }),
    });

    const data = await result.json();

    if (data.success === true) {
        localStorage.setItem("chips", data.data.chips);
        renderGame(data.data, data.data.chips);
    }
});

hitBtn.addEventListener("click", async () => {
    const response = await initializeGame();
    const playerId = response[0];

    const result = await fetch("http://localhost:3000/hit", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-player-id": playerId,
        },
    });

    const data = await result.json();

    if (data.success === true) {
        const playerCards = data.data.playerCards;
        renderPlayerCards(playerCards);
        chips.textContent = `Chips: ${data.data.chips}`;
        localStorage.setItem("chips", data.data.chips);

        if (data.data.status === "player_bust") {
            gameResult.textContent = "Player Bust!";
            renderGame(null, data.data.chips);
        }
    }
});

standBtn.addEventListener("click", async () => {
    const response = await initializeGame();
    const playerId = response[0];

    const result = await fetch("http://localhost:3000/stand", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-player-id": playerId,
        },
    });

    const data = await result.json();

    if (data.success === true) {
        const dealerCards = data.data.dealerCards;

        renderAllDealerCards(dealerCards);

        gameResult.textContent = data.data.status;
        chips.textContent = `Chips: ${data.data.chips}`;
        localStorage.setItem("chips", data.data.chips);
        btns.style.display = "none";
        formSection.style.display = "block";
        betInput.value = "";
    }
});

const initializePage = async () => {
    const response = await initializeGame();
    const currentChips = response[1];
    const round = await getMyRound();

    renderGame(round, currentChips);
};

initializePage();
