const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Set up initial game variables
let leftPaddle, rightPaddle, ball, gameInterval;

// Define paddles and ball
const paddleWidth = 20, paddleHeight = 100;
const ballSize = 10;

// Resize canvas to maintain aspect ratio (5:4 or 4:5)
function resizeCanvas() {
    if (window.innerWidth > window.innerHeight) {
        // 4:5 horizontal ratio
        canvas.width = window.innerHeight * 4 / 5;
        canvas.height = window.innerHeight;
    } else {
        // 5:4 vertical ratio
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth * 4 / 5;
    }
    resetGame();
}

// Reset game elements after resizing
function resetGame() {
    leftPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
    rightPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 };
    ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, dx: 4, dy: 4 };
}

// Draw paddles and ball
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// Move paddles based on user input or touch events
function movePaddles() {
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Prevent paddles from going out of bounds
    leftPaddle.y = Math.max(0, Math.min(leftPaddle.y, canvas.height - leftPaddle.height));
    rightPaddle.y = Math.max(0, Math.min(rightPaddle.y, canvas.height - rightPaddle.height));
}

// Move the ball and handle collisions
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if (ball.y <= 0 || ball.y >= canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (ball.x <= leftPaddle.x + leftPaddle.width && ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
        ball.dx = -ball.dx;
    }
    if (ball.x >= rightPaddle.x - ball.size && ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
        ball.dx = -ball.dx;
    }

    // Reset ball if it goes out of bounds
    if (ball.x <= 0 || ball.x >= canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 4;
        ball.dy = 4;
    }
}

// Game loop
function gameLoop() {
    draw();
    movePaddles();
    moveBall();
}

// Resize canvas on window resize
window.addEventListener("resize", resizeCanvas);
resizeCanvas();  // Initialize canvas size and game

// Set up game loop interval
gameInterval = setInterval(gameLoop, 1000 / 60);

// Handle touch events for paddle control
canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    if (touchY < canvas.height / 2) {
        leftPaddle.dy = -5;
        rightPaddle.dy = -5;
    } else {
        leftPaddle.dy = 5;
        rightPaddle.dy = 5;
    }
}, false);

canvas.addEventListener("touchend", function() {
    leftPaddle.dy = 0;
    rightPaddle.dy = 0;
}, false);
