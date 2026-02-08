import eventBus from '../../core/EventBus.js';

const EFFECT_PARAMS = [
  { id: 'reverbMix', label: 'Reverb Mix', default: 20 },
  { id: 'reverbDecay', label: 'Rev Decay', default: 30 },
  { id: 'delayMix', label: 'Delay Mix', default: 15 },
  { id: 'delayFeedback', label: 'Delay FB', default: 30 },
  { id: 'filterCutoff', label: 'Filter', default: 80 },
  { id: 'distortion', label: 'Distort', default: 0 },
];

/**
 * Effects parameter control panel.
 */
class EffectsPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="effects-panel">
        <h3 class="section-title">EFFECTS</h3>
        <div class="effects-grid">
          ${EFFECT_PARAMS.map((p) => `
            <div class="effect-control">
              <label>${p.label}</label>
              <input type="range" class="effect-slider" data-param="${p.id}"
                     min="0" max="100" value="${p.default}" />
              <span class="effect-value">${p.default}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.container.querySelectorAll('.effect-slider').forEach((slider) => {
      slider.addEventListener('input', () => {
        const param = slider.dataset.param;
        const value = slider.value / 100;
        const display = slider.parentElement.querySelector('.effect-value');
        if (display) display.textContent = slider.value;
        eventBus.emit('effects:setParam', { param, value });
      });
    });
  }
}

export default EffectsPanel;
