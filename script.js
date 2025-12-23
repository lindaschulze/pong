document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Spieler-Konfiguration
    const playerConfig = {
        mio: { image: 'paddle1.png', name: 'Mio', ballSpeed: 3 },
        mika: { image: 'paddle2.png', name: 'Mika', ballSpeed: 3 },
        faultier: { image: 'faultier.png', name: 'Faultier', ballSpeed: 1.5 },
        alien: { image: 'alien.png', name: 'Alien', ballSpeed: 6 }
    };

    let selectedPlayer1 = 'mio';
    let selectedPlayer2 = 'mika';
    let player1Image, player2Image;

    // Game constants
    const PADDLE_HEIGHT = 80;
    let scaleFactor = 1;
    let paddle1Width = 0, paddle2Width = 0;

    // Game objects
    let paddle1 = { x: 0, y: 0 };
    let paddle2 = { x: 0, y: 0 };
    let ball = { x: 0, y: 0, radius: 0, dx: 0, dy: 0, speed: 3 };

    let player1Score = 0, player2Score = 0, roundNumber = 1, gamePaused = false;
    let gameStarted = false;

    // Responsive resize
    function resizeCanvas() {
        const maxWidth = 600, maxHeight = 400, aspectRatio = maxWidth / maxHeight;
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
        
        paddle1 = { x: 20 * scaleFactor, y: canvas.height / 2 - scaledPaddleHeight / 2 };
        paddle2 = { x: canvas.width - (paddle2Width || 60) - 20 * scaleFactor, y: canvas.height / 2 - scaledPaddleHeight / 2 };
        ball = { x: canvas.width / 2, y: canvas.height / 2, radius: scaledBallRadius, dx: scaledSpeed, dy: scaledSpeed, speed: scaledSpeed };
    }

    // Spielerauswahl
    function initPlayerSelect() {
        const buttons = document.querySelectorAll('#playerButtons button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const player = button.dataset.player;
                const isPlayer1 = !button.classList.contains('player2');
                
                if (isPlayer1) {
                    selectedPlayer1 = player;
                    buttons.forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                } else {
                    selectedPlayer2 = player;
                    button.classList.add('player2', 'active');
                }
            });
        });

        // Doppeltouch für Player 2
        let player1Selected = false;
        document.getElementById('playerButtons').addEventListener('touchstart', (e) => {
            if (player1Selected) {
                e.target.closest('button').classList.add('player2');
            } else {
                player1Selected = true;
                buttons.forEach(b => b.classList.remove('active', 'player2'));
                e.target.closest('button').classList.add('active');
            }
        });
    }

    function startGame() {
        player1Image = new Image();
        player2Image = new Image();
        player1Image.src = playerConfig[selectedPlayer1].image;
        player2Image.src = playerConfig[selectedPlayer2].image;
        ball.speed = playerConfig[selectedPlayer1].ballSpeed;

        player1Image.onload = () => {
            paddle1Width = (player1Image.width / player1Image.height) * PADDLE_HEIGHT * scaleFactor;
            updateScoreboard();
            document.getElementById('playerSelectOverlay').style.display = 'none';
            gameStarted = true;
            gameLoop();
        };

        player2Image.onload = () => {
            paddle2Width = (player2Image.width / player2Image.height) * PADDLE_HEIGHT * scaleFactor;
            updateGamePositions();
        };

        document.getElementById('player1Name').textContent = `${playerConfig[selectedPlayer1].name}: `;
        document.getElementById('player2Name').textContent = `${playerConfig[selectedPlayer2].name}: `;
    }

    // Controls
    canvas.addEventListener("touchmove", handleInput, { passive: false });
    canvas.addEventListener("mousemove", handleInput);

    function handleInput(event) {
        if (!gameStarted) return;
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
        
        if (touchX < canvas.width / 2) {
            paddle1.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
        } else {
            paddle2.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
        }
    }

    // Draw functions (unverändert)
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

    // Game logic (unverändert)
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
        ball.speed = playerConfig[selectedPlayer1].ballSpeed + (roundNumber - 1) * 0.5;
        updateScoreboard();
        document.getElementById("winnerOverlay").style.display = "none";
        updateGamePositions();
    }

    document.getElementById("nextRoundButton").addEventListener("click", startNextRound);

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    initPlayerSelect();
    resizeCanvas();
    updateScoreboard();

    // Spiel startet nach Auswahl (Touch/Click auf Canvas oder Double-Tap)
    canvas.addEventListener('click', startGame);
    canvas.addEventListener('touchend', startGame);

    function gameLoop() {
        if (!gameStarted) return;
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
});
