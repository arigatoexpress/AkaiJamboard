import eventBus from '../../core/EventBus.js';

const KNOB_LABELS = [
  'Drums Vol', 'Bass Vol', 'Lead Vol', 'Chords Vol',
  'Reverb', 'Delay', 'Filter', 'Distort',
];

/**
 * 8-knob controller UI component.
 */
class KnobController {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.knobs = [];
    this.values = new Array(8).fill(0.5);
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="knob-controller">
        <h3 class="section-title">KNOBS</h3>
        <div class="knobs-wrapper">
          ${KNOB_LABELS.map((label, i) => `
            <div class="knob-wrap" data-knob="${i}">
              <div class="knob" data-knob="${i}">
                <div class="knob-indicator"></div>
              </div>
              <span class="knob-value">${Math.round(this.values[i] * 100)}</span>
              <span class="knob-label">${label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.knobs = [...this.container.querySelectorAll('.knob-wrap')];
    this.setupInteraction();

    eventBus.on('knob:change', ({ knob, value }) => {
      this.updateKnob(knob, value);
    });
  }

  setupInteraction() {
    this.knobs.forEach((wrap, i) => {
      const knob = wrap.querySelector('.knob');
      let dragging = false;
      let startY = 0;
      let startValue = 0;

      knob.addEventListener('mousedown', (e) => {
        dragging = true;
        startY = e.clientY;
        startValue = this.values[i];
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const delta = (startY - e.clientY) / 150;
        const newValue = Math.max(0, Math.min(1, startValue + delta));
        this.values[i] = newValue;
        this.updateKnob(i, newValue);
        this.emitKnobChange(i, newValue);
      });

      document.addEventListener('mouseup', () => {
        dragging = false;
      });
    });
  }

  updateKnob(index, value) {
    const wrap = this.knobs[index];
    if (!wrap) return;

    this.values[index] = value;
    const rotation = -135 + value * 270;
    const indicator = wrap.querySelector('.knob-indicator');
    const display = wrap.querySelector('.knob-value');

    if (indicator) indicator.style.transform = `rotate(${rotation}deg)`;
    if (display) display.textContent = Math.round(value * 100);
  }

  emitKnobChange(index, value) {
    if (index < 4) {
      eventBus.emit('knob:change', {
        knob: index, value, target: 'mixer', param: 'volume', track: index,
      });
    } else {
      const params = ['reverbMix', 'delayMix', 'filterCutoff', 'distortion'];
      eventBus.emit('knob:change', {
        knob: index, value, target: 'effect', param: params[index - 4],
      });
    }
  }
}

export default KnobController;
