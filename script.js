document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Responsive canvas setup
    const setCanvasSize = () => {
        canvas.width = window.innerWidth * 0.9; // 90% of screen width
        canvas.height = window.innerHeight * 0.6; // 60% of screen height
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Paddle properties
    const paddleHeight = canvas.height * 0.2;
    let paddle1Width, paddle2Width;

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    paddleImage1.onload = () => {
        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
    };
    paddleImage2.onload = () => {
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;
        paddle2.x = canvas.width - paddle2Width;
    };

    // Paddle positions
    const paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
    const paddle2 = { x: canvas.width, y: canvas.height / 2 - paddleHeight / 2 };

    // Ball properties
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width * 0.015,
        dx: 3,
        dy: 3,
        speed: 3,
    };

    // Scores and rounds
    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;

    // Touch controls
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        for (let touch of event.touches) {
            const touchX = touch.clientX - canvas.offsetLeft;
            const touchY = touch.clientY - canvas.offsetTop;

            if (touchX < canvas.width / 2) {
                paddle1.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchY - paddleHeight / 2));
            } else {
                paddle2.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchY - paddleHeight / 2));
            }
        }
    });

    // Draw paddles
    function drawPaddle(paddle, image, width) {
        if (width) {
            ctx.drawImage(image, paddle.x, paddle.y, width, paddleHeight);
        }
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

        // Bounce off walls
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
        ball.dx = ball.speed * (ball.dx > 0 ? 1 : -1);
        ball.dy = ball.speed * (ball.dy > 0 ? 1 : -1);
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
        ball.speed += 0.5;
        updateScoreboard();

        const overlay = document.getElementById("winnerOverlay");
        overlay.style.display = "none";
    }

    document.getElementById("nextRoundButton").addEventListener("click", startNextRound);

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

    updateScoreboard();
    gameLoop();
});
