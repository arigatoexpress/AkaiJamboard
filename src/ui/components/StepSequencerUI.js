import eventBus from '../../core/EventBus.js';
import state from '../../core/StateManager.js';
import { DRUM_NAMES } from '../../core/constants.js';

/**
 * Visual step sequencer grid.
 */
class StepSequencerUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.cells = [];
    this.currentStepEl = null;
  }

  init() {
    if (!this.container) return;
    this.render();

    eventBus.on('sequencer:step', ({ step }) => this.highlightStep(step));
    eventBus.on('sequencer:patternLoaded', (data) => this.loadPattern(data.drums));
    eventBus.on('sequencer:cleared', () => this.clearGrid());
    eventBus.on('transport:stopped', () => this.highlightStep(-1));
  }

  render() {
    const steps = state.get('totalSteps');

    this.container.innerHTML = `
      <div class="step-sequencer">
        <h3 class="section-title">STEP SEQUENCER</h3>
        <div class="seq-grid">
          <div class="seq-labels">
            ${DRUM_NAMES.map((name) => `<div class="seq-label">${name}</div>`).join('')}
          </div>
          <div class="seq-steps">
            ${DRUM_NAMES.map((_, row) => `
              <div class="seq-row" data-row="${row}">
                ${Array.from({ length: steps }, (_, step) => `
                  <div class="seq-cell" data-row="${row}" data-step="${step}"
                       data-beat="${step % 4 === 0 ? 'downbeat' : ''}"></div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="seq-step-indicators">
          ${Array.from({ length: steps }, (_, i) => `
            <div class="step-indicator" data-step="${i}">${i + 1}</div>
          `).join('')}
        </div>
      </div>
    `;

    // Cache cells for fast access
    this.cells = [];
    for (let row = 0; row < DRUM_NAMES.length; row++) {
      this.cells[row] = [...this.container.querySelectorAll(`.seq-cell[data-row="${row}"]`)];
    }

    // Click to toggle steps
    this.container.querySelectorAll('.seq-cell').forEach((cell) => {
      cell.addEventListener('click', () => {
        const row = parseInt(cell.dataset.row);
        const step = parseInt(cell.dataset.step);
        cell.classList.toggle('active');
        eventBus.emit('sequencer:toggleStep', { track: 0, row, step });
      });
    });
  }

  loadPattern(drumPattern) {
    if (!drumPattern) return;
    drumPattern.forEach((row, rowIdx) => {
      if (!this.cells[rowIdx]) return;
      row.forEach((velocity, step) => {
        const cell = this.cells[rowIdx][step];
        if (cell) {
          cell.classList.toggle('active', velocity > 0);
          if (velocity > 0) {
            const intensity = Math.round((velocity / 127) * 100);
            cell.style.setProperty('--cell-intensity', `${intensity}%`);
          }
        }
      });
    });
  }

  highlightStep(step) {
    // Remove previous highlight
    this.container.querySelectorAll('.step-current').forEach((el) => {
      el.classList.remove('step-current');
    });

    if (step < 0) return;

    // Highlight current step column
    for (let row = 0; row < this.cells.length; row++) {
      if (this.cells[row] && this.cells[row][step]) {
        this.cells[row][step].classList.add('step-current');
      }
    }

    // Update step indicator
    const indicators = this.container.querySelectorAll('.step-indicator');
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === step);
    });
  }

  clearGrid() {
    this.container.querySelectorAll('.seq-cell').forEach((cell) => {
      cell.classList.remove('active');
    });
  }
}

export default StepSequencerUI;
