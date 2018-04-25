var restartClass = '.restart';
var clicks = 0;
var moves = 0;
var falseMatches = 0;
var ratingList = document.querySelector('.stars');
var moveElement = document.querySelector('.moves');
var deck = document.querySelector('.deck');
var cards = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle',
'fa-bomb','fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'];
/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function drawCards(board){

  //clear the previous cards if any
  board.innerHTML = '';

  // get shuffled icons
  var shuffledCards = shuffle(cards);

  // for performance reasons buffer the cards in document fragment
  var fragment = document.createDocumentFragment();

  //create & add cards to fragments
  for (var i = 0 ; i < shuffledCards.length ; i++){
    var icon = shuffledCards[i];
    var card = document.createElement('LI');
    var cardIcon = document.createElement('I');

    //create Card icon
    cardIcon.classList.add('fa',icon);

    //create Card
    card.classList.add('card');
    card.dataset.shape = icon; // for matching cards logic

    // appnd card to fragment
    card.appendChild(cardIcon);
    fragment.appendChild(card);
  }

  // add the whole cards to the dom
  board.appendChild(fragment);
}

/************************
MOVES UTILS
************************/
function resetMoves(){
  updateMoves(0);
}
function updateMoves(count){
  moveElement.innerText = count;
}
function increaseMoves(){
  moves++;
  updateMoves(moves);
}

/************************
rating UTILS
************************/
function incFalseMatches(){
  falseMatches++;

  // update the rating according to the increase of false matches
  updateRating(falseMatches);
}
// updateRating will remove according to number of falseMatches
function updateRating(falseMatches){
  if (falseMatches > 19){
    removeStars();
  }
}

// remove stars according to the number of false matches
function removeStars(){
  if (ratingList.children.length > 1){
    ratingList.removeChild(ratingList.querySelector('li:last-of-type'));
  }
  resetFlaseMatches();
}
function drawRatingSystem(){
  ratingList.innerHTML = '';
  var ratingFragment = document.createDocumentFragment();
  for (var i = 0 ; i < 3 ; i++){
    var rateElement = document.createElement('LI');
    var starIcon = document.createElement('I');

    //create stars icon
    starIcon.classList.add('fa','fa-star');

    // appnd rating Stars to rating Fragment
    rateElement.appendChild(starIcon);
    ratingFragment.appendChild(rateElement);
  }

  // append the rating Fragment to the ratinglist
  ratingList.appendChild(ratingFragment);
}
function resetRating(){
  resetFlaseMatches();
  drawRatingSystem();
}
function resetFlaseMatches(){
  falseMatches = 0;
}

/************************
CARDS UTILS
************************/
function showCard(clickedElementParam){
  clickedElementParam.classList.add('open','show');
}

function shouldClicked (clickedElementParam){
  return clickedElementParam.classList.contains('card') && !clickedElementParam.classList.contains('match');
}

function hideUnmatched(openedCards){
  setTimeout(function(){
    openedCards[0].classList.remove('open','show');
    openedCards[1].classList.remove('open','show');
  },500);
}

function flagmatched(openedCards){
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
}

function isMatched(openedCards){
  return openedCards[0].dataset.shape === openedCards[1].dataset.shape;
}

function resetCards(){
  shuffle(cards);
  drawCards(deck);
}

/************************
GAME UTILITES
************************/
function reset(){
  resetMoves();
  resetCards();
  resetRating();
}
function start(){
  var restartButton = document.querySelector(restartClass);
  restartButton.addEventListener('click',reset);
  deck.addEventListener("click",main);
  drawCards(deck);
  drawRatingSystem();
}

/************************
MAIN GAME LOGIC
************************/
function main(evt){
  var clickedElement = evt.target;
  if (shouldClicked(clickedElement)){
  if (clicks < 2){
    showCard(clickedElement);
    clicks += 1;
  }
  if(clicks === 2){
    clicks = 0 ;
    increaseMoves();
    var openedCards = document.querySelectorAll('.open.show:not(.match)'); // all the elements contains both open and show
    if (isMatched(openedCards)){
     flagmatched(openedCards);
   }else{
     hideUnmatched(openedCards);
     incFalseMatches();
   }
 }
}
}
start();


/*

1- add description to necessary functions
2- define classes as variables
3- make timer
4- make congratulations popup message (moves appear/restartbutton/rating)
5- decrease star-rating accordign to Moves   ---finished--
6- setup readme page for github

*/
