import app from './app.js';

// Splash screen - requires user gesture to start audio context
const startBtn = document.getElementById('start-btn');
const splash = document.getElementById('splash-overlay');

startBtn?.addEventListener('click', async () => {
  startBtn.textContent = 'LOADING...';
  startBtn.disabled = true;

  await app.init();

  splash.classList.add('hidden');
  setTimeout(() => splash.remove(), 500);
});

// Allow pressing Enter to start
document.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' && splash && !splash.classList.contains('hidden')) {
    startBtn?.click();
  }
});
