document.addEventListener('DOMContentLoaded', function() {
    const favoriteNumber = 7;
    const requests = Array.from({ length: 4 }, () =>
        fetch(`http://numbersapi.com/${favoriteNumber}?json`)
        .then(response => response.json())
    );

    Promise.all(requests)
    .then(facts => {
        const factsContainer = document.getElementById('numberFact');
        factsContainer.innerHTML = '';
        facts.forEach((fact, index) => {
            const factElement = document.createElement('p');
            factElement.textContent = `Fact ${index + 1}: ${fact.text}`;
            factsContainer.appendChild(factElement);
        });
    })
    .catch(error => {
        console.error('Error fetching number facts:', error);
        document.getElementById('numberFact').textContent = 'Failed to load facts. Try again later.';
    });

// Fact 1: 7 is the number of suicides mentioned in the Bible.
// Fact 2: 7 is the number of periods, or horizontal rows of elements, in the periodic table.
// Fact 3: 7 is the number of colors of the rainbow.
// Fact 4: 7 is the number of SI base units.

    let deckId = null;
    document.getElementById('drawCard').addEventListener('click', function() {
        if (!deckId) {
            fetch('https://deckofcardsapi.com/api/deck/new/shuffle/')
                .then(response => response.json())
                .then(data => {
                    deckId = data.deck_id;
                    drawCard(deckId);
                });
        } else {
            drawCard(deckId);
        }
    });

    document.getElementById('drawTwoCards').addEventListener('click', function() {
        drawTwoCardsFromSameDeck();
    });
});

function drawCard(deckId) {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
            if(data.cards.length === 0) {
                alert('No more cards in deck!');
                return;
            }
            const card = data.cards[0];
            document.getElementById('cardContainer').innerHTML = `<p>${card.value} of ${card.suit}</p>`;
        })
        .catch(err => console.error('Error drawing card:', err));
}

function drawTwoCardsFromSameDeck() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=1`)
        .then(response => response.json())
        .then(firstDraw => {
            if (firstDraw.cards.length === 0) {
                alert('No more cards in deck!');
                return;
            }
            const firstCard = firstDraw.cards[0];
            const deckId = firstDraw.deck_id;
            const firstCardElement = document.createElement('p');
            firstCardElement.textContent = `First card: ${firstCard.value} of ${firstCard.suit}`;
            document.getElementById('cardContainer').appendChild(firstCardElement);

            return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        })
        .then(response => response.json())
        .then(secondDraw => {
            if (secondDraw.cards.length === 0) {
                alert('No more cards in deck!');
                return;
            }
            const secondCard = secondDraw.cards[0];
            const secondCardElement = document.createElement('p');
            secondCardElement.textContent = `Second card: ${secondCard.value} of ${secondCard.suit}`;
            document.getElementById('cardContainer').appendChild(secondCardElement);
        })
        .catch(err => {
            console.error('Error drawing cards', err);
            alert('Failed to draw cards');
        });
}
