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
  Sparkles
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

  // Web Audio Nodes references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainNodeRef = useRef<GainNode | null>(null);
  const windGainNodeRef = useRef<GainNode | null>(null);
  const audioStartedRef = useRef(false);

  // Synthesize rain and wind using client-side mathematical white noise buffers
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
      // Wait for user gesture release then start
      setTimeout(() => {
        startRainSynth();
      }, 50);
    }
  };

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

  // Periodic distant thunder lightning generator simulation
  useEffect(() => {
    if (!isMonsoonMode) return;

    const triggerLighningCycle = () => {
      const delay = 15000 + Math.random() * 25000; // between 15s and 40s
      const timer = setTimeout(() => {
        // Double pulse flash standard in cloud-to-ground strikes
        setLightningFlash(true);
        
        // Low rumble audio simulation if rain sounds are on
        if (isPlayingSound && audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(45, ctx.currentTime);
          
          // lowpass filter for deep heavy rumble
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(60, ctx.currentTime);

          gain.gain.setValueAtTime(0.01, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volume * 0.45, ctx.currentTime + 0.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 5);
        }

        setTimeout(() => {
          setLightningFlash(false);
          // second minor flash pulse
          setTimeout(() => {
            setLightningFlash(true);
            setTimeout(() => {
              setLightningFlash(false);
            }, 80);
          }, 150);
        }, 120);

        triggerLighningCycle();
      }, delay);

      return timer;
    };

    const timerObj = triggerLighningCycle();
    return () => clearTimeout(timerObj);
  }, [isMonsoonMode, isPlayingSound, volume]);

  // Falling rain droplets positions map generator to bypass HMR re-triggering flicker
  const raindrops = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${(i * 1.67 + Math.random() * 1.5) % 100}%`,
    delay: `${Math.random() * 3.5}s`,
    duration: `${1.2 + Math.random() * 1.0}s`,
    opacity: 0.15 + Math.random() * 0.4,
    height: `${20 + Math.random() * 25}px`
  }));

  return (
    <div id="monsoon-rain-controller-hub" className="relative z-10 w-full">
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
                className="absolute bg-gradient-to-b from-sky-400/30 to-sky-100/10 rounded-full"
                style={{
                  left: drop.left,
                  top: '-50px',
                  width: '1px',
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
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent opacity-80 pointer-events-none mix-blend-overlay" />
        </div>
      )}

      {/* 
        B. LIGHTNING FLASH ATMOSPHERIC EFFECTS 
        Briefly flashes a high opacity light overlay across active viewport when thunder triggers 
      */}
      {lightningFlash && (
        <div className="fixed inset-0 bg-sky-100/25 pointer-events-none z-50 mix-blend-screen transition-opacity duration-75" />
      )}

      {/* 
        C. METEOROLOGICAL STATUS CONTROL DASHBOARD WIDGET
        Styled beautifully like a modern meteorological parameter telemetry. 
        Highly tactile, aesthetic, fits right into bento margins of Welcome Hub.
      */}
      <div className={`rounded-3xl p-6 text-left relative overflow-hidden transition-all duration-500 border ${
        isMonsoonMode 
          ? 'bg-[#091426]/90 text-sky-100 border-sky-400/20 shadow-2xl shadow-blue-950/40' 
          : 'bg-white text-slate-800 border-slate-200/80 shadow-md'
      }`}>
        {/* Background decorative ocean wave pulse */}
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header telemetry tag */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <span className={`font-mono text-[8px] font-extrabold tracking-widest px-2 py-1 rounded uppercase ${
            isMonsoonMode 
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/10' 
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            🌿 Thiruvananthapuram Weather telemetry
          </span>
          <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-orange-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE STATION
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-between items-stretch">
          
          {/* Main Toggle Action Panel */}
          <div className="flex-grow space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                <CloudRain className={`text-sky-500 ${isMonsoonMode ? 'animate-bounce' : ''}`} size={20} />
                Kerala Monsoon Aesthetic
              </h3>
              <p className="text-xs text-slate-400 leading-normal font-sans">
                {isMonsoonMode 
                  ? 'Active: Slanted water cascades, storm background, and custom monsoon specials in notices.' 
                  : 'Inactive: High-luminance warehouse interior colors. Toggle on to engage wet weather features.'}
              </p>
            </div>

            {/* Tactical Control Switches */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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
                <CloudLightning size={13} className={isMonsoonMode ? 'animate-pulse' : ''} />
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
                  title="Toggle synthesised wind & water sounds completely client-side"
                >
                  {isPlayingSound ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} />}
                  {isPlayingSound ? 'Synthesiser Playing' : 'Synthesize Rain'}
                </button>
              )}
            </div>

            {/* Synthesiser Volume Slider */}
            {isPlayingSound && (
              <div className="space-y-1.5 pt-2 max-w-[200px] text-left">
                <div className="flex justify-between items-center text-[10px] text-sky-300/80 font-mono">
                  <span>AMBIENCE VOLUME</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Meteorological parameter stats box */}
          <div className={`p-4 rounded-2xl flex flex-col justify-between gap-3 text-left shrink-0 min-w-[200px] transition-all ${
            isMonsoonMode 
              ? 'bg-[#030a14] border border-sky-400/10 text-sky-200' 
              : 'bg-slate-50 border border-slate-200/80 text-slate-600'
          }`}>
            <span className="font-mono text-[9px] font-bold text-sky-400 tracking-wider">
              🌧️ CHALAI DISTRICT TELEMETRY
            </span>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-[8.5px] opacity-60 block">Outdoors Temp</span>
                <span className={`font-bold ${isMonsoonMode ? 'text-sky-300' : 'text-slate-700'}`}>26.5° C</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] opacity-60 block">Air Humidity</span>
                <span className="font-bold text-orange-500">98.5% RH</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] opacity-60 block">Ocean Rain Rate</span>
                <span className={`font-bold ${isMonsoonMode ? 'text-sky-300' : 'text-slate-700'}`}>120mm/hr</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[8.5px] opacity-60 block">Sea-Winds</span>
                <span className="font-bold text-emerald-500">42 knots W</span>
              </div>
            </div>

            <p className="text-[9.5px] leading-snug border-t border-sky-500/10 pt-2 italic opacity-90 max-w-[210px]">
              *Transit advisory: Secure packaging cardboard seams utilizing our 50µm heavy carton adhesive.
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
      `}</style>
    </div>
  );
}
