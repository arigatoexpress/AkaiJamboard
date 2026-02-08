import audioEngine from './core/AudioEngine.js';
import midiController from './core/MIDIController.js';
import akaiMapper from './midi/AkaiAPKMiniMapper.js';
import midiHandler from './midi/MIDIMessageHandler.js';
import transport from './audio/Transport.js';
import sequencer from './audio/Sequencer.js';
import mixer from './audio/Mixer.js';
import drumMachine from './audio/instruments/DrumMachine.js';
import bassEngine from './audio/instruments/BassEngine.js';
import melodySynth from './audio/instruments/MelodySynth.js';
import effectsChain from './audio/effects/EffectsChain.js';
import waveformAnalyzer from './audio/analysis/WaveformAnalyzer.js';
import aiEngine from './ai/AIEngine.js';
import uiController from './ui/UIController.js';
import eventBus from './core/EventBus.js';

/**
 * Main application controller that initializes all subsystems.
 */
class App {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // 1. Initialize audio engine (requires user gesture)
      await audioEngine.init();

      // 2. Initialize mixer channels
      mixer.init();

      // 3. Initialize instruments, connecting to mixer channels
      drumMachine.init(mixer.getChannel(0));
      bassEngine.init(mixer.getChannel(1));
      melodySynth.init(mixer.getChannel(2));

      // Create a second melodySynth instance for chords
      const chordSynth = Object.create(melodySynth);
      chordSynth.init(mixer.getChannel(3));

      // 4. Initialize effects
      effectsChain.init();

      // 5. Initialize waveform analyzer
      waveformAnalyzer.init();

      // 6. Initialize transport
      transport.init();

      // 7. Initialize sequencer with instrument references
      sequencer.init({
        drums: drumMachine,
        bass: bassEngine,
        lead: melodySynth,
        chords: {
          triggerChord: (notes, vel, dur, time) =>
            chordSynth.triggerChord(notes, vel, dur, time),
        },
      });

      // 8. Initialize MIDI
      await midiController.init();
      akaiMapper.init();
      midiHandler.init();

      // 9. Initialize AI engine
      aiEngine.init();

      // 10. Initialize UI
      uiController.init();

      // 11. Setup master volume control
      eventBus.on('master:setVolume', ({ db }) => {
        audioEngine.setMasterVolume(db);
      });

      // Setup keyboard note input
      eventBus.on('key:press', ({ note, velocity }) => {
        melodySynth.triggerNote(note, velocity / 127, '8n');
      });

      this.initialized = true;
      console.log('AKAI Jamboard initialized successfully');

    } catch (err) {
      console.error('Failed to initialize AKAI Jamboard:', err);
    }
  }
}

export const app = new App();
export default app;
