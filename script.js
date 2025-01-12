// Get game elements
const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const gameContainer = document.getElementById("game-container");
const scoreboard = document.getElementById("scoreboard");

// Game variables
let ballSpeedX = 3; // Speed in percentage per ms
let ballSpeedY = 3; // Speed in percentage per ms
let opponentSpeed = 3;

// Ball position
let ballX = gameContainer.clientWidth / 2;
let ballY = gameContainer.clientHeight / 2;

// Paddle positions
let playerPaddleY = gameContainer.clientHeight / 2 - playerPaddle.offsetHeight / 2;
let opponentPaddleY = gameContainer.clientHeight / 2 - opponentPaddle.offsetHeight / 2;

// Scoring
let playerScore = 0;
let opponentScore = 0;
const maxScore = 5;

// Update scoreboard
function updateScore() {
  scoreboard.textContent = `Player: ${playerScore} | Opponent: ${opponentScore}`;
}

// Reset ball position
function resetBall() {
  ballX = gameContainer.clientWidth / 2 - ball.offsetWidth / 2;
  ballY = gameContainer.clientHeight / 2 - ball.offsetHeight / 2;
  ballSpeedX *= -1;
}

// End game
function endGame(winner) {
  alert(`${winner} wins!`);
  playerScore = 0;
  opponentScore = 0;
  resetBall();
  updateScore();
}

// Update game frame
function updateGame() {
  opponentPaddleY += opponentSpeed * (ballY > opponentPaddleY + opponentPaddle.clientHeight / 2 ? 1 : -1);
  opponentPaddleY = Math.max(0, Math.min(opponentPaddleY, gameContainer.clientHeight - opponentPaddle.clientHeight));
  opponentPaddle.style.top = `${opponentPaddleY}px`;

  // Normalize ball movement to avoid dependency on frame rate
  ballX += ballSpeedX * gameContainer.clientWidth / 100; // Normalize to percentage
  ballY += ballSpeedY * gameContainer.clientHeight / 100; // Normalize to percentage

  if (ballY <= 0 || ballY >= gameContainer.clientHeight - ball.clientHeight) ballSpeedY *= -1;

  if (
    ballX <= playerPaddle.offsetLeft + playerPaddle.clientWidth &&
    ballY + ball.clientHeight >= playerPaddleY &&
    ballY <= playerPaddleY + playerPaddle.clientHeight
  ) {
    ballSpeedX *= -1;
  }

  if (
    ballX + ball.clientWidth >= opponentPaddle.offsetLeft &&
    ballY + ball.clientHeight >= opponentPaddleY &&
    ballY <= opponentPaddleY + opponentPaddle.clientHeight
  ) {
    ballSpeedX *= -1;
  }

  if (ballX <= 0) {
    opponentScore++;
    if (opponentScore === maxScore) endGame("Opponent");
    else resetBall();
  } else if (ballX >= gameContainer.clientWidth - ball.clientWidth) {
    playerScore++;
    if (playerScore === maxScore) endGame("Player");
    else resetBall();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  playerPaddle.style.top = `${playerPaddleY}px`;
  updateScore();
  requestAnimationFrame(updateGame);
}

// Handle touch/mouse controls
let touchStartY = 0;
gameContainer.addEventListener("touchstart", (e) => (touchStartY = e.touches[0].clientY));
gameContainer.addEventListener("touchmove", (e) => {
  playerPaddleY += e.touches[0].clientY - touchStartY;
  touchStartY = e.touches[0].clientY;
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.clientHeight));
  e.preventDefault();
});

gameContainer.addEventListener("mousemove", (e) => {
  playerPaddleY = e.clientY - gameContainer.offsetTop - playerPaddle.clientHeight / 2;
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.clientHeight));
});

updateScore();
updateGame();
