// main.js - Diverse Geometry Dash Style Obstacles
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
let speed = 7.2;

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
});

canvas.addEventListener('click', () => {
    if (gameRunning) jump();
});

function spawnObstacle() {
    const rand = Math.random();
    const baseX = canvas.width + 40;

    if (rand < 0.35) {
        // Single tall spike/block
        obstacles.push({ x: baseX, y: 305, w: 38, h: 75, type: "tall" });

    } else if (rand < 0.55) {
        // Double obstacle (two close blocks)
        obstacles.push({ x: baseX, y: 305, w: 35, h: 65, type: "normal" });
        obstacles.push({ x: baseX + 65, y: 305, w: 35, h: 65, type: "normal" });

    } else if (rand < 0.7) {
        // Low wide block
        obstacles.push({ x: baseX, y: 325, w: 70, h: 45, type: "low" });

    } else if (rand < 0.85) {
        // High platform (you have to jump on it or over it)
        obstacles.push({ x: baseX, y: 240, w: 55, h: 25, type: "platform" });

    } else {
        // Triple spike pattern
        obstacles.push({ x: baseX, y: 305, w: 32, h: 70, type: "tall" });
        obstacles.push({ x: baseX + 55, y: 305, w: 32, h: 70, type: "tall" });
        obstacles.push({ x: baseX + 110, y: 305, w: 32, h: 70, type: "tall" });
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Collision
        if (
            player.x + player.size - 8 > obs.x &&
            player.x + 8 < obs.x + obs.w &&
            player.y + player.size - 8 > obs.y
        ) {
            endGame();
            return;
        }

        if (obs.x + obs.w < 0) {
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

    // Spawn more frequently for better flow
    if (frame % 38 === 0) {
        spawnObstacle();
        if (speed < 14) speed += 0.035;
    }
}

function drawBackground() {
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.18)';
    const offset = (frame * 4) % 60;
    for (let x = offset; x < canvas.width + 60; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

function drawObstacles() {
    ctx.shadowBlur = 25;
    
    for (let obs of obstacles) {
        if (obs.type === "platform") {
            ctx.shadowColor = '#00ccff';
            ctx.fillStyle = '#00ccff';
        } else {
            ctx.shadowColor = '#ff0044';
            ctx.fillStyle = '#ff0044';
        }
        
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        
        // Spike effect on top
        if (obs.type !== "platform" && obs.type !== "low") {
            ctx.fillStyle = '#ff3366';
            ctx.fillRect(obs.x + 6, obs.y - 18, obs.w - 12, 20);
        }
    }
    ctx.shadowBlur = 0;
}

function draw() {
    drawBackground();
    drawPlayer();
    drawObstacles();

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
    player.rotation = 0;
    obstacles = [];
    frame = 0;
    speed = 7.2;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

startScreen.style.display = 'block';
gameLoop();
