import * as Tone from 'tone';
import eventBus from '../core/EventBus.js';
import state from '../core/StateManager.js';
import { TRACKS, DRUM_NAMES } from '../core/constants.js';

class Sequencer {
  constructor() {
    this.patterns = new Map();     // trackId -> 2D array [row][step]
    this.melodyPatterns = new Map(); // trackId -> [step] with note data
    this.sequence = null;
    this.currentStep = 0;
    this.stepCallback = null;
  }

  init(instruments) {
    this.instruments = instruments;
    const totalSteps = state.get('totalSteps');

    // Initialize empty drum pattern (8 rows x 16 steps)
    this.patterns.set(0, Array.from({ length: 8 }, () => new Array(totalSteps).fill(0)));

    // Initialize empty melodic patterns for bass, lead, chords
    for (let t = 1; t < TRACKS.length; t++) {
      this.melodyPatterns.set(t, new Array(totalSteps).fill(null));
    }

    // Create the Tone.js Sequence
    const steps = Array.from({ length: totalSteps }, (_, i) => i);
    this.sequence = new Tone.Sequence(
      (time, step) => this.onStep(time, step),
      steps,
      '16n'
    );
    this.sequence.loop = true;

    eventBus.on('sequencer:loadPattern', (data) => this.loadAIPattern(data));
    eventBus.on('sequencer:toggleStep', (data) => this.toggleStep(data));
    eventBus.on('sequencer:clear', () => this.clearAll());
    eventBus.on('transport:started', () => this.sequence?.start(0));
    eventBus.on('transport:stopped', () => {
      this.sequence?.stop();
      this.currentStep = 0;
    });
  }

  onStep(time, step) {
    this.currentStep = step;
    state.set('currentStep', step);

    // Drums (track 0)
    const drumPattern = this.patterns.get(0);
    if (drumPattern && this.instruments.drums) {
      drumPattern.forEach((row, drumIdx) => {
        const velocity = row[step];
        if (velocity > 0) {
          this.instruments.drums.trigger(drumIdx, velocity / 127, time);
        }
      });
    }

    // Bass (track 1)
    const bassPattern = this.melodyPatterns.get(1);
    if (bassPattern && bassPattern[step] && this.instruments.bass) {
      const n = bassPattern[step];
      this.instruments.bass.triggerNote(n.note, n.velocity / 127, n.duration, time);
    }

    // Lead (track 2)
    const leadPattern = this.melodyPatterns.get(2);
    if (leadPattern && leadPattern[step] && this.instruments.lead) {
      const n = leadPattern[step];
      this.instruments.lead.triggerNote(n.note, n.velocity / 127, n.duration, time);
    }

    // Chords (track 3)
    const chordPattern = this.melodyPatterns.get(3);
    if (chordPattern && chordPattern[step] && chordPattern[step].trigger && this.instruments.chords) {
      const c = chordPattern[step];
      this.instruments.chords.triggerChord(c.notes, 0.5, '2n', time);
    }

    eventBus.emit('sequencer:step', { step, time });
  }

  loadAIPattern(data) {
    const totalSteps = state.get('totalSteps');

    // Load drums
    if (data.drums) {
      const drumRows = ['kick', 'snare', 'closedHH', 'openHH', 'clap', 'tomLo', 'tomHi', 'crash'];
      const drumPattern = drumRows.map((name) => data.drums[name] || new Array(totalSteps).fill(0));
      this.patterns.set(0, drumPattern);
    }

    // Load bassline
    if (data.bassline) {
      this.melodyPatterns.set(1, data.bassline);
    }

    // Load melody
    if (data.melody) {
      this.melodyPatterns.set(2, data.melody);
    }

    // Load chords
    if (data.chordSequence) {
      this.melodyPatterns.set(3, data.chordSequence);
    }

    eventBus.emit('sequencer:patternLoaded', {
      drums: this.patterns.get(0),
      bass: this.melodyPatterns.get(1),
      lead: this.melodyPatterns.get(2),
      chords: this.melodyPatterns.get(3),
    });
  }

  toggleStep({ track, row, step }) {
    if (track === 0) {
      const pattern = this.patterns.get(0);
      if (pattern && pattern[row]) {
        pattern[row][step] = pattern[row][step] > 0 ? 0 : 100;
        eventBus.emit('sequencer:stepToggled', { track, row, step, value: pattern[row][step] });
      }
    }
  }

  setStep(track, row, step, velocity) {
    if (track === 0) {
      const pattern = this.patterns.get(0);
      if (pattern && pattern[row]) {
        pattern[row][step] = velocity;
      }
    }
  }

  getPattern(track) {
    if (track === 0) return this.patterns.get(0);
    return this.melodyPatterns.get(track);
  }

  clearAll() {
    const totalSteps = state.get('totalSteps');
    this.patterns.set(0, Array.from({ length: 8 }, () => new Array(totalSteps).fill(0)));
    for (let t = 1; t < TRACKS.length; t++) {
      this.melodyPatterns.set(t, new Array(totalSteps).fill(null));
    }
    eventBus.emit('sequencer:cleared');
  }

  getCurrentStep() {
    return this.currentStep;
  }

  dispose() {
    if (this.sequence) {
      this.sequence.dispose();
    }
  }
}

export const sequencer = new Sequencer();
export default sequencer;
