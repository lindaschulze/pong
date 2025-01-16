let selectedPaddle = 'paddle1.png';

function selectPaddle(paddle) {
    selectedPaddle = paddle;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    initializeGame();
}

function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    const paddleWidth = 10;
    const paddleHeight = 100;

    const paddleImageLeft = new Image();
    paddleImageLeft.src = selectedPaddle;

    const paddleImageRight = new Image();
    paddleImageRight.src = 'paddle2.png';

    const paddleLeft = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
    const paddleRight = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };

    function drawPaddle(paddle, image) {
        context.drawImage(image, paddle.x, paddle.y, paddleWidth, paddleHeight);
    }

    function gameLoop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(paddleLeft, paddleImageLeft);
        drawPaddle(paddleRight, paddleImageRight);
        requestAnimationFrame(gameLoop);
    }

    paddleImageLeft.onload = () => {
        paddleImageRight.onload = () => {
            gameLoop();
        };
    };
}
