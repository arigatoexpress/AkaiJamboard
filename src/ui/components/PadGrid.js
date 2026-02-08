import eventBus from '../../core/EventBus.js';
import { DRUM_NAMES } from '../../core/constants.js';

/**
 * 8-pad grid UI component for drum triggering.
 */
class PadGrid {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.pads = [];
    this.activeTimeouts = new Map();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="pad-grid">
        <h3 class="section-title">PADS</h3>
        <div class="pads-wrapper">
          ${DRUM_NAMES.map((name, i) => `
            <button class="pad" data-pad="${i}" data-name="${name}">
              <span class="pad-label">${name}</span>
              <span class="pad-velocity"></span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.pads = [...this.container.querySelectorAll('.pad')];

    // Mouse/touch triggers
    this.pads.forEach((pad, i) => {
      pad.addEventListener('mousedown', () => {
        eventBus.emit('pad:trigger', { pad: i, velocity: 100 });
      });
      pad.addEventListener('mouseup', () => {
        eventBus.emit('pad:release', { pad: i });
      });
    });

    // Visual feedback from events
    eventBus.on('drum:triggered', ({ index, velocity }) => {
      this.flashPad(index, velocity);
    });

    eventBus.on('pad:release', ({ pad }) => {
      this.releasePad(pad);
    });
  }

  flashPad(index, velocity) {
    const pad = this.pads[index];
    if (!pad) return;

    const intensity = Math.round((velocity / 127) * 100);
    pad.classList.add('active');
    pad.style.setProperty('--pad-intensity', `${intensity}%`);
    pad.querySelector('.pad-velocity').textContent = Math.round(velocity * 127) || '';

    clearTimeout(this.activeTimeouts.get(index));
    this.activeTimeouts.set(index, setTimeout(() => {
      pad.classList.remove('active');
      pad.querySelector('.pad-velocity').textContent = '';
    }, 150));
  }

  releasePad(index) {
    const pad = this.pads[index];
    if (pad) pad.classList.remove('active');
  }
}

export default PadGrid;
