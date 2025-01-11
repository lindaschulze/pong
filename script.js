// Get game elements
const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const gameContainer = document.getElementById("game-container");

// Game variables
let ballSpeedX = 4;
let ballSpeedY = 4;
let playerSpeed = 0;
let opponentSpeed = 4;

// Ball position
let ballX = 390;
let ballY = 290;

// Player paddle position
let playerPaddleY = 250;

// Opponent paddle position
let opponentPaddleY = 250;

// Update game frame
function updateGame() {
  // Move player paddle
  playerPaddleY += playerSpeed;
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.clientHeight));
  playerPaddle.style.top = playerPaddleY + "px";

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

  // Ball out of bounds (reset to center)
  if (ballX <= 0 || ballX >= gameContainer.clientWidth - ball.clientWidth) {
    ballX = gameContainer.clientWidth / 2 - ball.clientWidth / 2;
    ballY = gameContainer.clientHeight / 2 - ball.clientHeight / 2;
    ballSpeedX *= -1;
  }

  // Update ball position
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  // Request next frame
  requestAnimationFrame(updateGame);
}

// Handle key presses for player paddle
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    playerSpeed = -6;
  } else if (event.key === "ArrowDown") {
    playerSpeed = 6;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    playerSpeed = 0;
  }
});

// Start the game
updateGame();
