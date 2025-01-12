// Get game elements
const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const gameContainer = document.getElementById("game-container");
const scoreboard = document.getElementById("scoreboard");

// Game variables
let ballSpeedX = 300; // Pixels per second
let ballSpeedY = 300; // Pixels per second
let opponentSpeed = 300; // Pixels per second
let ballX, ballY, playerPaddleY, opponentPaddleY;

// Scoring
let playerScore = 0;
let opponentScore = 0;
const maxScore = 5; // End game at this score

// Initialize positions
function resetPositions() {
  ballX = gameContainer.clientWidth / 2 - ball.offsetWidth / 2;
  ballY = gameContainer.clientHeight / 2 - ball.offsetHeight / 2;
  playerPaddleY = gameContainer.clientHeight / 2 - playerPaddle.offsetHeight / 2;
  opponentPaddleY = gameContainer.clientHeight / 2 - opponentPaddle.offsetHeight / 2;

  ballSpeedX *= -1; // Reverse ball direction
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  playerPaddle.style.top = `${playerPaddleY}px`;
  opponentPaddle.style.top = `${opponentPaddleY}px`;
}

// Update scoreboard
function updateScore() {
  scoreboard.textContent = `Player: ${playerScore} | Opponent: ${opponentScore}`;
}

// End game
function endGame(winner) {
  alert(`${winner} wins!`);
  playerScore = 0;
  opponentScore = 0;
  updateScore();
  resetPositions();
}

// Update game logic
function gameLogic(deltaTime) {
  // Update opponent paddle (simple AI)
  if (opponentPaddleY + opponentPaddle.offsetHeight / 2 < ballY) {
    opponentPaddleY += opponentSpeed * deltaTime;
  } else {
    opponentPaddleY -= opponentSpeed * deltaTime;
  }
  opponentPaddleY = Math.max(0, Math.min(opponentPaddleY, gameContainer.clientHeight - opponentPaddle.offsetHeight));

  // Update ball position
  ballX += ballSpeedX * deltaTime;
  ballY += ballSpeedY * deltaTime;

  // Ball collision with walls
  if (ballY <= 0 || ballY >= gameContainer.clientHeight - ball.offsetHeight) {
    ballSpeedY *= -1;
  }

  // Ball collision with player paddle
  if (
    ballX <= playerPaddle.offsetLeft + playerPaddle.clientWidth &&
    ballY + ball.offsetHeight >= playerPaddleY &&
    ballY <= playerPaddleY + playerPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
  }

  // Ball collision with opponent paddle
  if (
    ballX + ball.offsetWidth >= opponentPaddle.offsetLeft &&
    ballY + ball.offsetHeight >= opponentPaddleY &&
    ballY <= opponentPaddleY + opponentPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
  }

  // Ball out of bounds (scoring)
  if (ballX <= 0) {
    opponentScore++;
    if (opponentScore === maxScore) {
      endGame("Opponent");
    } else {
      resetPositions();
    }
  } else if (ballX >= gameContainer.clientWidth - ball.offsetWidth) {
    playerScore++;
    if (playerScore === maxScore) {
      endGame("Player");
    } else {
      resetPositions();
    }
  }

  // Update positions on screen
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  opponentPaddle.style.top = `${opponentPaddleY}px`;
}

// Animation loop with fixed timestep
let lastFrameTime = performance.now();

function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert ms to seconds
  lastFrameTime = currentTime;

  gameLogic(deltaTime); // Update game logic
  updateScore(); // Ensure scoreboard stays updated

  requestAnimationFrame(gameLoop); // Request next frame
}

// Initialize game
resetPositions();
updateScore();
gameLoop(lastFrameTime);

// Input handling for desktop
gameContainer.addEventListener("mousemove", (e) => {
  const mouseY = e.clientY - gameContainer.offsetTop;
  playerPaddleY = mouseY - playerPaddle.offsetHeight / 2;

  // Prevent paddle from going out of bounds
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.offsetHeight));
  playerPaddle.style.top = `${playerPaddleY}px`;
});

// Touch handling for mobile
let touchStartY = 0;

gameContainer.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

gameContainer.addEventListener("touchmove", (e) => {
  const touchY = e.touches[0].clientY;
  const deltaY = touchY - touchStartY;
  touchStartY = touchY;

  playerPaddleY += deltaY;

  // Prevent paddle from going out of bounds
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.offsetHeight));
  playerPaddle.style.top = `${playerPaddleY}px`;
});
