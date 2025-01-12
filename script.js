// Update game frame
function updateGame(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    requestAnimationFrame(updateGame);
    return;
  }

  const delta = timestamp - lastTimestamp; // Time since last frame in ms
  lastTimestamp = timestamp;

  opponentPaddleY += opponentSpeed * (ballY > opponentPaddleY + opponentPaddle.clientHeight / 2 ? 1 : -1);
  opponentPaddleY = Math.max(0, Math.min(opponentPaddleY, gameContainer.clientHeight - opponentPaddle.clientHeight));
  opponentPaddle.style.top = `${opponentPaddleY}px`;

  // Update ball position with adjusted speed
  ballX += ballSpeedX * delta / 10; // Apply factor to adjust speed
  ballY += ballSpeedY * delta / 10; // Apply factor to adjust speed

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
