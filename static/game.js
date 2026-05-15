// ===== SPĒLES KONSTANTES UN MAINĪGIE =====

// Canvas un konteksts spēles zīmēšanai
const canvas = document.getElementById("gameCanvas");
let ctx;

// Raketes parametri
const paddleWidth = 15;
const paddleHeight = 75;

// Rakešu Y pozīcijas
let leftPaddleY;
let rightPaddleY;

// Spēlētāju rezultāti
let leftScore = 0;
let rightScore = 0;

// Spēles stāvoklis
let gameOver = false;
let winner = "";

// Spēlētāju vārdi
let leftPlayerName = "";
let rightPlayerName = "";

// Skaņa kad bumba trāpa raketē
const hitSound = new Audio(
    "https://www.soundjay.com/button/sounds/button-16.mp3"
);

// Objekts, kurā glabājas nospiestas pogas
const keys = {};

// ===== KLAUSĪTĀJI =====

// Klausītājs rezultātu pogas klikšķim uz canvas
canvas.addEventListener("click", (e) => {
    if (!gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Rezultātu pogas koordinātes
    const btnY = canvas.height / 2 + 90;
    const btnX = canvas.width / 2;
    const btnWidth = 200;
    const btnHeight = 40;

    // Pārbaudām, vai klikšķis ir uz pogas
    if (x > btnX - btnWidth / 2 && x < btnX + btnWidth / 2 &&
        y > btnY - btnHeight / 2 && y < btnY + btnHeight / 2) {
        window.location.href = "/results";
    }
});

// Klausītājs taustiņu spiešanai
window.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

// Klausītājs taustiņa atlaidei
window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// ===== BUMBU PARAMETRI =====

let ballX;
let ballY;

let ballSpeedX;
let ballSpeedY;

// ===== SPĒLES FUNKCIJAS =====

// Atjauno bumbu uz vidusspēles
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    // Nejaušs virziens
    let direction = Math.random() > 0.5 ? 1 : -1;
    ballSpeedX = 5 * direction;

    // Nejaušs leņķis
    ballSpeedY = Math.random() * 4 - 2;
}

// Sāk spēli - ņem spēlētāju vārdus un inicializē canvas
function startGame() {
    const leftInput = document.getElementById("leftPlayerName").value.trim();
    const rightInput = document.getElementById("rightPlayerName").value.trim();

    // Pārbaudām, vai vārdi ievadīti
    if (!leftInput || !rightInput) {
        alert("Lūdzu, ievadi abu spēlētāju vārdus!");
        return;
    }

    // Glabājam spēlētāju vārdus
    leftPlayerName = leftInput;
    rightPlayerName = rightInput;

    // Inicializējam canvas tikai pēc formas paslēpšanas
    ctx = canvas.getContext("2d");
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;

    // Inicializējam bumbu
    resetBall();

    // Slēpjam formu un rādām spēli
    document.getElementById("nameForm").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    // Canvas saņem fokusus
    canvas.focus();

    // Sākam spēles cilpu
    gameLoop();
}

// ===== ZĪMĒŠANAS FUNKCIJAS =====

// Zīmē taisnstūri
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Zīmē apli (bumbu)
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

// ===== SPĒLĒTĀJU KUSTĪBAS =====

// Pārvieto raketes balstoties uz nospiestas taustiņiem
function movePaddles() {
    // Kreisais spēlētājs (W/S)
    if (keys["KeyW"]) {
        if (leftPaddleY > 0) {
            leftPaddleY -= 7;
        }
    }

    if (keys["KeyS"]) {
        if (leftPaddleY < canvas.height - paddleHeight) {
            leftPaddleY += 7;
        }
    }

    // Labais spēlētājs (Augšup/Lejup bultiņas)
    if (keys["ArrowUp"]) {
        if (rightPaddleY > 0) {
            rightPaddleY -= 7;
        }
    }

    if (keys["ArrowDown"]) {
        if (rightPaddleY < canvas.height - paddleHeight) {
            rightPaddleY += 7;
        }
    }
}

// ===== BUMBU KUSTĪBAS UN SADURSMES =====

// Pārvieto bumbu un pārbaudā sadursmes
function moveBall() {
    // Pārvieto bumbu
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Atleciens no augšas un apakšas
    if (ballY <= 10 || ballY >= canvas.height - 10) {
        ballSpeedY *= -1;
    }

    // Sadursme ar kreiso raketi
    if (
        ballX <= 35 &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1;
        hitSound.play();
    }

    // Sadursme ar labo raketi
    if (
        ballX >= canvas.width - 35 &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX *= -1;
        hitSound.play();
    }

    // Vārti pa labi (kreisais spēlētājs zaudē)
    if (ballX < 0) {
        rightScore++;
        console.log("VĀRTI PA LABI! Rezultāts:", leftScore, "-", rightScore);

        if (rightScore >= 10) {
            gameOver = true;
            winner = rightPlayerName;
            console.log("UZVARA:", winner);
            saveResult();
        }

        resetBall();
    }

    // Vārti pa kreisi (labais spēlētājs zaudē)
    if (ballX > canvas.width) {
        leftScore++;
        console.log("VĀRTI PA KREISI! Rezultāts:", leftScore, "-", rightScore);

        if (leftScore >= 10) {
            gameOver = true;
            winner = leftPlayerName;
            console.log("UZVARA:", winner);
            saveResult();
        }

        resetBall();
    }
}

// ===== REZULTĀTU GLABĀŠANA =====

// Saglabā spēles rezultātu localStorage
function saveResult() {
    let results =
        JSON.parse(localStorage.getItem("pingpongResults")) || [];

    results.push({
        left: leftScore,
        right: rightScore,
        leftPlayer: leftPlayerName,
        rightPlayer: rightPlayerName,
        winner: winner
    });

    localStorage.setItem(
        "pingpongResults",
        JSON.stringify(results)
    );
}

// ===== ZĪMĒŠANAS FUNKCIJA =====

// Zīmē visu spēles ekrānu
function draw() {
    // Zīmē spēles laukuma fonu
    drawRect(
        0,
        0,
        canvas.width,
        canvas.height,
        "#00aa55"
    );

    // Zīmē viduslīniju
    drawRect(
        canvas.width / 2 - 2,
        0,
        4,
        canvas.height,
        "white"
    );

    // Zīmē kreiso raketi
    drawRect(
        20,
        leftPaddleY,
        paddleWidth,
        paddleHeight,
        "white"
    );

    // Zīmē labo raketi
    drawRect(
        canvas.width - 35,
        rightPaddleY,
        paddleWidth,
        paddleHeight,
        "white"
    );

    // Zīmē bumbu
    drawCircle(ballX, ballY, 10, "white");

    // Zīmē rezultātu skaitu
    drawText(leftScore, 100, 50);
    drawText(rightScore, 600, 50);

    // Zīmē uzvaras skreeniju
    if (gameOver) {
        // Tumšais fons
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Uzvaras teksts
        ctx.fillStyle = "white";
        ctx.font = "50px Arial";
        ctx.textAlign = "center";
        ctx.fillText("UZVARA!", canvas.width / 2, canvas.height / 2 - 50);
        
        // Uzvarētāja vārds
        ctx.font = "30px Arial";
        ctx.fillText(winner, canvas.width / 2, canvas.height / 2);
        
        // Galīgais rezultāts
        ctx.font = "20px Arial";
        ctx.fillText(leftScore + " : " + rightScore, canvas.width / 2, canvas.height / 2 + 50);
        
        // Zīmē rezultātu pogu
        ctx.fillStyle = "rgba(100, 150, 200, 0.8)";
        const btnY = canvas.height / 2 + 90;
        ctx.fillRect(canvas.width / 2 - 100, btnY - 20, 200, 40);
        
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Skatīt rezultātus", canvas.width / 2, btnY + 7);
        
        ctx.textAlign = "left";
    }
}

// ===== GALVENĀ SPĒLES CILPA =====

// Galvenā spēles cilpa - atjaunina un zīmē visu
function gameLoop() {
    // Pārbauda vai spēle nav beigusies
    if (!gameOver) {
        movePaddles();
        moveBall();
    }

    draw();

    // Turpina cilpu
    requestAnimationFrame(gameLoop);
}