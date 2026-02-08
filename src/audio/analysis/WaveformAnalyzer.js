import * as Tone from 'tone';
import audioEngine from '../../core/AudioEngine.js';

/**
 * Real-time waveform and spectrum analyzer.
 */
class WaveformAnalyzer {
  constructor() {
    this.waveformAnalyser = null;
    this.fftAnalyser = null;
  }

  init() {
    const master = audioEngine.getMaster();

    this.waveformAnalyser = new Tone.Analyser('waveform', 512);
    this.fftAnalyser = new Tone.Analyser('fft', 256);

    master.connect(this.waveformAnalyser);
    master.connect(this.fftAnalyser);
  }

  getWaveform() {
    return this.waveformAnalyser ? this.waveformAnalyser.getValue() : new Float32Array(512);
  }

  getFFT() {
    return this.fftAnalyser ? this.fftAnalyser.getValue() : new Float32Array(256);
  }

  dispose() {
    if (this.waveformAnalyser) this.waveformAnalyser.dispose();
    if (this.fftAnalyser) this.fftAnalyser.dispose();
  }
}

export const waveformAnalyzer = new WaveformAnalyzer();
export default waveformAnalyzer;
