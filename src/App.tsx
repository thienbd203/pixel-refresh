/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play, Square } from 'lucide-react';
import { ModeChip } from './components/ModeChip';
import { DurationPicker } from './components/DurationPicker';
import { SliderControl } from './components/SliderControl';
import { ToggleRow } from './components/ToggleRow';
import { cn } from './lib/utils';

// --- Types ---

type Mode = 'RAINBOW' | 'WHITE' | 'RED' | 'GREEN' | 'BLUE' | 'GRAYSCALE' | 'PIXEL WALK';
type View = 'SETTINGS' | 'SESSION';

interface SessionParams {
  mode: Mode;
  duration: number; // minutes
  speed: number;
  brightness: number;
  keepScreenOn: boolean;
  hideStatusBar: boolean;
}

// --- Constants ---

const MODES: Mode[] = ['RAINBOW', 'WHITE', 'RED', 'GREEN', 'BLUE', 'GRAYSCALE', 'PIXEL WALK'];
const DURATION_OPTIONS = [
  { label: '5 MIN', value: 5 },
  { label: '10 MIN', value: 10 },
  { label: '30 MIN', value: 30 },
  { label: 'CUSTOM', value: 60 },
];

// --- Sub-components ---

const SettingsView: React.FC<{ 
  onStart: (params: SessionParams) => void 
}> = ({ onStart }) => {
  const [mode, setMode] = useState<Mode>('RAINBOW');
  const [duration, setDuration] = useState(10);
  const [speed, setSpeed] = useState(85);
  const [brightness, setBrightness] = useState(85);
  const [keepScreenOn, setKeepScreenOn] = useState(true);
  const [hideStatusBar, setHideStatusBar] = useState(false);

  const getSpeedLabel = (s: number) => {
    if (s > 80) return 'OPTIMAL';
    if (s > 50) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background w-full border-b-[1.5px] border-primary flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <span className="font-mono text-[10px] font-bold tracking-[2px] text-on-surface-variant uppercase">■ PIXEL REFRESH</span>
          <h1 className="font-headline text-[32px] sm:text-[48px] uppercase text-primary leading-none mt-0.5">OLED TREATMENT</h1>
        </div>
      </header>

      <main className="px-6 pt-8 space-y-8 max-w-2xl mx-auto">
        {/* Mode Section */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] font-bold text-on-surface-variant tracking-[2px] uppercase">■ MODE</h2>
          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar -mx-6 px-6">
            {MODES.map(m => (
              <ModeChip 
                key={m} 
                label={m} 
                active={mode === m} 
                onClick={() => setMode(m)} 
              />
            ))}
          </div>
        </section>

        {/* Duration Section */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] font-bold text-on-surface-variant tracking-[2px] uppercase">■ DURATION</h2>
          <DurationPicker 
            options={DURATION_OPTIONS} 
            selectedValue={duration} 
            onSelect={setDuration} 
          />
        </section>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SliderControl 
            label="SPEED" 
            value={speed} 
            min={0} 
            max={100} 
            badge={getSpeedLabel(speed)}
            onChange={setSpeed}
            minLabel="LOW"
            maxLabel="HIGH"
          />
          <SliderControl 
            label="BRIGHTNESS" 
            value={brightness} 
            min={0} 
            max={100} 
            badge={`${brightness}%`}
            onChange={setBrightness}
            minLabel="MIN"
            maxLabel="MAX"
          />
        </div>

        {/* Toggles */}
        <div className="border-[1.5px] border-primary rounded-lg bg-surface divide-y-[1.5px] divide-primary/10 overflow-hidden">
          <ToggleRow 
            label="Keep screen on" 
            description="System enforced during treatment" 
            active={keepScreenOn} 
            onToggle={() => setKeepScreenOn(!keepScreenOn)} 
          />
          <ToggleRow 
            label="Hide status bar" 
            description="Immersive mode for full coverage" 
            active={hideStatusBar} 
            onToggle={() => setHideStatusBar(!hideStatusBar)} 
          />
        </div>

        {/* Start Button - Non-fixed */}
        <div className="pt-2 pb-12">
          <button 
            onClick={() => onStart({ mode, duration, speed, brightness, keepScreenOn, hideStatusBar })}
            className="w-full h-14 bg-secondary-fixed border-[1.5px] border-primary flex items-center justify-center space-x-2 transition-transform active:translate-x-[2px] active:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="font-mono font-extrabold text-[14px] uppercase tracking-wider">START TREATMENT</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

const SessionView: React.FC<{ 
  params: SessionParams; 
  onEnd: () => void 
}> = ({ params, onEnd }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(params.duration * 60);
  const [colorIndex, setColorIndex] = useState(0);
  const wakeLockRef = useRef<any>(null);

  // Fullscreen effect
  useEffect(() => {
    if (params.hideStatusBar) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [params.hideStatusBar]);

  // Wake lock effect
  useEffect(() => {
    if (params.keepScreenOn && 'wakeLock' in navigator) {
      const requestWakeLock = async () => {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.error(`Wake Lock error: ${err}`);
        }
      };
      requestWakeLock();
    }
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [params.keepScreenOn]);

  // Countdown effect
  useEffect(() => {
    if (isPaused) return;
    if (timeLeft <= 0) {
      onEnd();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, timeLeft, onEnd]);

  // Color cycling logic
  const colors = useMemo(() => {
    switch (params.mode) {
      case 'WHITE': return ['#FFFFFF'];
      case 'RED': return ['#FF0000'];
      case 'GREEN': return ['#00FF00'];
      case 'BLUE': return ['#0000FF'];
      case 'GRAYSCALE': return ['#111111', '#444444', '#888888', '#CCCCCC', '#FFFFFF'];
      case 'RAINBOW': return ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
      case 'PIXEL WALK': return ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000'];
      default: return ['#FFFFFF'];
    }
  }, [params.mode]);

  useEffect(() => {
    if (isPaused || colors.length === 1) return;
    
    // speed 0-100 mapped to delay. 100 speed = very fast (100ms), 0 speed = slow (3000ms)
    const delay = Math.max(100, 3100 - (params.speed * 30));
    
    const interval = setInterval(() => {
      setColorIndex(idx => (idx + 1) % colors.length);
    }, delay);
    
    return () => clearInterval(interval);
  }, [isPaused, colors, params.speed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] cursor-none overflow-hidden select-none bg-black">
      {/* Immersive Background */}
      <motion.div 
        className="absolute inset-0 transition-colors duration-100 ease-linear"
        style={{ 
          backgroundColor: colors[colorIndex],
          opacity: params.brightness / 100 
        }}
        onClick={() => setIsPaused(true)}
      />

      {/* Paused Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-6 z-[200] cursor-default"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface border-[1.5px] border-primary rounded-lg w-full max-w-sm p-6 flex flex-col items-center space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="w-full flex justify-start">
                <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-[2px] uppercase">■ PAUSED</span>
              </div>
              
              <div className="py-2 w-full text-center">
                <h1 className="font-mono text-primary font-extrabold text-[56px] tracking-tight leading-none">
                  {formatTime(timeLeft)}
                </h1>
              </div>
              
              <div className="w-full h-[1.5px] bg-primary/20" />
              
              <div className="w-full flex gap-4">
                <button 
                  onClick={onEnd}
                  className="flex-1 h-14 bg-white border-[1.5px] border-primary text-primary font-mono text-[12px] font-bold uppercase flex items-center justify-center hover:bg-surface-container transition-colors active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  STOP
                </button>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex-[1.5] h-14 bg-primary text-surface border-[1.5px] border-primary font-mono text-[12px] font-bold uppercase flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  RESUME
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge metadata (very subtle) */}
      {!isPaused && (
        <div className="absolute top-8 left-8 right-8 flex justify-between pointer-events-none opacity-10">
          <span className="font-mono text-[10px] uppercase">■ ACTIVE_PROCESS</span>
          <span className="font-mono text-[10px] uppercase">TRTMT_{params.mode.replace(' ', '_')}</span>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('SETTINGS');
  const [sessionParams, setSessionParams] = useState<SessionParams | null>(null);

  const startSession = (params: SessionParams) => {
    setSessionParams(params);
    setView('SESSION');
  };

  const endSession = () => {
    setView('SETTINGS');
    setSessionParams(null);
  };

  return (
    <div className="font-body selection:bg-secondary-fixed selection:text-primary">
      <AnimatePresence mode="wait">
        {view === 'SETTINGS' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsView onStart={startSession} />
          </motion.div>
        ) : (
          <motion.div
            key="session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {sessionParams && <SessionView params={sessionParams} onEnd={endSession} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
