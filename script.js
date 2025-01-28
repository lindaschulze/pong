document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas dimensions
    const canvasRatio = 3 / 2; // 3:2 aspect ratio
    function resizeCanvas() {
        const width = Math.min(window.innerWidth * 0.9, 600);
        canvas.width = width;
        canvas.height = width / canvasRatio;

        // Update paddle and ball positions proportionally
        const paddleHeight = canvas.height * 0.2;
        paddle1.height = paddle2.height = paddleHeight;
        paddle1.width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
        paddle2.width = (paddleImage2.width / paddleImage2.height) * paddleHeight;

        paddle1.y = Math.min(paddle1.y, canvas.height - paddle1.height);
        paddle2.y = Math.min(paddle2.y, canvas.height - paddle2.height);
        paddle2.x = canvas.width - paddle2.width;

        ball.radius = canvas.width * 0.02;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Paddle properties
    const paddle1 = { x: 0, y: 0, width: 0, height: 0 };
    const paddle2 = { x: 0, y: 0, width: 0, height: 0 };

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    paddleImage1.onload = () => {
        resizeCanvas(); // Ensure paddles are resized after image load
    };
    paddleImage2.onload = () => {
        resizeCanvas();
    };

    // Ball properties
    const ball = {
        x: 0,
        y: 0,
        radius: 0,
        dx: 5,
        dy: 5,
    };

    // Scores
    let player1Score = 0;
    let player2Score = 0;

    // Draw paddles
    function drawPaddle(paddle, image) {
        ctx.drawImage(image, paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // Draw ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    // Draw middle line
    function drawMiddleLine() {
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }

    // Move ball
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off top and bottom walls
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

        // Bounce off paddles
        if (
            (ball.x - ball.radius < paddle1.x + paddle1.width &&
                ball.y > paddle1.y &&
                ball.y < paddle1.y + paddle1.height) ||
            (ball.x + ball.radius > paddle2.x &&
                ball.y > paddle2.y &&
                ball.y < paddle2.y + paddle2.height)
        ) {
            ball.dx *= -1;
        }

        // Scoring
        if (ball.x - ball.radius < 0) {
            player2Score++;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            player1Score++;
            resetBall();
        }
    }

    // Reset ball
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = canvas.width * 0.005;
        ball.dy = canvas.width * 0.005;
    }

    // Update scoreboard
    function updateScoreboard() {
        document.getElementById("player1Score").textContent = player1Score;
        document.getElementById("player2Score").textContent = player2Score;
    }

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawMiddleLine();
        drawPaddle(paddle1, paddleImage1);
        drawPaddle(paddle2, paddleImage2);
        drawBall();
        moveBall();

        requestAnimationFrame(gameLoop);
    }

    // Initialize game
    resetBall();
    updateScoreboard();
    gameLoop();
});
