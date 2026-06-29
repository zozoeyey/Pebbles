import { useState } from 'react';
import { ACT_CONFIGS } from '../data/activities';
import BackButton from '../components/BackButton';
import { useActivityPlayer } from '../hooks/useActivityPlayer';
import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
  selectedActivityId: string | null;
  onGoReflect: () => void;
}

function stepImg(id: string, stepIdx: number, isPlaying: boolean, mode: 'listen' | 'read') {
  if (id === 'tense-and-relax') {
    if (stepIdx === 0) return (mode === 'read' || isPlaying) ? 'assets/turtle.gif' : 'assets/turtle-still.svg';
    if (stepIdx === 1) return 'assets/lemon.gif';
  }
  return 'assets/blob.svg';
}

export default function ActivityScreen({ showScreen, selectedActivityId, onGoReflect }: Props) {
  const id = selectedActivityId || 'freeze-feelings';
  const config = ACT_CONFIGS[id] || ACT_CONFIGS['freeze-feelings'];

  const [mode, setMode] = useState<'listen' | 'read'>('listen');
  const [readStep, setReadStep] = useState(0);

  const {
    isPlaying,
    currentTimeDisplay,
    durationDisplay,
    progressPct,
    currentStepIdx,
    toggle,
    stop,
    seek,
    audioRef,
  } = useActivityPlayer({
    audioSrc: config.audioSrc,
    steps: config.steps,
    stepTimes: config.stepTimes,
  });

  function handleBack() {
    stop();
    showScreen('detail');
  }

  function handleGoReflect() {
    stop();
    onGoReflect();
  }

  function switchMode(next: 'listen' | 'read') {
    if (next === 'read') stop();
    setMode(next);
    setReadStep(0);
  }

  const displayStep = mode === 'read' ? readStep : currentStepIdx;
  const totalSteps = config.steps.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="act-wrap">

        {/* Top row: back + mode toggle */}
        <div className="act-top-row">
          <BackButton onClick={handleBack} />
          <div className="act-mode-toggle">
            <button
              className={`act-mode-btn${mode === 'read' ? ' active' : ''}`}
              onClick={() => switchMode('read')}
            >
              Read
            </button>
            <button
              className={`act-mode-btn${mode === 'listen' ? ' active' : ''}`}
              onClick={() => switchMode('listen')}
            >
              Listen
            </button>
          </div>
        </div>

        {/* Step text — read mode only */}
        {mode === 'read' && (
          <div className="act-title">{config.steps[displayStep]}</div>
        )}

        {/* Illustration */}
        <div className="act-middle">
          <img
            className="act-blob"
            src={stepImg(id, displayStep, isPlaying, mode)}
            alt=""
          />
        </div>

        {/* Bottom controls */}
        <div className="act-controls">

          {mode === 'read' ? (
            /* Read mode: prev / step counter / next */
            <div className="act-step-nav">
              <button
                className="act-step-nav-btn"
                onClick={() => setReadStep((s) => Math.max(0, s - 1))}
                disabled={readStep === 0}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span className="act-step-counter">{readStep + 1} / {totalSteps}</span>
              <button
                className="act-step-nav-btn"
                onClick={() => setReadStep((s) => Math.min(totalSteps - 1, s + 1))}
                disabled={readStep === totalSteps - 1}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M8 5L13 10L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            /* Listen mode: play + timeline */
            <>
              <button className="act-play-btn" onClick={toggle}>
                {isPlaying ? (
                  <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
                    <rect x="2" y="2" width="8" height="26" rx="2" fill="white"/>
                    <rect x="16" y="2" width="8" height="26" rx="2" fill="white"/>
                  </svg>
                ) : (
                  <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
                    <path d="M2 1.5L24 15L2 28.5V1.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <div className="act-timeline">
                <div className="act-time-row">
                  <span className="act-time-label">{currentTimeDisplay}</span>
                  <div className="act-track-wrap">
                    <div className="act-progress-track" onClick={seek}>
                      <div className="act-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                  <span className="act-time-label" style={{ textAlign: 'right' }}>{durationDisplay}</span>
                </div>
              </div>
            </>
          )}

          <button className="act-go-btn" onClick={handleGoReflect}>
            Go to Reflection
          </button>
        </div>

        <audio ref={(el) => { audioRef.current = el; }} preload="auto" />
      </div>
    </div>
  );
}
