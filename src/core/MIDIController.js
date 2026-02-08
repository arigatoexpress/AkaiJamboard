import eventBus from './EventBus.js';
import { MIDI_MSG } from './constants.js';

class MIDIController {
  constructor() {
    this.midiAccess = null;
    this.inputs = [];
    this.outputs = [];
    this.connected = false;
    this.activeInput = null;
  }

  async init() {
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not supported');
      eventBus.emit('midi:unsupported');
      return false;
    }
    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      this.midiAccess.onstatechange = (e) => this.onStateChange(e);
      this.scanDevices();
      return true;
    } catch (err) {
      console.error('MIDI access denied:', err);
      eventBus.emit('midi:error', err);
      return false;
    }
  }

  scanDevices() {
    this.inputs = [];
    this.outputs = [];

    for (const input of this.midiAccess.inputs.values()) {
      this.inputs.push(input);
    }
    for (const output of this.midiAccess.outputs.values()) {
      this.outputs.push(output);
    }

    // Auto-connect to AKAI device or first available
    const akaiInput = this.inputs.find(
      (i) => i.name && i.name.toLowerCase().includes('apk')
    );
    const target = akaiInput || this.inputs[0];

    if (target) {
      this.connect(target);
    }

    eventBus.emit('midi:devices', {
      inputs: this.inputs.map((i) => ({ id: i.id, name: i.name })),
      outputs: this.outputs.map((o) => ({ id: o.id, name: o.name })),
    });
  }

  connect(input) {
    if (this.activeInput) {
      this.activeInput.onmidimessage = null;
    }
    this.activeInput = input;
    input.onmidimessage = (msg) => this.onMessage(msg);
    this.connected = true;
    eventBus.emit('midi:connected', { name: input.name, id: input.id });
    console.log(`MIDI connected: ${input.name}`);
  }

  onMessage(msg) {
    const [status, data1, data2] = msg.data;
    const type = status & 0xf0;
    const channel = status & 0x0f;

    const parsed = { type, channel, data1, data2, timestamp: msg.timeStamp };

    switch (type) {
      case MIDI_MSG.NOTE_ON:
        if (data2 > 0) {
          eventBus.emit('midi:noteon', { note: data1, velocity: data2, channel });
        } else {
          eventBus.emit('midi:noteoff', { note: data1, channel });
        }
        break;
      case MIDI_MSG.NOTE_OFF:
        eventBus.emit('midi:noteoff', { note: data1, channel });
        break;
      case MIDI_MSG.CC:
        eventBus.emit('midi:cc', { cc: data1, value: data2, channel });
        break;
      case MIDI_MSG.PITCH_BEND:
        eventBus.emit('midi:pitchbend', { value: (data2 << 7) | data1, channel });
        break;
    }

    eventBus.emit('midi:message', parsed);
  }

  onStateChange(e) {
    console.log(`MIDI device ${e.port.name}: ${e.port.state}`);
    this.scanDevices();
    eventBus.emit('midi:statechange', {
      name: e.port.name,
      state: e.port.state,
      type: e.port.type,
    });
  }

  sendNoteOn(note, velocity = 127, channel = 0) {
    const output = this.outputs[0];
    if (output) output.send([MIDI_MSG.NOTE_ON | channel, note, velocity]);
  }

  sendNoteOff(note, channel = 0) {
    const output = this.outputs[0];
    if (output) output.send([MIDI_MSG.NOTE_OFF | channel, note, 0]);
  }

  isConnected() {
    return this.connected;
  }
}

export const midiController = new MIDIController();
export default midiController;
