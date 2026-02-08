import eventBus from '../core/EventBus.js';
import PadGrid from './components/PadGrid.js';
import KnobController from './components/KnobController.js';
import StepSequencerUI from './components/StepSequencerUI.js';
import MixerUI from './components/MixerUI.js';
import WaveformDisplay from './components/WaveformDisplay.js';
import TransportBar from './components/TransportBar.js';
import AIControlPanel from './components/AIControlPanel.js';
import EffectsPanel from './components/EffectsPanel.js';

/**
 * Main UI coordinator that initializes and manages all UI components.
 */
class UIController {
  constructor() {
    this.padGrid = new PadGrid('pad-grid-container');
    this.knobController = new KnobController('knob-controller');
    this.stepSequencer = new StepSequencerUI('step-sequencer-ui');
    this.mixerUI = new MixerUI('mixer-ui');
    this.waveformDisplay = new WaveformDisplay('waveform-display');
    this.transportBar = new TransportBar('transport-bar');
    this.aiPanel = new AIControlPanel('ai-control-panel');
    this.effectsPanel = new EffectsPanel('effects-panel');
  }

  init() {
    this.padGrid.init();
    this.knobController.init();
    this.stepSequencer.init();
    this.mixerUI.init();
    this.waveformDisplay.init();
    this.transportBar.init();
    this.aiPanel.init();
    this.effectsPanel.init();

    this.setupViewSwitching();
    this.setupKeyboardShortcuts();
    this.setupMIDIStatusIndicator();
  }

  setupViewSwitching() {
    document.querySelectorAll('.view-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.view-tab').forEach((t) => t.classList.remove('active'));
        document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
        tab.classList.add('active');
        const view = document.getElementById(`${tab.dataset.view}-view`);
        if (view) view.classList.add('active');
      });
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          eventBus.emit('transport:toggle');
          break;
        case 'Escape':
          eventBus.emit('transport:stop');
          break;
        case 'KeyG':
          eventBus.emit('ai:generate', {});
          break;
        case 'KeyR':
          if (!e.ctrlKey && !e.metaKey) eventBus.emit('ai:randomize');
          break;
        case 'KeyV':
          eventBus.emit('ai:variation');
          break;
      }
    });
  }

  setupMIDIStatusIndicator() {
    const dot = document.getElementById('midi-dot');
    const label = document.getElementById('midi-label');

    eventBus.on('midi:connected', ({ name }) => {
      if (dot) { dot.classList.remove('disconnected'); dot.classList.add('connected'); }
      if (label) label.textContent = `MIDI: ${name}`;
    });

    eventBus.on('midi:unsupported', () => {
      if (label) label.textContent = 'MIDI: Not Supported';
    });

    eventBus.on('midi:error', () => {
      if (label) label.textContent = 'MIDI: Error';
    });
  }
}

export const uiController = new UIController();
export default uiController;
