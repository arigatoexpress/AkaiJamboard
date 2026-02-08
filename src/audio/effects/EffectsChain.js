import * as Tone from 'tone';
import eventBus from '../../core/EventBus.js';
import audioEngine from '../../core/AudioEngine.js';

/**
 * Master effects chain with send/return architecture.
 */
class EffectsChain {
  constructor() {
    this.reverb = null;
    this.delay = null;
    this.filter = null;
    this.distortion = null;
    this.effects = {};
  }

  init() {
    const master = audioEngine.getMaster();

    this.reverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0.2,
      preDelay: 0.01,
    }).connect(master);

    this.delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.3,
      wet: 0.15,
    }).connect(master);

    this.filter = new Tone.Filter({
      frequency: 5000,
      type: 'lowpass',
      rolloff: -12,
    }).connect(master);

    this.distortion = new Tone.Distortion({
      distortion: 0,
      wet: 0,
    }).connect(master);

    this.effects = {
      reverb: this.reverb,
      delay: this.delay,
      filter: this.filter,
      distortion: this.distortion,
    };

    // Listen for knob changes mapped to effects
    eventBus.on('knob:change', (data) => {
      if (data.target === 'effect') {
        this.setParam(data.param, data.value);
      }
    });

    eventBus.on('effects:setParam', ({ param, value }) => this.setParam(param, value));
  }

  setParam(param, value) {
    switch (param) {
      case 'reverbMix':
        this.reverb.wet.value = value;
        break;
      case 'reverbDecay':
        this.reverb.decay = 0.5 + value * 8;
        break;
      case 'delayTime':
        this.delay.delayTime.value = 0.05 + value * 0.95;
        break;
      case 'delayFeedback':
        this.delay.feedback.value = value * 0.85;
        break;
      case 'delayMix':
        this.delay.wet.value = value;
        break;
      case 'filterCutoff':
        this.filter.frequency.value = 100 + value * 9900;
        break;
      case 'filterResonance':
        this.filter.Q.value = 0.5 + value * 15;
        break;
      case 'distortion':
        this.distortion.distortion = value;
        this.distortion.wet.value = value > 0 ? 1 : 0;
        break;
    }
    eventBus.emit('effects:paramChanged', { param, value });
  }

  getEffect(name) {
    return this.effects[name];
  }

  dispose() {
    Object.values(this.effects).forEach((fx) => fx.dispose());
  }
}

export const effectsChain = new EffectsChain();
export default effectsChain;
