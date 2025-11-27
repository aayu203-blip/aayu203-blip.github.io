import { Config } from './Config.js';

export class Truck extends PIXI.Container {
    constructor(texture) {
        super();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(Config.truckScale);
        this.addChild(this.sprite);
        this.vx = 0;
        this.ax = 0;
        this.pointerEase = 0.12;
    }

    update(delta, input) {
        if (input.pointerActive && typeof input.pointerX === 'number') {
            const offset = input.pointerX - this.x;
            this.vx = offset * this.pointerEase * delta;
            this.x += this.vx;
        } else {
            if (input.left) this.ax = -Config.truckSpeed;
            else if (input.right) this.ax = Config.truckSpeed;
            else this.ax = 0;
            this.vx += this.ax * delta;
            this.vx *= Config.truckFriction;
            if (this.vx > Config.truckMaxSpeed) this.vx = Config.truckMaxSpeed;
            if (this.vx < -Config.truckMaxSpeed) this.vx = -Config.truckMaxSpeed;
            this.x += this.vx * delta;
        }
        const targetRotation = (this.vx / Config.truckMaxSpeed) * Config.truckTilt;
        this.rotation += (targetRotation - this.rotation) * 0.1;
    }
}

export class FallingPart extends PIXI.Sprite {
    constructor(texture, meta, startX) {
        super(texture);
        this.anchor.set(0.5);
        this.x = startX;
        this.y = -100;
        this.meta = meta;
        this.type = meta?.type || 'good';
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
        this.scale.set(0.6);
    }

    update(delta, speedMultiplier) {
        this.y += Config.gravity * speedMultiplier * delta;
        this.rotation += this.rotSpeed * delta;
    }
}

