document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Spieler-Konfiguration (PIXELS PER FRAME - geräteunabhängig!)
    const playerConfig = {
        mio: { image: "paddle1.png", name: "Mio", pixelsPerFrame: 4, isAI: false },
        mika: { image: "paddle2.png", name: "Mika", pixelsPerFrame: 4, isAI: false },
        faultier: { image: "faultier.png", name: "Faultier", pixelsPerFrame: 2, isAI: false },
        alien: { image: "alien.png", name: "Alien", pixelsPerFrame: 8, isAI: false },
        roboter: { image: "roboter.png", name: "Roboter", pixelsPerFrame: 5, isAI: true }
    };

    let selectedPlayer1 = "mio";
    let selectedPlayer2 = "mika";
    let player1Image, player2Image;
    
    // Game constants
    const PADDLE_HEIGHT = 80;
    let scaleFactor = 1;
    let paddle1Width = 0, paddle2Width = 0;
    let pixelsPerFrame = 4; // PIXELS PRO FRAME - KONSTANT!
    
    // Game objects
    let paddle1 = { x: 0, y: 0, isLeft: true };
    let paddle2 = { x: 0, y: 0, isLeft: false };
    let ball = { x: 0, y: 0, radius: 0, dx: 0, dy: 0 };
    
    // Game state
    let player1Score = 0;
    let player2Score = 0;
    let roundNumber = 1;
    let gamePaused = false;
    let gameStarted = false;
    let player1Selected = false;
    let player2Selected = false;
    let lastTime = 0;

    // Responsive resize (NUR VISUELLE Skalierung)
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
        
        ball.radius = scaledBallRadius; // NUR VISUELL
    }

    // AI für Roboter (konstante Pixel-Bewegung)
    function updateAI() {
        if (!playerConfig[selectedPlayer2].isAI && !playerConfig[selectedPlayer1].isAI) return;
        
        const scaledPaddleHeight = PADDLE_HEIGHT * scaleFactor;
        const aiPaddle = playerConfig[selectedPlayer2].isAI ? paddle2 : paddle1;
        const targetY = ball.y - scaledPaddleHeight / 2;
        
        const aiSpeed = 3; // PIXELS PER FRAME
        if (aiPaddle.y + scaledPaddleHeight / 2 < targetY) {
            aiPaddle.y += aiSpeed;
        } else if (aiPaddle.y + scaledPaddleHeight / 2 > targetY) {
            aiPaddle.y -= aiSpeed;
        }
        
        aiPaddle.y = Math.max(0, Math.min(canvas.height - scaledPaddleHeight, aiPaddle.y));
    }

    // Spielerauswahl
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
        
        // PIXELS PER FRAME von Spieler 1 (Player1 bestimmt!)
        pixelsPerFrame = playerConfig[selectedPlayer1].pixelsPerFrame;
        
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
