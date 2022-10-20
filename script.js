/**
 * @brief Parrot Game - Érico A. B. Cavalcanti - 17/10/22
 *        Driven Turma 9 - Third week of full-stack course
*/ 

// total number of plays, will be incremented and displayed at the game's end
let numberOfPlays = 0;

// asks the quantity of cards to be displayed, so we can start the game
askCardQuantity();

function extractNameFromGifFile(cardFrontDiv) {

    // regex user for extracting the gif name from the image file
    const extractGifRegex = /images\/(.*).gif/;

    // applies the regex above in the card front div received
    const gifFileName = extractGifRegex.exec(cardFrontDiv.childNodes[1].src)[1];

    return gifFileName;
}

// called everytime the user clicks card
function testCard(card) {
    
    /* 
        In this game every card has a div for it's front part and a div for 
        it's back part, we must select both to create our flipping cards logic 
    */
    const cardsFront = Array.from(document.querySelectorAll('.cardFront'));
    const cardsBack = Array.from(document.querySelectorAll('.cardBack'));

    /*
        childNodes[3] -> selects div.cardBack
        childNodes[1] -> selects div.cardFront
    */
    let clickedCardBack = card.childNodes[3];
    let clickedCardFront = card.childNodes[1];          
    
    // variable containing the classe name of the card clicked
    const cardClass = extractNameFromGifFile(clickedCardFront);
    
    // extracts an array containing only the 2 cards with the class being tested
    const cardsToMatch = extractCardsToMatch(cardsFront, cardClass);    

    // the game does not flip a matched card
    if(clickedCardBack.classList.contains('rotate') && !cardIsNotMatched(getFlippedCards(cardsFront,cardsBack)[0], clickedCardFront)) {
        return;
    }
    
    // flips the card clicked
    flipCard(clickedCardBack, clickedCardFront);

    // checks if the card clicked is matched
    if(testForMatch(cardsToMatch)) {
        numberOfPlays++;              
        changeMatchedCardsColor(cardsFront);
    } else {
        flipBothCardsDisplayed(cardsFront, cardsBack);
    }

    // checks if the game is over, if it is displays the 'numberOfPlays' played
    if(gameIsOver(cardsFront)) {
        setTimeout(function() {
            alert(`Você ganhou em ${numberOfPlays} jogadas!`);       
        }, 500);
    }
}

// adds pink background color to card when it's match is found
function changeMatchedCardsColor(cardsFrontDiv) {
    for(let cardCounter in cardsFrontDiv) {
        if(!cardsFrontDiv[cardCounter].classList.contains('rotate')) {
            cardsFrontDiv[cardCounter].classList.add('cardMatched');
        }
    }
}

// checks if all cards were flipped
function gameIsOver(cardsFront) {
    if(numberOfCardsHidden(cardsFront) === 0) {
        return true;
    }
    return false;
}

// returns an matrix containing all the cards flipped front and back divs
function getFlippedCards(allCardsFrontDiv, allCardsBackDiv){
    // array containing all cards fliped front div
    const cardsFlipedFrontDiv = [];
    const cardsFlipedBackDiv = [];
    
    for(let cardCounter in allCardsFrontDiv) {
        if(!allCardsFrontDiv[cardCounter].classList.contains('rotate')) {
            cardsFlipedFrontDiv.push(allCardsFrontDiv[cardCounter]);
            cardsFlipedBackDiv.push(allCardsBackDiv[cardCounter]);
        }
    }    
    return [cardsFlipedFrontDiv, cardsFlipedBackDiv];
}

// if the 2 cards selected were not matched, the game must flips both cards back
function flipBothCardsDisplayed(allCardsFront, allCardsBack) {
    // arrays containing all cards fliped front and back div
    const cardsFlipedFront = getFlippedCards(allCardsFront, allCardsBack)[0];
    const cardsFlipedBack = getFlippedCards(allCardsFront, allCardsBack)[1];

    let quantityOfCardsFliped = 0;

    setTimeout(() => {
        for(let cardCounter in cardsFlipedFront) {
            if(cardIsNotMatched(cardsFlipedFront, cardsFlipedFront[cardCounter]) && !cardIsAlone(cardsFlipedFront)) {
                flipCard(cardsFlipedFront[cardCounter], cardsFlipedBack[cardCounter]);
                quantityOfCardsFliped++;
            }
        }  
        // checks if the play was completed, so we can increment 'numberOfPlays'
        if(quantityOfCardsFliped >= 2) {
            numberOfPlays++;
        }
    }, 600);
}

// checks if just 1 card was selected, so we can mantain it being displayed
function cardIsAlone(cardsFliped) {

    // this variable will be decremented so we can disregard the cards that were already match
    let quantityOfCardsFlipped = cardsFliped.length;    

   // variable containing the classe name of the card clicked
   const cardsToAnalyzeClasses = [];

   for(let cards in cardsFliped) {
       cardsToAnalyzeClasses.push(extractNameFromGifFile(cardsFliped[cards]));
   }

   for(let currentCard = 0; currentCard < cardsToAnalyzeClasses.length; currentCard++) {
       for(let nextCard = currentCard + 1; nextCard < cardsToAnalyzeClasses.length; nextCard++) {
           if(cardsToAnalyzeClasses[currentCard] === cardsToAnalyzeClasses[nextCard]) {
            quantityOfCardsFlipped -= 2;
           }
       }
   }

   return (quantityOfCardsFlipped === 1);
}

function cardIsNotMatched(cardsFliped, cardToAnalyse) {

     // regex user for extracting the gif name from the image file
     const extractGifRegex = /images\/(.*).gif/;

    // variable containing the classe name of the card clicked
    const cardsToAnalyzeClasses = [];
    const classesWithBothCardsFlipped = [];
    const cardTestedClass = extractGifRegex.exec(cardToAnalyse.childNodes[1].src)[1];

    for(let cards in cardsFliped) {
        cardsToAnalyzeClasses.push(extractGifRegex.exec(cardsFliped[cards].childNodes[1].src)[1]);
    }

    for(let i = 0; i < cardsToAnalyzeClasses.length; i++) {
        for(let j = i + 1; j < cardsToAnalyzeClasses.length; j++) {
            if(cardsToAnalyzeClasses[i] === cardsToAnalyzeClasses[j]) {
                classesWithBothCardsFlipped.push(cardsToAnalyzeClasses[i]);
            }
        }
    }

    if(classesWithBothCardsFlipped.includes(cardTestedClass)) {
        return false;
    }
    return true;
}

// flips the card switching the '.rotate' class from both card "sub divs" (cardBack and cardFront)
function flipCard(cardBack, cardFront) {
    cardFront.classList.toggle('rotate');
    cardBack.classList.toggle('rotate');
}

// checks if there was a match for the card selected
function testForMatch(cardsToTest) {
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
