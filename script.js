// Get game elements
const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const gameContainer = document.getElementById("game-container");

// Game variables
let ballSpeedX = 4;
let ballSpeedY = 4;
let opponentSpeed = 4;

// Ball position
let ballX = 390;
let ballY = 290;

// Player paddle position
let playerPaddleY = 250;

// Opponent paddle position
let opponentPaddleY = 250;

// Touch-related variables
let touchStartY = 0;

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

  // Ball out of bounds (reset to center)
  if (ballX <= 0 || ballX >= gameContainer.clientWidth - ball.clientWidth) {
    ballX = gameContainer.clientWidth / 2 - ball.clientWidth / 2;
    ballY = gameContainer.clientHeight / 2 - ball.clientHeight / 2;
    ballSpeedX *= -1;
  }

  // Update ball position
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  // Update player paddle position
  playerPaddle.style.top = playerPaddleY + "px";

  // Request next frame
  requestAnimationFrame(updateGame);
}

// Handle touch start
document.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientY;
});

// Handle touch move
document.addEventListener("touchmove", (event) => {
  const touchY = event.touches[0].clientY;
  const deltaY = touchY - touchStartY;
  playerPaddleY += deltaY;
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.clientHeight));
  touchStartY = touchY; // Update for smooth movement
});

// Start the game
updateGame();
