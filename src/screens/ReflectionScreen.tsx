import { useEffect, useRef, useState } from 'react';
import { PEER_REFLECTIONS } from '../data/activities';
import BackButton from '../components/BackButton';
import ExitButton from '../components/ExitButton';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { shareReflection } from '../lib/communityApi';
import { logEvent } from '../lib/analytics';
import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
  selectedActivityId: string | null;
  selectedAge: number | null;
}

const PEBBLE_PATH =
  'M101.2 0C121.524 0 138 16.4759 138 36.7998C138 50.657 130.339 62.7231 119.023 69C130.339 75.2769 138 87.3429 138 101.2C138 121.524 121.524 138 101.2 138H36.7998C16.4759 138 0 121.524 0 101.2C4.49801e-05 87.3433 7.66 75.277 18.9756 69C7.66 62.723 4.77943e-05 50.6567 0 36.7998C0 16.4759 16.4759 0 36.7998 0H101.2Z';

function boldLeadingLabel(text: string): string {
  return text.replace(
    /^(Activity engagement|Focus on mechanics over sensation|Key takeaway|What went well|What could have gone better|Hope for the future|Tried .+):/,
    '<strong>$1:</strong>',
  );
}

export default function ReflectionScreen({ showScreen, selectedActivityId, selectedAge }: Props) {
  const actId = selectedActivityId || 'freeze-feelings';
  const peer = PEER_REFLECTIONS[actId] || PEER_REFLECTIONS['freeze-feelings'];
  const [peerOpen, setPeerOpen] = useState(false);

  const {
    state,
    isRecording,
    summary,
    transcript,
    reflectionId,
    error,
    timerDisplay,
    startRecording,
    stopRecording,
    resetRecorder,
  } = useAudioRecorder(actId, actId, selectedAge);

  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'shared' | 'error'>('idle');
  const [resultTab, setResultTab] = useState<'summary' | 'transcript'>('summary');
  const completedLogged = useRef(false);

  // Completing counts once, whichever way they leave after recording.
  function logCompleted() {
    if (completedLogged.current) return;
    completedLogged.current = true;
    logEvent('activity_completed', { activityId: actId });
  }

  useEffect(() => {
    if (state === 'result') logEvent('reflection_submitted', { activityId: actId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  async function handleShare() {
    if (!reflectionId) return;
    setShareState('sharing');
    try {
      await shareReflection(reflectionId);
      setShareState('shared');
      logEvent('reflection_shared', { activityId: actId });
    } catch (e) {
      console.error(e);
      setShareState('error');
    }
  }

  function handleRecordClick() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  const summaryParagraphs = summary
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.replace(/^[-•*]\s*/, ''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="refl-screen-wrap">
        {/* Back / Exit */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BackButton onClick={() => showScreen('activity')} />
          <ExitButton onClick={() => { stopRecording(); showScreen('results'); }} />
        </div>

        <div className="refl-heading">How did it go?</div>
        <div className="refl-subtext">Read another parent's reflection, then record your own.</div>

        {/* Peer card — collapsible */}
        <div className="refl-peer-card">
          <button className="refl-peer-toggle" onClick={() => setPeerOpen(o => { if (!o) logEvent('peer_reflection_opened', { activityId: actId }); return !o; })}>
            <div className="refl-peer-toggle-left">
              <div className="refl-peer-avatar">
                <svg viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d={PEBBLE_PATH} fill="#FDD15E"/>
                  <ellipse cx="59" cy="52" rx="7" ry="9" fill="#555"/>
                  <ellipse cx="79" cy="52" rx="7" ry="9" fill="#555"/>
                </svg>
              </div>
              <div>
                <div className="refl-peer-name">Read another parent's reflection</div>
                <div className="refl-peer-meta">Parent (child age 5) · 2h ago</div>
              </div>
            </div>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#6b6761" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: 'transform 0.2s', transform: peerOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          {peerOpen && (
            <div className="refl-peer-text">
              {peer.paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: boldLeadingLabel(p) }} />
              ))}
            </div>
          )}
        </div>

        {/* Prompts */}
        <div className="refl-prompt-label">Reflect on these while you record</div>
        <div className="refl-prompt-card">
          <div className="refl-prompt-q">How did the activity go — what went well and what could have gone better? What did you notice about your child?</div>
          <div className="refl-prompt-q">What would you try differently next time?</div>
          <div className="refl-prompt-q">What's one tip you'd share with another parent trying this?</div>
        </div>

        {/* Idle / Recording state */}
        {(state === 'idle' || state === 'recording') && (
          <div className="refl-record-area">
            <button className="refl-record-btn" onClick={handleRecordClick}>
              <div className={`refl-record-circle${isRecording ? ' recording' : ''}`}>
                <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {isRecording ? (
                    <rect x="8" y="12" width="28" height="28" rx="5" fill="#3d3935"/>
                  ) : (
                    <g>
                      <rect x="14" y="2" width="16" height="26" rx="8" fill="#3d3935"/>
                      <path d="M5 28C5 37 13 44 22 44C31 44 39 37 39 28" stroke="#3d3935" strokeWidth="3" strokeLinecap="round" fill="none"/>
                      <line x1="22" y1="44" x2="22" y2="50" stroke="#3d3935" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="15" y1="50" x2="29" y2="50" stroke="#3d3935" strokeWidth="3" strokeLinecap="round"/>
                    </g>
                  )}
                </svg>
              </div>
              {timerDisplay && <span className="refl-timer">{timerDisplay}</span>}
            </button>
            <div className="refl-tap-label">
              {isRecording ? 'Tap to stop' : 'Tap to record your reflection'}
            </div>
          </div>
        )}

        {/* Processing state */}
        {state === 'processing' && (
          <div className="refl-state-box">
            <div className="refl-state-msg">Transcribing your note…</div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="16" cy="16" r="12" stroke="#d6e475" strokeWidth="4"/>
              <path d="M16 4a12 12 0 0 1 12 12" stroke="#3d3935" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Result state */}
        {state === 'result' && (
          <div className="refl-state-box">
            {/* Toggle between the AI note and the parent's exact words */}
            {transcript && (
              <div className="refl-tab-row">
                <button
                  className={`refl-tab${resultTab === 'summary' ? ' active' : ''}`}
                  onClick={() => setResultTab('summary')}
                >
                  Summary
                </button>
                <button
                  className={`refl-tab${resultTab === 'transcript' ? ' active' : ''}`}
                  onClick={() => setResultTab('transcript')}
                >
                  What you said
                </button>
              </div>
            )}
            <div className="refl-summary-box">
              {resultTab === 'transcript'
                ? <p>{transcript}</p>
                : summaryParagraphs.map((p, i) => (
                    <p key={i} style={{ marginBottom: 6 }}>{p}</p>
                  ))}
            </div>

            <div className="refl-actions">
              {reflectionId && shareState !== 'shared' && (
                <>
                  <button
                    className="refl-btn-primary"
                    disabled={shareState === 'sharing'}
                    onClick={handleShare}
                  >
                    {shareState === 'sharing' ? 'Sharing…' : shareState === 'error' ? 'Try sharing again' : 'Share to Community'}
                  </button>
                  <div className="refl-share-note">
                    Sharing posts your <strong>Summary</strong> to Community, anonymously with your
                    child's age. Your recording and exact words ("What you said") stay private.
                  </div>
                </>
              )}
              {shareState === 'shared' && (
                <button className="refl-btn-primary" onClick={() => { logCompleted(); showScreen('community'); }}>
                  Shared 💛 · See it in Community →
                </button>
              )}
              <button
                className="refl-btn-secondary"
                onClick={() => { logCompleted(); showScreen('results'); }}
              >
                Complete
              </button>
              <button className="refl-link-btn" onClick={resetRecorder}>Record again</button>
            </div>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="refl-state-box">
            <div className="refl-error-msg">{error}</div>
            <button className="refl-reset-btn" onClick={resetRecorder}>Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
