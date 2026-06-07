import { PEER_REFLECTIONS } from '../data/activities';
import BackButton from '../components/BackButton';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
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

  const {
    state,
    isRecording,
    summary,
    error,
    timerDisplay,
    startRecording,
    stopRecording,
    resetRecorder,
  } = useAudioRecorder(actId, actId, selectedAge);

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
    <div style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="refl-screen-wrap">
        {/* Back */}
        <BackButton onClick={() => showScreen('activity')} />

        <div className="refl-heading">How did it go?</div>
        <div className="refl-subtext">Read another parent's reflection, then record your own.</div>

        {/* Peer card */}
        <div className="refl-peer-card">
          <div className="refl-peer-header">
            <div className="refl-peer-avatar">
              <svg viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <path d={PEBBLE_PATH} fill="#FDD15E"/>
                <ellipse cx="52" cy="66" rx="7" ry="9" fill="#555"/>
                <ellipse cx="86" cy="66" rx="7" ry="9" fill="#555"/>
              </svg>
            </div>
            <div>
              <div className="refl-peer-name">Parent (child age 5)</div>
              <div className="refl-peer-meta">2h ago</div>
            </div>
          </div>
          <div className="refl-peer-text">
            {peer.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: boldLeadingLabel(p) }} />
            ))}
          </div>
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
            <button
              className={`refl-record-btn${isRecording ? ' recording' : ''}`}
              onClick={handleRecordClick}
            >
              <div className="refl-btn-icon">
                {isRecording ? (
                  /* Stop icon */
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="6" width="20" height="20" rx="4" fill="#3d3935"/>
                  </svg>
                ) : (
                  /* Mic icon */
                  <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
                    <rect x="10" y="1" width="12" height="20" rx="6" fill="#3d3935"/>
                    <path d="M4 18C4 25.18 9.37 31 16 31C22.63 31 28 25.18 28 18" stroke="#3d3935" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="16" y1="31" x2="16" y2="35" stroke="#3d3935" strokeWidth="2.5" strokeLinecap="round"/>
                    <line x1="10" y1="35" x2="22" y2="35" stroke="#3d3935" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
                {timerDisplay && <span className="refl-timer">{timerDisplay}</span>}
              </div>
            </button>
            <div className="refl-tap-label">{isRecording ? 'Tap to stop' : 'Tap to record'}</div>
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
            <div className="refl-summary-box">
              {summaryParagraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: 6 }}>{p}</p>
              ))}
            </div>
            <button className="refl-reset-btn" onClick={resetRecorder}>Record again</button>
            <button className="refl-complete-btn" onClick={() => showScreen('results')}>Complete</button>
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
