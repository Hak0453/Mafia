/**
 * 1930s ORCHESTRAL NOIR & GRAMOPHONE SOUND MANAGER
 * ------------------------------------------------
 * Generates a brooding, dramatic 1930s Mafia-style orchestral theme in D minor
 * (bowed cello/contrabass, haunting solo strings melody, slow timpani pulse,
 * mournful brass swells, and warm gramophone vinyl crackle) using Web Audio API.
 *
 * Also supports playing a custom MP3 file if `SITE_META.customAudioUrl` is set in `src/config.js`.
 */

import { SITE_META } from '../config.js';

export class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.melodyTimer = null;
    this.crackleNode = null;
    this.audioElement = null;
    this.stepIndex = 0;

    // Dramatic D-minor Mafia-inspired orchestral theme sequence
    // Each step: { leadFreq, harmonyFreq, bassFreq, brassFreq, durationMs, timpani }
    this.sequence = [
      // Phrase 1: Brooding minor motif (D - F - E - D - A - Bb - A)
      { lead: 293.66, harm: 220.0, bass: 73.42, brass: 146.83, dur: 1400, timp: true },   // D4
      { lead: 349.23, harm: 261.63, bass: 73.42, brass: 174.61, dur: 900, timp: false },  // F4
      { lead: 329.63, harm: 246.94, bass: 82.41, brass: 164.81, dur: 1100, timp: false }, // E4
      { lead: 293.66, harm: 220.0, bass: 73.42, brass: 146.83, dur: 1600, timp: true },   // D4
      { lead: 440.0, harm: 293.66, bass: 110.0, brass: 220.0, dur: 1300, timp: true },    // A4
      { lead: 466.16, harm: 349.23, bass: 116.54, brass: 233.08, dur: 1100, timp: false },// Bb4
      { lead: 440.0, harm: 329.63, bass: 110.0, brass: 220.0, dur: 2000, timp: true },    // A4

      // Phrase 2: Descending tragic cadence (G - A - F - E - D - C# - D)
      { lead: 392.0, harm: 293.66, bass: 98.0, brass: 196.0, dur: 1200, timp: true },     // G4
      { lead: 440.0, harm: 329.63, bass: 98.0, brass: 220.0, dur: 900, timp: false },     // A4
      { lead: 349.23, harm: 261.63, bass: 87.31, brass: 174.61, dur: 1300, timp: true },  // F4
      { lead: 329.63, harm: 220.0, bass: 82.41, brass: 164.81, dur: 1100, timp: false },  // E4
      { lead: 277.18, harm: 220.0, bass: 110.0, brass: 138.59, dur: 1300, timp: false },  // C#4 (harmonic minor tension)
      { lead: 293.66, harm: 220.0, bass: 73.42, brass: 146.83, dur: 2600, timp: true }    // D4 resolution
    ];
  }

  initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.42;

    // Warm vintage gramophone / dark hall convolution-style delay feedback
    this.reverbDelay = this.ctx.createDelay();
    this.reverbDelay.delayTime.value = 0.28;
    this.reverbFeedback = this.ctx.createGain();
    this.reverbFeedback.gain.value = 0.34;
    this.reverbFilter = this.ctx.createBiquadFilter();
    this.reverbFilter.type = 'lowpass';
    this.reverbFilter.frequency.value = 1400;

    this.reverbDelay.connect(this.reverbFilter);
    this.reverbFilter.connect(this.reverbFeedback);
    this.reverbFeedback.connect(this.reverbDelay);
    this.reverbFilter.connect(this.masterGain);

    this.masterGain.connect(this.ctx.destination);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    if (this.isPlaying) return;
    this.initContext();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;

    if (SITE_META.customAudioUrl) {
      if (!this.audioElement) {
        this.audioElement = new Audio(SITE_META.customAudioUrl);
        this.audioElement.loop = true;
        this.audioElement.volume = 0.65;
      }
      this.audioElement.play().catch(() => {});
      return;
    }

    this.startVinylCrackle();
    this.scheduleNextNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.crackleNode) {
      try {
        this.crackleNode.stop();
      } catch (_) {}
      this.crackleNode = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  startVinylCrackle() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Soft hiss + occasional warm gramophone crackle pops
      const hiss = (Math.random() * 2 - 1) * 0.012;
      const pop = Math.random() < 0.0012 ? (Math.random() * 2 - 1) * 0.16 : 0;
      data[i] = hiss + pop;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1150;
    bandpass.Q.value = 0.9;

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.value = 0.25;

    noise.connect(bandpass);
    bandpass.connect(crackleGain);
    crackleGain.connect(this.masterGain);
    noise.start();
    this.crackleNode = noise;
  }

  scheduleNextNote() {
    if (!this.isPlaying || !this.ctx) return;
    const step = this.sequence[this.stepIndex % this.sequence.length];
    this.stepIndex++;

    const now = this.ctx.currentTime;
    const durSec = step.dur / 1000;

    // 1. Expressive Bowed Solo Violin / String Lead (with vibrato)
    this.playBowedString(step.lead, now, durSec * 1.05, 0.15, true);

    // 2. Warm Viola / Cello Harmony Voice
    this.playBowedString(step.harm, now, durSec * 1.1, 0.085, false);

    // 3. Deep Contrabass & Mournful Horn Swell
    this.playBassAndHorn(step.bass, step.brass, now, durSec * 1.15);

    // 4. Slow Orchestral Timpani Pulse on downbeats
    if (step.timp) {
      this.playTimpani(step.bass, now);
    }

    this.melodyTimer = setTimeout(() => this.scheduleNextNote(), step.dur);
  }

  playBowedString(freq, startTime, duration, peakGain, withVibrato) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.003, startTime); // Slight ensemble detune

    if (withVibrato) {
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vib.frequency.value = 5.2;
      vibGain.gain.value = 2.4;
      vib.connect(vibGain);
      vibGain.connect(osc1.frequency);
      vib.start(startTime);
      vib.stop(startTime + duration + 0.2);
    }

    // Warm string body filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1250, startTime);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(0.32, duration * 0.35));
    env.gain.exponentialRampToValueAtTime(0.0008, startTime + duration + 0.15);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    env.connect(this.reverbDelay);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.2);
    osc2.stop(startTime + duration + 0.2);
  }

  playBassAndHorn(bassFreq, hornFreq, startTime, duration) {
    const bassOsc = this.ctx.createOscillator();
    const hornOsc = this.ctx.createOscillator();
    bassOsc.type = 'triangle';
    hornOsc.type = 'sawtooth';
    bassOsc.frequency.setValueAtTime(bassFreq, startTime);
    hornOsc.frequency.setValueAtTime(hornFreq, startTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, startTime);
    filter.frequency.linearRampToValueAtTime(620, startTime + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(320, startTime + duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(0.14, startTime + 0.35);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.15);

    bassOsc.connect(filter);
    hornOsc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);
    env.connect(this.reverbDelay);

    bassOsc.start(startTime);
    hornOsc.start(startTime);
    bassOsc.stop(startTime + duration + 0.2);
    hornOsc.stop(startTime + duration + 0.2);
  }

  playTimpani(freq, startTime) {
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.18, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.92, startTime + 0.45);

    env.gain.setValueAtTime(0.001, startTime);
    env.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0005, startTime + 0.75);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + 0.8);
  }

  playHoverSound() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

    env.gain.setValueAtTime(0.04, now);
    env.gain.exponentialRampToValueAtTime(0.0005, now + 0.065);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playSelectSound() {
    if (!this.ctx) this.initContext();
    if (this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;

    // Subtle mechanical typewriter / revolver cylinder click + low chord thud
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(146.83, now);
    osc.frequency.exponentialRampToValueAtTime(73.42, now + 0.22);

    env.gain.setValueAtTime(0.14, now);
    env.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

    osc.connect(env);
    env.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}
