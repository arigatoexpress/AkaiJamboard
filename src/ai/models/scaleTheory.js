import { SCALES, NOTE_NAMES } from '../../core/constants.js';

/**
 * Music theory utilities for AI generation.
 */

export function noteNameToMidi(name, octave = 3) {
  const idx = NOTE_NAMES.indexOf(name);
  if (idx === -1) return 60;
  return (octave + 1) * 12 + idx;
}

export function midiToNoteName(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[midi % 12]}${octave}`;
}

export function getScaleNotes(root, scaleName, octave = 3) {
  const scale = SCALES[scaleName] || SCALES.minor;
  const rootMidi = noteNameToMidi(root, octave);
  return scale.map((interval) => rootMidi + interval);
}

export function getScaleNotesMultiOctave(root, scaleName, startOctave = 2, endOctave = 5) {
  const notes = [];
  for (let oct = startOctave; oct <= endOctave; oct++) {
    notes.push(...getScaleNotes(root, scaleName, oct));
  }
  return notes;
}

export function quantizeToScale(midiNote, root, scaleName) {
  const scale = SCALES[scaleName] || SCALES.minor;
  const rootPitch = NOTE_NAMES.indexOf(root);
  const relative = ((midiNote % 12) - rootPitch + 12) % 12;

  let closest = scale[0];
  let minDist = 12;
  for (const interval of scale) {
    const dist = Math.abs(relative - interval);
    if (dist < minDist) {
      minDist = dist;
      closest = interval;
    }
  }

  const octave = Math.floor(midiNote / 12);
  return octave * 12 + ((rootPitch + closest) % 12);
}

export function getChordNotes(rootMidi, intervals) {
  return intervals.map((i) => rootMidi + i);
}

export function intervalName(semitones) {
  const names = [
    'Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd',
    'Perfect 4th', 'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th',
    'Minor 7th', 'Major 7th', 'Octave',
  ];
  return names[semitones % 13] || `${semitones} semitones`;
}

export default {
  noteNameToMidi,
  midiToNoteName,
  getScaleNotes,
  getScaleNotesMultiOctave,
  quantizeToScale,
  getChordNotes,
  intervalName,
};
