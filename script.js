const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let paddleHeight = 100;
let paddleWidth = 10;
let ballSize = 10;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let scoreLeft = 0;
let scoreRight = 0;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawMiddleLine() {
  ctx.fillStyle = "white";
  let segmentHeight = 20;
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.fillRect(canvas.width / 2 - 1, y, 2, segmentHeight);
  }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, '#003300'); // field
  drawMiddleLine();
  drawRect(0, leftPaddleY, paddleWidth, paddleHeight, 'white');
  drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, 'white');
  drawRect(ballX, ballY, ballSize, ballSize, 'white');
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top & bottom wall
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle
  if (
    ballX <= paddleWidth &&
    ballY + ballSize > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = paddleWidth; // prevent sticking
  }

  // Right paddle
  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width - paddleWidth - ballSize; // prevent sticking
  }

  // Score left
  if (ballX > canvas.width) {
    scoreLeft++;
    updateScore();
    resetBall();
  }

  // Score right
  if (ballX < 0) {
    scoreRight++;
    updateScore();
    resetBall();
  }
}

function updateScore() {
  document.getElementById("score-left").textContent = scoreLeft;
  document.getElementById("score-right").textContent = scoreRight;
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
  draw();
  moveBall();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// Touch control
canvas.addEventListener('touchmove', function (e) {
  e.preventDefault();
  for (let i = 0; i < e.touches.length; i++) {
    let touch = e.touches[i];
    let touchX = touch.clientX;
    let touchY = touch.clientY;

    if (touchX < canvas.width / 2) {
      leftPaddleY = touchY - paddleHeight / 2;
    } else {
      rightPaddleY = touchY - paddleHeight / 2;
    }
  }
}, { passive: false });