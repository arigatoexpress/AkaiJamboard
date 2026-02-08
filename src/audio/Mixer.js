import * as Tone from 'tone';
import eventBus from '../core/EventBus.js';
import audioEngine from '../core/AudioEngine.js';
import { TRACKS } from '../core/constants.js';

class Mixer {
  constructor() {
    this.channels = new Map();
    this.muted = new Map();
    this.soloed = new Map();
  }

  init() {
    const master = audioEngine.getMaster();

    for (const track of TRACKS) {
      const channel = new Tone.Channel({
        volume: -6,
        pan: 0,
      }).connect(master);

      this.channels.set(track.id, channel);
      this.muted.set(track.id, false);
      this.soloed.set(track.id, false);
    }

    eventBus.on('knob:change', (data) => {
      if (data.target === 'mixer' && data.param === 'volume') {
        this.setVolume(data.track, data.value);
      }
    });

    eventBus.on('mixer:setVolume', ({ track, value }) => this.setVolume(track, value));
    eventBus.on('mixer:setPan', ({ track, value }) => this.setPan(track, value));
    eventBus.on('mixer:toggleMute', ({ track }) => this.toggleMute(track));
    eventBus.on('mixer:toggleSolo', ({ track }) => this.toggleSolo(track));
  }

  getChannel(trackId) {
    return this.channels.get(trackId);
  }

  setVolume(trackId, normalized) {
    const channel = this.channels.get(trackId);
    if (channel) {
      // Convert 0-1 to dB range (-60 to 0)
      const db = normalized <= 0 ? -Infinity : -60 + normalized * 60;
      channel.volume.value = db;
      eventBus.emit('mixer:volumeChanged', { track: trackId, value: normalized, db });
    }
  }

  setPan(trackId, normalized) {
    const channel = this.channels.get(trackId);
    if (channel) {
      // Convert 0-1 to -1 to 1
      channel.pan.value = (normalized * 2) - 1;
      eventBus.emit('mixer:panChanged', { track: trackId, value: normalized });
    }
  }

  toggleMute(trackId) {
    const muted = !this.muted.get(trackId);
    this.muted.set(trackId, muted);
    const channel = this.channels.get(trackId);
    if (channel) channel.mute = muted;
    eventBus.emit('mixer:muteChanged', { track: trackId, muted });
  }

  toggleSolo(trackId) {
    const soloed = !this.soloed.get(trackId);
    this.soloed.set(trackId, soloed);

    const anySoloed = [...this.soloed.values()].some((s) => s);

    for (const [id, channel] of this.channels) {
      if (anySoloed) {
        channel.mute = !this.soloed.get(id);
      } else {
        channel.mute = this.muted.get(id);
      }
    }

    eventBus.emit('mixer:soloChanged', { track: trackId, soloed });
  }

  getState() {
    const result = {};
    for (const track of TRACKS) {
      result[track.id] = {
        volume: this.channels.get(track.id)?.volume.value,
        pan: this.channels.get(track.id)?.pan.value,
        muted: this.muted.get(track.id),
        soloed: this.soloed.get(track.id),
      };
    }
    return result;
  }

  dispose() {
    for (const channel of this.channels.values()) {
      channel.dispose();
    }
  }
}

export const mixer = new Mixer();
export default mixer;
