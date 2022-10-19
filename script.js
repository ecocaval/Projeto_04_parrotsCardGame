/**
 * @brief Parrot Game - 17/10/22
*/ 

// num.sort((a,b) => {
//     return 0.5 - Math.random();
// })

// firts function of the program
askCardQuantity();

function testCard(card) {
    // regex user for extracting the gif name from the image file
    const extractGifRegex = /images\/(.*).gif/
    
    let cardBack = card.childNodes[3];
    let cardFront = card.childNodes[1];

    // variable containing the classe name of the card clicked
    const cardClass = extractGifRegex.exec(cardFront.childNodes[1].src)[1];

    flipCard(cardBack, cardFront)

    console.log(testForMatch(cardClass));
}

function flipCard(cardBack, cardFront) {
    cardFront.classList.toggle('rotate');
    cardBack.classList.toggle('rotate');
}

function testForMatch(class_to_match) {

    const cardFront = Array.from(document.querySelectorAll('.cardFront'));

    const cardsToTest = extractCardsToMatch(cardFront, class_to_match);

    if(numberOfCardsHidden(cardsToTest) === 0) {
        return true;
    }
    return false;
}

function numberOfCardsHidden(cardsToTest){
    let cardsHidden = 0;

    for(let card in cardsToTest){
        if(cardsToTest[card].classList.contains('rotate')) {
            cardsHidden++
        }
    }
    return cardsHidden;
}

function extractCardsToMatch(cards, class_to_match) {

    // looks for any string between 'images/' and '.gif'
    const extractGifRegex = /images\/(.*).gif/;

    let cardsToTest = [];    

    for(let card in cards) {
        const cardClass = extractGifRegex.exec(cards[card].childNodes[1].src)[1];
        if(cardClass === class_to_match) {
            cardsToTest.push(cards[card]);
        }
    }    
    return cardsToTest;
}

function askCardQuantity() {
    let cardQuantity = 0;

    while(cardQuantity < 4 || cardQuantity > 14 || (cardQuantity % 2 !== 0)) {
        cardQuantity = prompt('Por favor, insira o número de cartas que deseja:');
    }

    createGameCards(cardQuantity);
}

function createGameCards(cardQuantity) {

    let cardSection = document.querySelector('.cardSection');

    let cardClasses = ['bobrossparrot', 'explodyparrot', 'fiestaparrot', 'metalparrot', 'revertitparrot', 'tripletsparrot', 'unicornparrot'];    

    while(cardClasses.length > cardQuantity/2) {
        cardClasses.pop();
    }

    cardClasses = doubleTheArray(cardClasses);

    for(let contador = 0; contador < cardQuantity; contador++) {
        cardSection.innerHTML += `
        <div class="card" onclick="testCard(this)">
            <div class="cardFront rotate">
                <img src="images/${cardClasses[contador]}.gif">
            </div>
            <div class="cardBack">
                <img src="images/back.png">
            </div>
        </div>
        `;
    }
}

function doubleTheArray(arrayToDouble) {
    arrayToDouble = arrayToDouble.concat(arrayToDouble);
    return arrayToDouble;
}

