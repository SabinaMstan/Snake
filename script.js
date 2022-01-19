const nrCellsRow = 20;
const nrCellsCol = 20;
let snake = [];
let puddles = [];
let milliSec = 200;
let headPos;
let currentHeadPosition;
let dir = 1;
let dirClass = 'Right';
let lastDirClass = 'Right';
let interval;
let score = 0;
let scoreField;

function startGame() {
  document.getElementById('start').disabled = true;
  document.getElementById('board').innerHTML = '';
  loadBoard();
  displayScore();
  generateSnake();
  generateTreat();
  generatePuddle();
  interval = setInterval(moveSnake, milliSec);
}

function loadBoard() {
  let id = 0;
  for (let i = 0; i < nrCellsRow; ++i) {
    for (let j = 0; j < nrCellsCol; ++j) {
      ++id;
      let cell = document.createElement('div');
      cell.setAttribute('id', id);
      if (i == 0 || i == 19 || j == 0 || j == 19) {
        cell.classList.add('cell', 'wall');
      }
      if ((i + j) % 2 == 0) {
        cell.classList.add('cell', 'light');
      } else {
        cell.classList.add('cell');
      }
      document.getElementById('board').appendChild(cell);
    }
  }
}

function displayScore() {
    let coinImg = document.createElement('img');
    coinImg.src = 'coin.png';
    scoreField = document.createElement('input');
    scoreField.value = score;
    scoreField.style.width = '20px';
    scoreField.setAttribute('width', '20');
    document.getElementById('header').appendChild(coinImg);
    document.getElementById('header').appendChild(scoreField);
}


function generateSnake() {
  let id = generateRandomNumber(nrCellsRow * nrCellsCol - 1);
  if (document.getElementById(id).classList.contains('wall') || document.getElementById(id - 1).classList.contains('wall') || document.getElementById(id - 2).classList.contains('wall')) {
    generateSnake();
  } else {
    snake = [id - 2, id - 1, id];
    document.getElementById(id - 1).classList.add('snakePart');
    document.getElementById(id).classList.add('snakeHead');
    document.getElementById(id - 2).classList.add('snakeTail');
  }
  headPos = snake.length - 1;
}

function generateTreat() {
  let id = generateRandomNumber(nrCellsRow * nrCellsCol - 1);
  let coin = document.getElementById(id);
  if (coin.classList.contains('wall') || coin.classList.contains('snake')) {
    generateTreat();
  } else {
    coin.classList.add('coin');
  }
}

function generatePuddle() {
  let nrOfPuddles = generateRandomNumber(3);
  for (let puddleIndex = 0; puddleIndex < nrOfPuddles; ++puddleIndex) {
    let tryagain = 1;
    while (tryagain === 1) {
      tryagain = 0;
      let id = generateRandomNumber(nrCellsRow * nrCellsCol - 1);
      let puddleCell = document.getElementById(id);
      if (puddleCell.classList.contains('puddle') || puddleCell.classList.contains('wall') || puddleCell.classList.contains('snake') || puddleCell.classList.contains('coin')) {
        tryagain = 1;
      } else {
        puddles.push(id);
        puddleCell.classList.add('puddle');
      }
    }
  }
}


function getHeadDir(event) {
  let directions = [[38,'snakeDown',-20,'Up'], [37,'snakeRight',-1,'Left'], [39, 'snakeLeft', 1, 'Right'], [40, 'snakeUp', 20, 'Down']];
  for (let d of directions) {
    if (event.keyCode === d[0] && !document.getElementById(snake[headPos]).classList.contains(d[1])) {
      dir = d[2];
      dirClass = d[3];
    }
  }
}

function moveSnake() {
  document.addEventListener('keydown', getHeadDir);
  moveHead();
  if (checkHeadPos()) {
    moveTail();
  }
}

function moveHead() {
  headPos = snake.length - 1;
  document.getElementById(snake[headPos]).classList.remove('snakeHead');
  if (document.getElementById(snake[headPos]).classList.contains('puddle')) {
    diveIn();
  } else {
    document.getElementById(snake[headPos]).classList.add('snakePart');
  }
  currentHeadPosition = document.getElementById(snake[headPos] + dir);
  currentHeadPosition.classList.add('snakeHead', `snake${dirClass}`);
  let snakeHead = snake[headPos] + dir;
  snake.push(snakeHead);
}

function checkHeadPos() {
  if (currentHeadPosition.classList.contains('wall') || currentHeadPosition.classList.contains('snakePart')) {
    gameOver();
  } else if (currentHeadPosition.classList.contains('coin')) {
    getPoints();
    return 0;
  }
  return 1;
}

function getPoints() {
  currentHeadPosition.classList.remove('coin');
  generateTreat();
  score += 1;
  scoreField.value = score;
}

function diveIn() {
  let puddlePos = puddles.indexOf(snake[headPos]);
  if (puddles.length === 2) {
    if (puddlePos === 0) {
      snake[headPos] = puddles[1];
    } else {
      snake[headPos] = puddles[0];
    }
  } else if (puddles.length === 3) {
    if (puddlePos === 0) {
      snake[headPos] = puddles[generateRandomNumber(2)];
    } else if (puddlePos === 1) {
      snake[headPos] = puddles[2];
    } else {
      snake[headPos] = puddles[generateRandomNumber(2) - 1];
    }
  } else {
    gameOver();
  }
}

function moveTail() {
  document.getElementById(snake[0]).classList.remove('snakePart', 'snakeTail', 'snakeTailUp', 'snakeTailLeft', 'snakeTailRight', 'snakeTailDown', 'snakeUp', 'snakeDown', 'snakeLeft', 'snakeRight');
  let snakeTail = document.getElementById(snake[1]);
  snake.shift();
  let dirClassTail = posTail();
  snakeTail.classList.add('snakeTail', dirClassTail);
}

function posTail() {
  if (snake[1] === snake[0] + 1) {
    return 'snakeTailRight';
  } else if (snake[1] === snake[0] - 1) {
    return 'snakeTailLeft';
  } else if (snake[1] === snake[0] - 20){
    return 'snakeTailUp';
  } else if (snake[1] === snake[0] + 20) {
    return 'snakeTailDown';
  }
}

function generateRandomNumber(n) {
  return Math.floor(Math.random() * n + 1);
}

function gameOver() {
  clearInterval(interval);
  alert('That was it!');
  location.reload();
}
