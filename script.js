const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Spielfeldgrößen
canvas.width = 800;
canvas.height = 400;

// Paddle-Größen
const paddleHeight = 100;
const paddleWidth = 10;
const paddleSpeed = 5;

// Ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 3,
  dy: 3,
};

// Paddles
const paddleImage1 = new Image();
paddleImage1.src = "paddle1.png";

const paddleImage2 = new Image();
paddleImage2.src = "paddle2.png";

const leftPaddle = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  height: paddleHeight,
  dy: 0,
  img: paddleImage1,
};

const rightPaddle = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  height: paddleHeight,
  dy: 0,
  img: paddleImage2,
};

// Eventlistener für Paddle-Steuerung
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      leftPaddle.dy = -paddleSpeed;
      break;
    case "s":
      leftPaddle.dy = paddleSpeed;
      break;
    case "ArrowUp":
      rightPaddle.dy = -paddleSpeed;
      break;
    case "ArrowDown":
      rightPaddle.dy = paddleSpeed;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
    case "s":
      leftPaddle.dy = 0;
      break;
    case "ArrowUp":
    case "ArrowDown":
      rightPaddle.dy = 0;
      break;
  }
});

// Funktion zum Zeichnen der Paddles als Bilder
function drawImage(paddle) {
  const aspectRatio = paddle.img.width / paddle.img.height;
  const newWidth = paddle.height * aspectRatio; // Breite proportional zur fixen Höhe
  ctx.drawImage(paddle.img, paddle.x, paddle.y, newWidth, paddle.height);
}

// Funktion zum Zeichnen des Balls
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

// Spielfeld zeichnen
function drawField() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Update der Paddle-Positionen
function updatePaddlePosition(paddle) {
  paddle.y += paddle.dy;

  // Paddles innerhalb des Spielfelds halten
  if (paddle.y < 0) paddle.y = 0;
  if (paddle.y + paddle.height > canvas.height)
    paddle.y = canvas.height - paddle.height;
}

// Ballposition aktualisieren
function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball prallt von den oberen und unteren Rändern ab
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy *= -1;
  }

  // Kollision mit linken Paddle
  if (
    ball.x - ball.radius < leftPaddle.x + paddleWidth &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + paddleWidth + ball.radius; // Überschneidung korrigieren
  }

  // Kollision mit rechtem Paddle
  if (
    ball.x + ball.radius > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.radius; // Überschneidung korrigieren
  }

  // Ball aus dem Spielfeld (Punkte für Gegner)
  if (ball.x < 0 || ball.x > canvas.width) {
    resetBall();
  }
}

// Ball zurücksetzen
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1; // Richtung ändern
}

// Spielschleife
function gameLoop() {
  drawField();

  drawImage(leftPaddle);
  drawImage(rightPaddle);
  drawBall();

  updatePaddlePosition(leftPaddle);
  updatePaddlePosition(rightPaddle);
  updateBall();

  requestAnimationFrame(gameLoop);
}

// Spiel starten, nachdem die Bilder geladen sind
paddleImage1.onload = paddleImage2.onload = () => {
  gameLoop();
};
