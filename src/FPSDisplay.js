class FPSDisplay {
    constructor(containerElement) {
        this.container = containerElement;
        this.fps = 0;
        this.times = [];
    }

    updateFps(now) {
        // https://stackoverflow.com/a/48036361
        while (this.times.length > 0 && this.times[0] <= now - 1000) {
            this.times.shift();
        }
        this.times.push(now);
        this.fps = this.times.length;
        this.container.innerHTML = this.fps;
    }
}


export default FPSDisplay;
