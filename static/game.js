// ===== KONSTANTES =====

// Spēles laukums
const canvas = document.getElementById("gameCanvas");
let ctx;

// Raketītes izmērs
const paddleWidth = 15;
const paddleHeight = 75;

// Raketītes Y pozīcijas
let leftPaddleY;
let rightPaddleY;

// Punkti
let leftScore = 0;
let rightScore = 0;

// Spēles stāvoklis
let gameOver = false;
let winner = "";

// Bumbas ātrums
const speedIncrease = 1.05;
const maxBallSpeed = 18;

// Spēlētāju vārdi
let leftPlayerName = "";
let rightPlayerName = "";

// Nospiedto taustiņu stāvokļi
let keys = {};

// Skaņa triecienam
const hitSound = new Audio();
hitSound.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==";
hitSound.volume = 0.7;

// ===== NOTIKUMI =====

// Klikš uz pogas rezultātiem
canvas.addEventListener("click", (e) => {
    if (!gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Pogas zona
    const btnY = canvas.height / 2 + 90;
    const btnX = canvas.width / 2;
    const btnWidth = 200;
    const btnHeight = 40;

    // Pārbauda klikšķi pogā
    if (x > btnX - btnWidth / 2 && x < btnX + btnWidth / 2 &&
        y > btnY - btnHeight / 2 && y < btnY + btnHeight / 2) {
        window.location.href = "/results";
    }
});

// Taustiņš uz leju
window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

// Taustiņš augšā
window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// ===== BUMBA =====

let ballX;
let ballY;

let ballSpeedX;
let ballSpeedY;

// ===== SPĒLES FUNKCIJAS =====

// Atjauno bumbu centrā
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    // Nejauša virziena izvēle
    let direction = Math.random() > 0.5 ? 1 : -1;
    ballSpeedX = 5 * direction;

    // Nejaušs leņķis
    ballSpeedY = Math.random() * 4 - 2;
}

// Sāk spēli
function startGame() {
    const leftInput = document.getElementById("leftPlayerName").value.trim();
    const rightInput = document.getElementById("rightPlayerName").value.trim();

    // Pārbauda vārdus
    if (!leftInput || !rightInput) {
        alert("Lūdzu, ievadi abu spēlētāju vārdus!");
        return;
    }

    leftPlayerName = leftInput;
    rightPlayerName = rightInput;

    //canvas un raketes
    ctx = canvas.getContext("2d");
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;

    // Atjauno bumbu
    resetBall();

    // Slēpj formu, rāda spēli
    document.getElementById("nameForm").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    // Fokusē canvas
    canvas.focus();
    gameLoop();
}

// ===== SKAŅA =====

// Atskaņo trieciena skaņu
function playHitSound() {
    try {
        hitSound.currentTime = 0;
        hitSound.play().catch(err => console.log("Skaņa neatskanēja:", err));
    } catch (e) {
        console.log("Skaņas kļūda:", e);
    }
}

// ===== ZĪMĒŠANA =====

//taisnstūris
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// aplis
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

// Zīmē tekstu
function drawText(text, x, y) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText(text, x, y);
}

// ===== RAKETES =====

// Pārvieto raketes
function movePaddles() {
    if (keys["KeyW"] && leftPaddleY > 0) {
        leftPaddleY -= 7;
    }
    if (keys["KeyS"] && leftPaddleY < canvas.height - paddleHeight) {
        leftPaddleY += 7;
    }

    if (keys["ArrowUp"] && rightPaddleY > 0) {
        rightPaddleY -= 7;
    }
    if (keys["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight) {
        rightPaddleY += 7;
    }
}

// ===== BUMBA =====

// Pārvieto bumbu un pārbauda sadursmes
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 10 || ballY >= canvas.height - 10) {
        ballSpeedY *= -1;
    }

    if (
        ballX <= 35 &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1 * speedIncrease;
        ballSpeedY *= speedIncrease;
        ballSpeedX = Math.sign(ballSpeedX) * Math.min(Math.abs(ballSpeedX), maxBallSpeed);
        ballSpeedY = Math.sign(ballSpeedY) * Math.min(Math.abs(ballSpeedY), maxBallSpeed);
        playHitSound();
    }

    if (
        ballX >= canvas.width - 35 &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1 * speedIncrease;
        ballSpeedY *= speedIncrease;
        ballSpeedX = Math.sign(ballSpeedX) * Math.min(Math.abs(ballSpeedX), maxBallSpeed);
        ballSpeedY = Math.sign(ballSpeedY) * Math.min(Math.abs(ballSpeedY), maxBallSpeed);
        playHitSound();
    }

    if (ballX < 0) {
        rightScore++;
        console.log("Vārtus ieguva labais:", leftScore, "-", rightScore);

        if (rightScore >= 10) {
            gameOver = true;
            winner = rightPlayerName;
            console.log("Uzvara:", winner);
            saveResult();
        }

        resetBall();
    }

    if (ballX > canvas.width) {
        leftScore++;
        console.log("Vārtus ieguva kreisais:", leftScore, "-", rightScore);

        if (leftScore >= 10) {
            gameOver = true;
            winner = leftPlayerName;
            console.log("Uzvara:", winner);
            saveResult();
        }

        resetBall();
    }
}

// ===== REZULTĀTU GLABĀŠANA =====

function saveResult() {
    const results = JSON.parse(localStorage.getItem("pingpongResults")) || [];

    results.push({
        left: leftScore,
        right: rightScore,
        leftPlayer: leftPlayerName,
        rightPlayer: rightPlayerName,
        winner: winner
    });

    localStorage.setItem("pingpongResults", JSON.stringify(results));
}

// ===== ZĪMĒŠANA =====

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, "#00aa55");
    drawRect(canvas.width / 2 - 2, 0, 4, canvas.height, "white");
    drawRect(20, leftPaddleY, paddleWidth, paddleHeight, "white");
    drawRect(canvas.width - 35, rightPaddleY, paddleWidth, paddleHeight, "white");
    drawCircle(ballX, ballY, 10, "white");
    drawText(leftScore, 100, 50);
    drawText(rightScore, 600, 50);

    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("UZVARA!", canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = "30px Arial";
        ctx.fillText(winner, canvas.width / 2, canvas.height / 2);
        ctx.font = "20px Arial";
        ctx.fillText(leftScore + " : " + rightScore, canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillStyle = "rgba(100, 150, 200, 0.8)";
        const btnY = canvas.height / 2 + 90;
        ctx.fillRect(canvas.width / 2 - 100, btnY - 20, 200, 40);
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Skatīt rezultātus", canvas.width / 2, btnY + 7);
        ctx.textAlign = "left";
    }
}

// ===== SPĒLES CILPA =====

function gameLoop() {
    if (!gameOver) {
        movePaddles();
        moveBall();
    }

    draw();
    requestAnimationFrame(gameLoop);
}