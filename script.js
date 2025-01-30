document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let canvasWidth, canvasHeight;
    function resizeCanvas() {
        if (window.innerWidth > window.innerHeight) {
            // Querformat (Landscape)
            canvasWidth = window.innerWidth * 0.9;
            canvasHeight = window.innerHeight * 0.9;
        } else {
            // Hochformat (Portrait)
            canvasWidth = window.innerWidth * 0.95;
            canvasHeight = window.innerHeight * 0.7;
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        updatePositions();
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initial aufrufen

    // Paddle Eigenschaften
    const paddle1 = { width: 10, height: canvasHeight * 0.2, x: 0, y: canvasHeight / 2 - (canvasHeight * 0.2) / 2 };
    const paddle2 = { width: 10, height: canvasHeight * 0.2, x: canvasWidth - 10, y: canvasHeight / 2 - (canvasHeight * 0.2) / 2 };

    // Ball
    const ball = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        radius: canvasWidth * 0.02,
        dx: 5,
        dy: 5
    };

    function updatePositions() {
        paddle1.height = canvasHeight * 0.2;
        paddle2.height = canvasHeight * 0.2;
        paddle1.y = canvasHeight / 2 - paddle1.height / 2;
        paddle2.y = canvasHeight / 2 - paddle2.height / 2;
        paddle2.x = canvasWidth - paddle2.width;

        ball.radius = canvasWidth * 0.02;
        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
    }

    function drawPaddle(paddle) {
        ctx.fillStyle = "white";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
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
        ctx.moveTo(canvasWidth / 2, 0);
        ctx.lineTo(canvasWidth / 2, canvasHeight);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvasHeight) {
            ball.dy *= -1;
        }

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

        if (ball.x - ball.radius < 0) {
            resetBall();
        } else if (ball.x + ball.radius > canvasWidth) {
            resetBall();
        }
    }

    function resetBall() {
        ball.x = canvasWidth / 2;
        ball.y = canvasHeight / 2;
        ball.dx = canvasWidth * 0.005;
        ball.dy = canvasHeight * 0.005;
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMiddleLine();
        drawPaddle(paddle1);
        drawPaddle(paddle2);
        drawBall();
        moveBall();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
