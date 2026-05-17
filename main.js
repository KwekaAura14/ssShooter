// main.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');

let score = 0;
let gameRunning = false;
let obstacles = [];
let frame = 0;
let speed = 4;

// Keyboard controls
window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) {
        jump();
    }
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function spawnObstacle() {
    const height = 60 + Math.random() * 80;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: 40,
        height: height
    });
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision with player
        if (
            player.x + player.size > obs.x &&
            player.x < obs.x + obs.width &&
            player.y + player.size > obs.y
        ) {
            endGame();
            return;
        }

        // Remove off-screen obstacles
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            scoreEl.textContent = score;
        }
    }
}

function update() {
    if (!gameRunning) return;

    updatePlayer();
    updateObstacles();

    // Spawn obstacles
    frame++;
    if (frame % 70 === 0) {
        spawnObstacle();
        if (speed < 9) speed += 0.1;
    }
}

function draw() {
    // Background
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    // Obstacles
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
    ctx.shadowBlur = 0;

    // Ground
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
    player.y = 300;
    player.velocity = 0;
    player.grounded = true;
    obstacles = [];
    frame = 0;
    speed = 4;
    gameOverScreen.style.display = 'none';
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

// Initialize
startScreen.style.display = 'block';
gameLoop();
