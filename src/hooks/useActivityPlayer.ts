import { useState, useRef, useCallback, useEffect } from 'react';

interface UseActivityPlayerProps {
  audioSrc: string;
  steps: string[];
  stepTimes: number[];
}

interface UseActivityPlayerResult {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentStepIdx: number;
  currentTimeDisplay: string;
  durationDisplay: string;
  progressPct: number;
  toggle: () => void;
  stop: () => void;
  seek: (e: React.MouseEvent<HTMLDivElement>) => void;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function useActivityPlayer({ audioSrc, steps: _steps, stepTimes }: UseActivityPlayerProps): UseActivityPlayerResult {
  const audioRef: React.MutableRefObject<HTMLAudioElement | null> = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Reset when audioSrc changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = audioSrc;
    audio.load();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentStepIdx(0);
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      let idx = 0;
      for (let i = stepTimes.length - 1; i >= 0; i--) {
        if (audio.currentTime >= stepTimes[i]) { idx = i; break; }
      }
      setCurrentStepIdx(idx);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [stepTimes]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentStepIdx(0);
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  }, []);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    isPlaying,
    currentTime,
    duration,
    currentStepIdx,
    currentTimeDisplay: fmtTime(currentTime),
    durationDisplay: fmtTime(duration),
    progressPct,
    toggle,
    stop,
    seek,
    audioRef,
  };
}
