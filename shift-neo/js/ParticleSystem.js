import { Config } from './Config.js';

export class ParticleSystem {
    constructor(app) {
        this.app = app;
        this.particles = [];
        this.ambientTimer = 0;
    }

    createExplosion(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.spawnParticle({
                x,
                y,
                radius: Math.random() * 5 + 2,
                color,
                speed: 20,
                decay: 0.05,
                alpha: 1
            });
        }
    }

    spawnAmbientDust() {
        const ambientCount = this.particles.filter((p) => p.isAmbient).length;
        if (ambientCount >= Config.ambient.dustLimit) return;
        this.spawnParticle({
            x: Math.random() * this.app.screen.width,
            y: Math.random() * this.app.screen.height,
            radius: Math.random() * 2 + 0.5,
            color: 0xfff7c7,
            speed: 2,
            decay: 0.01,
            alpha: 0.3,
            ambient: true
        });
    }

    spawnParticle(options) {
        const p = new PIXI.Graphics();
        p.beginFill(options.color);
        p.drawCircle(0, 0, options.radius);
        p.endFill();
        p.x = options.x;
        p.y = options.y;
        p.vx = (Math.random() - 0.5) * options.speed;
        p.vy = (Math.random() - 0.5) * options.speed;
        p.life = 1;
        p.decay = options.decay;
        p.alpha = options.alpha;
        p.isAmbient = !!options.ambient;
        this.app.stage.addChild(p);
        this.particles.push(p);
    }

    update(delta) {
        this.ambientTimer -= delta;
        if (this.ambientTimer <= 0) {
            this.spawnAmbientDust();
            this.ambientTimer = Config.ambient.dustInterval;
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * delta * (p.isAmbient ? 0.3 : 1);
            p.y += p.vy * delta * (p.isAmbient ? 0.3 : 1);
            p.life -= (p.decay || 0.05) * delta;
            p.alpha = Math.max(0, p.life);
            if (p.isAmbient) {
                if (p.y > this.app.screen.height) p.y = 0;
                if (p.x > this.app.screen.width) p.x = 0;
                if (p.x < 0) p.x = this.app.screen.width;
            }
            if (p.life <= 0) {
                this.app.stage.removeChild(p);
                this.particles.splice(i, 1);
            }
        }
    }
}

