var clicks = 0;
var moves = 0;
var falseMatches = 0;
var decStarsLimit = 4;
var timerActive = false;
var timerElement = document.getElementById('mytimer');
var ratingList = document.getElementById('stars');
var moveElement = document.getElementById('moves');
var deck = document.querySelector('.deck');
var popupBackground = document.getElementById('myModal');
var popupClose = document.getElementById("close");
var popupRating =document.getElementById('modalRating');
var popupTimer = document.getElementById('modalTimer');
var popupMoves = document.getElementById('modalMoves');
var playagainbtn = document.getElementById('start-again');
var restartButton = document.getElementById('restart');
var cards = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle',
'fa-bomb','fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'];
//var cards = ['fa-diamond','fa-diamond'];
/************************
MOVES utils
************************/
function resetMoves(){
  moves = 0;
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
rating utils
************************/
function incFalseMatches(){
  falseMatches++;

  // update the rating according to the increase of false matches
  updateRating(falseMatches);
}

function updateRating(falseMatches){
  if (falseMatches > decStarsLimit){
    removeStars();
  }
}

function removeStars(){
  if (ratingList.children.length > 1){
    ratingList.removeChild(ratingList.querySelector('li:last-of-type'));
  }
  resetFlaseMatches();
}

function drawRating(){
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
  drawRating();
}

function resetFlaseMatches(){
  falseMatches = 0;
}

/************************
CARDS utils
************************/
function shuffle(array) {
    // Shuffle function from http://stackoverflow.com/a/2450976

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
  //var shuffledCards = shuffle(cards);
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

function flagAsMatched(openedCards){
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
}

function isMatch(openedCards){
  return openedCards[0].dataset.shape === openedCards[1].dataset.shape;
}

function resetCards(){
  shuffle(cards);
  drawCards(deck);
}

/************************
timer utils
************************/
function startTimer(){

  //declaring varibales for each hours minutes seconds
  var timerString = timerElement.innerHTML;

  // splitting array to make it easier for modification
  var timerArray = timerString.split(':');
  var hour = timerArray[0];
  var min = timerArray[1];
  var sec = timerArray[2];

  // Timer logic
  if(timerActive){
    if(sec == 59){
      if(min == 59){
        hour++;
        min = 0;
        if(hour < 10 ){
          hour = "0" + hour;
        }
      }else{
        min++;
      }
      if (min < 10){
        min = "0" + min;
        sec = 0;
      }
  }else{
      sec++;
      if(sec < 10){
        sec = "0" + sec;
      }
  }

    //update the timer element
    timerElement.innerHTML = hour +':'+min+':'+sec;

    //start timer and updating each one second
    setTimeout(startTimer,1000);
  }
}

function stopTimer(){
  timerActive = false;
}

function resetTimer(){
  timerElement.innerHTML = "00" +':'+"00"+':'+"00";
  timerActive = false;
}

function activateTimer(timerIsActive){
  if(!timerIsActive){
    timerActive = true;
    startTimer();
  }
}

/************************
modal utils
************************/
function showModal() {
    popupBackground.style.display = "block";
}

function hideModal() {
    popupBackground.style.display = "none";
    // bug fixed as if you click again on matched cards
    popUpReset();
}

function shouldCloseModal(event){
  return event.target == popupBackground || event.target == popupClose;
}

function closeModal(event) {
  if (shouldCloseModal(event)) {
      hideModal();
  }
}

function popUpReset(){
  popupRating.innerHTML = '';
  popupTimer.innerHTML = '';
  popupMoves.innerHTML = '';
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
    if (isMatch(openedCards)){
     flagAsMatched(openedCards);
   }else{
     hideUnmatched(openedCards);
     incFalseMatches();
   }
  }
  }
  activateTimer(timerActive);
  checkifGameFinsihed();
}

/************************
GAME utils
************************/
function reset(){
  resetMoves();
  resetCards();
  resetRating();
  resetTimer();
  hideModal();
  popUpReset();
}

function start(){
  drawCards(deck);
  drawRating();
  startTimer();
  bindEvents();
}

function checkifGameFinsihed(){
  if(document.querySelectorAll('.match').length === cards.length){

    var ratingListPopup = ratingList.cloneNode(true);
    var modalTimer = timerElement.cloneNode(true);
    var modalMoves = moveElement.cloneNode(true);

    popupRating.appendChild(ratingListPopup);
    popupTimer.appendChild(modalTimer);
    popupMoves.appendChild(modalMoves);

    stopTimer();
    showModal();
  }
}

function bindEvents(){
  restartButton.addEventListener('click',reset);
  deck.addEventListener("click",main);
  window.addEventListener('click',closeModal);
  playagainbtn.addEventListener('click',reset);
}

start();
