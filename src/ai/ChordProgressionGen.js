import { progressions, chordTypes, majorScaleDegrees, minorScaleDegrees } from './models/chordLibrary.js';
import { noteNameToMidi } from './models/scaleTheory.js';

/**
 * AI chord progression generator.
 */
class ChordProgressionGen {
  /**
   * Generate a chord progression for a given genre.
   */
  generate(genre = 'hiphop', rootNote = 'C', octave = 3, isMinor = true) {
    const genreProgs = progressions[genre] || progressions.hiphop;
    const template = genreProgs[Math.floor(Math.random() * genreProgs.length)];

    const scaleDegrees = isMinor ? minorScaleDegrees : majorScaleDegrees;
    const rootMidi = noteNameToMidi(rootNote, octave);

    const chords = template.degrees.map((degree, idx) => {
      const degreeIndex = (degree - 1) % 7;
      const semitones = scaleDegrees[degreeIndex];
      const chordRoot = rootMidi + semitones;
      const quality = template.qualities[idx];
      const intervals = chordTypes[quality] || chordTypes.minor;
      const notes = intervals.map((i) => chordRoot + i);

      return {
        root: chordRoot,
        notes,
        quality,
        degree,
        name: `${this.midiToName(chordRoot)} ${quality}`,
      };
    });

    return {
      name: template.name,
      chords,
      rootNote,
      octave,
      isMinor,
    };
  }

  /**
   * Convert chord progression to sequencer-ready format.
   * Each chord lasts stepsPerChord steps.
   */
  toSequence(progression, totalSteps = 16) {
    const stepsPerChord = Math.floor(totalSteps / progression.chords.length);
    const sequence = [];

    for (let step = 0; step < totalSteps; step++) {
      const chordIdx = Math.min(
        Math.floor(step / stepsPerChord),
        progression.chords.length - 1
      );
      const chord = progression.chords[chordIdx];

      // Play chord on first step of each chord change, sustain on others
      if (step % stepsPerChord === 0) {
        sequence.push({ step, notes: chord.notes, velocity: 80, trigger: true });
      } else {
        sequence.push({ step, notes: chord.notes, velocity: 0, trigger: false });
      }
    }

    return sequence;
  }

  midiToName(midi) {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return names[midi % 12];
  }
}

export const chordGen = new ChordProgressionGen();
export default chordGen;
