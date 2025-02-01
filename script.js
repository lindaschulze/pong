document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        const container = document.getElementById("gameContainer");
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        console.log("Canvas resized", canvas.width, canvas.height);
        updateGameElements();
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    let paddle1, paddle2, ball;

    function updateGameElements() {
        const paddleHeight = canvas.height * 0.2;
        const paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
        const paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;

        paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddle1Width, height: paddleHeight, dy: 0 };
        paddle2 = { x: canvas.width - paddle2Width, y: canvas.height / 2 - paddleHeight / 2, width: paddle2Width, height: paddleHeight, dy: 0 };
        ball = { x: canvas.width / 2, y: canvas.height / 2, radius: canvas.width * 0.02, dx: canvas.width * 0.005, dy: canvas.width * 0.005 };
    }

    function drawPaddle(paddle, image) {
        if (image.complete) {
            ctx.drawImage(image, paddle.x, paddle.y, paddle.width, paddle.height);
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    function movePaddles() {
        paddle1.y += paddle1.dy;
        paddle2.y += paddle2.dy;

        paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.height, paddle1.y));
        paddle2.y = Math.max(0, Math.min(canvas.height - paddle2.height, paddle2.y));
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

        if (
            (ball.x - ball.radius < paddle1.x + paddle1.width && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) ||
            (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height)
        ) {
            ball.dx *= -1;
        }

        if (ball.x < 0 || ball.x > canvas.width) {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
        }
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "w") paddle1.dy = -5;
        if (e.key === "s") paddle1.dy = 5;
        if (e.key === "ArrowUp") paddle2.dy = -5;
        if (e.key === "ArrowDown") paddle2.dy = 5;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "w" || e.key === "s") paddle1.dy = 0;
        if (e.key === "ArrowUp" || e.key === "ArrowDown") paddle2.dy = 0;
    });

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        movePaddles();
        moveBall();
        
        drawPaddle(paddle1, paddleImage1);
        drawPaddle(paddle2, paddleImage2);
        drawBall();

        requestAnimationFrame(gameLoop);
    }

    let imagesLoaded = 0;
    function imageLoaded() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            console.log("Both images loaded");
            updateGameElements();
            gameLoop();
        }
    }

    paddleImage1.onload = imageLoaded;
    paddleImage2.onload = imageLoaded;
});
