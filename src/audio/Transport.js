import * as Tone from 'tone';
import eventBus from '../core/EventBus.js';
import state from '../core/StateManager.js';

class Transport {
  constructor() {
    this.isPlaying = false;
    this.isRecording = false;
  }

  init() {
    Tone.getTransport().bpm.value = state.get('bpm');

    eventBus.on('state:bpm', ({ value }) => {
      Tone.getTransport().bpm.value = value;
    });

    eventBus.on('transport:play', () => this.play());
    eventBus.on('transport:stop', () => this.stop());
    eventBus.on('transport:toggle', () => this.toggle());
    eventBus.on('transport:setBpm', ({ bpm }) => this.setBpm(bpm));
  }

  play() {
    if (this.isPlaying) return;
    Tone.getTransport().start();
    this.isPlaying = true;
    state.set('playing', true);
    eventBus.emit('transport:started');
  }

  stop() {
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    this.isPlaying = false;
    state.set('playing', false);
    state.set('currentStep', 0);
    eventBus.emit('transport:stopped');
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.play();
  }

  setBpm(bpm) {
    const clamped = Math.max(40, Math.min(300, bpm));
    Tone.getTransport().bpm.value = clamped;
    state.set('bpm', clamped);
  }

  getBpm() {
    return Tone.getTransport().bpm.value;
  }

  getPosition() {
    return Tone.getTransport().position;
  }
}

export const transport = new Transport();
export default transport;
