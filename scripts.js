document.addEventListener('DOMContentLoaded', async function() {
    const favoriteNumber = 7;
    try {
        const facts = await Promise.all(
            Array.from({ length: 4 }, () => axios.get(`http://numbersapi.com/${favoriteNumber}?json`))
        );
        const factsContainer = document.getElementById('factsContainer');
        factsContainer.innerHTML = '';
        facts.forEach((fact, index) => {
            const factElement = document.createElement('p');
            factElement.textContent = `Fact ${index + 1}: ${fact.data.text}`;
            factsContainer.appendChild(factElement);
        });
    } catch (error) {
        console.error('Error fetching number facts:', error);
        document.getElementById('numberFact').textContent = 'Failed to load facts. Try again later.';
    }

    let deckId = null;

    document.getElementById('drawCard').addEventListener('click', async () => {
        if (!deckId) {
            const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/');
            deckId = response.data.deck_id;
        }
        await drawCard(deckId);
    });

    document.getElementById('drawTwoCards').addEventListener('click', async () => {
        await drawTwoCardsFromSameDeck();
    });
});

async function drawCard(deckId) {
    try {
        const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        if (response.data.cards.length === 0) {
            alert('No more cards in deck!');
            return;
        }
        const card = response.data.cards[0];
        document.getElementById('cardContainer').innerHTML = `<p>${card.value} of ${card.suit}</p>`;
    } catch (err) {
        console.error('Error drawing card:', err);
        alert('Failed to draw a card.');
    }
}

async function drawTwoCardsFromSameDeck() {
    try {
        const firstDraw = await axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
        const firstCard = firstDraw.data.cards[0];
        const deckId = firstDraw.data.deck_id;
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';
        cardContainer.appendChild(createCardElement(`First card: ${firstCard.value} of ${firstCard.suit}`));

        const secondDraw = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const secondCard = secondDraw.data.cards[0];
        cardContainer.appendChild(createCardElement(`Second card: ${secondCard.value} of ${secondCard.suit}`));
    } catch (err) {
        console.error('Error drawing cards:', err);
        alert('Failed to draw cards.');
    }
}

function createCardElement(text) {
    const cardElement = document.createElement('p');
    cardElement.textContent = text;
    return cardElement;
}