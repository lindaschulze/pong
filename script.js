// Initialisieren des Spielfeldes und der Variablen
let canvas = document.getElementById("pong");
let context = canvas.getContext("2d");

// Spielfeldgrößen
canvas.width = 800;
canvas.height = 600;

// Paddle-Eigenschaften
let paddleWidth = 10, paddleHeight = 100;
let paddle1Y = (canvas.height - paddleHeight) / 2, paddle2Y = (canvas.height - paddleHeight) / 2;

// Ball-Eigenschaften
let ballRadius = 10;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 5;

// Punktestand
let score1 = 0, score2 = 0;

// Touch-Positionen
let touchStartX, touchStartY;

// Funktion zur Aktualisierung der Position des Balls
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball-Kollision mit dem oberen und unteren Rand
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball-Kollision mit den Paddles
    if (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Punktestand aktualisieren
    if (ballX - ballRadius < 0) {
        score2++;
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        score1++;
        resetBall();
    }
}

// Funktion zum Zurücksetzen des Balls
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

// Funktion zur Anzeige des Punktestands
function drawScore() {
    context.font = "32px Arial";
    context.fillText(score1, canvas.width / 4, 50);
    context.fillText(score2, canvas.width * 3 / 4, 50);
}

// Funktion zum Zeichnen der Paddles
function drawPaddles() {
    context.fillStyle = "#0095DD";
    context.fillRect(0, paddle1Y, paddleWidth, paddleHeight);  // Linkes Paddle
    context.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);  // Rechtes Paddle
}

// Funktion zum Zeichnen der Mittellinie
function drawCenterLine() {
    context.strokeStyle = "#0095DD";
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
}

// Funktion zum Verarbeiten der Touch-Events
function handleTouchMove(event) {
    let touchX = event.touches[0].clientX;
    let touchY = event.touches[0].clientY;

    // Überprüfen, ob der Touch auf der linken oder rechten Seite ist
    if (touchX < canvas.width / 2) {
        paddle1Y = touchY - paddleHeight / 2;  // Linkes Paddle folgt dem Touch
        if (paddle1Y < 0) paddle1Y = 0;  // Grenzen für das linke Paddle
        if (paddle1Y > canvas.height - paddleHeight) paddle1Y = canvas.height - paddleHeight;
    } else {
        paddle2Y = touchY - paddleHeight / 2;  // Rechtes Paddle folgt dem Touch
        if (paddle2Y < 0) paddle2Y = 0;  // Grenzen für das rechte Paddle
        if (paddle2Y > canvas.height - paddleHeight) paddle2Y = canvas.height - paddleHeight;
    }
}

// Event Listener für Touch-Bewegung
canvas.addEventListener("touchmove", handleTouchMove, false);

// Funktion zum Zeichnen des Spiels
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);  // Spielfeld löschen

    drawCenterLine();
    drawScore();
    drawPaddles();
    moveBall();
}

// Das Spiel jede 20 ms aktualisieren
setInterval(draw, 20);
