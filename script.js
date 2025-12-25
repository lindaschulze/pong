document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Spieler-Konfiguration (60FPS, pixelsPerFrame)
    const playerConfig = {
        mio:     { image: "paddle1.png", name: "Mio",     pixelsPerFrame: 5,   isAI: false },
        mika:    { image: "paddle2.png", name: "Mika",    pixelsPerFrame: 5,   isAI: false },
        faultier:{ image: "faultier.png",name: "Faulenzo",pixelsPerFrame: 2,   isAI: false },
        alien:   { image: "alien.png",   name: "Blub",    pixelsPerFrame: 8,   isAI: false },
        roboter: { image: "computer.png",name: "Robo",    pixelsPerFrame: 5,   isAI: true  },
        nugget:  { image: "nugget.png",  name: "Nugget",  pixelsPerFrame: 5,   isAI: false }
    };

    let selectedPlayer1 = "mio";
    let selectedPlayer2 = "mika";
    let player1Image, player2Image;
    
    const PADDLE_HEIGHT = 80;
    let scaleFactor = 1;
    let paddle1Width = 0, paddle2Width = 0;
    let pixelsPerFrame = 5; // Start jetzt schneller
    
    // Hauptball + Extra-Bälle (Nugget)
    let balls = [];
    
    let paddle1 = { x: 0, y: 0, isLeft: true };
    let paddle2 = { x: 0, y: 0, isLeft: false };
    
    // NUGGET COOLDOWN - 1 Sekunde pro Paddle
    let nuggetCooldowns = {
        left: 0,
        right: 0
    };
    
    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;
    let gameStarted = false;
    let player1Selected = false;
    let player2Selected = false;

    // 60 FPS Lock
    let lastFrameTime = 0;
    const FRAME_TIME = 1000 / 60;

    function getSlowestPlayerSpeed() {
        const speed1 = playerConfig[selectedPlayer1].pixelsPerFrame;
        const speed2 = playerConfig[selectedPlayer2].pixelsPerFrame;
        return Math.min(speed1, speed2);
    }

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
        
        paddle1.x = 20 * scaleFactor;
        paddle1.y = canvas.height / 2 - scaledPaddleHeight / 2;
        paddle2.x = canvas.width - (paddle2Width || 60) - 20 * scaleFactor;
        paddle2.y = canvas.height / 2 - scaledPaddleHeight / 2;

        balls.forEach(ball => {
            ball.radius = scaledBallRadius;
        });
    }

    function updateAI() {
        if (!playerConfig[selectedPlayer2].isAI && !playerConfig[selectedPlayer1].isAI) return;
        
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const aiPaddle = playerConfig[selectedPlayer2].isAI ? paddle2 : paddle1;
        const targetY = balls[0]?.y ?? canvas.height / 2;
        
        const aiMoveSpeed = 2.5;
        if (aiPaddle.y + scaledPaddleHeight / 2 < targetY) {
            aiPaddle.y += aiMoveSpeed;
        } else if (aiPaddle.y + scaledPaddleHeight / 2 > targetY) {
            aiPaddle.y -= aiMoveSpeed;
        }
        
        aiPaddle.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, aiPaddle.y));
    }

    function initPlayerSelect() {
        const buttons = document.querySelectorAll("#playerButtons button");
        
        buttons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.stopPropagation();
                const player = button.dataset.player;
                
                if (!player1Selected) {
                    selectedPlayer1 = player;
                    buttons.forEach(b => b.classList.remove("active"));
                    button.classList.add("active");
                    player1Selected = true;
                } else if (!player2Selected) {
                    selectedPlayer2 = player;
                    button.classList.add("active", "player2");
                    player2Selected = true;
                    document.getElementById("startGameButton").textContent = "Los geht's!";
                }
                
                if (player1Selected && player2Selected) {
                    document.getElementById("startGameButton").style.display = "block";
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
        
        pixelsPerFrame = getSlowestPlayerSpeed();
        
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
        setupMainBall();
        
        nuggetCooldowns = { left: 0, right: 0 };
    }

    function setupMainBall() {
        const radius = 10 * scaleFactor;
        balls = [{
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius,
            dx: pixelsPerFrame * (Math.random() > 0.5 ? 1 : -1),
            dy: (pixelsPerFrame * 0.7) * (Math.random() > 0.5 ? 1 : -1),
            isMain: true
        }];
        updateScoreboard();
    }

    function handleInput(event) {
        if (!gameStarted || (playerConfig[selectedPlayer1].isAI && playerConfig[selectedPlayer2].isAI)) return;
        event.preventDefault();
        
        const rect = canvas.getBoundingClientRect();
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        let clientX, clientY;
        
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        const touchX = (clientX - rect.left) / rect.width * canvas.width;
        const touchY = (clientY - rect.top) / rect.height * canvas.height;
        
        if (touchX < canvas.width / 2 && !playerConfig[selectedPlayer1].isAI) {
            paddle1.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
        } else if (touchX >= canvas.width / 2 && !playerConfig[selectedPlayer2].isAI) {
            paddle2.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, touchY - scaledPaddleHeight / 2));
        }
    }

    canvas.addEventListener("touchmove", handleInput, { passive: false });
    canvas.addEventListener("mousemove", handleInput);

    function drawPaddle(paddle, image, width) {
        if (width && image && image.complete) {
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

    function drawBall(ball) {
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

    function canSpawnNuggetBall(side) {
        const now = Date.now();
        return now - nuggetCooldowns[side] >= 1000;
    }

    function spawnNuggetBall(paddle) {
        const side = paddle.isLeft ? 'left' : 'right';
        
        if (!canSpawnNuggetBall(side)) {
            return false;
        }
        
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const radius = 8 * scaleFactor;
        const x = paddle.isLeft ? paddle.x + paddle1Width / 2 : paddle.x + paddle2Width / 2;
        const y = paddle.y + scaledPaddleHeight + radius + 2;

        balls.push({
            x,
            y,
            radius,
            dx: (Math.random() > 0.5 ? 1 : -1) * pixelsPerFrame * 0.8,
            dy: -pixelsPerFrame,
            isMain: false
        });
        
        nuggetCooldowns[side] = Date.now();
        return true;
    }

    function moveBalls() {
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const isNuggetLeft  = selectedPlayer1 === "nugget";
        const isNuggetRight = selectedPlayer2 === "nugget";

        balls.forEach((ball) => {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.dy *= -1;
            }

            let hitLeft = false;
            let hitRight = false;

            if (
                ball.x - ball.radius < paddle1.x + paddle1Width &&
                ball.y > paddle1.y &&
                ball.y < paddle1.y + scaledPaddleHeight
            ) {
                ball.dx *= -1;
                hitLeft = true;
            }

            if (
                ball.x + ball.radius > paddle2.x &&
                ball.y > paddle2.y &&
                ball.y < paddle2.y + scaledPaddleHeight
            ) {
                ball.dx *= -1;
                hitRight = true;
            }

            if (hitLeft && isNuggetLeft) {
                spawnNuggetBall(paddle1);
            }
            if (hitRight && isNuggetRight) {
                spawnNuggetBall(paddle2);
            }

            if (ball.isMain) {
                if (ball.x - ball.radius < 0) {
                    player2Score++;
                    setupMainBall();
                } else if (ball.x + ball.radius > canvas.width) {
                    player1Score++;
                    setupMainBall();
                }
            }
        });

        checkWinner();
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
        // schnellerer Runden-Boost
        pixelsPerFrame = getSlowestPlayerSpeed() + (roundNumber - 1) * 1;
        document.getElementById("winnerOverlay").style.display = "none";
        updateGamePositions();
        setupMainBall();
        nuggetCooldowns = { left: 0, right: 0 };
    }

    document.getElementById("nextRoundButton").addEventListener("click", startNextRound);
    window.addEventListener('resize', resizeCanvas);

    function gameLoop(timestamp) {
        if (timestamp - lastFrameTime < FRAME_TIME) {
            requestAnimationFrame(gameLoop);
            return;
        }
        lastFrameTime = timestamp;

        if (!gameStarted) {
            requestAnimationFrame(gameLoop);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMiddleLine();
        drawPaddle(paddle1, player1Image, paddle1Width);
        drawPaddle(paddle2, player2Image, paddle2Width);
        balls.forEach(drawBall);
        
        if (!gamePaused) {
            updateAI();
            moveBalls();
        }
        requestAnimationFrame(gameLoop);
    }

    // Init
    resizeCanvas();
    initPlayerSelect();
    updateScoreboard();
    requestAnimationFrame(gameLoop);
});