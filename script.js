/**
 * @brief Parrot Game - 17/10/22
 */

function askCardsQuantity() {
    let cardsQuantity = 0;
    while(cardsQuantity === 0 || (cardsQuantity % 2 === 1) || cardsQuantity < 4 || cardsQuantity > 14) {
        cardsQuantity = prompt('Com quantas cartas voce deseja jogar');
    }
    sortCards();
} 

function sortCards() {
    const cards = Array.from(document.querySelectorAll('.card'));
        
    let cards_classes = [];

    for(let card_index in cards) {
        cards_classes[card_index] = cards[card_index].classList[2];
    }

    shuffle_cards(cards, cards_classes);
}

function shuffle_cards(cards, cards_classes) {
    let classes_shuffled = cards_classes;

    classes_shuffled.sort((a,b) => {
        return 0.5 - Math.random();
    })

    console.log(classes_shuffled);
}


