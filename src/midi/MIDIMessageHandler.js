import eventBus from '../core/EventBus.js';
import { NOTE_NAMES } from '../core/constants.js';

class MIDIMessageHandler {
  constructor() {
    this.lastCC = new Map();
    this.throttleMs = 16; // ~60fps throttle for CC
    this.lastCCTime = new Map();
  }

  init() {
    eventBus.on('midi:cc', (data) => this.throttleCC(data));
  }

  throttleCC(data) {
    const now = performance.now();
    const key = `${data.channel}:${data.cc}`;
    const last = this.lastCCTime.get(key) || 0;

    if (now - last < this.throttleMs) return;
    this.lastCCTime.set(key, now);
    this.lastCC.set(key, data.value);

    eventBus.emit('midi:cc:throttled', data);
  }

  static midiNoteToName(note) {
    const octave = Math.floor(note / 12) - 1;
    const name = NOTE_NAMES[note % 12];
    return `${name}${octave}`;
  }

  static midiNoteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  static velocityToGain(velocity) {
    return velocity / 127;
  }
}

export const midiHandler = new MIDIMessageHandler();
export default midiHandler;
