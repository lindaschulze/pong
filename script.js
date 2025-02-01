document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas dimensions
    const canvasRatio = 3 / 2; // 3:2 aspect ratio
    function resizeCanvas() {
        const container = document.getElementById("gameContainer");
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        updateGameElements();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Paddle properties
    let paddleHeight, paddle1Width, paddle2Width;

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    // Paddle positions
    const paddle1 = { x: 0, y: 0 };
    const paddle2 = { x: 0, y: 0 };

    // Ball properties
    const ball = {
        x: 0,
        y: 0,
        radius: 0,
        dx: 0,
        dy: 0,
    };

    // Scores and rounds
    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;

    // Game state
    let gamePaused = false;

    function updateGameElements() {
        paddleHeight = canvas.height * 0.2;
        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;

        paddle1.x = 0;
        paddle2.x = canvas.width - paddle2Width;
        paddle1.y = paddle2.y = canvas.height / 2 - paddleHeight / 2;

        ball.radius = canvas.width * 0.02;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = canvas.width * 0.005;
        ball.dy = canvas.width * 0.005;
    }

    // Touch controls
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        const canvasRect = canvas.getBoundingClientRect();
        for (let touch of event.touches) {
            const touchX = touch.clientX - canvasRect.left;
            const touchY = touch.clientY - canvasRect.top;

            if (touchX < canvas.width / 2) {
                paddle1.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchY - paddleHeight / 2));
            } else {
                paddle2.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchY - paddleHeight / 2));
            }
        }
    }, { passive: false });

    // Draw functions
    function drawPaddle(paddle, image, width) {
        if (width) {
            ctx.drawImage(image, paddle.x, paddle.y, width, paddleHeight);
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

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
            (ball.x - ball.radius < paddle1.x + paddle1Width &&
                ball.y > paddle1.y &&
                ball.y < paddle1.y + paddleHeight) ||
            (ball.x + ball.radius > paddle2.x &&
                ball.y > paddle2.y &&
                ball.y < paddle2.y + paddleHeight)
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

        checkWinner();
    }

    // Reset ball
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = Math.abs(ball.dx) * (ball.dx > 0 ? 1 : -1);
        ball.dy = Math.abs(ball.dy) * (ball.dy > 0 ? 1 : -1);
        updateScoreboard();
    }

    // Update scoreboard
    function updateScoreboard() {
        document.getElementById("player1Score").textContent = player1Score;
        document.getElementById("player2Score").textContent = player2Score;
    }

    // Check for round winner
    function checkWinner() {
        if (player1Score >= 5 || player2Score >= 5) {
            gamePaused = true;
            const winner = player1Score >= 5 ? "Mio" : "Mika";
            const winnerImage = player1Score >= 5 ? paddleImage1 : paddleImage2;

            showWinnerOverlay(winner, winnerImage);
        }
    }

    // Show winner overlay
    function showWinnerOverlay(winner, winnerImage) {
        const overlay = document.getElementById("winnerOverlay");
        const winnerText = document.getElementById("winnerText");
        const winnerImg = document.getElementById("winnerImage");
        const roundText = document.getElementById("roundText");

        winnerText.textContent = `${winner} gewinnt diese Runde!`;
        winnerImg.src = winnerImage.src;
        roundText.textContent = `Nächste Runde: ${roundNumber + 1}`;

        overlay.style.display = "flex";
    }

    // Start next round
    function startNextRound() {
        gamePaused = false;
        player1Score = 0;
        player2Score = 0;
        roundNumber++;
        ball.dx *= 1.1; // Increase speed slightly
        ball.dy *= 1.1;
        updateScoreboard();

        const overlay = document.getElementById("winnerOverlay");
        overlay.style.display = "none";
    }

    // Event listener for next round button
    document.getElementById("nextRoundButton").addEventListener("click", startNextRound);

    // Game loop
    function gameLoop() {
        if (!gamePaused) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMiddleLine();

            drawPaddle(paddle1, paddleImage1, paddle1Width);
            drawPaddle(paddle2, paddleImage2, paddle2Width);

            drawBall();
            moveBall();
        }
        requestAnimationFrame(gameLoop);
    }

    // Initialize game
    paddleImage2.onload = () => {
        updateGameElements();
        updateScoreboard();
        gameLoop();
    };
});
