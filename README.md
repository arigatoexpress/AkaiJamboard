# AKAI Jamboard - AI Beatmaker & DJ Set

A web-based AI-powered beatmaking and DJ performance application designed for the AKAI APK Mini MIDI controller.

> See `AGENTS.md` for agentic navigation.

## Features

- **AI Beat Generation** - Algorithmically generates drum patterns, basslines, melodies, and chord progressions across 8 genres (Hip-Hop, House, Techno, Trap, DnB, Lo-Fi, Funk, Ambient)
- **AKAI APK Mini Integration** - Full MIDI mapping for 8 pads, 8 knobs, and 25-key keyboard via Web MIDI API
- **Synthesized Instruments** - Drum machine (8 voices), mono bass synth, polyphonic lead/chord synths using Tone.js
- **Step Sequencer** - 16-step, 8-row drum sequencer with 4-track melodic sequencing
- **Effects Chain** - Reverb, delay, filter, and distortion with real-time parameter control
- **Mixer** - 4-channel mixer with volume, pan, mute/solo per track
- **Real-time Visualizer** - Waveform and spectrum analyzer via Canvas API
- **Keyboard Shortcuts** - Space (play/stop), G (generate), R (random), V (variation), Esc (stop)

## Tech Stack

- **Vite** - Build tool and dev server
- **Tone.js** - Web Audio API framework for synthesis and scheduling
- **Web MIDI API** - Hardware controller communication
- **Canvas API** - Real-time audio visualization
- **Vanilla JS** - No framework dependencies

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and click **START SESSION** to initialize the audio context.

## MIDI Controller Mapping (AKAI APK Mini)

| Control | Function |
|---------|----------|
| Pads 1-8 | Trigger drum sounds (Kick, Snare, HH, etc.) |
| Knobs 1-4 | Track volumes (Drums, Bass, Lead, Chords) |
| Knobs 5-8 | Effects (Reverb, Delay, Filter, Distortion) |
| Keys | Play melody notes (chromatic) |

## Architecture

```
src/
├── core/       # EventBus, StateManager, AudioEngine, MIDIController
├── midi/       # AKAI APK Mini mapper, MIDI message handler
├── audio/      # Transport, Sequencer, Mixer, Instruments, Effects
├── ai/         # Pattern/Melody/Chord generators, Groove engine
├── ui/         # Pad grid, Knobs, Sequencer, Mixer, Waveform, Transport
└── main.js     # Application entry point
```

## License

MIT
