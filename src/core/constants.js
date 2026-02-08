// AKAI APK Mini MIDI mappings
export const AKAI_APK_MINI = {
  name: 'APK Mini',
  // Pad note numbers (Bank A)
  PADS_BANK_A: [36, 37, 38, 39, 40, 41, 42, 43],
  // Pad note numbers (Bank B)
  PADS_BANK_B: [48, 49, 50, 51, 52, 53, 54, 55],
  // Knob CC numbers
  KNOBS: [1, 2, 3, 4, 5, 6, 7, 8],
  // Keyboard range (25 keys)
  KEY_START: 48,
  KEY_END: 72,
  CHANNEL: 0,
};

// Drum names mapped to pad positions
export const DRUM_NAMES = [
  'Kick', 'Snare', 'Closed HH', 'Open HH',
  'Clap', 'Tom Lo', 'Tom Hi', 'Crash',
];

// Musical scales
export const SCALES = {
  major:        [0, 2, 4, 5, 7, 9, 11],
  minor:        [0, 2, 3, 5, 7, 8, 10],
  dorian:       [0, 2, 3, 5, 7, 9, 10],
  mixolydian:   [0, 2, 4, 5, 7, 9, 10],
  pentatonic:   [0, 2, 4, 7, 9],
  minorPenta:   [0, 3, 5, 7, 10],
  blues:        [0, 3, 5, 6, 7, 10],
  chromatic:    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

// Note names
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Genre templates for AI
export const GENRES = {
  house:    { bpm: 124, swing: 0,    feel: '4-on-floor' },
  techno:   { bpm: 130, swing: 0,    feel: 'driving' },
  hiphop:   { bpm: 90,  swing: 0.3,  feel: 'boom-bap' },
  trap:     { bpm: 140, swing: 0.15, feel: 'trap' },
  dnb:      { bpm: 174, swing: 0,    feel: 'breakbeat' },
  lofi:     { bpm: 80,  swing: 0.4,  feel: 'lofi' },
  funk:     { bpm: 110, swing: 0.25, feel: 'funky' },
  ambient:  { bpm: 70,  swing: 0,    feel: 'ambient' },
};

// Default app state
export const DEFAULT_STATE = {
  bpm: 120,
  swing: 0,
  playing: false,
  recording: false,
  currentStep: 0,
  totalSteps: 16,
  activeTrack: 0,
  genre: 'hiphop',
  rootNote: 'C',
  scale: 'minor',
  octave: 3,
  masterVolume: 0.8,
};

// MIDI message types
export const MIDI_MSG = {
  NOTE_ON: 0x90,
  NOTE_OFF: 0x80,
  CC: 0xB0,
  PITCH_BEND: 0xE0,
};

// Sequencer track config
export const TRACKS = [
  { id: 0, name: 'Drums',  type: 'drums',  color: '#ff3366' },
  { id: 1, name: 'Bass',   type: 'bass',   color: '#33ccff' },
  { id: 2, name: 'Lead',   type: 'melody', color: '#ffcc33' },
  { id: 3, name: 'Chords', type: 'chords', color: '#66ff99' },
];
