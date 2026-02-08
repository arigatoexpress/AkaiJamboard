import * as Tone from 'tone';
import { midiToNoteName } from '../../ai/models/scaleTheory.js';

/**
 * Polyphonic melody/lead synthesizer.
 */
class MelodySynth {
  constructor() {
    this.synth = null;
    this.output = null;
  }

  init(outputChannel) {
    this.output = outputChannel;

    this.synth = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 6,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.3, release: 0.5 },
    }).connect(this.output);

    this.synth.volume.value = -8;
  }

  triggerNote(midiNote, velocity = 0.7, duration = '8n', time) {
    const noteName = typeof midiNote === 'number' ? midiToNoteName(midiNote) : midiNote;
    this.synth.triggerAttackRelease(noteName, duration, time, velocity);
  }

  triggerChord(midiNotes, velocity = 0.5, duration = '2n', time) {
    const noteNames = midiNotes.map((n) =>
      typeof n === 'number' ? midiToNoteName(n) : n
    );
    this.synth.triggerAttackRelease(noteNames, duration, time, velocity);
  }

  setOscType(type) {
    // PolySynth requires setting on the options
    if (this.synth) {
      this.synth.set({ oscillator: { type } });
    }
  }

  dispose() {
    if (this.synth) this.synth.dispose();
  }
}

export const melodySynth = new MelodySynth();
export default melodySynth;
