// Web Audio API engine — generates tones instantly, no network required.
// Each sound profile uses oscillators, filters, and envelopes for distinct character.

export type SoundProfile = {
  type: OscillatorType;
  frequency: number;
  detune?: number;
  duration: number;           // seconds
  attack: number;
  release: number;
  filterFreq?: number;
  filterType?: BiquadFilterType;
  distortion?: boolean;
  harmonics?: number[];       // additional oscillator frequencies (ratios)
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

export function playProfile(profile: SoundProfile): () => void {
  const ac = getCtx();
  const now = ac.currentTime;

  const masterGain = ac.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.5, now + profile.attack);
  masterGain.gain.exponentialRampToValueAtTime(
    0.001,
    now + profile.duration + profile.release
  );
  masterGain.connect(ac.destination);

  // Optional filter
  let endpoint: AudioNode = masterGain;
  if (profile.filterFreq) {
    const filter = ac.createBiquadFilter();
    filter.type = profile.filterType ?? "lowpass";
    filter.frequency.setValueAtTime(profile.filterFreq, now);
    filter.connect(masterGain);
    endpoint = filter;
  }

  // Optional waveshaper distortion
  if (profile.distortion) {
    const shaper = ac.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 300) * x) / (Math.PI + 300 * Math.abs(x));
    }
    shaper.curve = curve;
    shaper.connect(endpoint);
    endpoint = shaper;
  }

  const oscillators: OscillatorNode[] = [];

  const makeOsc = (freq: number, detune = 0, gain = 0.5) => {
    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(gain, now);
    oscGain.connect(endpoint);

    const osc = ac.createOscillator();
    osc.type = profile.type;
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);
    osc.connect(oscGain);
    osc.start(now);
    osc.stop(now + profile.duration + profile.release + 0.05);
    oscillators.push(osc);
  };

  makeOsc(profile.frequency, profile.detune ?? 0);

  if (profile.harmonics) {
    profile.harmonics.forEach((ratio, i) => {
      makeOsc(profile.frequency * ratio, 0, 0.3 / (i + 2));
    });
  }

  // Return a stop function
  return () => {
    const stopAt = ac.currentTime + 0.05;
    masterGain.gain.cancelScheduledValues(ac.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.001, stopAt);
    oscillators.forEach((o) => {
      try { o.stop(stopAt + 0.05); } catch { /* already stopped */ }
    });
  };
}

// --- Preset profiles per sound id ---

const profiles: Record<string, SoundProfile> = {
  // Music — sustained pads
  m1: { type: "sine",     frequency: 110,  duration: 2.0, attack: 0.3, release: 1.2, harmonics: [2, 3, 4.5] },
  m2: { type: "sine",     frequency: 146,  duration: 2.0, attack: 0.4, release: 1.5, harmonics: [1.5, 3] },
  m3: { type: "sine",     frequency: 98,   duration: 2.5, attack: 0.5, release: 2.0, harmonics: [2, 4] },
  m4: { type: "sawtooth", frequency: 130,  duration: 1.5, attack: 0.1, release: 0.8, filterFreq: 600, filterType: "lowpass", harmonics: [2, 3] },
  m5: { type: "sine",     frequency: 174,  duration: 2.0, attack: 0.3, release: 1.2, harmonics: [2, 3] },
  m6: { type: "triangle", frequency: 87,   duration: 2.5, attack: 0.4, release: 1.8, harmonics: [1.5, 2.5, 4] },
  m7: { type: "sine",     frequency: 220,  duration: 1.5, attack: 0.2, release: 0.9, harmonics: [2, 5] },
  m8: { type: "sine",     frequency: 82,   duration: 3.0, attack: 0.6, release: 2.5, harmonics: [2, 3, 6] },

  // Impacts & Ragdolls — punchy transients
  i1: { type: "sine",     frequency: 80,   duration: 0.3, attack: 0.005, release: 0.4, distortion: true },
  i2: { type: "sine",     frequency: 55,   duration: 0.4, attack: 0.005, release: 0.5, distortion: true },
  i3: { type: "square",   frequency: 400,  duration: 0.1, attack: 0.002, release: 0.15, filterFreq: 800 },
  i4: { type: "sawtooth", frequency: 60,   duration: 0.5, attack: 0.005, release: 0.6, distortion: true, harmonics: [2, 3] },
  i5: { type: "sine",     frequency: 45,   duration: 0.4, attack: 0.005, release: 0.5, distortion: true },
  i6: { type: "sawtooth", frequency: 150,  duration: 0.3, attack: 0.005, release: 0.4, filterFreq: 1200 },
  i7: { type: "square",   frequency: 300,  duration: 0.2, attack: 0.005, release: 0.3, filterFreq: 600 },
  i8: { type: "sine",     frequency: 65,   duration: 0.6, attack: 0.005, release: 0.8, distortion: true },

  // Gojo — clean, bright, limitless
  g1: { type: "sine",    frequency: 528,  duration: 0.8, attack: 0.05, release: 0.6, harmonics: [2, 4] },
  g2: { type: "sine",    frequency: 440,  duration: 0.6, attack: 0.1,  release: 0.5, harmonics: [1.5, 3] },
  g3: { type: "sine",    frequency: 660,  duration: 0.5, attack: 0.05, release: 0.4, harmonics: [2, 3] },
  g4: { type: "sine",    frequency: 320,  duration: 1.0, attack: 0.2,  release: 0.8, harmonics: [1.5, 2, 3] },
  g5: { type: "sine",    frequency: 180,  duration: 1.5, attack: 0.3,  release: 1.2, harmonics: [2, 4, 6] },
  g6: { type: "triangle",frequency: 392,  duration: 0.7, attack: 0.15, release: 0.6 },
  g7: { type: "sine",    frequency: 740,  duration: 0.4, attack: 0.05, release: 0.3 },
  g8: { type: "sine",    frequency: 494,  duration: 0.6, attack: 0.1,  release: 0.5, harmonics: [1.5] },

  // Sukuna — dark, gritty, powerful
  s1: { type: "sawtooth", frequency: 73,   duration: 1.5, attack: 0.1,  release: 1.0, filterFreq: 400,  distortion: true, harmonics: [2, 3] },
  s2: { type: "sawtooth", frequency: 220,  duration: 0.3, attack: 0.005,release: 0.3, filterFreq: 1500, distortion: true },
  s3: { type: "sawtooth", frequency: 330,  duration: 0.25,attack: 0.005,release: 0.25,filterFreq: 1800 },
  s4: { type: "sawtooth", frequency: 260,  duration: 0.3, attack: 0.005,release: 0.3, filterFreq: 1200 },
  s5: { type: "square",   frequency: 98,   duration: 0.8, attack: 0.05, release: 0.6, filterFreq: 500 },
  s6: { type: "sawtooth", frequency: 185,  duration: 0.3, attack: 0.005,release: 0.3, filterFreq: 900,  distortion: true },
  s7: { type: "sine",     frequency: 55,   duration: 0.5, attack: 0.01, release: 0.5, distortion: true, harmonics: [2, 3, 5] },
  s8: { type: "sawtooth", frequency: 65,   duration: 0.9, attack: 0.02, release: 0.7, filterFreq: 350,  distortion: true },

  // Hakari — punchy, percussive, lucky
  h1: { type: "square",   frequency: 880,  duration: 0.3, attack: 0.005,release: 0.3, harmonics: [2, 3] },
  h2: { type: "sawtooth", frequency: 110,  duration: 1.2, attack: 0.1,  release: 0.8, filterFreq: 600,  distortion: true },
  h3: { type: "sine",     frequency: 130,  duration: 0.5, attack: 0.05, release: 0.5 },
  h4: { type: "square",   frequency: 196,  duration: 0.3, attack: 0.005,release: 0.3, distortion: true },
  h5: { type: "square",   frequency: 1046, duration: 0.15,attack: 0.002,release: 0.15 },
  h6: { type: "square",   frequency: 523,  duration: 0.2, attack: 0.002,release: 0.2, harmonics: [2] },
  h7: { type: "sawtooth", frequency: 246,  duration: 0.2, attack: 0.005,release: 0.2, filterFreq: 1000 },
  h8: { type: "sine",     frequency: 165,  duration: 0.8, attack: 0.1,  release: 0.6, harmonics: [2, 3] },

  // Yuji — raw, human, powerful
  y1: { type: "square",   frequency: 140,  duration: 0.2, attack: 0.005,release: 0.25, distortion: true, filterFreq: 700 },
  y2: { type: "sawtooth", frequency: 90,   duration: 0.4, attack: 0.005,release: 0.4,  distortion: true, harmonics: [2, 4] },
  y3: { type: "sine",     frequency: 300,  duration: 0.5, attack: 0.05, release: 0.4 },
  y4: { type: "square",   frequency: 120,  duration: 0.25,attack: 0.005,release: 0.3,  distortion: true },
  y5: { type: "sine",     frequency: 70,   duration: 0.35,attack: 0.005,release: 0.4,  distortion: true },
  y6: { type: "square",   frequency: 160,  duration: 0.35,attack: 0.005,release: 0.35, distortion: true, filterFreq: 800 },
  y7: { type: "sine",     frequency: 200,  duration: 0.1, attack: 0.002,release: 0.1 },
  y8: { type: "sawtooth", frequency: 175,  duration: 0.3, attack: 0.01, release: 0.3,  filterFreq: 900 },

  // Items — utility, crisp
  it1: { type: "sine",     frequency: 220,  duration: 0.6, attack: 0.05, release: 0.5, harmonics: [2] },
  it2: { type: "triangle", frequency: 330,  duration: 0.8, attack: 0.1,  release: 0.6 },
  it3: { type: "square",   frequency: 660,  duration: 0.2, attack: 0.005,release: 0.2 },
  it4: { type: "sine",     frequency: 440,  duration: 0.5, attack: 0.05, release: 0.4, harmonics: [2, 3] },
  it5: { type: "sawtooth", frequency: 280,  duration: 0.3, attack: 0.005,release: 0.3, filterFreq: 1500 },
  it6: { type: "sawtooth", frequency: 350,  duration: 0.25,attack: 0.005,release: 0.25,distortion: true },
  it7: { type: "sine",     frequency: 523,  duration: 0.4, attack: 0.05, release: 0.3 },
  it8: { type: "triangle", frequency: 392,  duration: 0.3, attack: 0.02, release: 0.25 },
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
