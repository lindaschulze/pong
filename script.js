document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        const aspectRatio = 3 / 2; // Seitenverhältnis 600x400
        let width = window.innerWidth * 0.9;
        let height = width / aspectRatio;

        if (height > window.innerHeight * 0.9) {
            height = window.innerHeight * 0.9;
            width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const paddleHeight = canvas.height * 0.2;
    let paddle1Width, paddle2Width;

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    const paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
    const paddle2 = { x: canvas.width, y: canvas.height / 2 - paddleHeight / 2 };

    paddleImage1.onload = () => {
        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
    };
    paddleImage2.onload = () => {
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;
        paddle2.x = canvas.width - paddle2Width;
    };

    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width * 0.02,
        dx: canvas.width * 0.005,
        dy: canvas.height * 0.005,
        speed: canvas.width * 0.005,
    };

    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

        if (
            (ball.x - ball.radius < paddle1.x + paddle1Width &&
                ball.y > paddle1.y &&
                ball.y < paddle1.y + paddleHeight) ||
            (ball.x + ball.radius > paddle2.x &&
                ball.y > paddle2.y &&
                ball.y < paddle2.y + paddleHeight)
        ) {
            ball.dx *= -1;
        }

        if (ball.x - ball.radius < 0) {
            player2Score++;
            updateScoreboard();
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            player1Score++;
            updateScoreboard();
            resetBall();
        }
    }

    function updateScoreboard() {
        document.getElementById("player1Score").textContent = player1Score;
        document.getElementById("player2Score").textContent = player2Score;
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width / 2 - 1, 0, 2, canvas.height);
        ctx.drawImage(paddleImage1, paddle1.x, paddle1.y, paddle1Width, paddleHeight);
        ctx.drawImage(paddleImage2, paddle2.x, paddle2.y, paddle2Width, paddleHeight);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    function gameLoop() {
        if (!gamePaused) {
            moveBall();
            draw();
        }
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
