// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bilder laden
const paddle1Img = new Image();
const paddle2Img = new Image();
paddle1Img.src = 'paddle1.png';
paddle2Img.src = 'paddle2.png';

// Auswahlbildschirm
const selectionScreen = document.getElementById('selectionScreen');
const paddle1Option = document.getElementById('paddle1Option');
const paddle2Option = document.getElementById('paddle2Option');

// Spielobjekte
const paddleSpeed = 5;
const paddle1 = { x: 10, y: canvas.height / 2 - 50, width: 0, height: 0, dy: 0 };
const paddle2 = { x: canvas.width - 20, y: canvas.height / 2 - 50, width: 0, height: 0, dy: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 2, dy: 2 };

// Linker Schläger (Standard)
let selectedPaddleImage = paddle1Img;

// Paddle zeichnen mit Originalproportionen
function drawPaddle(paddle, image) {
    if (paddle.width === 0 || paddle.height === 0) {
        paddle.width = image.width;
        paddle.height = image.height;
    }
    ctx.drawImage(image, paddle.x, paddle.y, paddle.width, paddle.height);
}

// Ball zeichnen
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Schläger bewegen
function movePaddles() {
    paddle1.y += paddle1.dy;
    paddle2.y += paddle2.dy;

    // Begrenzung für paddle1
    if (paddle1.y < 0) paddle1.y = 0;
    if (paddle1.y + paddle1.height > canvas.height) paddle1.y = canvas.height - paddle1.height;

    // Begrenzung für paddle2
    if (paddle2.y < 0) paddle2.y = 0;
    if (paddle2.y + paddle2.height > canvas.height) paddle2.y = canvas.height - paddle2.height;
}

// Spiel aktualisieren
function updateGame() {
    // Ballbewegung
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Kollisionserkennung (oben und unten)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }

    // Kollision mit Schlägern
    if (
        (ball.x - ball.radius < paddle1.x + paddle1.width &&
            ball.y > paddle1.y &&
            ball.y < paddle1.y + paddle1.height) ||
        (ball.x + ball.radius > paddle2.x &&
            ball.y > paddle2.y &&
            ball.y < paddle2.y + paddle2.height)
    ) {
        ball.dx = -ball.dx;
    }

    // Bildschirm löschen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Elemente zeichnen
    drawPaddle(paddle1, selectedPaddleImage); // Linker Schläger mit gewähltem Bild
    drawPaddle(paddle2, paddle2Img);
    drawBall();
}

// Spiel-Loop
function gameLoop() {
    movePaddles();
    updateGame();
    requestAnimationFrame(gameLoop);
}

// Eventlistener für Paddle-Auswahl
paddle1Option.addEventListener('click', () => {
    selectedPaddleImage = paddle1Img;
    startGame();
});

paddle2Option.addEventListener('click', () => {
    selectedPaddleImage = paddle2Img;
    startGame();
});

// Spiel starten
function startGame() {
    selectionScreen.style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
}

// Tastensteuerung
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') paddle1.dy = -paddleSpeed; // Spieler 1 nach oben
    if (event.key === 's') paddle1.dy = paddleSpeed;  // Spieler 1 nach unten
    if (event.key === 'ArrowUp') paddle2.dy = -paddleSpeed; // Spieler 2 nach oben
    if (event.key === 'ArrowDown') paddle2.dy = paddleSpeed; // Spieler 2 nach unten
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w' || event.key === 's') paddle1.dy = 0; // Spieler 1 stoppt
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') paddle2.dy = 0; // Spieler 2 stoppt
});
