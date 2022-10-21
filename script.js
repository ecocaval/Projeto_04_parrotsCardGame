/**
 * @brief Parrot Game - Érico A. B. Cavalcanti - 17/10/22
 *        Driven Turma 9 - Third week of full-stack course
*/ 

// total number of plays, will be incremented and displayed at the game's end
let numberOfPlays = 0;

// timer variables BE CAREFUL
let secondsIncrementer = 0;
let milisecondsIncrementer = 0;
let seconds = 1;
let milliseconds = 0;

// asks the quantity of cards to be displayed, so we can start the game
askCardQuantity();

// asks the total number of cards to de displayed in the screen
function askCardQuantity() {
    let cardQuantity = 0;

    // keeps asking the card quantity till 4 < cardQuantity < 14, cardQuantity must be even
    while(cardQuantity < 4 || cardQuantity > 14 || (cardQuantity % 2 !== 0)) {
        cardQuantity = prompt('Por favor, insira o número de cartas que deseja:');
    }
    createGameCards(cardQuantity);
    createGameClock();
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
    for(let cardCounter = 0; cardCounter < cardQuantity; cardCounter++) {
        cardSection.innerHTML += `
        <div class="card" onclick="testCard(this)">
            <div class="cardFront rotate">
                <img src="images/${cardClasses[cardCounter]}.gif">
            </div>
            <div class="cardBack">
                <img src="images/back.png">
            </div>
        </div>
        `;
    }
}

function createGameClock() {
    const gameClock = document.querySelector('.gameClock');

    seconds = fomartNumberTo2digits(seconds);
    milliseconds = fomartNumberTo2digits(milliseconds);

    gameClock.innerHTML = `
        <p class="seconds">00</p>
        <p>:</p>
        <p class="milliseconds">00</p>        
    `;  
    
    if(gameClock !== null) {
        secondsIncrementer = setInterval(() => {
            const secondsDiv = document.querySelector('.seconds');
            secondsDiv.innerHTML = seconds;
            seconds++;
            seconds = fomartNumberTo2digits(seconds);
            if(seconds === 60) {
                seconds = 0
            }
        }, 1000);
    
        milisecondsIncrementer = setInterval(() => {
            const millisecondsDiv = document.querySelector('.milliseconds');
            millisecondsDiv.innerHTML = milliseconds;
            milliseconds++;
            milliseconds = fomartNumberTo2digits(milliseconds);
            if(milliseconds >= 99) {
                milliseconds = 0
                milliseconds = fomartNumberTo2digits(milliseconds);
            }
        }, 10);
    }
}

function fomartNumberTo2digits(number) {
    number = number.toLocaleString('pt-br', {
        minimumIntegerDigits: 2,
      });
    return number;
}

function shuffleCards(cardClassesToShuffle) {
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
    const originalCardsClasses = cardClassesToShuffle.slice()
   
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
    if(clickedCardBack.classList.contains('rotate') && cardIsMatched(getFlippedCards(cardsFront,cardsBack)[0], clickedCardFront)) {
        return;
    }
    
    if(noCardsBeingTested(cardsFront, cardsBack)) {
        // flips the card clicked
        flipCard(clickedCardBack, clickedCardFront);
    } else {
        return;
    }

    // checks if the card clicked is matched
    if(testForMatch(cardsToMatch)) {
        numberOfPlays++;              
        changeMatchedCardsColor(cardsFront);
    } else {
        flipBothCardsDisplayed(cardsFront, cardsBack);
    }

    // checks if the game is over, if it is displays the 'numberOfPlays' played
    if(gameIsOver(cardsFront)) {
        
        // stops game timer 
        stopClock();

        // waits .5s before alerting the game win
        setTimeout(function() {
            alert(`Você ganhou em ${numberOfPlays} jogadas!`);   
            restartMatchAtEnd();    
        }, 500);
    }
}

// extracts the name class from the gif img file (uses regex)
function extractNameFromGifFile(cardFrontDiv) {

    // regex user for extracting the gif name from the image file
    const extractGifRegex = /images\/(.*).gif/;

    // applies the regex above in the card front div received
    const gifFileName = extractGifRegex.exec(cardFrontDiv.childNodes[1].src)[1];

    return gifFileName;
}

// extracts an array containing only the 2 cards with the class being tested
function extractCardsToMatch(allCardsFrontDiv, classToMatch) {

    let cardsToMatch = [];    

    for(let card in allCardsFrontDiv) {
        // executes the regex rule in the <img> src, extracting the gif file name
        const cardClass = extractNameFromGifFile(allCardsFrontDiv[card]);
        if(cardClass === classToMatch) {
            cardsToMatch.push(allCardsFrontDiv[card]);
        }
    }    
    return cardsToMatch;
}

function cardIsMatched(cardsFlipedFrontDiv, cardToAnalyse) {

    // variable containing the classe name of the card clicked
    const cardTestedClass = extractNameFromGifFile(cardToAnalyse)
    const cardsToAnalyzeClasses = [];
    const classesWithBothCardsFlipped = [];

    for(let cards in cardsFlipedFrontDiv) {
        cardsToAnalyzeClasses.push(extractNameFromGifFile(cardsFlipedFrontDiv[cards]));
    }

    for(let currentCard = 0; currentCard < cardsToAnalyzeClasses.length; currentCard++) {
        for(let nextCard = currentCard + 1; nextCard < cardsToAnalyzeClasses.length; nextCard++) {
            if(cardsToAnalyzeClasses[currentCard] === cardsToAnalyzeClasses[nextCard]) {
                classesWithBothCardsFlipped.push(cardsToAnalyzeClasses[currentCard]);
            }
        }
    }

    if(classesWithBothCardsFlipped.includes(cardTestedClass)) {
        return true;
    }
    return false;
}

// returns an matrix containing all the cards flipped front and back divs
function getFlippedCards(allCardsFrontDiv, allCardsBackDiv){
    // arrays containing all cards fliped front and back div
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

function noCardsBeingTested(allCardsFrontDiv, allCardsBackDiv) {

    const cardsFlipedFrontDiv = getFlippedCards(allCardsFrontDiv, allCardsBackDiv)[0];
    const cardsToAnalyzeClasses = [];

    let numberOfCardsFlipped = cardsFlipedFrontDiv.length;

    console.log(numberOfCardsFlipped);

    for(let cards in cardsFlipedFrontDiv) {
        cardsToAnalyzeClasses.push(extractNameFromGifFile(cardsFlipedFrontDiv[cards]));
    }

    for(let currentCard = 0; currentCard < cardsToAnalyzeClasses.length; currentCard++) {
        for(let nextCard = currentCard + 1; nextCard < cardsToAnalyzeClasses.length; nextCard++) {
            if(cardsToAnalyzeClasses[currentCard] === cardsToAnalyzeClasses[nextCard]) {
                numberOfCardsFlipped -= 2;
            }
        }
    }
    return (numberOfCardsFlipped < 2);
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

// adds pink background color to card when it's match is found
function changeMatchedCardsColor(cardsFrontDiv) {
    for(let cardCounter in cardsFrontDiv) {
        if(!cardsFrontDiv[cardCounter].classList.contains('rotate')) {
            cardsFrontDiv[cardCounter].classList.add('cardMatched');
        }
    }
}

// if the 2 cards selected were not matched, the game must flips both cards back
function flipBothCardsDisplayed(allCardsFront, allCardsBack) {
    // arrays containing all cards fliped front and back div
    const cardsFlipedFront = getFlippedCards(allCardsFront, allCardsBack)[0];
    const cardsFlipedBack = getFlippedCards(allCardsFront, allCardsBack)[1];

    let quantityOfCardsFliped = 0;

    setTimeout(() => {
        for(let cardCounter in cardsFlipedFront) {
            if(!cardIsMatched(cardsFlipedFront, cardsFlipedFront[cardCounter]) && !cardIsAlone(cardsFlipedFront)) {
                flipCard(cardsFlipedFront[cardCounter], cardsFlipedBack[cardCounter]);
                quantityOfCardsFliped++;
            }
        }  
        // checks if the play was completed, so we can increment 'numberOfPlays'
        if(quantityOfCardsFliped >= 2) {
            numberOfPlays++;
        }
    }, 1000); // 1s of delay
}

// checks if just 1 card was selected, so we can mantain it being displayed
function cardIsAlone(cardsFliped) {

    // this variable will be decremented so we can disconsider the cards that were already match
    let quantityOfCardsFlipped = cardsFliped.length;    

   // variable containing the classe name of the card clicked
   const cardsToAnalyzeClasses = [];

   for(let cards in cardsFliped) {
       cardsToAnalyzeClasses.push(extractNameFromGifFile(cardsFliped[cards]));
   }

   // looks for cards that were matched decrementing de 'quantityOfCardsFlipped'
   for(let currentCard = 0; currentCard < cardsToAnalyzeClasses.length; currentCard++) {
       for(let nextCard = currentCard + 1; nextCard < cardsToAnalyzeClasses.length; nextCard++) {
           if(cardsToAnalyzeClasses[currentCard] === cardsToAnalyzeClasses[nextCard]) {
            quantityOfCardsFlipped -= 2;
           }
       }
   }

   return (quantityOfCardsFlipped === 1);
}

// checks if all cards were flipped
function gameIsOver(cardsFront) {
    if(numberOfCardsHidden(cardsFront) === 0) {
        return true;
    }
    return false;
}

function stopClock() {
    clearInterval(secondsIncrementer);
    clearInterval(milisecondsIncrementer);
    seconds = 0;
    milliseconds = 0;
}

function restartMatchAtEnd() {
    numberOfPlays = 0;

    let userAnswer = prompt('Você gostaria de reiniciar o jogo? (sim/não)')

    // gets the user answer and dinsconsiders UpperCases and Accents 
    userAnswer = userAnswer.toLowerCase();
    userAnswer = userAnswer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if(userAnswer === 'sim') {
        deleteCards();
        askCardQuantity();
    } else if (userAnswer === 'nao') {
        alert("Tudo bem! Caso mude de ideia, aperte botão 'RESTART GAME' !");
        displayRestartButton();
    }  else {
        // keeps asking until the userAnswer respects the answer rules
        restartMatchAtEnd();
    }
}

// deletes the previous cards displayed at screen
function deleteCards() {
    const cardSection = document.querySelector('.cardSection');
    cardSection.innerHTML = null;
}

function displayRestartButton() {
    const main_section = document.querySelector('main');
    main_section.innerHTML += `
        <div class="restartButton" onclick="restartMatchAtButton()">Restart Game</div>
    `;
}

function restartMatchAtButton() {
    deleteCards();
    deleteRestartButton()
    askCardQuantity();
}

function deleteRestartButton() {
    const restartButton = document.querySelector('.restartButton');
    restartButton.remove();
}