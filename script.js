const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let leftPaddleImage = null;
let selectedImagePath = null;
let paddleImageReady = false;

function selectPaddle(path) {
  selectedImagePath = path;
  const img = new Image();
  img.src = path;
  img.onload = () => {
    leftPaddleImage = img;
    paddleImageReady = true;
    document.getElementById("selectionScreen").style.display = "none";
    document.querySelector(".game-container").style.display = "block";
    resizeCanvas();
    gameLoop();
  };
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

let paddleHeight = 100;
let paddleWidth = 10;

let rightPaddleY = 200;
let leftPaddleY = 200;

let ballX = 300;
let ballY = 200;
let ballSize = 10;
let ballSpeedX = 4;
let ballSpeedY = 3;

function drawPaddles() {
  // Left paddle with image
  if (paddleImageReady && leftPaddleImage) {
    let aspect = leftPaddleImage.height / leftPaddleImage.width;
    let imgHeight = paddleHeight;
    let imgWidth = imgHeight / aspect;
    ctx.drawImage(leftPaddleImage, 0, leftPaddleY, imgWidth, imgHeight);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  }

  // Right paddle (default)
  ctx.fillStyle = "white";
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.fillStyle = "white";
  ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

function drawField() {
  ctx.fillStyle = "#003300";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMiddleLine() {
  ctx.fillStyle = "white";
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.fillRect(canvas.width / 2 - 1, y, 2, 20);
  }
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballX <= 20 &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = 20;
  }

  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width - paddleWidth - ballSize;
  }

  // Reset if out of bounds
  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
  }
}

function gameLoop() {
  drawField();
  drawMiddleLine();
  drawPaddles();
  drawBall();
  moveBall();
  requestAnimationFrame(gameLoop);
}

// Touch-Steuerung
canvas.addEventListener("touchmove", function (e) {
  e.preventDefault();
  for (let i = 0; i < e.touches.length; i++) {
    let touch = e.touches[i];
    let x = touch.clientX;
    let y = touch.clientY;

    if (x < canvas.width / 2) {
      leftPaddleY = y - paddleHeight / 2;
    } else {
      rightPaddleY = y - paddleHeight / 2;
    }
  }
}, { passive: false });