const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 15;
const paddleHeight = 100;

let leftPaddleY = 250;
let rightPaddleY = 250;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

let ballSpeedX = 5;
let ballSpeedY = 4;

let leftScore = 0;
let rightScore = 0;

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(x, y, r, 0, Math.PI * 2);

    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = "white";

    ctx.font = "40px Arial";

    ctx.fillText(text, x, y);
}

function movePaddles() {

    if (keys["w"] && leftPaddleY > 0) {
        leftPaddleY -= 7;
    }

    if (
        keys["s"] &&
        leftPaddleY < canvas.height - paddleHeight
    ) {
        leftPaddleY += 7;
    }

    if (keys["ArrowUp"] && rightPaddleY > 0) {
        rightPaddleY -= 7;
    }

    if (
        keys["ArrowDown"] &&
        rightPaddleY < canvas.height - paddleHeight
    ) {
        rightPaddleY += 7;
    }
}

function moveBall() {

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= canvas.height) {
        ballSpeedY *= -1;
    }

    if (
        ballX <= 35 &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    if (
        ballX >= canvas.width - 35 &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1;
    }

    if (ballX < 0) {
        rightScore++;
        saveResult();
        resetBall();
    }

    if (ballX > canvas.width) {
        leftScore++;
        saveResult();
        resetBall();
    }
}

function resetBall() {

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    ballSpeedX *= -1;
}

function saveResult() {

    let results =
        JSON.parse(localStorage.getItem("pingpongResults")) || [];

    let winner = "Ничья";

    if (leftScore > rightScore) {
        winner = "Левый";
    }

    if (rightScore > leftScore) {
        winner = "Правый";
    }

    results.push({
        left: leftScore,
        right: rightScore,
        winner: winner
    });

    localStorage.setItem(
        "pingpongResults",
        JSON.stringify(results)
    );
}

function draw() {

    drawRect(
        0,
        0,
        canvas.width,
        canvas.height,
        "#00aa55"
    );

    drawRect(
        20,
        leftPaddleY,
        paddleWidth,
        paddleHeight,
        "white"
    );

    drawRect(
        canvas.width - 35,
        rightPaddleY,
        paddleWidth,
        paddleHeight,
        "white"
    );

    drawCircle(ballX, ballY, 10, "white");

    drawText(leftScore, 250, 50);

    drawText(rightScore, 730, 50);
}

function gameLoop() {

    movePaddles();

    moveBall();

    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();