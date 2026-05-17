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
let speed = 5.5;

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function spawnObstacle() {
    // Spawn farther to the right so you can clearly see them coming
    const height = 80 + Math.random() * 90;   // Tall obstacles mostly
    const gap = 180 + Math.random() * 80;     // Distance from right edge

    obstacles.push({
        x: canvas.width + gap,        // Spawn with extra space in front
        y: canvas.height - height,
        width: 48,
        height: height,
        color: '#ff0044'
    });
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision detection
        if (
            player.x + player.size > obs.x &&
            player.x < obs.x + obs.width &&
            player.y + player.size > obs.y
        ) {
            endGame();
            return;
        }

        // Remove off-screen + give points
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 20;
            scoreEl.textContent = score;
        }
    }
}

function update() {
    if (!gameRunning) return;

    updatePlayer();
    updateObstacles();

    frame++;

    // Spawn obstacles with better timing
    if (frame % 55 === 0) {           // Changed for better spacing
        spawnObstacle();
        
        // Slowly increase difficulty
        if (speed < 11) speed += 0.07;
    }
}

function draw() {
    // Background
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    // Draw obstacles with strong glow
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
    ctx.shadowBlur = 0;

    // Ground line
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, 360, canvas.width, 10);
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
    speed = 5.5;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

// Initialize
startScreen.style.display = 'block';
gameLoop();
