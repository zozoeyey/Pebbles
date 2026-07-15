import { useState } from 'react';
import { PEER_REFLECTIONS } from '../data/activities';
import BackButton from '../components/BackButton';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { shareReflection } from '../lib/communityApi';
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
    reflectionId,
    error,
    timerDisplay,
    startRecording,
    stopRecording,
    resetRecorder,
  } = useAudioRecorder(actId, actId, selectedAge);

  const [shareState, setShareState] = useState<'idle' | 'sharing' | 'shared' | 'error'>('idle');

  async function handleShare() {
    if (!reflectionId) return;
    setShareState('sharing');
    try {
      await shareReflection(reflectionId);
      setShareState('shared');
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
        {/* Back */}
        <BackButton onClick={() => showScreen('activity')} />

        <div className="refl-heading">How did it go?</div>
        <div className="refl-subtext">Read another parent's reflection, then record your own.</div>

        {/* Peer card — collapsible */}
        <div className="refl-peer-card">
          <button className="refl-peer-toggle" onClick={() => setPeerOpen(o => !o)}>
            <div className="refl-peer-toggle-left">
              <div className="refl-peer-avatar">
                <svg viewBox="0 0 138 138" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d={PEBBLE_PATH} fill="#FDD15E"/>
                  <ellipse cx="52" cy="66" rx="7" ry="9" fill="#555"/>
                  <ellipse cx="86" cy="66" rx="7" ry="9" fill="#555"/>
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
              <svg width="160" height="156" viewBox="0 0 138 134" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Blob */}
                <path
                  d="M41.9096 18.2441C51.676 -6.08137 86.0271 -6.08137 95.7934 18.2441C98.2588 24.3846 104.024 28.5731 110.609 29.0197C136.655 30.7861 147.33 63.5177 127.274 80.2775C122.198 84.5195 119.998 91.3067 121.614 97.7321C127.999 123.12 100.149 143.291 78.0216 129.397C72.4244 125.882 65.2787 125.882 59.6814 129.397C37.554 143.291 9.70356 123.12 16.0891 97.7321C17.7052 91.3067 15.5047 84.5195 10.4286 80.2775C-9.62669 63.5177 1.04831 30.7861 27.0939 29.0197C33.6791 28.5731 39.4443 24.3846 41.9096 18.2441Z"
                  fill={isRecording ? '#F9A3C4' : '#FDD15E'}
                />
                {/* Eyes */}
                <ellipse cx="62" cy="46" rx="5" ry="6.5" fill="#555"/>
                <ellipse cx="76" cy="46" rx="5" ry="6.5" fill="#555"/>
                {/* Mic or Stop icon, centered around (69, 90) */}
                {isRecording ? (
                  <rect x="55" y="76" width="28" height="28" rx="5" fill="#3d3935"/>
                ) : (
                  <g>
                    <rect x="61" y="62" width="16" height="26" rx="8" fill="#3d3935"/>
                    <path d="M52 88C52 97 60 104 69 104C78 104 86 97 86 88" stroke="#3d3935" strokeWidth="3" strokeLinecap="round" fill="none"/>
                    <line x1="69" y1="104" x2="69" y2="110" stroke="#3d3935" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="62" y1="110" x2="76" y2="110" stroke="#3d3935" strokeWidth="3" strokeLinecap="round"/>
                  </g>
                )}
              </svg>
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
            <div className="refl-summary-box">
              {summaryParagraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: 6 }}>{p}</p>
              ))}
            </div>

            {/* Share to community — opt-in, only once the summary is visible */}
            {reflectionId && shareState !== 'shared' && (
              <div className="refl-share-box">
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, color: '#3d3935' }}>
                  Share this with other parents?
                </div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 11.5, color: '#6b6761', margin: '4px 0 10px', lineHeight: 1.6 }}>
                  Only this summary is shared — anonymously, with your child's age. Never your recording.
                </div>
                <button
                  className="refl-complete-btn"
                  style={{ marginTop: 0 }}
                  disabled={shareState === 'sharing'}
                  onClick={handleShare}
                >
                  {shareState === 'sharing' ? 'Sharing…' : shareState === 'error' ? 'Try sharing again' : 'Share to Community'}
                </button>
              </div>
            )}
            {shareState === 'shared' && (
              <div className="refl-share-box" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, color: '#3d3935' }}>
                  Shared — thank you! 💛
                </div>
                <button
                  className="refl-complete-btn"
                  style={{ marginTop: 10 }}
                  onClick={() => showScreen('community')}
                >
                  See it in Community →
                </button>
              </div>
            )}

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
