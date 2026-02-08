import drumTemplates from './models/drumPatterns.js';

/**
 * AI drum pattern generator using templates, Euclidean rhythms, and mutation.
 */
class PatternGenerator {
  /**
   * Generate a drum pattern for a given genre.
   */
  generate(genre = 'hiphop', complexity = 0.5, steps = 16) {
    const templates = drumTemplates[genre] || drumTemplates.hiphop;
    const base = templates[Math.floor(Math.random() * templates.length)];

    const pattern = {
      kick:     this.mutateRow([...(base.kick || this.emptyRow(steps))], complexity),
      snare:    this.mutateRow([...(base.snare || this.emptyRow(steps))], complexity),
      closedHH: this.mutateRow([...(base.closedHH || this.emptyRow(steps))], complexity),
      openHH:   this.mutateRow([...(base.openHH || this.emptyRow(steps))], complexity),
      clap:     this.mutateRow([...(base.clap || this.emptyRow(steps))], complexity * 0.5),
      tomLo:    this.emptyRow(steps),
      tomHi:    this.emptyRow(steps),
      crash:    this.emptyRow(steps),
    };

    // Add occasional crash on beat 1
    if (Math.random() < 0.3) pattern.crash[0] = 80;

    // Add fills at higher complexity
    if (complexity > 0.6) {
      this.addFill(pattern, steps);
    }

    return pattern;
  }

  /**
   * Generate Euclidean rhythm pattern.
   */
  euclidean(pulses, steps) {
    const pattern = new Array(steps).fill(0);
    if (pulses <= 0) return pattern;
    if (pulses >= steps) return new Array(steps).fill(100);

    let bucket = 0;
    for (let i = 0; i < steps; i++) {
      bucket += pulses;
      if (bucket >= steps) {
        bucket -= steps;
        pattern[i] = 80 + Math.floor(Math.random() * 40);
      }
    }
    return pattern;
  }

  /**
   * Mutate a row by adding/removing hits based on complexity.
   */
  mutateRow(row, complexity) {
    const mutationChance = complexity * 0.3;
    return row.map((val) => {
      if (val > 0 && Math.random() < mutationChance * 0.5) {
        return 0; // remove hit
      }
      if (val === 0 && Math.random() < mutationChance * 0.3) {
        return 40 + Math.floor(Math.random() * 60); // add ghost hit
      }
      if (val > 0) {
        // Velocity variation
        return Math.max(20, Math.min(127, val + Math.floor((Math.random() - 0.5) * 30)));
      }
      return val;
    });
  }

  /**
   * Add a fill pattern to the last 4 steps.
   */
  addFill(pattern, steps) {
    const fillStart = steps - 4;
    for (let i = fillStart; i < steps; i++) {
      if (Math.random() < 0.6) {
        pattern.snare[i] = 70 + Math.floor(Math.random() * 50);
      }
      if (Math.random() < 0.4) {
        pattern.tomLo[i] = 60 + Math.floor(Math.random() * 40);
      }
      if (Math.random() < 0.3) {
        pattern.tomHi[i] = 60 + Math.floor(Math.random() * 40);
      }
    }
  }

  /**
   * Humanize velocities for a more natural feel.
   */
  humanize(pattern, amount = 0.2) {
    const result = {};
    for (const [name, row] of Object.entries(pattern)) {
      result[name] = row.map((v) => {
        if (v === 0) return 0;
        const variation = Math.floor((Math.random() - 0.5) * 127 * amount);
        return Math.max(20, Math.min(127, v + variation));
      });
    }
    return result;
  }

  emptyRow(steps = 16) {
    return new Array(steps).fill(0);
  }
}

export const patternGenerator = new PatternGenerator();
export default patternGenerator;
