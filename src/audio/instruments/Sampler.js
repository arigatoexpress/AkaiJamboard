import * as Tone from 'tone';
import eventBus from '../../core/EventBus.js';

/**
 * Audio sample player for loading and playing back user samples.
 */
class SamplePlayer {
  constructor() {
    this.players = new Map();
    this.output = null;
  }

  init(outputChannel) {
    this.output = outputChannel;
  }

  async loadSample(id, url) {
    try {
      const player = new Tone.Player(url).connect(this.output);
      await Tone.loaded();
      this.players.set(id, player);
      eventBus.emit('sampler:loaded', { id, url });
      return true;
    } catch (err) {
      console.error(`Failed to load sample ${id}:`, err);
      return false;
    }
  }

  trigger(id, time) {
    const player = this.players.get(id);
    if (player && player.loaded) {
      player.start(time);
    }
  }

  stop(id) {
    const player = this.players.get(id);
    if (player) player.stop();
  }

  setPlaybackRate(id, rate) {
    const player = this.players.get(id);
    if (player) player.playbackRate = rate;
  }

  removeSample(id) {
    const player = this.players.get(id);
    if (player) {
      player.dispose();
      this.players.delete(id);
    }
  }

  dispose() {
    for (const player of this.players.values()) {
      player.dispose();
    }
    this.players.clear();
  }
}

export const samplePlayer = new SamplePlayer();
export default samplePlayer;
