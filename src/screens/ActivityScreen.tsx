import { ACT_CONFIGS } from '../data/activities';
import BackButton from '../components/BackButton';
import { useActivityPlayer } from '../hooks/useActivityPlayer';
import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
  selectedActivityId: string | null;
  onGoReflect: () => void;
}

export default function ActivityScreen({ showScreen, selectedActivityId, onGoReflect }: Props) {
  const id = selectedActivityId || 'freeze-feelings';
  const config = ACT_CONFIGS[id] || ACT_CONFIGS['freeze-feelings'];

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

  return (
    <div style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="act-wrap">
        {/* Back */}
        <BackButton onClick={handleBack} />

        {/* Step text as title */}
        <div className="act-title">{config.steps[currentStepIdx]}</div>

        {/* Blob / step illustration — fills middle space */}
        <div className="act-middle">
          <img
            className="act-blob"
            src={
              id === 'tense-and-relax' && currentStepIdx === 0
                ? (isPlaying ? 'assets/turtle.gif' : 'assets/turtle-still.svg')
                : id === 'tense-and-relax' && currentStepIdx === 1
                ? 'assets/lemon.gif'
                : 'assets/blob.svg'
            }
            alt=""
          />
        </div>

        {/* Bottom controls — always anchored */}
        <div className="act-controls">
          {/* Play / Pause */}
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

          {/* Timeline */}
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

          {/* CTA */}
          <button className="act-go-btn" onClick={handleGoReflect}>
            Go to Reflection
          </button>
        </div>

        {/* Hidden audio element */}
        <audio ref={(el) => { audioRef.current = el; }} preload="auto" />
      </div>
    </div>
  );
}
