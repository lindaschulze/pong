// Anpassung der Canvas-Größe
function adjustCanvasSize() {
    canvas.width = window.innerWidth * 0.8;  // 80% der Bildschirmbreite
    canvas.height = window.innerHeight * 0.8; // 80% der Bildschirmhöhe

    // Berechnung der Paddle-Größe, proportional zur Canvas-Größe
    paddleWidth = canvas.width / 15;  // Proportional zur Breite des Canvas
    paddleHeight = canvas.height / 8; // Proportional zur Höhe des Canvas

    // Initialpositionen der Paddles setzen
    paddle1.x = 0;
    paddle1.y = canvas.height / 2 - paddleHeight / 2;

    paddle2.x = canvas.width - paddleWidth;
    paddle2.y = canvas.height / 2 - paddleHeight / 2;
}

// Aufruf der Funktion beim Laden und bei Änderung der Fenstergröße
window.addEventListener("resize", adjustCanvasSize);
adjustCanvasSize(); // Initiale Anpassung der Canvas-Größe

// Setzen der Ball-Startposition
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = Math.random() > 0.5 ? 5 : -5;
    ball.speedY = Math.random() * 4 - 2;
}

// Ballposition zurücksetzen nach Tor
function scorePoint(player) {
    if (player === 1) {
        score1++;
    } else {
        score2++;
    }
    resetBall();
}
