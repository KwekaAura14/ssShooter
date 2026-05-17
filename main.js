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
let speed = 7;

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function spawnObstacle() {
    obstacles.push({
        x: canvas.width + 30,
        y: 310,
        width: 38,
        height: 65,
        color: '#ff0044'
    });
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        if (
            player.x + player.size > obs.x + 5 &&
            player.x < obs.x + obs.width - 5 &&
            player.y + player.size > obs.y + 5
        ) {
            endGame();
            return;
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 15;
            scoreEl.textContent = score;
        }
    }
}

function update() {
    if (!gameRunning) return;

    updatePlayer();
    updateObstacles();

    frame++;

    if (frame % 42 === 0) {        // Faster spawning
        spawnObstacle();
        if (speed < 13) speed += 0.04;
    }
}

function drawBackground() {
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';
    ctx.lineWidth = 2;
    const offset = (frame * 4) % 50;
    for (let x = offset; x < canvas.width + 50; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

function draw() {
    drawBackground();
    drawPlayer();

    ctx.shadowBlur = 25;
    ctx.shadowColor = '#ff0044';
    ctx.fillStyle = '#ff0044';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
    ctx.shadowBlur = 0;

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
    player.rotation = 0;
    obstacles = [];
    frame = 0;
    speed = 7;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

startScreen.style.display = 'block';
gameLoop();
