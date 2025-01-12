// Game variables for fixed update
const fixedUpdateInterval = 1000 / 60; // 60 updates per second
let lastUpdateTime = performance.now(); // Time of the last update
let accumulator = 0; // Tracks leftover time for consistent updates

function updateGame(currentTime) {
  // Calculate the time elapsed since the last frame
  const elapsedTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;

  // Accumulate the time elapsed
  accumulator += elapsedTime;

  // Process game logic in fixed intervals
  while (accumulator >= fixedUpdateInterval) {
    gameLogic(fixedUpdateInterval / 1000); // Convert milliseconds to seconds
    accumulator -= fixedUpdateInterval;
  }

  // Request the next frame
  requestAnimationFrame(updateGame);
}

function gameLogic(deltaTime) {
  // Scale movements based on deltaTime
  const scaledBallSpeedX = ballSpeedX * deltaTime;
  const scaledBallSpeedY = ballSpeedY * deltaTime;
  const scaledOpponentSpeed = opponentSpeed * deltaTime;

  // Move opponent paddle (simple AI)
  if (opponentPaddleY + opponentPaddle.clientHeight / 2 < ballY) {
    opponentPaddleY += scaledOpponentSpeed;
  } else {
    opponentPaddleY -= scaledOpponentSpeed;
  }
  opponentPaddleY = Math.max(0, Math.min(opponentPaddleY, gameContainer.clientHeight - opponentPaddle.clientHeight));
  opponentPaddle.style.top = opponentPaddleY + "px";

  // Move ball
  ballX += scaledBallSpeedX;
  ballY += scaledBallSpeedY;

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
}

// Initialize scoreboard and game
updateScore();
updateGame(performance.now()); // Start the game loop
