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
    
    let cardBack = card.childNodes[1];
    let cardFront = card.childNodes[3];

    // variable containing the classe name of the card clicked
    const cardClass = extractGifRegex.exec(cardFront.childNodes[1].src)[1];

    flipCard(cardBack, cardFront)

    console.log(testForMatch(cardClass));
}

function flipCard(cardBack, cardFront) {
    cardFront.classList.toggle('hidden');
    cardBack.classList.toggle('hidden');
}

function testForMatch(class_to_match) {

    const extractGifRegex = /images\/(.*).gif/

    const cardFront = Array.from(document.querySelectorAll('.cardFront'));

    const cardsToTest = [];

    for(let card in cardFront) {
        const cardClass = extractGifRegex.exec(cardFront[card].childNodes[1].src)[1];
        if(cardClass === class_to_match) {
            cardsToTest.push(cardFront[card]);
        }
    }    
    
    let cardsHidden = 0;

    for(let card in cardsToTest){
        if(cardsToTest[card].classList.contains('hidden')) {
            cardsHidden++
        }
    }

    if(cardsHidden === 0) {
        return true;
    }
    return false;
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

    cardClasses = doubleTheArray(cardClasses);

    for(let contador = 0; contador < cardQuantity; contador++) {
        cardSection.innerHTML += `
        <div onclick="testCard(this)">
            <div class="cardBack">
                <img src="images/back.png">
            </div>
            <div class="cardFront hidden">
                <img src="images/${cardClasses[contador]}.gif">
            </div>
        </div>
        `;
    }
}

function doubleTheArray(arrayToDouble) {
    arrayToDouble = arrayToDouble.concat(arrayToDouble);
    return arrayToDouble;
}

