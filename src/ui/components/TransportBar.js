import eventBus from '../../core/EventBus.js';
import state from '../../core/StateManager.js';

/**
 * Transport controls (play/stop/record, BPM).
 */
class TransportBar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="transport">
        <button class="transport-btn" id="btn-stop" title="Stop">
          <svg viewBox="0 0 24 24" width="20" height="20"><rect x="6" y="6" width="12" height="12" fill="currentColor"/></svg>
        </button>
        <button class="transport-btn play-btn" id="btn-play" title="Play">
          <svg viewBox="0 0 24 24" width="20" height="20"><polygon points="8,5 19,12 8,19" fill="currentColor"/></svg>
        </button>
        <div class="bpm-control">
          <button class="bpm-btn" id="bpm-down">-</button>
          <div class="bpm-display">
            <input type="number" id="bpm-input" value="${state.get('bpm')}" min="40" max="300" />
            <span class="bpm-label">BPM</span>
          </div>
          <button class="bpm-btn" id="bpm-up">+</button>
        </div>
      </div>
    `;

    this.setupEvents();
  }

  setupEvents() {
    document.getElementById('btn-play')?.addEventListener('click', () => {
      eventBus.emit('transport:toggle');
    });

    document.getElementById('btn-stop')?.addEventListener('click', () => {
      eventBus.emit('transport:stop');
    });

    const bpmInput = document.getElementById('bpm-input');
    bpmInput?.addEventListener('change', () => {
      eventBus.emit('transport:setBpm', { bpm: parseInt(bpmInput.value) || 120 });
    });

    document.getElementById('bpm-down')?.addEventListener('click', () => {
      const bpm = state.get('bpm') - 1;
      eventBus.emit('transport:setBpm', { bpm });
    });

    document.getElementById('bpm-up')?.addEventListener('click', () => {
      const bpm = state.get('bpm') + 1;
      eventBus.emit('transport:setBpm', { bpm });
    });

    // Update UI on state changes
    eventBus.on('state:bpm', ({ value }) => {
      if (bpmInput) bpmInput.value = Math.round(value);
    });

    eventBus.on('transport:started', () => {
      document.getElementById('btn-play')?.classList.add('active');
    });

    eventBus.on('transport:stopped', () => {
      document.getElementById('btn-play')?.classList.remove('active');
    });
  }
}

export default TransportBar;
