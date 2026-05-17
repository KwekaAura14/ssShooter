// player.js - Faster GD Style Jump
const player = {
    x: 150,
    y: 300,
    size: 40,
    velocity: 0,
    grounded: true,
    rotation: 0   // For cube rotation effect
};

const GRAVITY = 1.1;      // Much stronger gravity (faster fall)
const JUMP_FORCE = -22;   // Much stronger jump (faster rise)

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
        player.rotation = 0;
    }

    // Rotation when in air (Geometry Dash cube feel)
    if (!player.grounded) {
        player.rotation += 12;   // Fast rotation
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.size/2, player.y + player.size/2);
    
    if (!player.grounded) {
        ctx.rotate(player.rotation * Math.PI / 180);
    }

    ctx.shadowBlur = 30;
    ctx.shadowColor = '#00ffcc';
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(-player.size/2, -player.size/2, player.size, player.size);
    
    ctx.shadowBlur = 0;
    ctx.restore();
}

// Make functions available globally
window.jump = jump;
window.updatePlayer = updatePlayer;
window.drawPlayer = drawPlayer;
