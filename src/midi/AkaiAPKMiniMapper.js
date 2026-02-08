import eventBus from '../core/EventBus.js';
import { AKAI_APK_MINI } from '../core/constants.js';

class AkaiAPKMiniMapper {
  constructor() {
    this.padBank = 'A';
    this.knobMap = [
      { target: 'mixer', param: 'volume', track: 0 },
      { target: 'mixer', param: 'volume', track: 1 },
      { target: 'mixer', param: 'volume', track: 2 },
      { target: 'mixer', param: 'volume', track: 3 },
      { target: 'effect', param: 'reverbMix' },
      { target: 'effect', param: 'delayTime' },
      { target: 'effect', param: 'filterCutoff' },
      { target: 'effect', param: 'distortion' },
    ];
  }

  init() {
    eventBus.on('midi:noteon', (data) => this.handleNoteOn(data));
    eventBus.on('midi:noteoff', (data) => this.handleNoteOff(data));
    eventBus.on('midi:cc', (data) => this.handleCC(data));
  }

  handleNoteOn({ note, velocity }) {
    const pads = this.padBank === 'A'
      ? AKAI_APK_MINI.PADS_BANK_A
      : AKAI_APK_MINI.PADS_BANK_B;

    const padIndex = pads.indexOf(note);
    if (padIndex !== -1) {
      eventBus.emit('pad:trigger', { pad: padIndex, velocity });
      return;
    }

    if (note >= AKAI_APK_MINI.KEY_START && note <= AKAI_APK_MINI.KEY_END) {
      eventBus.emit('key:press', { note, velocity });
    }
  }

  handleNoteOff({ note }) {
    const pads = this.padBank === 'A'
      ? AKAI_APK_MINI.PADS_BANK_A
      : AKAI_APK_MINI.PADS_BANK_B;

    const padIndex = pads.indexOf(note);
    if (padIndex !== -1) {
      eventBus.emit('pad:release', { pad: padIndex });
      return;
    }

    if (note >= AKAI_APK_MINI.KEY_START && note <= AKAI_APK_MINI.KEY_END) {
      eventBus.emit('key:release', { note });
    }
  }

  handleCC({ cc, value }) {
    const knobIndex = AKAI_APK_MINI.KNOBS.indexOf(cc);
    if (knobIndex !== -1) {
      const mapping = this.knobMap[knobIndex];
      const normalized = value / 127;
      eventBus.emit('knob:change', {
        knob: knobIndex,
        value: normalized,
        rawValue: value,
        ...mapping,
      });
    }
  }

  setPadBank(bank) {
    this.padBank = bank;
    eventBus.emit('midi:bankchange', { bank });
  }

  setKnobMapping(knobIndex, mapping) {
    if (knobIndex >= 0 && knobIndex < 8) {
      this.knobMap[knobIndex] = mapping;
    }
  }
}

export const akaiMapper = new AkaiAPKMiniMapper();
export default akaiMapper;
