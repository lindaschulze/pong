document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Seitenverhältnis beibehalten
    const aspectRatio = 3 / 2; // Entspricht dem bisherigen Verhältnis
    function resizeCanvas() {
        let width = window.innerWidth * 0.9;
        let height = width / aspectRatio;
        
        if (height > window.innerHeight * 0.8) {
            height = window.innerHeight * 0.8;
            width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Paddle Eigenschaften
    const paddleHeight = canvas.height * 0.2;
    let paddle1Width, paddle2Width;

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    // Positionen
    const paddle1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2 };
    const paddle2 = { x: canvas.width, y: canvas.height / 2 - paddleHeight / 2 };
    
    paddleImage1.onload = () => {
        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
    };
    paddleImage2.onload = () => {
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;
        paddle2.x = canvas.width - paddle2Width;
    };

    // Ball Eigenschaften
    const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: canvas.width * 0.02, dx: 3, dy: 3 };

    // Touch-Steuerung
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        for (let touch of event.touches) {
            const touchX = touch.clientX - canvas.offsetLeft;
            const touchY = touch.clientY - canvas.offsetTop;
            
            if (touchX < canvas.width / 2) {
                paddle1.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchY - paddleHeight / 2));
            } else {
                paddle2.y = Math.max(0, Math.min(canvas.height - paddleHeight, touchY - paddleHeight / 2));
            }
        }
    });

    function drawPaddle(paddle, image, width) {
        if (width) {
            ctx.drawImage(image, paddle.x, paddle.y, width, paddleHeight);
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
        ctx.setLineDash([10, 10]);
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }

    function moveBall() {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
        }

        if ((ball.x - ball.radius < paddle1.x + paddle1Width && ball.y > paddle1.y && ball.y < paddle1.y + paddleHeight) ||
            (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddleHeight)) {
            ball.dx *= -1;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMiddleLine();
        drawPaddle(paddle1, paddleImage1, paddle1Width);
        drawPaddle(paddle2, paddleImage2, paddle2Width);
        drawBall();
        moveBall();
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
});
