// Web Audio API engine — generates character-appropriate tones instantly.
// Each profile targets the feel of its JJS sound category.

export type SoundProfile = {
  type: OscillatorType;
  frequency: number;
  freqEnd?: number;          // pitch-sweep target (for impact/whoosh effects)
  detune?: number;
  duration: number;
  attack: number;
  release: number;
  gainPeak?: number;
  filterFreq?: number;
  filterEnd?: number;
  filterType?: BiquadFilterType;
  distortion?: boolean;
  harmonics?: Array<{ ratio: number; gain: number }>;
  delay?: number;            // seconds before sound starts (for echo layers)
};

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx || ctx.state === "closed") {
    ctx = new AudioContext();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function makeDistortionCurve(amount = 200): Float32Array {
  const n = 256;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export function playProfile(profile: SoundProfile): () => void {
  const ac = getCtx();
  const now = ac.currentTime + (profile.delay ?? 0);
  const end = now + profile.attack + profile.duration + profile.release;
  const peak = profile.gainPeak ?? 0.55;

  // Master gain with ADSR envelope
  const masterGain = ac.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(peak, now + profile.attack);
  masterGain.gain.setValueAtTime(peak, now + profile.attack + profile.duration);
  masterGain.gain.exponentialRampToValueAtTime(0.001, end);
  masterGain.connect(ac.destination);

  let chain: AudioNode = masterGain;

  // Optional filter with sweep
  if (profile.filterFreq) {
    const filter = ac.createBiquadFilter();
    filter.type = profile.filterType ?? "lowpass";
    filter.frequency.setValueAtTime(profile.filterFreq, now);
    if (profile.filterEnd) {
      filter.frequency.exponentialRampToValueAtTime(profile.filterEnd, end);
    }
    filter.connect(chain);
    chain = filter;
  }

  // Optional waveshaper
  if (profile.distortion) {
    const shaper = ac.createWaveShaper();
    shaper.curve = makeDistortionCurve(150);
    shaper.connect(chain);
    chain = shaper;
  }

  const oscillators: OscillatorNode[] = [];

  const makeOsc = (freq: number, freqEnd: number | undefined, gain: number) => {
    const g = ac.createGain();
    g.gain.setValueAtTime(gain, now);
    g.connect(chain);

    const osc = ac.createOscillator();
    osc.type = profile.type;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + profile.attack + profile.duration);
    }
    if (profile.detune) osc.detune.setValueAtTime(profile.detune, now);
    osc.connect(g);
    osc.start(now);
    osc.stop(end + 0.05);
    oscillators.push(osc);
  };

  makeOsc(profile.frequency, profile.freqEnd, 1);

  (profile.harmonics ?? []).forEach(({ ratio, gain }) => {
    const hFreq = profile.frequency * ratio;
    const hFreqEnd = profile.freqEnd ? profile.freqEnd * ratio : undefined;
    makeOsc(hFreq, hFreqEnd, gain);
  });

  return () => {
    const stopAt = ac.currentTime + 0.04;
    masterGain.gain.cancelScheduledValues(ac.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, stopAt);
    oscillators.forEach((o) => {
      try { o.stop(stopAt + 0.05); } catch { /* already stopped */ }
    });
  };
}

// ─── Sound Profiles ──────────────────────────────────────────────────────────
// Designed so each category has a recognisable character:
//   Music      → sustained pads with harmonic richness
//   Impacts    → deep sub-bass pitch-drop + distortion (feels like a hit)
//   Gojo       → clean, rising sine tones (limitless, ethereal)
//   Sukuna     → dark sawtooth sweeps, low-freq menace
//   Hakari     → staccato square-wave hits, bright + punchy
//   Yuji       → short midrange square burst (raw physical energy)
//   Items      → crisp triangle/sine chimes

const profiles: Record<string, SoundProfile> = {
  // ── Music ──────────────────────────────────────────────────────────────────
  // Sustained pad chords — warm, atmospheric
  m1: { type: "sine",     frequency: 110,  duration: 2.5, attack: 0.5, release: 1.5, harmonics: [{ ratio: 2, gain: 0.5 }, { ratio: 3, gain: 0.25 }, { ratio: 4.5, gain: 0.12 }] },
  m2: { type: "triangle", frequency: 146,  duration: 2.5, attack: 0.4, release: 1.8, harmonics: [{ ratio: 1.5, gain: 0.4 }, { ratio: 3, gain: 0.2 }] },
  m3: { type: "sine",     frequency: 82,   duration: 3.0, attack: 0.6, release: 2.0, harmonics: [{ ratio: 2, gain: 0.45 }, { ratio: 4, gain: 0.18 }] },
  m4: { type: "sawtooth", frequency: 130,  duration: 2.0, attack: 0.3, release: 1.2, filterFreq: 800,  filterType: "lowpass", harmonics: [{ ratio: 2, gain: 0.3 }, { ratio: 3, gain: 0.15 }] },
  m5: { type: "sine",     frequency: 174,  duration: 2.5, attack: 0.4, release: 1.5, harmonics: [{ ratio: 2, gain: 0.4 }, { ratio: 3, gain: 0.2 }] },
  m6: { type: "triangle", frequency: 87,   duration: 3.0, attack: 0.5, release: 2.0, harmonics: [{ ratio: 1.5, gain: 0.35 }, { ratio: 2.5, gain: 0.2 }, { ratio: 4, gain: 0.1 }] },
  m7: { type: "sine",     frequency: 220,  duration: 2.0, attack: 0.3, release: 1.2, harmonics: [{ ratio: 2, gain: 0.4 }, { ratio: 5, gain: 0.1 }] },
  m8: { type: "sine",     frequency: 82,   duration: 3.5, attack: 0.7, release: 2.5, harmonics: [{ ratio: 2, gain: 0.35 }, { ratio: 3, gain: 0.18 }, { ratio: 6, gain: 0.08 }] },

  // ── Impacts & Ragdolls ─────────────────────────────────────────────────────
  // Deep pitch-drop from high→low + distortion = physical hit sensation
  i1: { type: "sine", frequency: 180, freqEnd: 30,  duration: 0.25, attack: 0.004, release: 0.4, gainPeak: 0.8, distortion: true },
  i2: { type: "sine", frequency: 120, freqEnd: 22,  duration: 0.3,  attack: 0.004, release: 0.5, gainPeak: 0.9, distortion: true, harmonics: [{ ratio: 2, gain: 0.4 }] },
  i3: { type: "square", frequency: 800, freqEnd: 200, duration: 0.06, attack: 0.002, release: 0.1, filterFreq: 1500, filterEnd: 300, filterType: "lowpass" },
  i4: { type: "sine", frequency: 200, freqEnd: 28,  duration: 0.35, attack: 0.004, release: 0.6, gainPeak: 0.85, distortion: true, harmonics: [{ ratio: 1.5, gain: 0.3 }] },
  i5: { type: "sine", frequency: 160, freqEnd: 25,  duration: 0.3,  attack: 0.004, release: 0.55, gainPeak: 0.85, distortion: true },
  i6: { type: "sawtooth", frequency: 400, freqEnd: 60, duration: 0.2, attack: 0.004, release: 0.35, filterFreq: 2000, filterEnd: 200, filterType: "lowpass", gainPeak: 0.7 },
  i7: { type: "square", frequency: 600, freqEnd: 80,  duration: 0.12, attack: 0.003, release: 0.2, filterFreq: 1200, filterEnd: 150, filterType: "lowpass" },
  i8: { type: "sine", frequency: 140, freqEnd: 20,  duration: 0.4,  attack: 0.004, release: 0.7, gainPeak: 0.9, distortion: true, harmonics: [{ ratio: 2, gain: 0.5 }, { ratio: 3, gain: 0.2 }] },

  // ── Gojo ──────────────────────────────────────────────────────────────────
  // Clean rising sine tones — limitless, celestial, crystalline
  g1: { type: "sine", frequency: 220, freqEnd: 660,  duration: 0.8, attack: 0.12, release: 0.6, gainPeak: 0.5, harmonics: [{ ratio: 2, gain: 0.3 }, { ratio: 4, gain: 0.1 }] },
  g2: { type: "sine", frequency: 330, freqEnd: 880,  duration: 0.6, attack: 0.08, release: 0.5, gainPeak: 0.5 },
  g3: { type: "sine", frequency: 660, freqEnd: 220,  duration: 0.5, attack: 0.05, release: 0.4, gainPeak: 0.55, harmonics: [{ ratio: 2, gain: 0.25 }] },
  g4: { type: "sine", frequency: 110, freqEnd: 880,  duration: 1.2, attack: 0.2,  release: 0.9, gainPeak: 0.5, harmonics: [{ ratio: 2, gain: 0.3 }, { ratio: 3, gain: 0.15 }] },
  g5: { type: "sine", frequency: 55,  freqEnd: 440,  duration: 1.8, attack: 0.3,  release: 1.5, gainPeak: 0.5, harmonics: [{ ratio: 2, gain: 0.4 }, { ratio: 4, gain: 0.2 }, { ratio: 6, gain: 0.1 }] },
  g6: { type: "sine", frequency: 440, freqEnd: 880,  duration: 0.7, attack: 0.15, release: 0.6, gainPeak: 0.45 },
  g7: { type: "sine", frequency: 880, freqEnd: 1760, duration: 0.3, attack: 0.04, release: 0.25, gainPeak: 0.4 },
  g8: { type: "sine", frequency: 523, freqEnd: 659,  duration: 0.5, attack: 0.1,  release: 0.4, gainPeak: 0.45, harmonics: [{ ratio: 1.5, gain: 0.2 }] },

  // ── Sukuna ────────────────────────────────────────────────────────────────
  // Low sawtooth with downward sweeps — menacing, ancient, brutal
  s1: { type: "sawtooth", frequency: 80,  freqEnd: 35,  duration: 1.2, attack: 0.1, release: 1.0, filterFreq: 600, filterEnd: 100, filterType: "lowpass", distortion: true, gainPeak: 0.7, harmonics: [{ ratio: 2, gain: 0.3 }] },
  s2: { type: "sawtooth", frequency: 440, freqEnd: 110, duration: 0.2, attack: 0.005, release: 0.25, filterFreq: 3000, filterEnd: 400, filterType: "lowpass", gainPeak: 0.7 },
  s3: { type: "sawtooth", frequency: 550, freqEnd: 80,  duration: 0.15, attack: 0.003, release: 0.2, filterFreq: 4000, filterEnd: 300, filterType: "lowpass", gainPeak: 0.75 },
  s4: { type: "sawtooth", frequency: 440, freqEnd: 60,  duration: 0.18, attack: 0.003, release: 0.22, filterFreq: 3500, filterEnd: 200, filterType: "lowpass", gainPeak: 0.72 },
  s5: { type: "sawtooth", frequency: 110, freqEnd: 55,  duration: 0.7, attack: 0.06, release: 0.6, filterFreq: 500, filterEnd: 150, filterType: "lowpass", distortion: true, gainPeak: 0.6 },
  s6: { type: "sawtooth", frequency: 330, freqEnd: 80,  duration: 0.2, attack: 0.004, release: 0.28, filterFreq: 2000, filterEnd: 300, filterType: "lowpass", gainPeak: 0.72 },
  s7: { type: "sine",     frequency: 55,  freqEnd: 22,  duration: 0.5, attack: 0.01, release: 0.55, gainPeak: 0.85, distortion: true, harmonics: [{ ratio: 2, gain: 0.5 }, { ratio: 3, gain: 0.25 }] },
  s8: { type: "sawtooth", frequency: 90,  freqEnd: 30,  duration: 0.8, attack: 0.02, release: 0.7, filterFreq: 400, filterEnd: 80, filterType: "lowpass", distortion: true, gainPeak: 0.75 },

  // ── Hakari ────────────────────────────────────────────────────────────────
  // Bright staccato square bursts — casino, energetic, lucky
  h1: { type: "square", frequency: 1046, freqEnd: 2093, duration: 0.12, attack: 0.003, release: 0.18, filterFreq: 5000, filterType: "lowpass", gainPeak: 0.45 },
  h2: { type: "sawtooth", frequency: 110, freqEnd: 55, duration: 1.0, attack: 0.08, release: 0.8, filterFreq: 600, filterType: "lowpass", distortion: true, gainPeak: 0.65 },
  h3: { type: "square", frequency: 130,  freqEnd: 65,   duration: 0.3, attack: 0.008, release: 0.35, filterFreq: 800, filterType: "lowpass", gainPeak: 0.5 },
  h4: { type: "square", frequency: 196,  freqEnd: 98,   duration: 0.2, attack: 0.004, release: 0.25, distortion: true, gainPeak: 0.55 },
  h5: { type: "square", frequency: 1318, freqEnd: 659,  duration: 0.08, attack: 0.002, release: 0.12, filterFreq: 6000, filterType: "lowpass", gainPeak: 0.4 },
  h6: { type: "square", frequency: 659,  freqEnd: 1318, duration: 0.1, attack: 0.002, release: 0.15, gainPeak: 0.42 },
  h7: { type: "sawtooth", frequency: 440, freqEnd: 220, duration: 0.15, attack: 0.004, release: 0.2, filterFreq: 2000, filterEnd: 400, filterType: "lowpass", gainPeak: 0.6 },
  h8: { type: "square", frequency: 261,  freqEnd: 130,  duration: 0.6, attack: 0.05, release: 0.5, filterFreq: 1500, filterType: "lowpass", gainPeak: 0.48 },

  // ── Yuji ──────────────────────────────────────────────────────────────────
  // Short midrange square burst with fast decay — raw physical punch
  y1: { type: "square", frequency: 250, freqEnd: 60,  duration: 0.15, attack: 0.003, release: 0.2, filterFreq: 1200, filterEnd: 200, filterType: "lowpass", distortion: true, gainPeak: 0.7 },
  y2: { type: "square", frequency: 180, freqEnd: 45,  duration: 0.25, attack: 0.003, release: 0.35, filterFreq: 900, filterEnd: 100, filterType: "lowpass", distortion: true, gainPeak: 0.8, harmonics: [{ ratio: 2, gain: 0.4 }] },
  y3: { type: "sine",   frequency: 400, freqEnd: 300, duration: 0.4, attack: 0.04, release: 0.3, gainPeak: 0.5 },
  y4: { type: "square", frequency: 220, freqEnd: 55,  duration: 0.18, attack: 0.003, release: 0.25, filterFreq: 1000, filterEnd: 150, filterType: "lowpass", distortion: true, gainPeak: 0.75 },
  y5: { type: "sine",   frequency: 80,  freqEnd: 28,  duration: 0.28, attack: 0.004, release: 0.4, gainPeak: 0.85, distortion: true },
  y6: { type: "square", frequency: 280, freqEnd: 70,  duration: 0.2,  attack: 0.003, release: 0.28, filterFreq: 1400, filterEnd: 180, filterType: "lowpass", distortion: true, gainPeak: 0.72 },
  y7: { type: "triangle", frequency: 300, freqEnd: 200, duration: 0.1, attack: 0.002, release: 0.1 },
  y8: { type: "square", frequency: 200, freqEnd: 50,  duration: 0.2,  attack: 0.004, release: 0.3, filterFreq: 1100, filterEnd: 120, filterType: "lowpass", distortion: true, gainPeak: 0.7 },

  // ── Items ─────────────────────────────────────────────────────────────────
  // Crisp triangle/sine chimes — utility, activation, clean
  it1: { type: "triangle", frequency: 440, freqEnd: 880, duration: 0.5, attack: 0.04, release: 0.6, gainPeak: 0.5, harmonics: [{ ratio: 2, gain: 0.25 }] },
  it2: { type: "sine",     frequency: 330, freqEnd: 660, duration: 0.8, attack: 0.08, release: 0.7, gainPeak: 0.45 },
  it3: { type: "triangle", frequency: 880, freqEnd: 440, duration: 0.15, attack: 0.003, release: 0.2, gainPeak: 0.45 },
  it4: { type: "sine",     frequency: 528, freqEnd: 792, duration: 0.5, attack: 0.05, release: 0.5, gainPeak: 0.45, harmonics: [{ ratio: 2, gain: 0.2 }, { ratio: 3, gain: 0.1 }] },
  it5: { type: "triangle", frequency: 660, freqEnd: 330, duration: 0.2, attack: 0.004, release: 0.3, gainPeak: 0.5 },
  it6: { type: "sawtooth", frequency: 440, freqEnd: 110, duration: 0.12, attack: 0.003, release: 0.18, filterFreq: 2500, filterEnd: 400, filterType: "lowpass", gainPeak: 0.55 },
  it7: { type: "sine",     frequency: 659, freqEnd: 988, duration: 0.35, attack: 0.04, release: 0.4, gainPeak: 0.45 },
  it8: { type: "triangle", frequency: 523, freqEnd: 784, duration: 0.25, attack: 0.02, release: 0.3, gainPeak: 0.4 },
};

export function getProfile(soundId: string): SoundProfile {
  return (
    profiles[soundId] ?? {
      type: "sine",
      frequency: 440,
      duration: 0.5,
      attack: 0.05,
      release: 0.4,
    }
  );
}
