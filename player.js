// player.js - Realistic Physics
const player = {
    x: 150,
    y: 300,
    size: 40,
    velocityY: 0,
    grounded: true,
    rotation: 0,
    isHoldingJump: false
};

const GRAVITY = 1.28;
const JUMP_FORCE = -24.5;
const HOLD_REDUCTION = 0.52;

function jump() {
    if (player.grounded) {
        player.velocityY = JUMP_FORCE;
        player.grounded = false;
        player.isHoldingJump = true;
    }
}

function updatePlayer() {
    let currentGravity = GRAVITY;

    // Variable jump height - holding jump makes you go higher
    if (player.isHoldingJump && player.velocityY < 0) {
        currentGravity *= HOLD_REDUCTION;
    }

    player.velocityY += currentGravity;
    player.y += player.velocityY;

    // Ground landing
    if (player.y >= 300) {
        player.y = 300;
        player.velocityY = 0;
        player.grounded = true;
        player.rotation = Math.round(player.rotation / 90) * 90; // Snap to grid
    }

    // Fast cube rotation in air
    if (!player.grounded) {
        player.rotation += 17.5;
    } else {
        player.rotation = 0;
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.size/2, player.y + player.size/2);
    ctx.rotate(player.rotation * Math.PI / 180);

    ctx.shadowBlur = 35;
    ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(-player.size/2, -player.size/2, player.size, player.size);

    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-player.size/2 + 8, -player.size/2 + 8, player.size - 16, player.size - 16);

    ctx.restore();
}

window.jump = jump;
window.updatePlayer = updatePlayer;
window.drawPlayer = drawPlayer;
