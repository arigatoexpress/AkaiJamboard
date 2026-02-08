import * as Tone from 'tone';
import eventBus from '../../core/EventBus.js';
import { DRUM_NAMES } from '../../core/constants.js';

/**
 * Synthesized drum machine with 8 voices.
 * Uses Tone.js synthesis rather than samples for zero-dependency startup.
 */
class DrumMachine {
  constructor() {
    this.voices = [];
    this.output = null;
  }

  init(outputChannel) {
    this.output = outputChannel;

    // Create synthesized drum voices
    this.voices = [
      this.createKick(),
      this.createSnare(),
      this.createClosedHH(),
      this.createOpenHH(),
      this.createClap(),
      this.createTomLo(),
      this.createTomHi(),
      this.createCrash(),
    ];

    eventBus.on('pad:trigger', ({ pad, velocity }) => {
      this.trigger(pad, velocity / 127);
    });
  }

  trigger(index, velocity = 0.8, time) {
    if (index >= 0 && index < this.voices.length) {
      const voice = this.voices[index];
      voice.trigger(velocity, time);
      eventBus.emit('drum:triggered', { index, name: DRUM_NAMES[index], velocity });
    }
  }

  createKick() {
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).connect(this.output);

    return {
      trigger: (vel, time) => synth.triggerAttackRelease('C1', '8n', time, vel),
      dispose: () => synth.dispose(),
    };
  }

  createSnare() {
    const noise = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
    }).connect(this.output);

    const body = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
    }).connect(this.output);

    return {
      trigger: (vel, time) => {
        noise.triggerAttackRelease('16n', time, vel * 0.6);
        body.triggerAttackRelease('E2', '16n', time, vel * 0.4);
      },
      dispose: () => { noise.dispose(); body.dispose(); },
    };
  }

  createClosedHH() {
    const synth = new Tone.MetalSynth({
      frequency: 400,
      envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).connect(this.output);

    return {
      trigger: (vel, time) => synth.triggerAttackRelease('32n', time, vel * 0.3),
      dispose: () => synth.dispose(),
    };
  }

  createOpenHH() {
    const synth = new Tone.MetalSynth({
      frequency: 400,
      envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).connect(this.output);

    return {
      trigger: (vel, time) => synth.triggerAttackRelease('8n', time, vel * 0.3),
      dispose: () => synth.dispose(),
    };
  }

  createClap() {
    const noise = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.08 },
    }).connect(this.output);

    return {
      trigger: (vel, time) => noise.triggerAttackRelease('16n', time, vel * 0.5),
      dispose: () => noise.dispose(),
    };
  }

  createTomLo() {
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.03,
      octaves: 3,
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    }).connect(this.output);

    return {
      trigger: (vel, time) => synth.triggerAttackRelease('G1', '8n', time, vel),
      dispose: () => synth.dispose(),
    };
  }

  createTomHi() {
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.03,
      octaves: 3,
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
    }).connect(this.output);

    return {
      trigger: (vel, time) => synth.triggerAttackRelease('D2', '8n', time, vel),
      dispose: () => synth.dispose(),
    };
  }

  createCrash() {
    const synth = new Tone.MetalSynth({
      frequency: 300,
      envelope: { attack: 0.001, decay: 1.2, release: 0.3 },
      harmonicity: 5.1,
      modulationIndex: 40,
      resonance: 5000,
      octaves: 1.5,
    }).connect(this.output);

    return {
      trigger: (vel, time) => synth.triggerAttackRelease('4n', time, vel * 0.25),
      dispose: () => synth.dispose(),
    };
  }

  dispose() {
    this.voices.forEach((v) => v.dispose());
  }
}

export const drumMachine = new DrumMachine();
export default drumMachine;
