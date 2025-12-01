import { Config } from './Config.js';

export class Truck extends PIXI.Container {
    constructor(texture, wheelsMeta = []) {
        super();
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(Config.truckScale);
        this.sprite.zIndex = 0;
        this.addChild(this.sprite);
        this.vx = 0;
        this.ax = 0;
        this.pointerEase = 0.12;
        this.textureDimensions = { width: texture.width, height: texture.height };
        this.wheels = wheelsMeta.map((meta) => this.createWheel(meta));
    }

    createWheel(meta) {
        const wheel = new PIXI.Container();
        const wheelSprite = new PIXI.Sprite(meta.texture);
        wheelSprite.anchor.set(0.5);
        // Use actual texture width for base diameter
        const baseDiameter = meta.texture.width || meta.size || 1;
        // Scale wheel to match truck scale proportionally
        const desiredDiameter = (meta.size || baseDiameter) * Config.truckScale;
        const scaleFactor = desiredDiameter / baseDiameter;
        wheelSprite.scale.set(scaleFactor);
        wheel.addChild(wheelSprite);
        // Position wheels relative to truck body
        // Truck sprite anchor is (0.5, 1) = center-bottom, so y=0 is at bottom of sprite
        // Wheel center.y is measured from top of image (0 = top, height = bottom)
        wheel.x = (meta.center.x - this.textureDimensions.width / 2) * Config.truckScale;
        // Convert image Y coordinate (from top) to truck container Y (from bottom, negative = up)
        // If center.y is near the bottom of the image, distanceFromBottom is small, wheel.y should be slightly negative
        const distanceFromBottom = this.textureDimensions.height - meta.center.y;
        wheel.y = -distanceFromBottom * Config.truckScale;
        
        // Debug: If wheels are too low, we need to move them up (more negative)
        // Add an offset to move wheels up to align with yellow circles on truck body
        wheel.y -= 50 * Config.truckScale; // Move wheels up by 50px (scaled)
        // Ensure wheels render on top
        this.addChild(wheel);
        wheel.zIndex = 10;
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

export class FallingPart extends PIXI.Container {
    constructor(texture, meta, startX) {
        super();
        this.meta = meta;
        this.type = meta?.type || 'good';
        this.x = startX;
        this.y = -100;
        const targetScale =
            meta?.scale || (this.type === 'bad' ? Config.hazardScale : Config.partScale);
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.scale.set(targetScale);
        if (this.type === 'bad') {
            const glow = new PIXI.Graphics();
            glow.beginFill(Config.hazardBackdropColor, 0.4);
            const radius =
                (texture.width || texture.height) *
                targetScale *
                (Config.hazardBackdropRadius || 0.35);
            glow.drawCircle(0, 0, radius);
            glow.endFill();
            this.addChild(glow);
        }
        this.addChild(sprite);
        this.rotSpeed = (Math.random() - 0.5) * 0.08;
    }

    update(delta, speedMultiplier) {
        this.y += Config.gravity * speedMultiplier * delta;
        this.rotation += this.rotSpeed * delta;
    }
}

