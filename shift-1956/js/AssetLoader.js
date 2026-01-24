export class AssetLoader {
    constructor(manifest, overlayId = 'loading-overlay') {
        this.manifest = manifest;
        this.overlay = document.getElementById(overlayId);
        this.progressLabel = this.overlay?.querySelector('.loader-label');
        this.progressValue = this.overlay?.querySelector('.loader-progress');
    }

    async loadAll() {
        const queue = this.collectTextures(this.manifest);
        queue.forEach((path) => PIXI.Assets.add(path, path));
        this.showOverlay();
        const textures = await PIXI.Assets.load(queue, (progress) => {
            this.updateProgress(Math.round(progress * 100));
        });
        this.updateProgress(100);
        setTimeout(() => this.hideOverlay(), 350);
        return textures;
    }

    collectTextures(source) {
        const entries = [];
        const visit = (value) => {
            if (!value) return;
            if (Array.isArray(value)) {
                value.forEach((v) => visit(v));
            } else if (typeof value === 'object' && value.texture) {
                entries.push(value.texture);
            } else if (typeof value === 'string') {
                entries.push(value);
            }
        };
        Object.values(source).forEach((val) => visit(val));
        return [...new Set(entries)];
    }

    showOverlay() {
        if (this.overlay) {
            this.overlay.classList.add('active');
        }
    }

    hideOverlay() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }

    updateProgress(percent) {
        if (this.progressLabel) {
            this.progressLabel.innerText = `Calibrating Shift • ${percent}%`;
        }
        if (this.progressValue) {
            this.progressValue.style.setProperty('--progress', `${percent}%`);
            this.progressValue.innerText = `${percent}%`;
        }
    }
}


