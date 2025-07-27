let board = [];
let currentPlayer = "X";
let size = 5;
let moves = 0;
let vsAI = false;
let gameOver = false;

function init() {
  size = parseInt(document.getElementById('size').value);
  vsAI = document.getElementById('mode').value === "ai";
  const boardElem = document.getElementById('board');
  boardElem.innerHTML = '';
  boardElem.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board = Array.from({ length: size }, () => Array(size).fill(""));
  currentPlayer = "X";
  moves = 0;
  gameOver = false;
  document.getElementById('message').textContent = '';

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleClick);
      boardElem.appendChild(cell);
    }
  }
}

function handleClick(e) {
  if (gameOver) return;
  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;

  if (board[row][col] !== "") return;

  makeMove(row, col, currentPlayer);
  if (checkGameEnd()) return;

  if (vsAI && currentPlayer === "O") {
    setTimeout(aiMove, 100); // AIの思考時間を模擬
  }
}

function makeMove(row, col, player) {
  board[row][col] = player;
  const cells = document.querySelectorAll('.cell');
  const idx = row * size + col;
  cells[idx].textContent = player;
  moves++;
  currentPlayer = player === "X" ? "O" : "X";
}

function aiMove() {
  if (gameOver) return;
  const empty = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === "") empty.push([i, j]);
    }
  }
  if (empty.length === 0) return;
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  makeMove(i, j, "O");
  checkGameEnd();
}

function countTriplets(player) {
  let count = 0;

  // 横
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 3; j++) {
      if (board[i][j] === player &&
          board[i][j+1] === player &&
          board[i][j+2] === player) count++;
    }
  }

  // 縦
  for (let i = 0; i <= size - 3; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === player &&
          board[i+1][j] === player &&
          board[i+2][j] === player) count++;
    }
  }

  // 斜め（右下がり）
  for (let i = 0; i <= size - 3; i++) {
    for (let j = 0; j <= size - 3; j++) {
      if (board[i][j] === player &&
          board[i+1][j+1] === player &&
          board[i+2][j+2] === player) count++;
    }
  }

  // 斜め（右上がり）
  for (let i = 2; i < size; i++) {
    for (let j = 0; j <= size - 3; j++) {
      if (board[i][j] === player &&
          board[i-1][j+1] === player &&
          board[i-2][j+2] === player) count++;
    }


  }
return count;
}

function checkGameEnd() {
  if (moves >= size * size) {
    const xScore = countTriplets("X");
    const oScore = countTriplets("O");
    let result = `X: ${xScore}点, O: ${oScore}点で → `;
    if (xScore > oScore) result += "Xの勝ち！";
    else if (oScore > xScore) result += "Oの勝ち！";
    else result += "引き分け！";
    document.getElementById('message').textContent = result;
    gameOver = true;
    return true;
}
return false;
}

window.onload = init;
