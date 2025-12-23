// Script für Pong-Spiel (angepasst für Touch-Steuerung)

// Variablen für Canvas und Kontext
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Spielvariablen
let player1Y = canvas.height / 2 - 50;
let player2Y = canvas.height / 2 - 50;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let player1Score = 0;
let player2Score = 0;
const paddleHeight = 100;
const paddleWidth = 20;

// Canvas-Größe einstellen
canvas.width = 800;
canvas.height = 400;

// Touch-Events für die Steuerung der Schläger
let touchStartY1 = 0;
let touchStartY2 = 0;

// Touch-Event Listener für den linken Schläger (Mio)
canvas.addEventListener('touchstart', function (e) {
    touchStartY1 = e.touches[0].clientY; // Anfangsposition für Mio
}, false);

canvas.addEventListener('touchmove', function (e) {
    let touchMoveY1 = e.touches[0].clientY;
    let deltaY1 = touchMoveY1 - touchStartY1; // Differenz der Bewegungen

    player1Y += deltaY1; // Schläger von Mio bewegen
    touchStartY1 = touchMoveY1; // Position aktualisieren

    // Begrenzung der Bewegung des Schlägers
    if (player1Y < 0) player1Y = 0;
    if (player1Y > canvas.height - paddleHeight) player1Y = canvas.height - paddleHeight;
}, false);

// Touch-Event Listener für den rechten Schläger (Mika)
canvas.addEventListener('touchstart', function (e) {
    touchStartY2 = e.touches[1]?.clientY; // Anfangsposition für Mika
}, false);

canvas.addEventListener('touchmove', function (e) {
    if (!e.touches[1]) return; // Nur wenn zwei Finger auf dem Bildschirm sind
    let touchMoveY2 = e.touches[1].clientY;
    let deltaY2 = touchMoveY2 - touchStartY2; // Differenz der Bewegungen

    player2Y += deltaY2; // Schläger von Mika bewegen
    touchStartY2 = touchMoveY2; // Position aktualisieren

    // Begrenzung der Bewegung des Schlägers
    if (player2Y < 0) player2Y = 0;
    if (player2Y > canvas.height - paddleHeight) player2Y = canvas.height - paddleHeight;
}, false);

// Ball-Bewegung und Kollisionserkennung
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball-Kollision mit den Wänden
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball-Kollision mit den Schlägern
    if (ballX < paddleWidth && ballY > player1Y && ballY < player1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        player1Score++;
    }
    if (ballX > canvas.width - paddleWidth && ballY > player2Y && ballY < player2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        player2Score++;
    }

    // Ball zurücksetzen, wenn er aus dem Spielfeld geht
    if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }
}

// Zeichnen der Schläger, des Balls und des Punktestands
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Schläger für Mio und Mika
    ctx.fillStyle = "blue";
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight); // Mio's Schläger
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); // Mika's Schläger

    // Ball zeichnen
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Punktestand anzeigen
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.fillText("Mio: " + player1Score, 20, 30);
    ctx.fillText("Mika: " + player2Score, canvas.width - 120, 30);
}

// Spielaktualisierung
function gameLoop() {
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();  // Spiel starten

