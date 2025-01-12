// Game variables
let ballSpeedX = 3;
let ballSpeedY = 3;
let opponentSpeed = 1.5; // Slower opponent speed to make the game more balanced

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
  // Randomness in opponent paddle movement
  const randomFactor = Math.random() * 0.5 - 0.25; // Small random factor between -0.25 and 0.25
  const opponentMovement = ballY > opponentPaddleY + opponentPaddle.clientHeight / 2 ? 1 : -1;
  
  // Adjust opponent paddle movement to add a small random factor
  opponentPaddleY += opponentSpeed * opponentMovement + randomFactor;

  // Prevent opponent from moving out of bounds
  opponentPaddleY = Math.max(0, Math.min(opponentPaddleY, gameContainer.clientHeight - opponentPaddle.clientHeight));
  opponentPaddle.style.top = `${opponentPaddleY}px`;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball collision with top and bottom walls
  if (ballY <= 0 || ballY >= gameContainer.clientHeight - ball.clientHeight) ballSpeedY *= -1;

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

  // Scoring logic
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
