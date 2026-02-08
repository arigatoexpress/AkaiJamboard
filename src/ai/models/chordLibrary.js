/**
 * Chord library and progression templates for AI generation.
 */

// Chord intervals relative to root
export const chordTypes = {
  major:    [0, 4, 7],
  minor:    [0, 3, 7],
  dim:      [0, 3, 6],
  aug:      [0, 4, 8],
  sus2:     [0, 2, 7],
  sus4:     [0, 5, 7],
  dom7:     [0, 4, 7, 10],
  maj7:     [0, 4, 7, 11],
  min7:     [0, 3, 7, 10],
  dim7:     [0, 3, 6, 9],
  min9:     [0, 3, 7, 10, 14],
  maj9:     [0, 4, 7, 11, 14],
};

// Common progressions by Roman numeral (1-indexed scale degree, with quality)
export const progressions = {
  pop: [
    { name: 'I-V-vi-IV', degrees: [1, 5, 6, 4], qualities: ['major', 'major', 'minor', 'major'] },
    { name: 'vi-IV-I-V', degrees: [6, 4, 1, 5], qualities: ['minor', 'major', 'major', 'major'] },
    { name: 'I-vi-IV-V', degrees: [1, 6, 4, 5], qualities: ['major', 'minor', 'major', 'major'] },
  ],
  jazz: [
    { name: 'ii-V-I', degrees: [2, 5, 1], qualities: ['min7', 'dom7', 'maj7'] },
    { name: 'I-vi-ii-V', degrees: [1, 6, 2, 5], qualities: ['maj7', 'min7', 'min7', 'dom7'] },
  ],
  hiphop: [
    { name: 'i-VI-III-VII', degrees: [1, 6, 3, 7], qualities: ['minor', 'major', 'major', 'major'] },
    { name: 'i-iv-VI-V', degrees: [1, 4, 6, 5], qualities: ['minor', 'minor', 'major', 'major'] },
    { name: 'i-VII-VI-V', degrees: [1, 7, 6, 5], qualities: ['min7', 'dom7', 'major', 'major'] },
  ],
  house: [
    { name: 'i-i-IV-IV', degrees: [1, 1, 4, 4], qualities: ['minor', 'minor', 'major', 'major'] },
    { name: 'vi-IV-I-V', degrees: [6, 4, 1, 5], qualities: ['minor', 'major', 'major', 'major'] },
  ],
  lofi: [
    { name: 'ii-V-I-vi', degrees: [2, 5, 1, 6], qualities: ['min9', 'dom7', 'maj9', 'min7'] },
    { name: 'I-iii-vi-IV', degrees: [1, 3, 6, 4], qualities: ['maj7', 'min7', 'min7', 'maj7'] },
  ],
};

// Scale degree to semitones in major scale
export const majorScaleDegrees = [0, 2, 4, 5, 7, 9, 11];

// Scale degree to semitones in minor scale
export const minorScaleDegrees = [0, 2, 3, 5, 7, 8, 10];

export default { chordTypes, progressions, majorScaleDegrees, minorScaleDegrees };
