// Initialisieren des Canvas und der Variablen
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddle1 = { x: 0, y: 0, width: 0, height: 0, speed: 5 };
let paddle2 = { x: 0, y: 0, width: 0, height: 0, speed: 5 };
let ball = { x: 0, y: 0, radius: 10, speedX: 0, speedY: 0 };
let score1 = 0;
let score2 = 0;

// Anpassung der Canvas-Größe und Position der Paddles
function adjustCanvasSize() {
    canvas.width = window.innerWidth * 0.8;  // 80% der Bildschirmbreite
    canvas.height = window.innerHeight * 0.8; // 80% der Bildschirmhöhe

    paddle1.width = canvas.width / 15;  // Proportional zur Canvas-Breite
    paddle1.height = canvas.height / 8; // Proportional zur Canvas-Höhe
    paddle2.width = canvas.width / 15;
    paddle2.height = canvas.height / 8;

    // Initialposition der Paddles
    paddle1.y = canvas.height / 2 - paddle1.height / 2;
    paddle2.y = canvas.height / 2 - paddle2.height / 2;

    // Ball-Startposition
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = Math.random() > 0.5 ? 5 : -5;
    ball.speedY = Math.random() * 4 - 2;
}

// Ball und Paddles zeichnen
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Spielfeld leeren

    // Spielfeld zeichnen
    ctx.fillStyle = "#2e8b57";  // Dunkelgrün
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ball zeichnen
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();

    // Paddles zeichnen
    ctx.fillStyle = "#fff";  // Weiße Farbe für Paddles
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

    // Punktestand anzeigen
    ctx.font = "30px Arial";
    ctx.fillText(score1, canvas.width / 4, 50);
    ctx.fillText(score2, canvas.width * 3 / 4, 50);
}

// Bewegung des Balls
function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball-Kollisionslogik
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;  // Ball prallt von oben und unten ab
    }

    if (ball.x + ball.radius > canvas.width) {
        score1++;  // Spieler 1 bekommt Punkt
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        score2++;  // Spieler 2 bekommt Punkt
        resetBall();
    }

    // Ball und Paddle-Kollision
    if (ball.x - ball.radius < paddle1.x + paddle1.width && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) {
        ball.speedX = -ball.speedX;
    }

    if (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) {
        ball.speedX = -ball.speedX;
    }
}

// Ball zurücksetzen
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = Math.random() > 0.5 ? 5 : -5;
    ball.speedY = Math.random() * 4 - 2;
}

// Hauptspiel-Loop
function gameLoop() {
    drawGame();
    moveBall();
    requestAnimationFrame(gameLoop);
}

// Aufruf beim Laden der Seite und bei Änderung der Fenstergröße
window.addEventListener("resize", adjustCanvasSize);
adjustCanvasSize(); // Initiale Anpassung der Canvas-Größe
gameLoop();  // Start des Spiels
