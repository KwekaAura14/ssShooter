// main.js - Geometry Dash Style
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
let speed = 6.5;           // Constant running speed

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function spawnObstacle() {
    obstacles.push({
        x: canvas.width + 50,
        y: 310,                    // On the ground like you
        width: 35,
        height: 60,                // Spike / block style
        color: '#ff0044'
    });
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision
        if (
            player.x + player.size > obs.x + 5 &&
            player.x < obs.x + obs.width - 5 &&
            player.y + player.size > obs.y + 5
        ) {
            endGame();
            return;
        }

        // Remove off screen + score
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

    // Spawn obstacles (Geometry Dash style spacing)
    if (frame % 48 === 0) {
        spawnObstacle();
        
        // Increase difficulty over time
        if (speed < 12) speed += 0.03;
    }
}

function drawBackground() {
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Moving grid lines (GD feel)
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.15)';
    ctx.lineWidth = 2;
    const offset = (frame * 3) % 60;
    for (let x = offset; x < canvas.width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

function draw() {
    drawBackground();
    drawPlayer();

    // Draw obstacles (spike style)
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        // Simple spike look
        ctx.fillStyle = '#ff3366';
        ctx.fillRect(obs.x + 8, obs.y - 15, obs.width - 16, 20);
    }
    ctx.shadowBlur = 0;

    // Ground
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, 370, canvas.width, 12);
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
    speed = 6.5;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

// Start everything
startScreen.style.display = 'block';
gameLoop();
