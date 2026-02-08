import eventBus from '../../core/EventBus.js';
import { TRACKS } from '../../core/constants.js';

/**
 * Mixer channel strip UI.
 */
class MixerUI {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.faders = new Map();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="mixer">
        ${TRACKS.map((track) => `
          <div class="mixer-channel" data-track="${track.id}" style="--track-color: ${track.color}">
            <span class="channel-name">${track.name}</span>
            <div class="fader-container">
              <input type="range" class="fader" min="0" max="100" value="75"
                     orient="vertical" data-track="${track.id}" />
              <div class="fader-meter" data-track="${track.id}"></div>
            </div>
            <div class="channel-controls">
              <input type="range" class="pan-knob" min="0" max="100" value="50"
                     data-track="${track.id}" title="Pan" />
              <button class="mute-btn" data-track="${track.id}">M</button>
              <button class="solo-btn" data-track="${track.id}">S</button>
            </div>
          </div>
        `).join('')}
        <div class="mixer-channel master">
          <span class="channel-name">Master</span>
          <div class="fader-container">
            <input type="range" class="fader master-fader" min="0" max="100" value="80"
                   orient="vertical" />
          </div>
        </div>
      </div>
    `;

    this.setupEvents();
  }

  setupEvents() {
    // Volume faders
    this.container.querySelectorAll('.fader[data-track]').forEach((fader) => {
      fader.addEventListener('input', () => {
        const track = parseInt(fader.dataset.track);
        const value = fader.value / 100;
        eventBus.emit('mixer:setVolume', { track, value });
      });
    });

    // Pan knobs
    this.container.querySelectorAll('.pan-knob').forEach((knob) => {
      knob.addEventListener('input', () => {
        const track = parseInt(knob.dataset.track);
        const value = knob.value / 100;
        eventBus.emit('mixer:setPan', { track, value });
      });
    });

    // Mute buttons
    this.container.querySelectorAll('.mute-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const track = parseInt(btn.dataset.track);
        eventBus.emit('mixer:toggleMute', { track });
      });
    });

    // Solo buttons
    this.container.querySelectorAll('.solo-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const track = parseInt(btn.dataset.track);
        eventBus.emit('mixer:toggleSolo', { track });
      });
    });

    // Master fader
    const masterFader = this.container.querySelector('.master-fader');
    if (masterFader) {
      masterFader.addEventListener('input', () => {
        const db = -60 + (masterFader.value / 100) * 60;
        eventBus.emit('master:setVolume', { db });
      });
    }

    // Listen for state updates
    eventBus.on('mixer:muteChanged', ({ track, muted }) => {
      const btn = this.container.querySelector(`.mute-btn[data-track="${track}"]`);
      if (btn) btn.classList.toggle('active', muted);
    });

    eventBus.on('mixer:soloChanged', ({ track, soloed }) => {
      const btn = this.container.querySelector(`.solo-btn[data-track="${track}"]`);
      if (btn) btn.classList.toggle('active', soloed);
    });
  }
}

export default MixerUI;
