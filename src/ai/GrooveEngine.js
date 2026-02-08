/**
 * Groove and humanization engine for making patterns feel more musical.
 */
class GrooveEngine {
  /**
   * Apply swing to a pattern by delaying even-numbered 16th notes.
   * swingAmount: 0 (no swing) to 1 (full triplet swing)
   */
  applySwing(pattern, swingAmount = 0.3) {
    // Swing is a timing thing - we store timing offsets per step
    const offsets = new Array(pattern.length || 16).fill(0);
    for (let i = 0; i < offsets.length; i++) {
      if (i % 2 === 1) {
        offsets[i] = swingAmount * 0.5; // Push back in time (fraction of step)
      }
    }
    return offsets;
  }

  /**
   * Add velocity variation (ghost notes, accents).
   */
  humanizeVelocity(row, amount = 0.2) {
    return row.map((v, i) => {
      if (v === 0) return 0;
      const variation = (Math.random() - 0.5) * 2 * amount * 50;
      return Math.max(20, Math.min(127, Math.round(v + variation)));
    });
  }

  /**
   * Add timing micro-variations (returns offset array in ms).
   */
  humanizeTiming(steps, amount = 10) {
    return new Array(steps).fill(0).map(() =>
      (Math.random() - 0.5) * 2 * amount
    );
  }

  /**
   * Add ghost notes to hi-hat patterns.
   */
  addGhostNotes(row, probability = 0.3) {
    return row.map((v) => {
      if (v === 0 && Math.random() < probability) {
        return 20 + Math.floor(Math.random() * 25); // soft ghost
      }
      return v;
    });
  }

  /**
   * Create a variation of a pattern for B-section or fill.
   */
  createVariation(drumPattern, intensity = 0.5) {
    const variation = {};
    for (const [name, row] of Object.entries(drumPattern)) {
      variation[name] = row.map((v, i) => {
        // Keep downbeats intact
        if (i % 4 === 0) return v;

        // Mutate off-beats
        if (Math.random() < intensity * 0.4) {
          return v > 0 ? 0 : (60 + Math.floor(Math.random() * 40));
        }
        return v;
      });
    }
    return variation;
  }
}

export const grooveEngine = new GrooveEngine();
export default grooveEngine;
