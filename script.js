const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreboard = document.getElementById("scoreboard");
const winnerDisplay = document.getElementById("winner");

let canvasWidth = 800;
let canvasHeight = 500;

function resizeCanvas() {
  const ratio = canvasWidth / canvasHeight;
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (width / height > ratio) {
    width = height * ratio;
  } else {
    height = width / ratio;
  }

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const paddleWidth = 10;
const paddleHeight = 100;
let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 2;
let score1 = 0;
let score2 = 0;

const paddleImg1 = document.getElementById("paddle1img");
const paddleImg2 = document.getElementById("paddle2img");

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#ffffff44";
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.drawImage(paddleImg1, 10, paddle1Y, paddleWidth * 3, paddleHeight);
  ctx.drawImage(paddleImg2, canvas.width - 10 - paddleWidth * 3, paddle2Y, paddleWidth * 3, paddleHeight);

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
  ctx.fill();
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX < 20 + paddleWidth * 3 && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
    ballSpeedX = -ballSpeedX;
    let deltaY = ballY - (paddle1Y + paddleHeight / 2);
    ballSpeedY = deltaY * 0.2;
  }

  if (ballX > canvas.width - 20 - paddleWidth * 3 && ballY > paddle2Y && ballY < paddle2Y