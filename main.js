// main.js - Major Improvements
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');

let score = 0;
let highScore = localStorage.getItem('neonHighScore') || 0;
let gameRunning = false;
let obstacles = [];
let particles = [];
let frame = 0;
let speed = 7.5;
let screenShake = 0;

window.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Spacebar') && gameRunning) jump();
    if (e.key === ' ' && !gameRunning && gameOverScreen.style.display === 'block') restartGame();
});

canvas.addEventListener('mousedown', () => {
    if (gameRunning) jump();
});

canvas.addEventListener('mouseup', () => {
    if (gameRunning) player.isHoldingJump = false;
});

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: Math.random() * 8 - 4,
            vy: Math.random() * 8 - 6,
            life: 25,
            color: color
        });
    }
}

function spawnObstacle() {
    const r = Math.random();
    const x = canvas.width + 30;

    if (r < 0.3) obstacles.push({x, y: 295, w: 40, h: 85, type: "spike"});
    else if (r < 0.5) {
        obstacles.push({x, y: 325, w: 45, h: 55, type: "low"});
        obstacles.push({x: x+95, y: 280, w: 38, h: 100, type: "spike"});
    }
    else if (r < 0.65) obstacles.push({x, y: 225, w: 70, h: 25, type: "platform"});
    else if (r < 0.8) {
        obstacles.push({x, y: 310, w: 32, h: 70, type: "spike"});
        obstacles.push({x: x+58, y: 310, w: 32, h: 70, type: "spike"});
    }
    else obstacles.push({x, y: 325, w: 110, h: 55, type: "low"});
}

function update() {
    if (!gameRunning) return;

    updatePlayer();
    updateObstacles();

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }

    frame++;
    if (frame % 34 === 0) {
        spawnObstacle();
        if (speed < 15.5) speed += 0.045;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= speed;

        if (player.x + player.size - 10 > o.x &&
            player.x + 8 < o.x + o.w &&
            player.y + player.size - 8 > o.y) {
            
            // Death effect
            createParticles(player.x + 20, player.y + 20, '#ff0066', 35);
            screenShake = 12;
            endGame();
            return;
        }

        if (o.x + o.w < 0) {
            obstacles.splice(i, 1);
            score += 20;
            scoreEl.textContent = score;
        }
    }
}

function drawBackground() {
    ctx.fillStyle = '#0a0a1f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 255, 204, 0.22)';
    const offset = (frame * 5) % 55;
    for (let x = offset - screenShake; x < canvas.width + 100; x += 55) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

function drawParticles() {
    for (let p of particles) {
        ctx.globalAlpha = p.life / 25;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 6, 6);
    }
    ctx.globalAlpha = 1;
}

function draw() {
    const shakeX = Math.random() * screenShake - screenShake/2;
    const shakeY = Math.random() * screenShake - screenShake/2;
    
    ctx.save();
    ctx.translate(shakeX, shakeY);

    drawBackground();
    drawPlayer();
    drawObstacles();
    drawParticles();

    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, 370, canvas.width, 14);

    ctx.restore();

    if (screenShake > 0) screenShake *= 0.85;
}

function drawObstacles() {
    ctx.shadowBlur = 30;
    for (let o of obstacles) {
        ctx.shadowColor = o.type === "platform" ? '#00ddff' : '#ff0066';
        ctx.fillStyle = o.type === "platform" ? '#00ddff' : '#ff0066';
        ctx.fillRect(o.x, o.y, o.w, o.h);
    }
    ctx.shadowBlur = 0;
}

// Game functions (start, end, reset) remain similar
function startGame() {
    startScreen.style.display = 'none';
    resetGame();
    gameRunning = true;
}

function endGame() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('neonHighScore', highScore);
    }
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
    player.isHoldingJump = false;
    obstacles = [];
    particles = [];
    frame = 0;
    speed = 7.5;
    screenShake = 0;
}

function restartGame() {
    resetGame();
    gameRunning = true;
}

startScreen.style.display = 'block';
gameLoop(); // Make sure you have gameLoop function

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
