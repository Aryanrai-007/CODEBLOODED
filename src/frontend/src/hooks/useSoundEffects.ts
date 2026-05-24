import { useCallback, useEffect, useRef, useState } from "react";

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isMuted = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function getMasterGain(): GainNode {
  getAudioContext();
  return masterGain!;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) {
  if (isMuted) return;
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(getMasterGain());
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playNoise(duration: number, volume: number) {
  if (isMuted) return;
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * volume * (1 - i / bufferSize);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  source.connect(gain);
  gain.connect(getMasterGain());
  source.start(ctx.currentTime);
}

export const SoundEffects = {
  shoot: () => playTone(880, 0.08, "square", 0.08),
  shootTriple: () => {
    playTone(1100, 0.06, "square", 0.06);
    setTimeout(() => playTone(1320, 0.06, "square", 0.06), 30);
  },
  shootPlasma: () => playTone(440, 0.15, "sawtooth", 0.1),
  shootMissile: () => playTone(220, 0.2, "sawtooth", 0.08),
  shootElectric: () => {
    playTone(2000, 0.05, "sine", 0.1);
    playTone(2500, 0.05, "sine", 0.08);
  },
  explosion: () => playNoise(0.3, 0.15),
  explosionBig: () => playNoise(0.5, 0.25),
  explosionSmall: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    const duration = 0.1;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(getMasterGain());
    source.start(ctx.currentTime);
  },
  explosionMedium: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    const duration = 0.25;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 600;
    filter.Q.value = 1;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(getMasterGain());
    source.start(ctx.currentTime);
  },
  explosionElectric: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    const duration = 0.2;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    const lfo = ctx.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = 40;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(getMasterGain());
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    lfo.start(ctx.currentTime);
    lfo.stop(ctx.currentTime + duration);
  },
  explosionBoss: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    const duration = 0.6;
    // Layer 1: low freq noise
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      60,
      ctx.currentTime + duration,
    );
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(getMasterGain());
    source.start(ctx.currentTime);
    // Layer 2: rumble sweep
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + duration);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.2, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration,
    );
    osc.connect(oscGain);
    oscGain.connect(getMasterGain());
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  },
  powerUp: () => {
    playTone(523, 0.1, "sine", 0.1);
    setTimeout(() => playTone(659, 0.1, "sine", 0.1), 80);
    setTimeout(() => playTone(784, 0.15, "sine", 0.12), 160);
  },
  combo: (combo: number) => {
    const base = 440 + combo * 50;
    playTone(base, 0.1, "sine", 0.08);
    setTimeout(() => playTone(base * 1.25, 0.1, "sine", 0.08), 60);
  },
  bossWarning: () => {
    playTone(200, 0.4, "sawtooth", 0.12);
    setTimeout(() => playTone(150, 0.4, "sawtooth", 0.12), 200);
    setTimeout(() => playTone(100, 0.6, "sawtooth", 0.15), 400);
  },
  bossHit: () => playTone(100, 0.15, "square", 0.12),
  playerHit: () => {
    playTone(150, 0.2, "sawtooth", 0.15);
    playNoise(0.2, 0.1);
  },
  levelUp: () => {
    playTone(523, 0.15, "sine", 0.1);
    setTimeout(() => playTone(659, 0.15, "sine", 0.1), 120);
    setTimeout(() => playTone(784, 0.15, "sine", 0.1), 240);
    setTimeout(() => playTone(1047, 0.3, "sine", 0.12), 360);
  },
  achievement: () => {
    playTone(784, 0.1, "sine", 0.1);
    setTimeout(() => playTone(988, 0.1, "sine", 0.1), 100);
    setTimeout(() => playTone(1175, 0.1, "sine", 0.1), 200);
    setTimeout(() => playTone(1568, 0.3, "sine", 0.12), 300);
  },
  gameOver: () => {
    playTone(400, 0.3, "sawtooth", 0.1);
    setTimeout(() => playTone(300, 0.3, "sawtooth", 0.1), 250);
    setTimeout(() => playTone(200, 0.5, "sawtooth", 0.12), 500);
  },
  click: () => playTone(1200, 0.03, "sine", 0.05),
};

export function useSoundEffects() {
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem("gameAudioMuted") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    isMuted = muted;
    try {
      localStorage.setItem("gameAudioMuted", String(muted));
    } catch {}
  }, [muted]);

  const initAudio = useCallback(() => {
    getAudioContext();
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  return { muted, toggleMute, initAudio };
}
