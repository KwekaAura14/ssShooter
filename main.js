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
let speed = 5;

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function spawnObstacle() {
    const type = Math.random(); // Random obstacle type

    if (type < 0.6) {
        // Tall obstacle (must jump over)
        obstacles.push({
            x: canvas.width,
            y: 260,
            width: 45,
            height: 100,
            color: '#ff0044',
            type: 'tall'
        });
    } else {
        // Short obstacle (can jump over or duck - but we only have jump for now)
        obstacles.push({
            x: canvas.width,
            y: 310,
            width: 45,
            height: 50,
            color: '#ff8800',
            type: 'short'
        });
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision
        if (
            player.x + player.size > obs.x &&
            player.x < obs.x + obs.width &&
            player.y + player.size > obs.y
        ) {
            endGame();
            return;
        }

        // Remove when off screen + add score
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

    frame++;
    if (frame % 65 === 0) {           // Spawn rate
        spawnObstacle();
        if (speed < 10) speed += 0.08; // Gradually get faster
    }
}

function draw() {
    // Background
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawPlayer();

    // Draw obstacles
    for (let obs of obstacles) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = obs.color;
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
    }

    // Ground
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, 360, canvas.width, 8);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Game control functions
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
    speed = 5;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

// Start the game
startScreen.style.display = 'block';
gameLoop();
