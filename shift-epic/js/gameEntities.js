import { Config } from './config.js';

export class Hauler extends PIXI.Container {
    constructor(textures) {
        super();
        this.body = new PIXI.Sprite(textures.body);
        this.body.anchor.set(0.5, 1);
        this.body.scale.set(0.9);
        this.addChild(this.body);

        this.wheels = [];
        if (textures.wheel) {
            const positions = [
                { x: -330, y: -40 },
                { x: 260, y: -40 }
            ];
            positions.forEach((pos) => {
                const wheel = new PIXI.Sprite(textures.wheel);
                wheel.anchor.set(0.5, 0.5);
                wheel.scale.set(0.55);
                wheel.x = pos.x;
                wheel.y = pos.y;
                this.addChild(wheel);
                this.wheels.push(wheel);
            });
        }
        this.vx = 0;
        this.ax = 0;
    }

    update(delta, input) {
        if (input.pointerActive) {
            const target = input.pointerX;
            const diff = target - this.x;
            this.vx = diff * 0.035;
        } else {
            if (input.left) this.ax = -Config.truckSpeed;
            else if (input.right) this.ax = Config.truckSpeed;
            else this.ax = 0;
            this.vx += this.ax * delta;
            this.vx *= Config.truckFriction;
        }
        this.vx = Math.max(Math.min(this.vx, Config.truckMaxSpeed), -Config.truckMaxSpeed);
        this.x += this.vx * delta;

        const tilt = (this.vx / Config.truckMaxSpeed) * Config.truckTilt;
        this.body.rotation += (tilt - this.body.rotation) * 0.2;
        this.wheels.forEach((wheel) => {
            wheel.rotation += (this.vx / 120) * delta;
        });
    }
}

export class Payload extends PIXI.Container {
    constructor(texture, meta) {
        super();
        this.meta = meta;
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.scale.set(0.6);
        this.addChild(sprite);

        this.scan = new PIXI.Graphics();
        this.scan.beginFill(0xffffff, 0.18);
        this.scan.drawRect(-140, -10, 280, 20);
        this.scan.endFill();
        this.addChild(this.scan);

        this.speed = Config.gravity;
        this.y = -100;
    }

    update(delta) {
        this.y += this.speed * delta * 6;
        this.scan.y += delta * 4;
        if (this.scan.y > 80) this.scan.y = -80;
    }
}

export class FaultCluster extends PIXI.Sprite {
    constructor(texture) {
        super(texture);
        this.anchor.set(0.5);
        this.scale.set(0.55);
        this.speed = Config.gravity * 0.9;
        this.y = -100;
    }

    update(delta) {
        this.y += this.speed * delta * 6;
    }
}

