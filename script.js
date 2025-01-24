// Anpassung der Spielfeldgröße für Mobilgeräte
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Setze die Spielfeldgröße auf die Bildschirmgröße
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Definiere die Paddles
const paddleWidth = canvas.width / 20;
const paddleHeight = canvas.height / 6;
const paddle1Image = new Image();
const paddle2Image = new Image();

paddle1Image.src = "paddle1.png";
paddle2Image.src = "paddle2.png";

// Paddles als Objekte
const paddle1 = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  image: paddle1Image
};

const paddle2 = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  image: paddle2Image
};

// Zeichne Paddles
function drawPaddle(paddle) {
  ctx.drawImage(paddle.image, paddle.x, paddle.y, paddle.width, paddle.height);
}

// Funktion zum Zeichnen des Spielfeldes
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Zeichne Paddles
  drawPaddle(paddle1);
  drawPaddle(paddle2);
}

// Rufe die Draw-Funktion in einem Animationsloop auf
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
