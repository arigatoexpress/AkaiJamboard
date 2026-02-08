import { getScaleNotes, midiToNoteName } from './models/scaleTheory.js';

/**
 * AI melody generator using scale-based algorithms.
 */
class MelodyGenerator {
  /**
   * Generate a melody over a given number of steps.
   */
  generate(rootNote = 'C', scale = 'minor', octave = 4, steps = 16, density = 0.5) {
    const scaleNotes = [
      ...getScaleNotes(rootNote, scale, octave - 1),
      ...getScaleNotes(rootNote, scale, octave),
      ...getScaleNotes(rootNote, scale, octave + 1),
    ];

    const melody = new Array(steps).fill(null);
    const centerIdx = Math.floor(scaleNotes.length / 2);
    let currentIdx = centerIdx;

    for (let step = 0; step < steps; step++) {
      // Decide if this step has a note
      if (Math.random() > density) {
        melody[step] = null;
        continue;
      }

      // Stepwise or skip motion
      const motion = this.getMotion();
      currentIdx = Math.max(0, Math.min(scaleNotes.length - 1, currentIdx + motion));

      const note = scaleNotes[currentIdx];
      const velocity = this.getVelocity(step, steps);

      melody[step] = {
        note,
        noteName: midiToNoteName(note),
        velocity,
        duration: this.getDuration(),
      };
    }

    // Ensure first beat has a note
    if (!melody[0]) {
      melody[0] = {
        note: scaleNotes[centerIdx],
        noteName: midiToNoteName(scaleNotes[centerIdx]),
        velocity: 90,
        duration: '8n',
      };
    }

    return melody;
  }

  /**
   * Generate a bassline (simpler, lower notes, root-heavy).
   */
  generateBass(rootNote = 'C', scale = 'minor', octave = 2, steps = 16, density = 0.4) {
    const scaleNotes = getScaleNotes(rootNote, scale, octave);
    const melody = new Array(steps).fill(null);
    const root = scaleNotes[0];
    const fifth = scaleNotes[4] || scaleNotes[3];

    for (let step = 0; step < steps; step++) {
      if (Math.random() > density) {
        melody[step] = null;
        continue;
      }

      // Basslines favor root and fifth
      let note;
      const r = Math.random();
      if (r < 0.4) note = root;
      else if (r < 0.65) note = fifth;
      else note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];

      melody[step] = {
        note,
        noteName: midiToNoteName(note),
        velocity: 70 + Math.floor(Math.random() * 40),
        duration: '8n',
      };
    }

    // Root on beat 1
    melody[0] = {
      note: root,
      noteName: midiToNoteName(root),
      velocity: 100,
      duration: '4n',
    };

    return melody;
  }

  getMotion() {
    const r = Math.random();
    if (r < 0.5) return Math.random() < 0.5 ? 1 : -1;  // step
    if (r < 0.8) return Math.random() < 0.5 ? 2 : -2;  // skip
    if (r < 0.95) return 0;                              // repeat
    return Math.random() < 0.5 ? 3 : -3;                // leap
  }

  getVelocity(step, totalSteps) {
    // Accent on beats 1 and 3 (in 16-step = steps 0, 8)
    const isDownbeat = step % (totalSteps / 2) === 0;
    const isQuarterNote = step % 4 === 0;
    const base = isDownbeat ? 90 : isQuarterNote ? 75 : 60;
    return Math.min(127, base + Math.floor(Math.random() * 20));
  }

  getDuration() {
    const r = Math.random();
    if (r < 0.4) return '16n';
    if (r < 0.75) return '8n';
    if (r < 0.9) return '4n';
    return '2n';
  }
}

export const melodyGenerator = new MelodyGenerator();
export default melodyGenerator;
