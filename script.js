/**
 * @brief Parrot Game - Érico A. B. Cavalcanti - 17/10/22
 *        Driven Turma 9 - Third week of full-stack course
*/ 

// asks the quantity of cards to be displayed, so we can start the game
askCardQuantity();

// called everytime the user clicks card
function testCard(card) {
    // regex user for extracting the gif name from the image file
    const extractGifRegex = /images\/(.*).gif/
    /*
        childNodes[3] -> selects div.cardBack
        childNodes[1] -> selects div.cardFront
    */
    let clickedCardBack = card.childNodes[3];
    let clickedCardFront = card.childNodes[1];

    // variable containing the classe name of the card clicked
    const cardClass = extractGifRegex.exec(clickedCardFront.childNodes[1].src)[1];

    flipCard(clickedCardBack, clickedCardFront);

    if(testForMatch(cardClass)) {
        //
    } 
}

// flips the card switching the '.rotate' class from both card "sub divs" (cardBack and cardFront)
function flipCard(cardBack, cardFront) {
    cardFront.classList.toggle('rotate');
    cardBack.classList.toggle('rotate');
}

// checks if there was a match for the card selected
function testForMatch(class_to_match) {

    const cardFront = Array.from(document.querySelectorAll('.cardFront'));

    // extracts an array containing only the 2 cards with the class being tested
    const cardsToTest = extractCardsToMatch(cardFront, class_to_match);

    if(numberOfCardsHidden(cardsToTest) === 0) {
        return true;
    }
    return false;
}

// checks the quantity of hidden cards in a certain array, returns the number of cards hidden
function numberOfCardsHidden(cardsToTest){
    let cardsHidden = 0;

    for(let card in cardsToTest){
        if(cardsToTest[card].classList.contains('rotate')) {
            cardsHidden++
        }
    }
    return cardsHidden;
}

// extracts an array containing only the 2 cards with the class being tested
function extractCardsToMatch(all_cards, class_to_match) {

    // looks for any string between 'images/' and '.gif'
    const extractGifRegex = /images\/(.*).gif/;

    let cardsToTest = [];    

    for(let card in all_cards) {
        // executes the regex rule in the <img> src, extracting the gif file name
        const cardClass = extractGifRegex.exec(all_cards[card].childNodes[1].src)[1];
        if(cardClass === class_to_match) {
            cardsToTest.push(all_cards[card]);
        }
    }    
    return cardsToTest;
}

// asks the total number of cards to de displayed in the screen
function askCardQuantity() {
    let cardQuantity = 0;

    // keeps asking the card quantity till 4 < cardQuantity < 14, cardQuantity must be even
    while(cardQuantity < 4 || cardQuantity > 14 || (cardQuantity % 2 !== 0)) {
        cardQuantity = prompt('Por favor, insira o número de cartas que deseja:');
    }

    createGameCards(cardQuantity);
}

// adds the cards in the HTML, the number of cards added is the 'cardQuantity'
function createGameCards(cardQuantity) {

    let cardSection = document.querySelector('.cardSection');

    // all of the 7 possible card classes
    let cardClasses = ['bobrossparrot', 'explodyparrot', 'fiestaparrot', 'metalparrot', 'revertitparrot', 'tripletsparrot', 'unicornparrot'];    

    //first shuffle
    cardClasses = shuffleCards(cardClasses);

    // adequates the cardclasses array size to the card quantity selected
    while(cardClasses.length > cardQuantity/2) {
        cardClasses.pop();
    }

    // doubles the original array size
    cardClasses = doubleTheArray(cardClasses);

    // second shuffle
    for(let shufflingCounter in cardClasses) {
        cardClasses = shuffleCards(cardClasses);
    }

    // adds the cards in the HTML, the number of cards added is the 'cardQuantity'
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

function shuffleCards(card_classes_to_shuffle) {
    /*
        ------ Example:
        originalCardsClassesIndexes = [0, 1, 2, ...]
        originalCardsClasses = ['bobsparrot', 'explodyparrot', 'fiestaparrot', ...]

        -> after .sort we have:  

        shuffledCardsClassesIndexes = [2, 1, 5, ...]
        shuffledCardsClasses = ['fiestaparrot', 'explodyparrot', 'tripletsparrot', ...]
    */

   // creates a copy of the array received as a parameter
    const originalCardsClassesIndexes = [];
    const originalCardsClasses = card_classes_to_shuffle.slice()
   
    let shuffledCardsClassesIndexes = [];
    let shuffledCardsClasses = [];

    // fullfils the originalCardsClassesIndexes array with 0 to the card classes quantity
    for(let counter in originalCardsClasses){
        originalCardsClassesIndexes.push(counter);
    }

    // this .sort is used to shuffle randomly the originalCardsClassesIndexes array
    shuffledCardsClassesIndexes = originalCardsClassesIndexes.sort((a,b) => {
        return 0.5 - Math.random();
    })

    // assembles the shuffledCardsClasses with randomly picked classes
    for(let counter in originalCardsClasses){
        shuffledCardsClasses.push(originalCardsClasses[shuffledCardsClassesIndexes[counter]])
    }    
    
    return shuffledCardsClasses;
}


// concatenates the array with it self, doubling the array total size
function doubleTheArray(arrayToDouble) {
    arrayToDouble = arrayToDouble.concat(arrayToDouble);
    return arrayToDouble;
}

