let selectedPaddle = 'paddle1.png';
let ballX = 400;
let ballY = 300;
let ballSpeedX = 5;
let ballSpeedY = 4;
let paddleLeftY = 250;
let paddleRightY = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;

function selectPaddle(paddle) {
    selectedPaddle = paddle;
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    startGame();
}

function startGame() {
    const canvas = document.getElementById('gameCanvas');
    const context = canvas.getContext('2d');

    const paddleLeftImage = new Image();
    paddleLeftImage.src = selectedPaddle;

    const paddleRightImage = new Image();
    paddleRightImage.src = 'paddle2.png';

    function drawRect(x, y, width, height, color) {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }

    function drawBall() {
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(ballX, ballY, BALL_SIZE / 2, 0, Math.PI * 2, true);
        context.fill();
    }

    function drawPaddle(x, y, image) {
        context.drawImage(image, x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
    }

    function moveEverything() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY < 0 || ballY > canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX < 0) {
            if (ballY > paddleLeftY && ballY < paddleLeftY + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
            } else {
                resetBall();
            }
        }

        if (ballX > canvas.width) {
            if (ballY > paddleRightY && ballY < paddleRightY + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;
            } else {
                resetBall();
            }
        }
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function drawEverything() {
        drawRect(0, 0, canvas.width, canvas.height, 'black');
        drawPaddle(0, paddleLeftY, paddleLeftImage);
        drawPaddle(canvas.width - PADDLE_WIDTH, paddleRightY, paddleRightImage);
        drawBall();
    }

    function gameLoop() {
        moveEverything();
        drawEverything();
        requestAnimationFrame(gameLoop);
    }

    paddleLeftImage.onload = () => {
        paddleRightImage.onload = () => {
            gameLoop();
        };
    };
}

window.onload = () => {
    document.addEventListener('mousemove', (evt) => {
        const canvas = document.getElementById('gameCanvas');
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const mouseY = evt.clientY - rect.top - root.scrollTop;
        paddleLeftY = mouseY - PADDLE_HEIGHT / 2;
    });
};
