// Character Animation System
class AnimationManager {
    constructor() {
        this.animations = {
            idle: {
                frames: 4,
                duration: 100,
                loop: true
            },
            walking: {
                frames: 8,
                duration: 75,
                loop: true
            },
            jumping: {
                frames: 3,
                duration: 100,
                loop: false
            },
            attacking: {
                frames: 6,
                duration: 50,
                loop: false
            },
            hurt: {
                frames: 4,
                duration: 80,
                loop: false
            },
            blocking: {
                frames: 2,
                duration: 150,
                loop: true
            },
            special: {
                frames: 10,
                duration: 60,
                loop: false
            }
        };
        
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    getFrame(animationType, elapsed) {
        const anim = this.animations[animationType] || this.animations.idle;
        this.frameTimer += elapsed;
        
        if (this.frameTimer >= anim.duration) {
            this.frameTimer = 0;
            this.currentFrame++;
            
            if (this.currentFrame >= anim.frames) {
                if (anim.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = anim.frames - 1;
                }
            }
        }
        
        return this.currentFrame;
    }

    reset() {
        this.currentFrame = 0;
        this.frameTimer = 0;
    }
}

// Particle System for visual effects
class Particle {
    constructor(x, y, vx, vy, color, size, lifetime) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.lifetime = lifetime;
        this.age = 0;
        this.gravity = 0.2;
    }

    update(elapsed) {
        this.age += elapsed;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.size *= 0.98;
    }

    draw(ctx) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    isAlive() {
        return this.age < this.lifetime;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, options = {}) {
        const {
            vxRange = [-5, 5],
            vyRange = [-8, -2],
            color = '#FFD700',
            sizeRange = [3, 8],
            lifetime = 1000
        } = options;

        for (let i = 0; i < count; i++) {
            const vx = vxRange[0] + Math.random() * (vxRange[1] - vxRange[0]);
            const vy = vyRange[0] + Math.random() * (vyRange[1] - vyRange[0]);
            const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
            
            this.particles.push(new Particle(x, y, vx, vy, color, size, lifetime));
        }
    }

    update(elapsed) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(elapsed);
            if (!this.particles[i].isAlive()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (let particle of this.particles) {
            particle.draw(ctx);
        }
    }
}

// Enhanced Character Renderer
class CharacterRenderer {
    static drawCharacter(ctx, player, isTransformed = false) {
        const x = player.x;
        const y = player.y + player.groundLevel;
        const scale = player.direction;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, 1);

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(0, 5, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        const headColor = player.direction > 0 
            ? (isTransformed ? '#FFD700' : '#FEF08A') 
            : (isTransformed ? '#FFD700' : '#FED7AA');
        const headGlow = isTransformed ? 'rgba(255, 215, 0, 0.6)' : 'rgba(0, 0, 0, 0.1)';

        ctx.shadowColor = headGlow;
        ctx.shadowBlur = isTransformed ? 20 : 5;
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(0, -80, 20, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (animated blink)
        const eyeOpen = Math.abs(Math.sin(player.animationFrame * 0.1)) > 0.3 ? 4 : 2;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(-8, -85, 3, eyeOpen, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(8, -85, 3, eyeOpen, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body gradient
        const bodyColor1 = player.direction > 0 ? '#3B82F6' : '#DC2626';
        const bodyColor2 = player.direction > 0 ? '#1E40AF' : '#7F1D1D';
        const gradient = ctx.createLinearGradient(0, -60, 0, -15);
        gradient.addColorStop(0, bodyColor1);
        gradient.addColorStop(1, bodyColor2);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = gradient;
        ctx.fillRect(-15, -60, 30, 45);

        // Chest details
        ctx.fillStyle = player.direction > 0 ? '#1E40AF' : '#7F1D1D';
        ctx.fillRect(-10, -50, 20, 15);

        // Arms with dynamic animation
        this.drawArms(ctx, player, isTransformed);

        // Legs with walking animation
        this.drawLegs(ctx, player);

        // Block shield animation
        if (player.block) {
            this.drawBlockShield(ctx, player);
        }

        // Transformation effects
        if (isTransformed) {
            this.drawTransformationAura(ctx, player);
        }

        ctx.restore();
    }

    static drawArms(ctx, player, isTransformed) {
        let armRotation = 0;
        const armColor1 = player.direction > 0 ? '#60A5FA' : '#FCA5A5';
        const armColor2 = player.direction > 0 ? '#3B82F6' : '#EF4444';

        if (player.state === 'attacking') {
            armRotation = Math.sin((player.attackFrame / 6) * Math.PI) * 0.8;
        } else if (player.state === 'blocking') {
            armRotation = -0.4;
        }

        // Left Arm
        ctx.save();
        ctx.translate(-20, -45);
        ctx.rotate(armRotation);
        ctx.fillStyle = armColor1;
        ctx.fillRect(-8, 0, 16, 40);
        ctx.fillStyle = armColor2;
        ctx.fillRect(-6, 35, 12, 8);
        ctx.restore();

        // Right Arm
        ctx.save();
        ctx.translate(20, -45);
        ctx.rotate(-armRotation);
        ctx.fillStyle = armColor1;
        ctx.fillRect(-8, 0, 16, 40);
        ctx.fillStyle = armColor2;
        ctx.fillRect(-6, 35, 12, 8);
        ctx.restore();
    }

    static drawLegs(ctx, player) {
        const legColor = player.direction > 0 ? '#1E40AF' : '#7F1D1D';
        const walkSpeed = 0.3;
        let leftLegAngle = 0;
        let rightLegAngle = 0;

        if (player.state === 'walking') {
            leftLegAngle = Math.sin((player.animationFrame / 8) * Math.PI * 2) * walkSpeed;
            rightLegAngle = -leftLegAngle;
        } else if (player.state === 'attacking') {
            rightLegAngle = 0.3;
        }

        // Left Leg
        ctx.save();
        ctx.translate(-10, -15);
        ctx.rotate(leftLegAngle);
        ctx.fillStyle = legColor;
        ctx.fillRect(-8, 0, 16, 35);
        ctx.restore();

        // Right Leg
        ctx.save();
        ctx.translate(10, -15);
        ctx.rotate(rightLegAngle);
        ctx.fillStyle = legColor;
        ctx.fillRect(-8, 0, 16, 35);
        ctx.restore();
    }

    static drawBlockShield(ctx, player) {
        ctx.strokeStyle = '#06B6D4';
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
        ctx.shadowBlur = 10;

        // Pulsing shield
        const pulse = Math.sin(player.animationFrame * 0.1) * 3;
        
        ctx.beginPath();
        ctx.arc(20, -40, 25 + pulse, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(20, -40, 20 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }

    static drawTransformationAura(ctx, player) {
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 20;

        for (let i = 0; i < 4; i++) {
            const radius = 45 + i * 10 + Math.sin(player.animationFrame * 0.05) * 5;
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.6 - i * 0.15})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, -50, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    }
}

// Sound Manager (placeholder for sound effects)
class SoundManager {
    constructor() {
        this.sounds = {
            punch: new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='),
            kick: new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='),
            fireball: new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='),
            hit: new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==')
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            try {
                this.sounds[soundName].currentTime = 0;
                this.sounds[soundName].play().catch(() => {});
            } catch (e) {}
        }
    }
}

// Game State Manager
class GameStateManager {
    constructor() {
        this.state = {
            round: 1,
            gameState: 'playing',
            maxCombo: 0,
            combo: [],
            message: 'ROUND 1 - FIGHT!'
        };
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
    }

    getState() {
        return this.state;
    }
}

// Export all managers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationManager,
        ParticleSystem,
        CharacterRenderer,
        SoundManager,
        GameStateManager
    };
}
