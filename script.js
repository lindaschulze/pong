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
const paddleWidth = 10;
const paddleHeight = 100;
const paddle1 = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
const paddle2 = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, dx: 2, dy: 2 };

// Linker Schläger (Standard)
let selectedPaddleImage = paddle1Img;

// Paddle zeichnen
function drawPaddle(paddle, image) {
    ctx.drawImage(image, paddle.x, paddle.y, paddleWidth, paddleHeight);
}

// Ball zeichnen
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
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
        (ball.x - ball.radius < paddle1.x + paddleWidth &&
            ball.y > paddle1.y &&
            ball.y < paddle1.y + paddleHeight) ||
        (ball.x + ball.radius > paddle2.x &&
            ball.y > paddle2.y &&
            ball.y < paddle2.y + paddleHeight)
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

// Spiel starten
function gameLoop() {
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
