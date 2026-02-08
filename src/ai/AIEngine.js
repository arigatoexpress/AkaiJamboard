import eventBus from '../core/EventBus.js';
import state from '../core/StateManager.js';
import patternGenerator from './PatternGenerator.js';
import chordGen from './ChordProgressionGen.js';
import melodyGenerator from './MelodyGenerator.js';
import grooveEngine from './GrooveEngine.js';
import { GENRES } from '../core/constants.js';

/**
 * Main AI coordinator that generates complete musical arrangements.
 */
class AIEngine {
  constructor() {
    this.lastGeneration = null;
  }

  init() {
    eventBus.on('ai:generate', (params) => this.generateBeat(params));
    eventBus.on('ai:variation', () => this.generateVariation());
    eventBus.on('ai:randomize', () => this.randomize());
  }

  /**
   * Generate a complete beat with drums, bass, melody, and chords.
   */
  generateBeat(params = {}) {
    const genre = params.genre || state.get('genre');
    const complexity = params.complexity ?? 0.5;
    const rootNote = params.rootNote || state.get('rootNote');
    const scale = params.scale || state.get('scale');
    const steps = state.get('totalSteps');

    const genreConfig = GENRES[genre] || GENRES.hiphop;
    const isMinor = scale === 'minor' || scale === 'dorian' || scale === 'minorPenta';

    // Generate each component
    const drums = patternGenerator.generate(genre, complexity, steps);
    const chords = chordGen.generate(genre, rootNote, 3, isMinor);
    const chordSequence = chordGen.toSequence(chords, steps);
    const bassline = melodyGenerator.generateBass(rootNote, scale, 2, steps, 0.4 + complexity * 0.3);
    const melody = melodyGenerator.generate(rootNote, scale, 4, steps, 0.3 + complexity * 0.4);

    // Apply groove
    const swingOffsets = grooveEngine.applySwing(drums.kick, genreConfig.swing);

    // Update BPM to genre default if not manually set
    if (!params.keepBpm) {
      state.set('bpm', genreConfig.bpm);
    }
    state.set('swing', genreConfig.swing);

    this.lastGeneration = {
      drums,
      chords,
      chordSequence,
      bassline,
      melody,
      swingOffsets,
      genre,
      rootNote,
      scale,
    };

    eventBus.emit('ai:generated', this.lastGeneration);
    eventBus.emit('sequencer:loadPattern', this.lastGeneration);

    return this.lastGeneration;
  }

  /**
   * Generate a variation of the last generation.
   */
  generateVariation() {
    if (!this.lastGeneration) {
      return this.generateBeat();
    }

    const varied = {
      ...this.lastGeneration,
      drums: grooveEngine.createVariation(this.lastGeneration.drums, 0.4),
    };

    // Humanize
    for (const [name, row] of Object.entries(varied.drums)) {
      varied.drums[name] = grooveEngine.humanizeVelocity(row, 0.15);
    }

    this.lastGeneration = varied;
    eventBus.emit('ai:generated', varied);
    eventBus.emit('sequencer:loadPattern', varied);

    return varied;
  }

  /**
   * Fully randomize everything.
   */
  randomize() {
    const genres = Object.keys(GENRES);
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const scales = ['minor', 'major', 'dorian', 'pentatonic', 'blues'];

    return this.generateBeat({
      genre: genres[Math.floor(Math.random() * genres.length)],
      complexity: 0.3 + Math.random() * 0.5,
      rootNote: notes[Math.floor(Math.random() * notes.length)],
      scale: scales[Math.floor(Math.random() * scales.length)],
    });
  }

  getLastGeneration() {
    return this.lastGeneration;
  }
}

export const aiEngine = new AIEngine();
export default aiEngine;
