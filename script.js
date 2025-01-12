// Last frame timestamp
let lastFrameTime = performance.now(); // Initialize with the current time

function updateGame(currentTime) {
  // Calculate the time elapsed since the last frame
  const deltaTime = (currentTime - lastFrameTime) / 1000; // Convert milliseconds to seconds
  lastFrameTime = currentTime; // Update the last frame time
  
  // Scale the ball and paddle movements by deltaTime
  const scaledBallSpeedX = ballSpeedX * deltaTime * 60; // Scale for 60 FPS baseline
  const scaledBallSpeedY = ballSpeedY * deltaTime * 60;
  const scaledOpponentSpeed = opponentSpeed * deltaTime * 60;

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

  // Request next frame
  requestAnimationFrame(updateGame);
}

// Initialize scoreboard and game
updateScore();
updateGame(performance.now()); // Pass the initial timestamp
