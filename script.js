// Get game elements
const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const gameContainer = document.getElementById("game-container");
const scoreboard = document.getElementById("scoreboard");
const roundDisplay = document.getElementById("round-display");

// Game variables
let ballSpeedX = 2;
let ballSpeedY = 2;
let opponentSpeed = 4;
let round = 1;

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
const maxRounds = 5; // Total rounds

// Update scoreboard
function updateScore() {
  scoreboard.textContent = `Player: ${playerScore} | Opponent: ${opponentScore}`;
}

// Display the current round
function updateRoundDisplay() {
  roundDisplay.textContent = `Round: ${round} / ${maxRounds}`;
}

// Reset ball position
function resetBall() {
  ballX = gameContainer.clientWidth / 2 - ball.offsetWidth / 2;
  ballY = gameContainer.clientHeight / 2 - ball.offsetHeight / 2;
  ballSpeedX = 2 + round * 0.5; // Increase speed with each round
  ballSpeedY = 2 + round * 0.5; // Increase speed with each round
  ballSpeedX *= (Math.random() < 0.5 ? 1 : -1); // Randomize direction
  ballSpeedY *= (Math.random() < 0.5 ? 1 : -1); // Randomize direction
}

// End game
function endGame(winner) {
  alert(`${winner} wins the game!`);
  resetGame();
}

// Reset game and display winner
function resetGame() {
  playerScore = 0;
  opponentScore = 0;
  round = 1;
  updateScore();
  updateRoundDisplay();
  resetBall();
  updateGame();
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
      if (round === maxRounds) {
        endGame("Opponent");
      } else {
        round++;
        resetBall();
      }
    } else {
      resetBall();
    }
  } else if (ballX >= gameContainer.clientWidth - ball.clientWidth) {
    playerScore++;
    if (playerScore === maxScore) {
      if (round === maxRounds) {
        endGame("Player");
      } else {
        round++;
        resetBall();
      }
    } else {
      resetBall();
    }
  }

  // Update ball position
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  // Update player paddle position
  playerPaddle.style.top = playerPaddleY + "px";

  // Update scoreboard and round display
  updateScore();
  updateRoundDisplay();

  // Request next frame
  requestAnimationFrame(updateGame);
}

// Add touch events for mobile swipe control
let touchStartY = 0;
let touchMoveY = 0;

// Handle touch start (on mobile devices)
gameContainer.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
  e.preventDefault(); // Prevent page scrolling
});

// Handle touch move (on mobile devices)
gameContainer.addEventListener("touchmove", (e) => {
  touchMoveY = e.touches[0].clientY;
  // Update the paddle Y position based on touch movement
  playerPaddleY += touchMoveY - touchStartY;
  touchStartY = touchMoveY; // Update touchStartY for smooth movement

  // Prevent the paddle from going out of bounds
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.clientHeight));

  // Update paddle position
  playerPaddle.style.top = playerPaddleY + "px";

  e.preventDefault(); // Prevent page scrolling
});

// Handle mouse movements (for desktop control)
gameContainer.addEventListener("mousemove", (e) => {
  const mouseY = e.clientY;
  playerPaddleY = mouseY - gameContainer.offsetTop - playerPaddle.clientHeight / 2;
  
  // Prevent the paddle from going out of bounds
  playerPaddleY = Math.max(0, Math.min(playerPaddleY, gameContainer.clientHeight - playerPaddle.clientHeight));
  
  // Update paddle position
  playerPaddle.style.top = playerPaddleY + "px";
});

// Initialize scoreboard and game
updateScore();
updateRoundDisplay();
updateGame();
