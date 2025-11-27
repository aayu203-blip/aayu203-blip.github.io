import { Config } from './Config.js';

export class Truck extends PIXI.Container {
    constructor(texture, wheelsMeta = []) {
        super();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(Config.truckScale);
        this.addChild(this.sprite);
        this.vx = 0;
        this.ax = 0;
        this.pointerEase = 0.12;
        this.textureDimensions = { width: texture.width, height: texture.height };
        this.wheels = wheelsMeta.map((meta) => this.createWheel(meta));
    }

    createWheel(meta) {
        const wheel = new PIXI.Sprite(meta.texture);
        wheel.anchor.set(0.5);
        wheel.scale.set(Config.truckScale);
        wheel.x = (meta.center.x - this.textureDimensions.width / 2) * Config.truckScale;
        wheel.y = (meta.center.y - this.textureDimensions.height) * Config.truckScale;
        this.addChild(wheel);
        return wheel;
    }

    update(delta, input) {
        if (input.pointerActive && typeof input.pointerX === 'number') {
            const offset = input.pointerX - this.x;
            this.vx = offset * this.pointerEase;
            this.x += this.vx * delta;
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
        const spin = this.vx * Config.wheelSpinRate * delta;
        this.wheels.forEach((wheel) => {
            wheel.rotation += spin;
        });
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

