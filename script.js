document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Fixed aspect ratio (4:3)
    const aspectRatio = 4 / 3;
    let canvasWidth, canvasHeight;

    // Paddle and Ball properties
    const paddleHeightRatio = 0.2; // 20% of canvas height
    const ballRadiusRatio = 0.015; // 1.5% of canvas width
    let paddle1Width, paddle2Width, paddleHeight, ballRadius;

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    const paddle1 = { x: 0, y: 0, width: 0, height: 0 };
    const paddle2 = { x: 0, y: 0, width: 0, height: 0 };
    const ball = { x: 0, y: 0, radius: 0, dx: 3, dy: 3, speed: 3 };

    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;

    // Function to resize canvas and reset game elements
    const setCanvasSize = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (windowWidth / windowHeight > aspectRatio) {
            canvasHeight = windowHeight * 0.9; // 90% of viewport height
            canvasWidth = canvasHeight * aspectRatio;
        } else {
            canvasWidth = windowWidth * 0.9; // 90% of viewport width
            canvasHeight = canvasWidth / aspectRatio;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Paddle dimensions
        paddleHeight = canvasHeight * paddleHeightRatio;
        paddle1.height = paddle2.height = paddleHeight;

        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;

        paddle1.width = paddle1Width;
        paddle2.width = paddle2Width;

        paddle1.x = 0;
        paddle1.y = canvasHeight / 2 - paddle1.height / 2;

        paddle2.x = canvasWidth - paddle2Width;
        paddle2.y = canvasHeight / 2 - paddle2.height / 2;

        // Ball dimensions
        ballRadius = canvasWidth * ballRadiusRatio;
        ball.radius = ballRadius;

        resetBall();
    };

    const resetBall = () => {
        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
        ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    };

    window.addEventListener("resize", setCanvasSize);

    // Draw paddles
    const drawPaddle = (paddle, image) => {
        ctx.drawImage(image, paddle.x, paddle.y, paddle.width, paddle.height);
    };

    // Draw ball
    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    };

    // Draw middle line
    const drawMiddleLine = () => {
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(canvasWidth / 2, 0);
        ctx.lineTo(canvasWidth / 2, canvasHeight);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    };

    // Ball movement
    const moveBall = () => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off top and bottom walls
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
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
            updateScoreboard();
            resetBall();
        } else if (ball.x + ball.radius > canvasWidth) {
            player1Score++;
            updateScoreboard();
            resetBall();
        }

        checkWinner();
    };

    // Check for winner
    const checkWinner = () => {
        if (player1Score >= 5 || player2Score >= 5) {
            gamePaused = true;
            const winner = player1Score >= 5 ? "Mio" : "Mika";
            showWinnerOverlay(winner);
        }
    };

    // Show winner overlay
    const showWinnerOverlay = (winner) => {
        const overlay = document.getElementById("winnerOverlay");
        const winnerText = document.getElementById("winnerText");

        winnerText.textContent = `${winner} gewinnt diese Runde!`;
        overlay.style.display = "flex";
    };

    document.getElementById("nextRoundButton").addEventListener("click", () => {
        gamePaused = false;
        player1Score = 0;
        player2Score = 0;
        roundNumber++;
        ball.speed += 0.5;
        resetBall();

        const overlay = document.getElementById("winnerOverlay");
        overlay.style.display = "none";
    });

    // Touch controls
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        for (let touch of event.touches) {
            const touchX = touch.clientX - canvas.offsetLeft;
            const touchY = touch.clientY - canvas.offsetTop;

            if (touchX < canvasWidth / 2) {
                paddle1.y = Math.max(0, Math.min(canvasHeight - paddle1.height, touchY - paddle1.height / 2));
            } else {
                paddle2.y = Math.max(0, Math.min(canvasHeight - paddle2.height, touchY - paddle2.height / 2));
            }
        }
    });

    // Update scoreboard
    const updateScoreboard = () => {
        document.getElementById("player1Score").textContent = player1Score;
        document.getElementById("player2Score").textContent = player2Score;
    };

    // Main game loop
    const gameLoop = () => {
        if (!gamePaused) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            drawMiddleLine();
            drawPaddle(paddle1, paddleImage1);
            drawPaddle(paddle2, paddleImage2);
            drawBall();
            moveBall();
        }
        requestAnimationFrame(gameLoop);
    };

    // Initialize
    setCanvasSize();
    updateScoreboard();
    gameLoop();
});
