// Get game elements
const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const gameContainer = document.getElementById("game-container");
const scoreboard = document.getElementById("scoreboard");

// Game variables
let ballSpeedX = 4;
let ballSpeedY = 4;
let opponentSpeed = 4;

// Ball position
let ballX = gameContainer.clientWidth / 2;
let ballY = gameContainer.clientHeight / 2;

// Paddle positions
let playerPaddleY = gameContainer.clientHeight / 2 - playerPaddle.offsetHeight / 2;
let opponentPaddleY = gameContainer.clientHeight / 2 - opponentPaddle.offsetHeight / 2;

// Scoring
let playerScore = 0;
let opponentScore = 0;
const maxScore = 5; // End game at this score

// Update scoreboard
function updateScore() {
  scoreboard.textContent = `Player: ${playerScore} | Opponent: ${opponentScore}`;
}

// Reset ball position
function resetBall() {
  ballX = gameContainer.clientWidth / 2 - ball.offsetWidth / 2;
  ballY = gameContainer.clientHeight / 2 - ball.offsetHeight / 2;
  ballSpeedX *= -1; // Reverse direction
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
  // Move opponent paddle (simple AI)
  if (opponentPaddleY + opponentPaddle.clientHeight / 2 < ballY) {
    opponentPaddleY += opponentSpeed;
  } else {
    opponentPaddleY -= opponentSpeed;
  }
  opponentPaddleY = Math.max(0, Math.min(opponentPaddleY, gameContainer.clientHeight - opponentPaddle.clientHeight));
  opponentPaddle.style.top = opponentPaddleY + "px";

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY >= gameContainer.clientHeight - ball.clientHeight) {
    ballSpeedY *= -1;
  }

  // Ball collision with player paddle
  if (
    ballX <= playerPaddle.offsetLeft + playerPaddle.clientWidth &&
    ballY + ball.clientHeight >= playerPaddleY &&
    ballY <= playerPaddleY + playerPaddle.clientHeight
  ) {
    ballSpeedX *= -1;
  }

  // Ball collision with opponent paddle
  if (
    ballX + ball.clientWidth >= opponentPaddle.offsetLeft &&
    ballY + ball.clientHeight >= opponentPaddleY &&
    ballY <= opponentPaddleY + opponentPaddle.clientHeight
  ) {
    ballSpeedX *= -1;
  }

  // Ball out of bounds (scoring)
  if (ballX <= 0) {
    opponentScore++;
    if (opponentScore === maxScore) {
      endGame("Opponent");
    } else {
      resetBall();
    }
  } else if (ballX >= gameContainer.clientWidth - ball.clientWidth) {
    playerScore++;
    if (playerScore === maxScore) {
      endGame("Player");
    } else {
      resetBall();
    }
  }

  // Update ball position
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  // Update player paddle position
  playerPaddle.style.top = playerPaddleY + "px";

  // Update scoreboard
  updateScore();

  // Request next frame
  requestAnimationFrame(updateGame);
}

// Initialize scoreboard and game
updateScore();
updateGame();
