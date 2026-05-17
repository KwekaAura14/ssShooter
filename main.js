const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');

let score = 0;
let gameRunning = false;
let gravity = 0.6;
let velocity = 0;
let playerY = 300;
const playerX = 150;
const playerSize = 40;

let obstacles = [];
let frame = 0;
let speed = 4;

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function jump() {
    if (playerY >= 300) velocity = -15;
}

function spawnObstacle() {
    const height = 60 + Math.random() * 80;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 40,
        height: height
    });
}

function update() {
    if (!gameRunning) return;

    velocity += gravity;
    playerY += velocity;

    if (playerY >= 300) {
        playerY = 300;
        velocity = 0;
    }

    frame++;
    if (frame % 70 === 0) {
        spawnObstacle();
        if (speed < 9) speed += 0.1;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        if (
            playerX + playerSize > obs.x &&
            playerX < obs.x + obs.width &&
            playerY + playerSize > obs.y
        ) {
            endGame();
            return;
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            scoreEl.textContent = score;
        }
    }
}

function draw() {
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Player
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00ffcc';
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
    ctx.shadowBlur = 0;

    // Obstacles
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, 340, canvas.width, 10);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    startScreen.style.display = 'none';
    resetGame();
    gameRunning = true;
}

function endGame() {
    gameRunning = false;
    finalScoreEl.textContent = score;
    gameOverScreen.style.display = 'block';
}

function resetGame() {
    score = 0;
    scoreEl.textContent = '0';
    playerY = 300;
    velocity = 0;
    obstacles = [];
    frame = 0;
    speed = 4;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

startScreen.style.display = 'block';
gameLoop();
