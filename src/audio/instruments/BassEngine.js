import * as Tone from 'tone';
import { midiToNoteName } from '../../ai/models/scaleTheory.js';

/**
 * Monophonic bass synthesizer.
 */
class BassEngine {
  constructor() {
    this.synth = null;
    this.filter = null;
    this.output = null;
  }

  init(outputChannel) {
    this.output = outputChannel;

    this.filter = new Tone.Filter({
      frequency: 800,
      type: 'lowpass',
      rolloff: -24,
      Q: 2,
    }).connect(this.output);

    this.synth = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.3 },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.2,
        baseFrequency: 100,
        octaves: 2.5,
      },
    }).connect(this.filter);
  }

  triggerNote(midiNote, velocity = 0.8, duration = '8n', time) {
    const noteName = typeof midiNote === 'number' ? midiToNoteName(midiNote) : midiNote;
    this.synth.triggerAttackRelease(noteName, duration, time, velocity);
  }

  setFilterCutoff(frequency) {
    if (this.filter) this.filter.frequency.value = frequency;
  }

  setOscType(type) {
    if (this.synth) this.synth.oscillator.type = type;
  }

  dispose() {
    if (this.synth) this.synth.dispose();
    if (this.filter) this.filter.dispose();
  }
}

export const bassEngine = new BassEngine();
export default bassEngine;
