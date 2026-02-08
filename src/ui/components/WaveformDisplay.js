import waveformAnalyzer from '../../audio/analysis/WaveformAnalyzer.js';

/**
 * Canvas-based real-time waveform and spectrum visualization.
 */
class WaveformDisplay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.mode = 'waveform'; // 'waveform' or 'spectrum'
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="waveform-container">
        <div class="waveform-header">
          <h3 class="section-title">VISUALIZER</h3>
          <button class="waveform-toggle" id="viz-toggle">SPECTRUM</button>
        </div>
        <canvas id="waveform-canvas" width="600" height="150"></canvas>
      </div>
    `;

    this.canvas = document.getElementById('waveform-canvas');
    this.ctx = this.canvas.getContext('2d');

    document.getElementById('viz-toggle')?.addEventListener('click', () => {
      this.mode = this.mode === 'waveform' ? 'spectrum' : 'waveform';
      document.getElementById('viz-toggle').textContent =
        this.mode === 'waveform' ? 'SPECTRUM' : 'WAVEFORM';
    });

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.startAnimation();
  }

  resizeCanvas() {
    if (!this.canvas || !this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width - 20;
    this.canvas.height = 150;
  }

  startAnimation() {
    const draw = () => {
      this.animationFrame = requestAnimationFrame(draw);
      if (this.mode === 'waveform') {
        this.drawWaveform();
      } else {
        this.drawSpectrum();
      }
    };
    draw();
  }

  drawWaveform() {
    const data = waveformAnalyzer.getWaveform();
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Draw center line
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw waveform
    ctx.strokeStyle = '#ff3366';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = (v + 1) / 2 * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }

    ctx.stroke();

    // Glow effect
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawSpectrum() {
    const data = waveformAnalyzer.getFFT();
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    const barWidth = width / data.length * 2;
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#33ccff');
    gradient.addColorStop(0.5, '#ff3366');
    gradient.addColorStop(1, '#ffcc33');

    for (let i = 0; i < data.length / 2; i++) {
      const value = (data[i] + 140) / 140; // Normalize dB
      const barHeight = Math.max(0, value * height);
      const x = i * barWidth;

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

export default WaveformDisplay;
