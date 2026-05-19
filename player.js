// player.js
const player = {
    x: 150,
    y: 300,
    size: 40,
    velocity: 0,
    grounded: true,
    rotation: 0,
    isHoldingJump: false
};

const GRAVITY = 1.4;
const JUMP_FORCE = -23;

function jump() {
    if (player.grounded) {
        player.velocity = JUMP_FORCE;
        player.grounded = false;
        player.isHoldingJump = true;
    }
}

function updatePlayer() {
    // Variable jump height (hold = higher jump)
    if (!player.isHoldingJump && player.velocity < 0) {
        player.velocity *= 0.65; // Cut jump short if not holding
    }

    player.velocity += GRAVITY;
    player.y += player.velocity;

    if (player.y >= 300) {
        player.y = 300;
        player.velocity = 0;
        player.grounded = true;
        player.rotation = Math.round(player.rotation / 90) * 90;
    }

    if (!player.grounded) {
        player.rotation += 18;
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

    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-player.size/2 + 8, -player.size/2 + 8, player.size-16, player.size-16);

    ctx.restore();
}

window.jump = jump;
window.updatePlayer = updatePlayer;
window.drawPlayer = drawPlayer;
