import { DEFAULT_STATE } from './constants.js';
import eventBus from './EventBus.js';

class StateManager {
  constructor() {
    this.state = { ...DEFAULT_STATE };
  }

  get(key) {
    return key ? this.state[key] : { ...this.state };
  }

  set(key, value) {
    const old = this.state[key];
    if (old === value) return;
    this.state[key] = value;
    eventBus.emit('state:change', { key, value, old });
    eventBus.emit(`state:${key}`, { value, old });
  }

  update(partial) {
    for (const [key, value] of Object.entries(partial)) {
      this.set(key, value);
    }
  }

  reset() {
    this.state = { ...DEFAULT_STATE };
    eventBus.emit('state:reset', this.state);
  }

  toJSON() {
    return JSON.stringify(this.state);
  }

  fromJSON(json) {
    try {
      const parsed = JSON.parse(json);
      this.state = { ...DEFAULT_STATE, ...parsed };
      eventBus.emit('state:loaded', this.state);
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }
}

export const state = new StateManager();
export default state;
