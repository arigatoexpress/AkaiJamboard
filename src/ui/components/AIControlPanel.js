import eventBus from '../../core/EventBus.js';
import state from '../../core/StateManager.js';
import { GENRES, NOTE_NAMES, SCALES } from '../../core/constants.js';

/**
 * AI generation controls panel.
 */
class AIControlPanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.complexity = 0.5;
  }

  init() {
    if (!this.container) return;

    const genreOptions = Object.keys(GENRES)
      .map((g) => `<option value="${g}" ${g === state.get('genre') ? 'selected' : ''}>${g.toUpperCase()}</option>`)
      .join('');

    const noteOptions = NOTE_NAMES
      .map((n) => `<option value="${n}" ${n === state.get('rootNote') ? 'selected' : ''}>${n}</option>`)
      .join('');

    const scaleOptions = Object.keys(SCALES)
      .map((s) => `<option value="${s}" ${s === state.get('scale') ? 'selected' : ''}>${s}</option>`)
      .join('');

    this.container.innerHTML = `
      <div class="ai-panel">
        <h3 class="section-title">AI ENGINE</h3>
        <div class="ai-controls">
          <div class="ai-row">
            <label>Genre</label>
            <select id="ai-genre">${genreOptions}</select>
          </div>
          <div class="ai-row">
            <label>Key</label>
            <select id="ai-root">${noteOptions}</select>
          </div>
          <div class="ai-row">
            <label>Scale</label>
            <select id="ai-scale">${scaleOptions}</select>
          </div>
          <div class="ai-row">
            <label>Complexity</label>
            <input type="range" id="ai-complexity" min="0" max="100" value="50" />
          </div>
          <div class="ai-buttons">
            <button class="ai-btn generate" id="ai-generate">GENERATE</button>
            <button class="ai-btn variation" id="ai-variation">VARIATION</button>
            <button class="ai-btn randomize" id="ai-randomize">RANDOM</button>
            <button class="ai-btn clear" id="ai-clear">CLEAR</button>
          </div>
        </div>
      </div>
    `;

    this.setupEvents();
  }

  setupEvents() {
    document.getElementById('ai-generate')?.addEventListener('click', () => {
      eventBus.emit('ai:generate', this.getParams());
    });

    document.getElementById('ai-variation')?.addEventListener('click', () => {
      eventBus.emit('ai:variation');
    });

    document.getElementById('ai-randomize')?.addEventListener('click', () => {
      eventBus.emit('ai:randomize');
    });

    document.getElementById('ai-clear')?.addEventListener('click', () => {
      eventBus.emit('sequencer:clear');
    });

    document.getElementById('ai-genre')?.addEventListener('change', (e) => {
      state.set('genre', e.target.value);
    });

    document.getElementById('ai-root')?.addEventListener('change', (e) => {
      state.set('rootNote', e.target.value);
    });

    document.getElementById('ai-scale')?.addEventListener('change', (e) => {
      state.set('scale', e.target.value);
    });

    document.getElementById('ai-complexity')?.addEventListener('input', (e) => {
      this.complexity = e.target.value / 100;
    });

    // Update selects when AI randomizes
    eventBus.on('ai:generated', (data) => {
      if (data.genre) {
        const genreSelect = document.getElementById('ai-genre');
        if (genreSelect) genreSelect.value = data.genre;
      }
      if (data.rootNote) {
        const rootSelect = document.getElementById('ai-root');
        if (rootSelect) rootSelect.value = data.rootNote;
      }
      if (data.scale) {
        const scaleSelect = document.getElementById('ai-scale');
        if (scaleSelect) scaleSelect.value = data.scale;
      }
    });
  }

  getParams() {
    return {
      genre: document.getElementById('ai-genre')?.value || state.get('genre'),
      rootNote: document.getElementById('ai-root')?.value || state.get('rootNote'),
      scale: document.getElementById('ai-scale')?.value || state.get('scale'),
      complexity: this.complexity,
    };
  }
}

export default AIControlPanel;
