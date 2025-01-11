const playerPaddle = document.getElementById("player-paddle");
const opponentPaddle = document.getElementById("opponent-paddle");
const ball = document.getElementById("ball");
const roundNumberDisplay = document.getElementById("round-number");
const playerScoreDisplay = document.getElementById("player-score");
const opponentScoreDisplay = document.getElementById("opponent-score");
const winnerMessage = document.getElementById("winner-message");

const gameContainer = document.getElementById("game-container");

let playerScore = 0;
let opponentScore = 0;
let roundNumber = 1;

let ballX, ballY, ballSpeedX, ballSpeedY, playerPaddleY, opponentPaddleY;

const paddleSpeed = 10;
const initialBallSpeed = 2;

function resetBall() {
  ballX = gameContainer.offsetWidth / 2 - ball.offsetWidth / 2;
  ballY = gameContainer.offsetHeight / 2 - ball.offsetHeight / 2;
  ballSpeedX = initialBallSpeed + roundNumber - 1;
  ballSpeedY = initialBallSpeed + roundNumber - 1;
}

function updateGame() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= gameContainer.offsetHeight - ball.offsetHeight) {
    ballSpeedY *= -1;
  }

  if (
    ballX <= playerPaddle.offsetLeft + playerPaddle.offsetWidth &&
    ballY + ball.offsetHeight >= playerPaddleY &&
    ballY <= playerPaddleY + playerPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
  }

  if (
    ballX + ball.offsetWidth >= opponentPaddle.offsetLeft &&
    ballY + ball.offsetHeight >= opponentPaddleY &&
    ballY <= opponentPaddleY + opponentPaddle.offsetHeight
  ) {
    ballSpeedX *= -1;
  }

  if (ballX <= 0) {
    opponentScore++;
    updateScore();
    resetBall();
  }

  if (ballX >= gameContainer.offsetWidth) {
    playerScore++;
    updateScore();
    resetBall();
  }

  playerPaddle.style.top = playerPaddleY + "px";
  opponentPaddle.style.top = opponentPaddleY + "px";
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  if (roundNumber > 5) return; // Stop game after 5 rounds

  requestAnimationFrame(updateGame);
}

function updateScore() {
  playerScoreDisplay.textContent = playerScore;
  opponentScoreDisplay.textContent = opponentScore;

  if (playerScore === 5 || opponentScore === 5) {
    roundNumber++;
    if (roundNumber > 5) {
      announceWinner();
    }
    resetBall();
  }
}

function announceWinner() {
  winnerMessage.textContent =
    playerScore > opponentScore ? "Player Wins!" : "Opponent
