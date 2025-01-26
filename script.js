const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Variables
let paddleWidth, paddleHeight, ballSize;
let leftPaddle, rightPaddle, ball;
let leftScore = 0, rightScore = 0;

// Paddle and Ball Initialization
function initializeGame() {
    // Left Paddle
    leftPaddle = {
        x: 0,
        y: (canvas.height - paddleHeight) / 2,
        width: paddleWidth,
        height: paddleHeight,
        img: new Image(),
    };
    leftPaddle.img.src = "paddle1.png";

    // Right Paddle
    rightPaddle = {
        x: canvas.width - paddleWidth,
        y: (canvas.height - paddleHeight) / 2,
        width: paddleWidth,
        height: paddleHeight,
        img: new Image(),
    };
    rightPaddle.img.src = "paddle2.png";

    // Ball
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 3,
        dy: 3,
        size: ballSize,
    };
}

// Resize Canvas
function resizeCanvas() {
    const aspectRatio = 4 / 3; // Maintain the aspect ratio
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    if (maxWidth / maxHeight < aspectRatio) {
        canvas.width = maxWidth;
        canvas.height = maxWidth / aspectRatio;
    } else {
        canvas.height = maxHeight;
        canvas.width = maxHeight * aspectRatio;
    }

    paddleHeight = canvas.height / 6; // Maintain paddle height proportion
    paddleWidth = (paddleHeight / leftPaddle.img.height) * leftPaddle.img.width; // Calculate paddle width based on image proportions
    ballSize = canvas.width / 50; // Adjust ball size dynamically

    initializeGame();
}

// Draw Paddle
function drawPaddle(paddle) {
    ctx.drawImage(paddle.img, paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw Ball
function drawBall() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
}

// Draw Score
function drawScore() {
    document.getElementById("player1-score").textContent = leftScore;
    document.getElementById("player2-score").textContent = rightScore;
}

// Update Game State
function updateGame() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y < ball.size || ball.y > canvas.height - ball.size) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.size < leftPaddle.x + leftPaddle.width &&
            ball.y > leftPaddle.y &&
            ball.y < leftPaddle.y + leftPaddle.height) ||
        (ball.x + ball.size > rightPaddle.x &&
            ball.y > rightPaddle.y &&
            ball.y < rightPaddle.y + rightPaddle.height)
    ) {
        ball.dx *= -1.1; // Increase speed slightly
    }

    // Ball out of bounds
    if (ball.x < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x > canvas.width) {
        leftScore++;
        resetBall();
    }
}

// Reset Ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 3 * (Math.random() > 0.5 ? 1 : -1); // Randomize direction
    ball.dy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Render Game Elements
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
    drawScore();
}

// Touch Controls
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchY = touch.clientY - rect.top;

    if (touch.clientX < rect.width / 2) {
        leftPaddle.y = Math.min(Math.max(touchY - leftPaddle.height / 2, 0), canvas.height - leftPaddle.height);
    } else {
        rightPaddle.y = Math.min(Math.max(touchY - rightPaddle.height / 2, 0), canvas.height - rightPaddle.height);
    }
});

// Main Game Loop
function gameLoop() {
    updateGame();
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize and Start Game
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
gameLoop();
