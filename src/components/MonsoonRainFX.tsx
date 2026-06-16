import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudRain, 
  Volume2, 
  VolumeX, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Info,
  Clock,
  Compass,
  Sparkles,
  Zap,
  Flame,
  Radio
} from 'lucide-react';

interface MonsoonRainFXProps {
  isMonsoonMode: boolean;
  onToggleMonsoonMode: (val: boolean) => void;
}

export function MonsoonRainFX({ isMonsoonMode, onToggleMonsoonMode }: MonsoonRainFXProps) {
  // Audio state
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [isRumbling, setIsRumbling] = useState(false);
  
  // Thunder settings: 'frequent' (every 10-20s), 'ambient' (every 30-50s), 'off' (manual only)
  const [thunderFrequency, setThunderFrequency] = useState<'frequent' | 'ambient' | 'off'>('ambient');
  const [lastStrikeTime, setLastStrikeTime] = useState<string>('No recent strikes');
  const [strikeCount, setStrikeCount] = useState<number>(0);

  // Web Audio Nodes references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainNodeRef = useRef<GainNode | null>(null);
  const windGainNodeRef = useRef<GainNode | null>(null);
  const audioStartedRef = useRef(false);

  // Procedural synthesised rain and wind using client-side mathematical white noise buffers
  const startRainSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 1. CREATE NOISE BUFFER FOR GENERAL SPLASHING RAIN
      const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      // Pink/White noise hybrid approximation
      let b0 = 0.0, b1 = 0.0, b2 = 0.0, b3 = 0.0, b4 = 0.0, b5 = 0.0, b6 = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // normalise volume
        b6 = white * 0.115926;
      }

      // Rain source node
      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      // Filter to shape raw noise into soft "raindrops on tropical leaves" splatters
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(750, ctx.currentTime);

      // Extra bandpass filter to capture higher crisp rain droplet splashes
      const highSplashFilter = ctx.createBiquadFilter();
      highSplashFilter.type = 'peaking';
      highSplashFilter.frequency.setValueAtTime(2200, ctx.currentTime);
      highSplashFilter.Q.setValueAtTime(1.5, ctx.currentTime);
      highSplashFilter.gain.setValueAtTime(8, ctx.currentTime);

      // Rain Gain structure
      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
      rainGainNodeRef.current = rainGain;

      // Connect nodes
      rainSource.connect(rainFilter);
      rainFilter.connect(highSplashFilter);
      highSplashFilter.connect(rainGain);
      rainGain.connect(ctx.destination);
      rainSource.start(0);

      // 2. CREATE WIND GUST OSCILLATING LOW RUMBLE
      const windSource = ctx.createBufferSource();
      windSource.buffer = noiseBuffer;
      windSource.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(350, ctx.currentTime);
      windFilter.Q.setValueAtTime(2.0, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      windGainNodeRef.current = windGain;

      windSource.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ctx.destination);
      windSource.start(0);

      // Slower volume modulation for realistic wind gust cycles
      const modulateWind = () => {
        if (!isPlayingSound || !windGainNodeRef.current) return;
        const targetGain = (0.05 + Math.random() * 0.15) * volume;
        const targetFreq = 200 + Math.random() * 400;
        const time = ctx.currentTime + 3 + Math.random() * 4;
        
        windGainNodeRef.current.gain.exponentialRampToValueAtTime(Math.max(0.01, targetGain), time);
        windFilter.frequency.exponentialRampToValueAtTime(targetFreq, time);
        
        setTimeout(modulateWind, 4000 + Math.random() * 3000);
      };
      modulateWind();

      audioStartedRef.current = true;
    } catch (e) {
      console.warn("Web Audio Context not permitted or fully supported in this sandboxed layout", e);
    }
  };

  const stopRainSynth = () => {
    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
        rainGainNodeRef.current = null;
        windGainNodeRef.current = null;
        audioStartedRef.current = false;
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // High-Fidelity synthesized multi-echo rolling thunder storm cracks
  const synthesizeThunderRumble = (targetVolume = volume) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Part 1: Electrostatic discharge crack (The high voltage snap)
      // Generates short sharp fizzing burst
      const snapLen = ctx.sampleRate * 0.4;
      const snapBuffer = ctx.createBuffer(1, snapLen, ctx.sampleRate);
      const snapOutput = snapBuffer.getChannelData(0);
      for (let i = 0; i < snapLen; i++) {
        const white = Math.random() * 2 - 1;
        // high exponential decay rate
        snapOutput[i] = white * Math.exp(-i / (ctx.sampleRate * 0.05));
      }
      
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuffer;

      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime(650, now);
      snapFilter.Q.setValueAtTime(3.5, now);

      const snapGain = ctx.createGain();
      // Snap is louder if lightning hits close
      snapGain.gain.setValueAtTime(targetVolume * 0.5, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapSource.start(now);

      // Part 2: Acoustic Resonant Rolling Low-End Waves (The physical rumble)
      const thunderWaves = [38, 48, 56, 75];
      thunderWaves.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Alternate waveforms to model compound atmospheric resonance
        osc.type = index % 2 === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // Slacking frequency represents waves expansion across hot humid air
        osc.frequency.linearRampToValueAtTime(freq * 0.75, now + 4.5);

        const lpFilter = ctx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        // lowpass cutoff keeps it deep, heavy, and non-harsh
        lpFilter.frequency.setValueAtTime(110 - index * 15, now);

        // Simulated propagation delay: distant waves arrive slightly later
        const delayMs = index * 220;
        const rumbleStart = now + (delayMs / 1000);

        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(targetVolume * (0.85 - index * 0.18), rumbleStart + 0.15);

        // Modulate with randomized volume echoes representing mountains/warehouse reflection peaks
        const duration = 4.0 + Math.random() * 2.5;
        for (let timeOffset = 0.8; timeOffset < duration; timeOffset += 0.8) {
          const echoPower = targetVolume * (0.45 - index * 0.1) * (0.3 + Math.random() * 0.7);
          oscGain.gain.linearRampToValueAtTime(echoPower, rumbleStart + timeOffset);
        }
        
        oscGain.gain.exponentialRampToValueAtTime(0.0001, rumbleStart + duration);

        osc.connect(lpFilter);
        lpFilter.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.start(rumbleStart);
        osc.stop(rumbleStart + duration + 0.5);
      });

    } catch (e) {
      console.warn("High fidelity thunder audio nodes failed initialization", e);
    }
  };

  // Immediate visual lightning & thunder strike trigger
  const triggerThunderStrike = () => {
    if (!isMonsoonMode) {
      onToggleMonsoonMode(true);
    }

    const timeString = new Date().toLocaleTimeString();
    setLastStrikeTime(timeString);
    setStrikeCount(prev => prev + 1);

    // 1. Visual physical screen rumble shockwave
    setIsRumbling(true);
    setTimeout(() => setIsRumbling(false), 950);

    // 2. High-intensity double visual pulse lightning screen-flash
    setLightningFlash(true);
    
    // Play synthesis automatically to give beautiful thunder sounds
    synthesizeThunderRumble(volume);

    setTimeout(() => {
      setLightningFlash(false);
      
      // Secondary brief reflection flash in the sky
      setTimeout(() => {
        setLightningFlash(true);
        setTimeout(() => {
          setLightningFlash(false);
        }, 90);
      }, 140);
    }, 110);
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (rainGainNodeRef.current && audioCtxRef.current) {
      rainGainNodeRef.current.gain.linearRampToValueAtTime(volume * 0.6, audioCtxRef.current.currentTime + 0.1);
    }
    if (windGainNodeRef.current && audioCtxRef.current) {
      windGainNodeRef.current.gain.linearRampToValueAtTime(volume * 0.15, audioCtxRef.current.currentTime + 0.1);
    }
  }, [volume]);

  // Handle rain sound play/pause toggles
  const handleToggleSound = () => {
    if (!isMonsoonMode) {
      onToggleMonsoonMode(true);
    }
    if (isPlayingSound) {
      stopRainSynth();
      setIsPlayingSound(false);
    } else {
      setIsPlayingSound(true);
      setTimeout(() => {
        startRainSynth();
      }, 50);
    }
  };

  // Unlocks and pre-resumes the Web Audio Context during direct human interactions (clicks/touches)
  // This bypasses browser auto-play security sandboxing, ensuring periodic background thunder sounds can start playing
  useEffect(() => {
    const unlockAudio = () => {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch (e) {
        console.warn("Could not pre-unlock audio context", e);
      }
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Trigger a spectacular structural intro/welcoming thunder strike soon after Monsoon mode is activated
  useEffect(() => {
    if (isMonsoonMode) {
      const welcomeTimer = setTimeout(() => {
        triggerThunderStrike();
      }, 1200);
      return () => clearTimeout(welcomeTimer);
    }
  }, [isMonsoonMode]);

  // Turn off sound if general monsoon mode is unchecked
  useEffect(() => {
    if (!isMonsoonMode && isPlayingSound) {
      stopRainSynth();
      setIsPlayingSound(false);
    }
  }, [isMonsoonMode]);

  // Clean mount/unmount listener
  useEffect(() => {
    return () => {
      stopRainSynth();
    };
  }, []);

  // Periodic distant storm generator simulation configured with customizable frequency
  useEffect(() => {
    if (!isMonsoonMode || thunderFrequency === 'off') return;

    const runStrikeLoop = () => {
      // frequent = every 10-22 seconds, ambient = thirty to sixty seconds
      const baseDelay = thunderFrequency === 'frequent' ? 10000 : 30000;
      const jitter = thunderFrequency === 'frequent' ? 12000 : 30000;
      const delay = baseDelay + Math.random() * jitter;

      const timer = setTimeout(() => {
        triggerThunderStrike();
        runStrikeLoop();
      }, delay);

      return timer;
    };

    const activeTimer = runStrikeLoop();
    return () => clearTimeout(activeTimer);
  }, [isMonsoonMode, thunderFrequency]);

  // Falling rain droplets positions map generator to bypass HMR re-triggering flicker
  const raindrops = Array.from({ length: 65 }, (_, i) => ({
    id: i,
    left: `${(i * 1.54 + Math.random() * 1.8) % 100}%`,
    delay: `${Math.random() * 3.2}s`,
    duration: `${1.1 + Math.random() * 0.9}s`,
    opacity: 0.15 + Math.random() * 0.45,
    height: `${22 + Math.random() * 28}px`
  }));

  return (
    <div id="monsoon-rain-controller-hub" className={`relative z-10 w-full transition-transform duration-300 ${isRumbling ? 'animate-rumble' : ''}`}>
      {/* 
        A. FULL PORTRAIT BACKGROUND OVERLAY VISUAL RAINDROPS 
        These are absolutely positioned with viewport coordinates, layered beautifully background-wise
      */}
      {isMonsoonMode && (
        <div id="visual-rain-screen-droplets" className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Falling liquid droplet matrix slanted 8 degrees simulating beautiful tropical wind */}
          <div className="absolute inset-0 transform rotate-[8deg] scale-105">
            {raindrops.map((drop) => (
              <div
                key={drop.id}
                className="absolute bg-gradient-to-b from-sky-450/45 to-sky-100/10 rounded-full"
                style={{
                  left: drop.left,
                  top: '-50px',
                  width: '1.2px',
                  height: drop.height,
                  opacity: drop.opacity,
                  animationName: 'tropicalRainFall',
                  animationDuration: drop.duration,
                  animationTimingFunction: 'linear',
                  animationDelay: drop.delay,
                  animationIterationCount: 'infinite'
                }}
              />
            ))}
          </div>

          {/* Drifting wet cloud mist patches */}
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-90 pointer-events-none mix-blend-overlay animate-pulse" />
        </div>
      )}

      {/* 
        B. LIGHTNING FLASH ATMOSPHERIC EFFECTS 
        Briefly flashes a high opacity light overlay across active viewport when thunder triggers 
      */}
      {lightningFlash && (
        <div className="fixed inset-0 bg-sky-200/35 pointer-events-none z-50 mix-blend-screen transition-opacity duration-75" />
      )}

      {/* 
        C. METEOROLOGICAL STATUS CONTROL DASHBOARD WIDGET
        Styled beautifully like a modern meteorological parameter telemetry. 
        Highly tactile, aesthetic, fits right into bento margins of Welcome Hub.
      */}
      <div className={`rounded-3xl p-6 text-left relative overflow-hidden transition-all duration-500 border ${
        isMonsoonMode 
          ? 'bg-[#06101f]/95 text-sky-100 border-sky-400/20 shadow-2xl shadow-blue-950/50' 
          : 'bg-white text-slate-800 border-slate-200/80 shadow-md'
      }`}>
        {/* Background decorative ocean wave pulse */}
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Header telemetry tag */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <span className={`font-mono text-[8px] font-extrabold tracking-widest px-2 py-1 rounded uppercase ${
            isMonsoonMode 
              ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20' 
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            ⛈️ Western Ghats Thunder Simulator
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            THUNDER STORM TELEMETRY
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch">
          
          {/* Main Toggle Action Panel */}
          <div className="flex-grow space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
                <CloudLightning className={`text-sky-400 ${isMonsoonMode ? 'animate-pulse' : ''}`} size={22} />
                Kerala Monsoon & Thunder Theme
              </h3>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                {isMonsoonMode 
                  ? 'Active: Slanted storm cascades, interactive thunder strikes, physical screen rumble, and beautiful synthesised sound effects.' 
                  : 'Inactive: Safe warm warehouse lighting theme. Toggle below to activate full weather experience.'}
              </p>
            </div>

            {/* Thunder Parameter Controls & manual trigger */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {/* Main Mode Toggle button */}
              <button
                type="button"
                onClick={() => onToggleMonsoonMode(!isMonsoonMode)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all duration-300 border ${
                  isMonsoonMode 
                    ? 'bg-sky-500 hover:bg-sky-600 text-slate-950 border-sky-400' 
                    : 'bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 border-slate-300'
                }`}
              >
                <CloudRain size={13} className={isMonsoonMode ? 'animate-bounce' : ''} />
                {isMonsoonMode ? 'Monsoon Active' : 'Enable Monsoon'}
              </button>

              {/* Sound Toggle button */}
              {isMonsoonMode && (
                <button
                  type="button"
                  onClick={handleToggleSound}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-tight flex items-center gap-1.5 cursor-pointer transition-all duration-300 border ${
                    isPlayingSound 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                      : 'bg-black/35 text-sky-300 hover:text-white border-sky-500/10'
                  }`}
                  title="Toggle synthesised structural wind, water, and rumble waves"
                >
                  {isPlayingSound ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} />}
                  {isPlayingSound ? 'Synthesiser On' : 'Synthesize Audio'}
                </button>
              )}
            </div>

            {/* Synthesiser Volume Slider and Thunder Rate settings */}
            {isMonsoonMode && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 max-w-lg border-t border-sky-950/30">
                {/* 1. Frequency toggle */}
                <div className="space-y-1">
                  <span className="text-[10px] text-sky-400 font-mono block tracking-wider">AUTO THUNDER FREQUENCY</span>
                  <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-sky-950/40">
                    {(['frequent', 'ambient', 'off'] as const).map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setThunderFrequency(rate)}
                        className={`flex-1 py-1 rounded-lg text-[9px] font-mono tracking-tight uppercase transition-all ${
                          thunderFrequency === rate
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-400/20 font-bold'
                            : 'text-slate-400 hover:text-sky-200'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Volume control */}
                {isPlayingSound ? (
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="flex justify-between items-center text-[10px] text-sky-300/80 font-mono">
                      <span>STORM VOLUME</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer accent-sky-400"
                    />
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 italic font-sans flex items-center justify-start gap-1">
                    <Radio size={12} className="shrink-0" /> Turn sound synthesis on to hear rolling rumbles!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Meteorological parameter stats box with Thunder telemetry */}
          <div className={`p-4 rounded-2xl flex flex-col justify-between gap-3 text-left shrink-0 min-w-[210px] transition-all ${
            isMonsoonMode 
              ? 'bg-[#030a14] border border-sky-400/10 text-sky-200' 
              : 'bg-slate-50 border border-slate-200/80 text-slate-600'
          }`}>
            <div>
              <span className="font-mono text-[9px] font-bold text-sky-400 tracking-wider block mb-1">
                ⚡ THUNDERSTORM STATISTICS
              </span>
              <div className="bg-sky-500/5 rounded-lg p-2 border border-sky-500/5 space-y-1 text-xs font-mono mb-2">
                <div className="flex justify-between">
                  <span className="opacity-60 text-[9.5px]">Storm Strikes:</span>
                  <span className="font-bold text-sky-300">{strikeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60 text-[9.5px]">Last Strike:</span>
                  <span className="font-bold text-amber-400 text-[10px]">{lastStrikeTime}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono border-t border-sky-950/30 pt-2.5">
              <div className="space-y-0.5">
                <span className="text-[8.5px] opacity-60 block">Temperature</span>
                <span className={`font-bold ${isMonsoonMode ? 'text-sky-300' : 'text-slate-700'}`}>24.8° C</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] opacity-60 block">Barometer</span>
                <span className="font-bold text-orange-500">994 hPa 📉</span>
              </div>
            </div>

            <p className="text-[9.5px] leading-snug border-t border-sky-500/10 pt-2 italic opacity-90">
              ⚡ Warning: Electrostatic activity detected. Secure container tarpaulins on outbound bulk freight.
            </p>
          </div>

        </div>
      </div>

      {/* Direct injection of CSS animation keyframes is extremely performant and does not block React triggers */}
      <style>{`
        @keyframes tropicalRainFall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(110vh);
          }
        }
        @keyframes screenRumble {
          0% { transform: translate(0, 0) rotate(0deg); }
          15% { transform: translate(-3px, 1.5px) rotate(-0.5deg); }
          30% { transform: translate(2px, -1.5px) rotate(0.5deg); }
          45% { transform: translate(-1.5px, 2px) rotate(0deg); }
          60% { transform: translate(2.5px, 1px) rotate(0.5deg); }
          75% { transform: translate(-1px, -1px) rotate(-0.5deg); }
          90% { transform: translate(1.5px, 1.5px) rotate(0deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-rumble {
          animation: screenRumble 0.85s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}
