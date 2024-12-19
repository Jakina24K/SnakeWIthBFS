const boardSize = 20;
const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
let board = [];
let snake = [[10, 10]];
let food = [];
let direction = [0, 1];
let interval;


function initializeBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  placeSnake();
  placeFood();
}

function placeSnake() {
  snake.forEach(([x, y]) => {
    board[x][y] = "snake";
  });
}

function placeFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * boardSize);
    y = Math.floor(Math.random() * boardSize);
  } while (board[x][y]);
  food = [x, y];
  board[x][y] = "food";
}

function renderBoard() {
  boardElement.innerHTML = "";
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (board[x][y] === "snake") {
        cell.classList.add("snake");
      } else if (board[x][y] === "food") {
        cell.classList.add("food");
      }
      boardElement.appendChild(cell);
    }
  }
}

function findPathBFS(start, target) {
  const queue = [[start]];
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  const directions = [
    [0, 1], 
    [1, 0], 
    [0, -1], 
    [-1, 0], 
  ];

  while (queue.length > 0) {
    const path = queue.shift();
    const [x, y] = path[path.length - 1];

    if (x === target[0] && y === target[1]) {
      return path;
    }

    for (let [dx, dy] of directions) {
      const next = [x + dx, y + dy];
      if (isValid(next) && !visited.has(`${next[0]},${next[1]}`)) {
        visited.add(`${next[0]},${next[1]}`);
        queue.push([...path, next]);
      }
    }
  }

  return null;
}

function moveSnake() {
  const path = findPathBFS(snake[0], food);

  if (!path || path.length <= 1) {
    clearInterval(interval);
    messageElement.textContent = "Game Over!";
    return;
  }

  const nextMove = path[1];
  const [x, y] = nextMove;

  snake.unshift(nextMove);
  if (x === food[0] && y === food[1]) {
    placeFood(); 
  } else {
    const tail = snake.pop();
    board[tail[0]][tail[1]] = null;
  }

  board[x][y] = "snake";
  renderBoard();
}

function isValid([x, y]) {
  return (
    x >= 0 &&
    x < boardSize &&
    y >= 0 &&
    y < boardSize &&
    board[x][y] !== "snake"
  );
}

function restartGame() {
  snake = [[10, 10]];
  food = [];
  direction = [0, 1];
  messageElement.textContent = "";
  initializeBoard();
  renderBoard();
  interval = setInterval(moveSnake, 100);
}

initializeBoard();
renderBoard();
interval = setInterval(moveSnake, 100);
