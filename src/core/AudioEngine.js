import * as Tone from 'tone';
import eventBus from './EventBus.js';

class AudioEngine {
  constructor() {
    this.initialized = false;
    this.master = null;
    this.analyser = null;
    this.limiter = null;
  }

  async init() {
    if (this.initialized) return;
    await Tone.start();

    this.limiter = new Tone.Limiter(-1).toDestination();
    this.master = new Tone.Channel({ volume: -6 }).connect(this.limiter);
    this.analyser = new Tone.Analyser('waveform', 1024);
    this.master.connect(this.analyser);

    this.initialized = true;
    eventBus.emit('audio:ready');
    console.log('AudioEngine initialized');
  }

  getMaster() {
    return this.master;
  }

  getAnalyser() {
    return this.analyser;
  }

  setMasterVolume(db) {
    if (this.master) this.master.volume.value = db;
  }

  getWaveform() {
    return this.analyser ? this.analyser.getValue() : new Float32Array(1024);
  }

  dispose() {
    if (this.master) this.master.dispose();
    if (this.analyser) this.analyser.dispose();
    if (this.limiter) this.limiter.dispose();
    this.initialized = false;
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
