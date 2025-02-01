document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        const container = document.getElementById("gameContainer");
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        console.log("Canvas resized", canvas.width, canvas.height);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const paddle1 = { x: 10, y: 10, width: 10, height: 100 };
    const paddle2 = { x: canvas.width - 20, y: 10, width: 10, height: 100 };
    const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 5 };

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

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawPaddle(paddle1);
        drawPaddle(paddle2);
        drawBall();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});

