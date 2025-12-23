document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Game constants (scaled)
    const PADDLE_HEIGHT = 80;
    let scaleFactor = 1;
    let paddle1Width = 0, paddle2Width = 0;

    // Load paddle images
    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    // Game objects
    let paddle1 = { x: 0, y: 0 };
    let paddle2 = { x: 0, y: 0 };
    let ball = { x: 0, y: 0, radius: 0, dx: 0, dy: 0, speed: 3 };

    // Scores and rounds
    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;

    // Responsive resize function
    function resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const maxWidth = 600;
        const maxHeight = 400;
        const aspectRatio = maxWidth / maxHeight;
        
        let newWidth = Math.min(window.innerWidth * 0.95, maxWidth);
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > window.innerHeight * 0.8) {
            newHeight = window.innerHeight * 0.8;
            newWidth = newHeight * aspectRatio;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        scaleFactor = newWidth / maxWidth;
        
        // Update game objects with scaled values
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const scaledBallRadius = 10 * scaleFactor;
        const scaledSpeed = 3 * scaleFactor;
        
        paddle1 = { 
            x: 20 * scaleFactor, 
            y: canvas.height / 2 - scaledPaddleHeight / 2 
        };
        paddle2 = { 
            x: canvas.width - (paddle2Width || 60) - 20 * scaleFactor, 
            y: canvas.height / 2 - scaledPaddleHeight / 2 
        };
        ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: scaledBallRadius,
            dx: scaledSpeed,
            dy: scaledSpeed,
            speed: scaledSpeed
        };
    }

    // Image load handlers
    paddleImage1.onload = () => {
        paddle1Width = (paddleImage1.width / paddleImage1.height) * PADDLE_HEIGHT * scaleFactor;
        resizeCanvas();
    };
    paddleImage2.onload = () => {
        paddle2Width = (paddleImage2.width / paddleImage2.height) * PADDLE_HEIGHT * scaleFactor;
        resizeCanvas();
    };

    // Touch controls (improved for mobile)
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        
        for (let touch of event.changedTouches) {
            const touchX = (touch.clientX - rect.left) / rect.width * canvas.width;
            const touchY = (touch.clientY - rect.top) / rect.height * canvas.height;
            
            if (touchX < canvas.width / 2) {
                paddle1.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
            } else {
                paddle2.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
            }
        }
    }, { passive: false });

    // Mouse controls for desktop
    canvas.addEventListener("mousemove", (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const mouseX = (event.clientX - rect.left) / rect.width * canvas.width;
        const mouseY = (event.clientY - rect.top) / rect.height * canvas.height;
        
        if (mouseX < canvas.width / 2) {
            paddle1.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, mouseY - scaledPaddleHeight / 2));
        } else {
            paddle2.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, mouseY - scaledPaddleHeight / 2));
        }
    });

    // Draw functions (scaled)
    function drawPaddle(paddle, image, width) {
        if (width && image.complete) {
            ctx.drawImage(image, paddle.x, paddle.y, width, PADDLE_HEIGHT * scaleFactor);
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
        ctx.setLineDash([10 * scaleFactor, 10 * scaleFactor]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2 * scaleFactor;
        ctx.stroke();
        ctx.closePath();
    }

    // Game logic
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;

        // Wall bounce
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

        // Paddle collision
        if (
            (ball.x - ball.radius < paddle1.x + paddle1Width &&
             ball.y > paddle1.y &&
             ball.y < paddle1.y + scaledPaddleHeight) ||
            (ball.x + ball.radius > paddle2.x &&
             ball.y > paddle2.y &&
             ball.y < paddle2.y + scaledPaddleHeight)
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

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ball.speed * (ball.dx > 0 ? 1 : -1);
        ball.dy = ball.speed * (ball.dy > 0 ? 1 : -1);
        updateScoreboard();
    }

    function updateScoreboard() {
        document.getElementById("player1Score").textContent = player1Score;
        document.getElementById("player2Score").textContent = player2Score;
    }

    function checkWinner() {
        if (player1Score >= 5 || player2Score >= 5) {
            gamePaused = true;
            const winner = player1Score >= 5 ? "Mio" : "Mika";
            const winnerImage = player1Score >= 5 ? paddleImage1 : paddleImage2;
            showWinnerOverlay(winner, winnerImage);
        }
    }

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

    function startNextRound() {
        gamePaused = false;
        player1Score = 0;
        player2Score = 0;
        roundNumber++;
        ball.speed += 0.5 * scaleFactor;
        updateScoreboard();
        document.getElementById("winnerOverlay").style.display = "none";
        resizeCanvas();
    }

    document.getElementById("nextRoundButton").addEventListener("click", startNextRound);

    // Resize listener
    window.addEventListener('resize', resizeCanvas);

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMiddleLine();
        drawPaddle(paddle1, paddleImage1, paddle1Width);
        drawPaddle(paddle2, paddleImage2, paddle2Width);
        drawBall();
        
        if (!gamePaused) {
            moveBall();
        }
        requestAnimationFrame(gameLoop);
    }

    // Initialize
    resizeCanvas();
    updateScoreboard();
    gameLoop();
});
