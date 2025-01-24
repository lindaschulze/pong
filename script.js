document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const paddleHeight = 100;
    const paddleWidth = 10; // Höhe fix, Breite wird dynamisch angepasst
    const paddleAspectRatio = 1; // Standardverhältnis (wird dynamisch aktualisiert)

    // Bilder der Paddle
    const paddleImage1 = new Image();
    paddleImage1.src = "paddle1.png";

    const paddleImage2 = new Image();
    paddleImage2.src = "paddle2.png";

    // Dynamische Breite basierend auf Bild
    paddleImage1.onload = () => (paddleAspectRatio = paddleImage1.width / paddleImage1.height);
    paddleImage2.onload = () => (paddleAspectRatio = paddleImage2.width / paddleImage2.height);

    // Paddle-Positionen
    const paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
    const paddle2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };

    // Ball
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 2,
        dy: 2,
    };

    // Key States
    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };

    document.addEventListener("keydown", (event) => {
        if (event.key in keys) keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
        if (event.key in keys) keys[event.key] = false;
    });

    // Spielfeld zeichnen
    function drawField() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Mittellinie
        ctx.strokeStyle = "white";
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Paddle zeichnen
    function drawPaddle(paddle, image) {
        const paddleWidthDynamic = paddleHeight * paddleAspectRatio; // Breite proportional zur Höhe
        ctx.drawImage(image, paddle.x, paddle.y, paddleWidthDynamic, paddleHeight);
    }

    // Ball zeichnen
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    // Paddle bewegen
    function movePaddles() {
        if (keys.w && paddle1.y > 0) paddle1.y -= 5;
        if (keys.s && paddle1.y < canvas.height - paddleHeight) paddle1.y += 5;
        if (keys.ArrowUp && paddle2.y > 0) paddle2.y -= 5;
        if (keys.ArrowDown && paddle2.y < canvas.height - paddleHeight) paddle2.y += 5;
    }

    // Ball bewegen
    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) ball.dy *= -1;

        if (
            (ball.x - ball.radius < paddle1.x + paddleWidth &&
                ball.y > paddle1.y &&
                ball.y < paddle1.y + paddleHeight) ||
            (ball.x + ball.radius > paddle2.x &&
                ball.y > paddle2.y &&
                ball.y < paddle2.y + paddleHeight)
        ) {
            ball.dx *= -1;
        }

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx *= -1;
        }
    }

    // Spielschleife
    function gameLoop() {
        drawField();
        movePaddles();
        moveBall();

        drawPaddle(paddle1, paddleImage1);
        drawPaddle(paddle2, paddleImage2);
        drawBall();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
