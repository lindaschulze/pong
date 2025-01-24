document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const paddleWidth = 10;
    const paddleHeight = 100;

    // Load paddle images
    const paddleImage1 = new Image();
    paddleImage1.src = 'paddle1.png';
    const paddleImage2 = new Image();
    paddleImage2.src = 'paddle2.png';

    // Paddle positions
    const paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
    const paddle2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };

    // Ball
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 2,
        dy: 2
    };

    // Key states
    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };

    // Event listeners for key presses
    document.addEventListener('keydown', (event) => {
        if (event.key in keys) keys[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
        if (event.key in keys) keys[event.key] = false;
    });

    // Draw paddles
    function drawPaddle(paddle, image) {
        ctx.drawImage(image, paddle.x, paddle.y, paddleWidth, paddleHeight);
    }

    // Draw ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    // Move paddles
    function movePaddles() {
        if (keys.w && paddle1.y > 0) paddle1.y -= 5;
        if (keys.s && paddle1.y < canvas.height - paddleHeight) paddle1.y += 5;
        if (keys.ArrowUp && paddle2.y > 0) paddle2.y -= 5;
        if (keys.ArrowDown && paddle2.y < canvas.height - paddleHeight) paddle2.y += 5;
    }

    // Move ball
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy *= -1;

        // Paddle collision
        if (
            (ball.x - ball.radius < paddle1.x + paddleWidth &&
                ball.y > paddle1.y &&
                ball.y < paddle1.y + paddleHeight) ||
            (ball.x + ball.radius > paddle2.x &&
                ball.y > paddle2.y &&
                ball.y < paddle2.y + paddleHeight)
        ) {
            ball.dx *= -1;
        }

        // Reset ball if it goes out
        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx *= -1;
        }
    }

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        movePaddles();
        moveBall();

        drawPaddle(paddle1, paddleImage1);
        drawPaddle(paddle2, paddleImage2);
        drawBall();

        requestAnimationFrame(gameLoop);
    }

    // Start game after images are loaded
    paddleImage1.onload = paddleImage2.onload = () => {
        gameLoop();
    };
});
