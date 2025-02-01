document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Canvas dimensions
    const canvasRatio = 3 / 2; // 3:2 aspect ratio
    function resizeCanvas() {
        const width = Math.min(window.innerWidth * 0.9, 600);
        canvas.width = width;
        canvas.height = width / canvasRatio;

        // Adjust paddle and ball sizes after resizing
        adjustPaddleAndBallSizes();
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Paddle properties
    let paddleHeight, paddle1Width, paddle2Width;

    const paddleImage1 = new Image();
    const paddleImage2 = new Image();
    paddleImage1.src = "paddle1.png";
    paddleImage2.src = "paddle2.png";

    // Load images to calculate proportional widths
    paddleImage1.onload = () => {
        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
    };
    paddleImage2.onload = () => {
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;
        paddle2.x = canvas.width - paddle2Width; // Adjust right paddle position
    };

    // Paddle positions
    const paddle1 = { x: 0, y: 0 };
    const paddle2 = { x: canvas.width, y: 0 };

    // Ball properties
    const ball = { x: 0, y: 0, radius: 0, dx: 0, dy: 0 };

    function adjustPaddleAndBallSizes() {
        paddleHeight = canvas.height * 0.2; // 20% of canvas height
        paddle1Width = (paddleImage1.width / paddleImage1.height) * paddleHeight;
        paddle2Width = (paddleImage2.width / paddleImage2.height) * paddleHeight;

        paddle1.y = canvas.height / 2 - paddleHeight / 2;
        paddle2.y = canvas.height / 2 - paddleHeight / 2;

        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.radius = canvas.width * 0.02; // 2% of canvas width
        ball.dx = canvas.width * 0.005;
        ball.dy = canvas.width * 0.005;
    }

    // Touch controls
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

    // Rest of the game code remains unchanged
    // ...
});
