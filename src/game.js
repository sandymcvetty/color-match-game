"use strict";

const gameOptions = document.querySelector('[name="gameOptions"]');

gameOptions.addEventListener('submit', function (e) {
  const color1 = e.currentTarget.color1.jscolor.rgb;
  const color2 = e.currentTarget.color2.jscolor.rgb;
  const stack = e.currentTarget.stack.value;
  e.preventDefault();
  newGame(color1, color2, stack);
});

const newLocal = false;
function newGame(color1, color2, stackSize) {
  const board = document.getElementById('board');
  const win = document.getElementById('win');
  if (win) {
    win.parentNode.removeChild(win);
  }

  board.innerHTML = null;
  const stack = stackSize;
  const steps = (stack / 2) - 1;
  const rgbDiff = [];
  const cardColors = [];
  let turn = [];
  let matched = [];
  let pauseFlip = false;


  // compare input color arrays to find the difference between each color value
  for (let j = 0; j < color2.length; j++) {
    rgbDiff.push(Math.abs(color1[j] - color2[j]));
  }

  const stepArr = rgbDiff.map(c => c / steps);
  cardColors.push(color1);

  let thisColor = [...color1];
  for (let k = steps - 1; k > 0; k--) {
    for (let l = 0; l < 3; l++) {
      if (color1[l] < color2[l]) {
        thisColor[l] = Math.floor(thisColor[l] + stepArr[l]);
  
      } else {
        thisColor[l] = Math.floor(thisColor[l] - stepArr[l]);
      }
    }
    cardColors.push(thisColor.toString());
  }

  cardColors.push(color2);
  cardColors.forEach(c => cardColors.push(c));

  // deal the cards
  for (let i = stackSize; i > 0; i--) {
    let index = Math.floor(Math.random() * cardColors.length);
    let color = cardColors[index];
    cardColors.splice(index, 1);
    board.appendChild(createCard(i, color));
  }

  const allCards = document.querySelectorAll('button.card');
  allCards.forEach(card => card.addEventListener('click', clickCard));

  function createCard(id, color) {
    let card = document.createElement('button');
    card.setAttribute('class', 'card');
    card.setAttribute('id', id);
    card.setAttribute('name', color);
    card.setAttribute('data-flipped', false);

    const colorblock = document.createElement('div');
    colorblock.setAttribute('class', 'colorblock');
    colorblock.setAttribute('style', `background-color: rgb(${color})`);
    card.appendChild(colorblock);

    return card;
  }

  function clickCard(e) {
    let card = { color: e.currentTarget.name, id: e.currentTarget.id };
    // check that the card isn't already in the turn
    const isPicked = turn.filter(pick => pick.id === card.id).length;

    // check that the card hasn't already been matched
    const isMatched = matched.filter(pick => pick.id === card.id).length;

    if (turn.length < 2 && isPicked === 0 && isMatched === 0 && pauseFlip === false) {
      flipCard(card);
      turn.push(card);
    } 
    if (turn.length === 2) {
      checkMatch();

      pauseFlip = true;
      setTimeout(function () {
        pauseFlip = false;
      }, 1000);
    }
  }

  function flipCard(card) {
    // console.log('flipcard');
    const isFlipped = document.getElementById(card.id).getAttribute('data-flipped');

    if (isFlipped === 'true') {
      setTimeout(function () {
        document.getElementById(card.id).setAttribute('data-flipped', false);
        document.getElementById(card.id).disabled = false;
      }, 1000);
    } else {
      document.getElementById(card.id).setAttribute('data-flipped', true);
      document.getElementById(card.id).disabled = true;
    }

  }

  function checkMatch() {
    if (turn.length === 2) {
      if (turn[0].color === turn[1].color) {
        turn.forEach(card => matched.push(card));
        
        // all cards matched
        if (matched.length == stack) {
          const win = document.createElement('div');
          win.setAttribute('id', 'win');
          win.setAttribute('style', `background: -webkit-linear-gradient(130deg, rgb(${color2}),rgb(${color1}));  -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;`);
          win.innerHTML = 'Success!';
          // console.log(board);
          let container = document.getElementById('container');
          container.insertBefore(win, board);
        }
      } else {
        turn.forEach(c => flipCard(c));
        turn = [];
      }

      turn = [];
    }
  }
}
