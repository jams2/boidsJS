class AudioSource {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        navigator.mediaDevices.getUserMedia(
            {audio: true, video: false}
        ).then(stream => {
            this.source = this.ctx.createMediaStreamSource(stream)
        }).then(()=> this.source.connect(this.analyser));
        this.analyser.fftSize = 256;
        this.analyser.maxDecibels = 50;
        this.analyser.minDecibels = -70;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.freqData = new Uint8Array(this.bufferLength);
    }

    update() {
        this.analyser.getByteFrequencyData(this.freqData);
    }
}

export { AudioSource };
