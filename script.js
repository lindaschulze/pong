// Script für Pong-Spiel (angepasst für Touch-Steuerung)

// Variablen für Canvas und Kontext
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Spielvariablen
let mioY = canvas.height / 2 - 50;
let mikaY = canvas.height / 2 - 50;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let mioScore = 0;
let mikaScore = 0;
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

    mioY += deltaY1; // Schläger von Mio bewegen
    touchStartY1 = touchMoveY1; // Position aktualisieren

    // Begrenzung der Bewegung des Schlägers
    if (mioY < 0) mioY = 0;
    if (mioY > canvas.height - paddleHeight) mioY = canvas.height - paddleHeight;
}, false);

// Touch-Event Listener für den rechten Schläger (Mika)
canvas.addEventListener('touchstart', function (e) {
    touchStartY2 = e.touches[1]?.clientY; // Anfangsposition für Mika
}, false);

canvas.addEventListener('touchmove', function (e) {
    if (!e.touches[1]) return; // Nur wenn zwei Finger auf dem Bildschirm sind
    let touchMoveY2 = e.touches[1].clientY;
    let deltaY2 = touchMoveY2 - touchStartY2; // Differenz der Bewegungen

    mikaY += deltaY2; // Schläger von Mika bewegen
    touchStartY2 = touchMoveY2; // Position aktualisieren

    // Begrenzung der Bewegung des Schlägers
    if (mikaY < 0) mikaY = 0;
    if (mikaY > canvas.height - paddleHeight) mikaY = canvas.height - paddleHeight;
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
    if (ballX < paddleWidth && ballY > mioY && ballY < mioY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        mioScore++;
    }
    if (ballX > canvas.width - paddleWidth && ballY > mikaY && ballY < mikaY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        mikaScore++;
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
    ctx.fillRect(0, mioY, paddleWidth, paddleHeight); // Mio's Schläger
    ctx.fillRect(canvas.width - pa
