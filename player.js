// player.js
const player = {
    x: 150,
    y: 300,
    size: 40,
    velocity: 0,
    grounded: true
};

const GRAVITY = 0.6;
const JUMP_FORCE = -15;

function jump() {
    if (player.grounded) {
        player.velocity = JUMP_FORCE;
        player.grounded = false;
    }
}

function updatePlayer() {
    player.velocity += GRAVITY;
    player.y += player.velocity;

    // Ground collision
    if (player.y >= 300) {
        player.y = 300;
        player.velocity = 0;
        player.grounded = true;
    }
}

function drawPlayer() {
    // Neon glow effect
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00ffcc';
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(player.x, player.y, player.size, player.size);
    ctx.shadowBlur = 0;
}

// Export functions so main.js can use them
window.jump = jump;
window.updatePlayer = updatePlayer;
window.drawPlayer = drawPlayer;
