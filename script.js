// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let canvasWidth = 600;
let canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Paddle and Ball settings
const paddleHeight = 100;
let paddleWidth = 10;
let leftPaddle = { x: 0, y: canvasHeight / 2 - paddleHeight / 2, image: new Image() };
let rightPaddle = { x: canvasWidth - paddleWidth, y: canvasHeight / 2 - paddleHeight / 2, image: new Image() };
leftPaddle.image.src = "paddle1.png";
rightPaddle.image.src = "paddle2.png";

let ball = { x: canvasWidth / 2, y: canvasHeight / 2, radius: 10, dx: 3, dy: 3 };

let leftScore = 0;
let rightScore = 0;

// Event listeners for paddle control
let touchY = null;

window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (touch.clientX < canvasWidth / 2) {
        touchY = touch.clientY;
        leftPaddle.y = touchY - paddleHeight / 2;
    } else {
        touchY = touch.clientY;
        rightPaddle.y = touchY - paddleHeight / 2;
    }
});

window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (touch.clientX < canvasWidth / 2) {
        touchY = touch.clientY;
        leftPaddle.y = Math.max(0, Math.min(canvasHeight - paddleHeight, touchY - paddleHeight / 2));
    } else {
        touchY = touch.clientY;
        rightPaddle.y = Math.max(0, Math.min(canvasHeight - paddleHeight, touchY - paddleHeight / 2));
    }
});

// Draw paddles and ball
function drawPaddle(paddle) {
    ctx.drawImage(paddle.image, paddle.x, paddle.y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawBall();
    requestAnimationFrame(updateGame);
}

// Game logic
function updateGame() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x - ball.radius < leftPaddle.x + paddleWidth &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + paddleHeight) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + paddleHeight) {
        ball.dx *= -1;
    }

    if (ball.x - ball.radius < 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvasWidth) {
        leftScore++;
        resetBall();
    }

    document.getElementById("leftScore").textContent = leftScore;
    document.getElementById("rightScore").textContent = rightScore;

    drawGame();
}

// Reset ball
function resetBall() {
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;
    ball.dx *= -1;
}

// Start the game
drawGame();
