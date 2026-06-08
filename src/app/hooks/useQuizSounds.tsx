import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import useSound from 'use-sound';

type QuizSoundContextValue = {
  enabled: boolean;
  toggleEnabled: () => void;
  playSelect: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playNavigate: () => void;
  playComplete: () => void;
};

type ToneSegment = {
  frequency: number;
  duration: number;
  gap?: number;
  volume?: number;
};

const STORAGE_KEY = 'online_quiz_learning_sound';
const SAMPLE_RATE = 22050;

const QuizSoundContext = createContext<QuizSoundContextValue | undefined>(undefined);

function readInitialSoundSetting() {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(STORAGE_KEY) !== 'off';
}

function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodeWav(samples: Int16Array) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  for (let index = 0; index < samples.length; index += 1) {
    view.setInt16(44 + index * 2, samples[index], true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    const chunk = bytes.subarray(index, index + 0x8000);
    binary += String.fromCharCode(...chunk);
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
}

function createToneSound(segments: ToneSegment[]) {
  const totalSamples = segments.reduce((total, segment) => {
    return total + Math.round((segment.duration + (segment.gap ?? 0.025)) * SAMPLE_RATE);
  }, 0);
  const samples = new Int16Array(totalSamples);
  let cursor = 0;

  segments.forEach((segment) => {
    const toneSamples = Math.round(segment.duration * SAMPLE_RATE);
    const gapSamples = Math.round((segment.gap ?? 0.025) * SAMPLE_RATE);
    const volume = segment.volume ?? 0.32;

    for (let index = 0; index < toneSamples; index += 1) {
      const progress = index / toneSamples;
      const fadeIn = Math.min(1, progress / 0.08);
      const fadeOut = Math.min(1, (1 - progress) / 0.14);
      const envelope = Math.max(0, Math.min(fadeIn, fadeOut));
      const wave = Math.sin((2 * Math.PI * segment.frequency * index) / SAMPLE_RATE);
      samples[cursor + index] = Math.round(wave * envelope * volume * 32767);
    }

    cursor += toneSamples + gapSamples;
  });

  return encodeWav(samples);
}

export function QuizSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(readInitialSoundSetting);
  const sounds = useMemo(() => ({
    select: createToneSound([{ frequency: 720, duration: 0.055, volume: 0.2 }]),
    correct: createToneSound([
      { frequency: 660, duration: 0.085, volume: 0.24 },
      { frequency: 880, duration: 0.11, volume: 0.22 },
    ]),
    incorrect: createToneSound([
      { frequency: 260, duration: 0.09, volume: 0.23 },
      { frequency: 190, duration: 0.12, volume: 0.2 },
    ]),
    navigate: createToneSound([{ frequency: 540, duration: 0.045, volume: 0.16 }]),
    complete: createToneSound([
      { frequency: 520, duration: 0.085, volume: 0.24 },
      { frequency: 660, duration: 0.085, volume: 0.24 },
      { frequency: 880, duration: 0.14, volume: 0.22 },
    ]),
  }), []);

  const [playSelect] = useSound(sounds.select, { soundEnabled: enabled, volume: 0.55 });
  const [playCorrect] = useSound(sounds.correct, { soundEnabled: enabled, volume: 0.65 });
  const [playIncorrect] = useSound(sounds.incorrect, { soundEnabled: enabled, volume: 0.6 });
  const [playNavigate] = useSound(sounds.navigate, { soundEnabled: enabled, volume: 0.45 });
  const [playComplete] = useSound(sounds.complete, { soundEnabled: enabled, volume: 0.7 });

  const value = useMemo<QuizSoundContextValue>(() => ({
    enabled,
    toggleEnabled: () => {
      setEnabled((current) => {
        const nextValue = !current;
        window.localStorage.setItem(STORAGE_KEY, nextValue ? 'on' : 'off');
        return nextValue;
      });
    },
    playSelect,
    playCorrect,
    playIncorrect,
    playNavigate,
    playComplete,
  }), [enabled, playComplete, playCorrect, playIncorrect, playNavigate, playSelect]);

  return (
    <QuizSoundContext.Provider value={value}>
      {children}
    </QuizSoundContext.Provider>
  );
}

export function useQuizSounds() {
  const context = useContext(QuizSoundContext);
  if (!context) {
    throw new Error('useQuizSounds must be used within QuizSoundProvider');
  }
  return context;
}
