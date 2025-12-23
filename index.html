document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Spieler-Konfiguration
    const playerConfig = {
        mio: { image: "paddle1.png", name: "Mio", ballSpeed: 3 },
        mika: { image: "paddle2.png", name: "Mika", ballSpeed: 3 },
        faultier: { image: "faultier.png", name: "Faultier", ballSpeed: 1.5 },
        alien: { image: "alien.png", name: "Alien", ballSpeed: 6 },
        computer: { image: "computer.png", name: "Computer", ballSpeed: 3, isAI: true }
    };

    let selectedPlayer1 = "mio";
    let selectedPlayer2 = "mika";
    let player1Image, player2Image;
    let isPlayer2AI = false;
    
    // Game constants
    const PADDLE_HEIGHT = 80;
    let scaleFactor = 1;
    let paddle1Width = 0, paddle2Width = 0;
    
    // Game objects
    let paddle1 = { x: 0, y: 0, isLeft: true };
    let paddle2 = { x: 0, y: 0, isLeft: false };
    let ball = { x: 0, y: 0, radius: 0, dx: 0, dy: 0, speed: 3 };
    
    // Game state
    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;
    let gameStarted = false;
    let player1Selected = false;

    // Responsive resize
    function resizeCanvas() {
        const maxWidth = 600, maxHeight = 400;
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
        updateGamePositions();
    }

    function updateGamePositions() {
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const scaledBallRadius = 10 * scaleFactor;
        const scaledSpeed = ball.speed * scaleFactor;
        
        paddle1.x = 20 * scaleFactor;
        paddle1.y = canvas.height / 2 - scaledPaddleHeight / 2;
        paddle2.x = canvas.width - (paddle2Width || 60) - 20 * scaleFactor;
        paddle2.y = canvas.height / 2 - scaledPaddleHeight / 2;
        
        if (!gameStarted) {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.radius = scaledBallRadius;
            ball.dx = scaledSpeed;
            ball.dy = scaledSpeed;
        }
    }

    // COMPUTER AI
    function updateAI() {
        if (!isPlayer2AI || gamePaused) return;
        
        const centerPaddle = paddle2.y + (PADDLE_HEIGHT * scaleFactor) / 2;
        const centerBall = ball.y;
        const paddleSpeed = 4 * scaleFactor;
        
        if (centerPaddle < centerBall - 10) {
            paddle2.y += paddleSpeed;
        } else if (centerPaddle > centerBall + 10) {
            paddle2.y -= paddleSpeed;
        }
        
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        paddle2.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, paddle2.y));
    }

    // Spielerauswahl
    function initPlayerSelect() {
        const buttons = document.querySelectorAll("#playerButtons button");
        let player2Selected = false;
        
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const player = button.dataset.player;
                
                if (!player1Selected) {
                    selectedPlayer1 = player;
                    buttons.forEach(b => b.classList.remove("active"));
                    button.classList.add("active");
                    player1Selected = true;
                    document.getElementById("startGameButton").style.display = "block";
                } else if (!player2Selected) {
                    selectedPlayer2 = player;
                    button.classList.add("active", "player2");
                    player2Selected = true;
                    isPlayer2AI = playerConfig[player].isAI || false;
                    document.getElementById("startGameButton").textContent = "Start!";
                }
            });
        });

        document.getElementById("startGameButton").addEventListener("click", startGame);
    }

    function startGame() {
        player1Image = new Image();
        player2Image = new Image();
        player1Image.src = playerConfig[selectedPlayer1].image;
        player2Image.src = playerConfig[selectedPlayer2].image;
        ball.speed = playerConfig[selectedPlayer1].ballSpeed;
        
        player1Image.onload = () => {
            paddle1Width = (player1Image.width / player1Image.height) * PADDLE_HEIGHT * scaleFactor;
            updateGamePositions();
            updateScoreboard();
        };
        
        player2Image.onload = () => {
            paddle2Width = (player2Image.width / player2Image.height) * PADDLE_HEIGHT * scaleFactor;
            updateGamePositions();
        };

        document.getElementById("player1Name").textContent = playerConfig[selectedPlayer1].name;
        document.getElementById("player2Name").textContent = playerConfig[selectedPlayer2].name;
        document.getElementById("playerSelectOverlay").style.display = "none";
        gameStarted = true;
    }

    // Input handling
    function handleInput(event) {
        if (!gameStarted || isPlayer2AI) return;
        event.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        let clientX, clientY;
        
        if (event.touches) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        const touchX = (clientX - rect.left) / rect.width * canvas.width;
        const touchY = (clientY - rect.top) / rect.height * canvas.height;
        
        paddle1.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
    }

    canvas.addEventListener("touchmove", handleInput, { passive: false });
    canvas.addEventListener("mousemove", handleInput);

    // Draw functions
    function drawPaddle(paddle, image, width) {
        if (width && image.complete) {
            ctx.save();
            if (paddle.isLeft) {
                ctx.scale(-1, 1);
                ctx.drawImage(image, -paddle.x - width, paddle.y, width, PADDLE_HEIGHT * scaleFactor);
            } else {
                ctx.drawImage(image, paddle.x, paddle.y, width, PADDLE_HEIGHT * scaleFactor);
            }
            ctx.restore();
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

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

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
            const winner = player1Score >= 5 ? playerConfig[selectedPlayer1].name : playerConfig[selectedPlayer2].name;
            const winnerImage = player1Score >= 5 ? player1Image : player2Image;
            showWinnerOverlay(winner, winnerImage);
        }
    }

    function showWinnerOverlay(winner, winnerImage) {
        const overlay = document.getElementById("winnerOverlay");
        const winnerText = document.getElementById("winnerText");
        const winnerImg = document.getElementById("winnerImage");
        const roundText = document.getElementById("roundText");

        winnerText.textContent = `${winner} gewinnt!`;
        winnerImg.src = winnerImage.src;
        roundText.textContent = `Runde ${roundNumber + 1}`;
        overlay.style.display = "flex";
    }

    function startNextRound() {
        gamePaused = false;
        player1Score = 0;
        player2Score = 0;
        roundNumber++;
        ball.speed = playerConfig[selectedPlayer1].ballSpeed + (roundNumber - 1) * 0.5;
        updateScoreboard();
        document.getElementById("winnerOverlay").style.display = "none";
        updateGamePositions();
    }

    document.getElementById("nextRoundButton").addEventListener("click", startNextRound);

    // Event listeners
    window.addEventListener('resize', resizeCanvas);

    // Initialize
    resizeCanvas();
    initPlayerSelect();
    updateScoreboard();

    function gameLoop() {
        if (!gameStarted) {
            requestAnimationFrame(gameLoop);
            return;
        }
        
        updateAI();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMiddleLine();
        drawPaddle(paddle1, player1Image, paddle1Width);
        drawPaddle(paddle2, player2Image, paddle2Width);
        drawBall();
        
        if (!gamePaused) {
            moveBall();
        }
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
});
