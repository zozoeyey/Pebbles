import { useState, useRef } from 'react';
import BackButton from '../components/BackButton';
import { EXPLORE_ACTS, COMMUNITY_REFLECTIONS, ACTIVITIES } from '../data/activities';
import type { Screen } from '../types';

const PEBBLE_PATH =
  'M101.2 0C121.524 0 138 16.4759 138 36.7998C138 50.657 130.339 62.7231 119.023 69C130.339 75.2769 138 87.3429 138 101.2C138 121.524 121.524 138 101.2 138H36.7998C16.4759 138 0 121.524 0 101.2C4.49801e-05 87.3433 7.66 75.277 18.9756 69C7.66 62.723 4.77943e-05 50.6567 0 36.7998C0 16.4759 16.4759 0 36.7998 0H101.2Z';

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

interface ReplyState {
  open: boolean;
  inputText: string;
  isRecording: boolean;
  timerDisplay: string;
  voiceLabel: string;
  confirmed: boolean;
}

function makeDefaultReply(): ReplyState {
  return {
    open: false,
    inputText: '',
    isRecording: false,
    timerDisplay: '',
    voiceLabel: 'Or record a voice note',
    confirmed: false,
  };
}

interface Props {
  showScreen: (s: Screen) => void;
  expandActivityId: string | null;
}

export default function CommunityExpandScreen({ showScreen, expandActivityId }: Props) {
  const actId = expandActivityId || 'freeze-feelings';
  const act = EXPLORE_ACTS.find((a) => a.id === actId) || ACTIVITIES.find((a) => a.id === actId);
  const reflections = COMMUNITY_REFLECTIONS[actId] || [];
  const shortTitle = act ? act.title.split(':')[0] : actId;

  const [replies, setReplies] = useState<ReplyState[]>(reflections.map(() => makeDefaultReply()));
  const [confirmed, setConfirmed] = useState<boolean[]>(reflections.map(() => false));

  // Reply recording refs (one per card)
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);
  const activeIdxRef = useRef<number | null>(null);

  function updateReply(idx: number, patch: Partial<ReplyState>) {
    setReplies((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function toggleReply(idx: number) {
    const isOpen = replies[idx].open;
    // Close all others first
    setReplies((prev) =>
      prev.map((r, i) => {
        if (i !== idx && r.open) {
          if (activeIdxRef.current === i) stopRecordingFor(i);
          return makeDefaultReply();
        }
        return r;
      }),
    );
    if (!isOpen) {
      updateReply(idx, { open: true });
    }
  }

  function stopRecordingFor(idx: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mrRef.current && mrRef.current.state !== 'inactive') {
      mrRef.current.stop();
      mrRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    activeIdxRef.current = null;
    updateReply(idx, { isRecording: false });
  }

  async function toggleReplyRecording(idx: number) {
    if (activeIdxRef.current === idx && mrRef.current && mrRef.current.state !== 'inactive') {
      stopRecordingFor(idx);
      return;
    }
    // Stop any other active recording
    if (activeIdxRef.current !== null && mrRef.current && mrRef.current.state !== 'inactive') {
      stopRecordingFor(activeIdxRef.current);
    }
    // Start new
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType });
      mrRef.current = mr;
      chunksRef.current = [];
      activeIdxRef.current = idx;

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        updateReply(idx, { isRecording: false, voiceLabel: 'Voice note recorded ✓', timerDisplay: '' });
      };
      mr.start(250);

      updateReply(idx, { isRecording: true, voiceLabel: 'Recording… tap to stop', timerDisplay: '0:00' });
      secondsRef.current = 0;
      timerRef.current = setInterval(() => {
        secondsRef.current++;
        const m = String(Math.floor(secondsRef.current / 60)).padStart(2, '0');
        const s = String(secondsRef.current % 60).padStart(2, '0');
        updateReply(idx, { timerDisplay: `${m}:${s}` });
      }, 1000);
    } catch {
      alert('Microphone access is required to record a voice note.');
    }
  }

  function cancelReply(idx: number) {
    if (activeIdxRef.current === idx) stopRecordingFor(idx);
    setReplies((prev) => prev.map((r, i) => (i === idx ? makeDefaultReply() : r)));
    chunksRef.current = [];
  }

  function sendReply(idx: number) {
    const r = replies[idx];
    const hasText = r.inputText.trim().length > 0;
    const hasAudio = chunksRef.current.length > 0 && !r.isRecording;
    if (!hasText && !hasAudio) {
      alert('Please type a reply or record a voice note first.');
      return;
    }
    cancelReply(idx);
    setConfirmed((prev) => prev.map((v, i) => (i === idx ? true : v)));
    setTimeout(() => setConfirmed((prev) => prev.map((v, i) => (i === idx ? false : v))), 2500);
  }

  return (
    <div style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="community-expand-wrap">
        {/* Back */}
        <BackButton onClick={() => showScreen('community')} />

        {/* Activity info card */}
        {act && (
          <div className="ce-activity-card">
            <div className="ce-activity-label">ACTIVITY</div>
            <div className="ce-activity-title">{act.title}</div>
            <div className="ce-tags">
              <span className="ce-tag" style={{ background: '#d6e475' }}>
                {'time' in act ? act.time : ''}
              </span>
              <span className="ce-tag" style={{ background: '#ffa9bc' }}>
                {'skill' in act ? act.skill : ('skills' in act ? (act as typeof ACTIVITIES[0]).skills[0] : '')}
              </span>
              <span className="ce-tag" style={{ background: '#fdd15e' }}>
                {'refs' in act ? act.refs : `${reflections.length} reflections`}
              </span>
            </div>
          </div>
        )}

        <div className="ce-section-label">ALL REFLECTIONS</div>

        <div className="ce-refl-list">
          {reflections.map((r, idx) => (
            <div className="community-card" key={idx}>
              <div className="community-card-head">
                <div className="community-avatar-bub" style={{ background: r.bg }}>
                  <svg width="30" height="30" viewBox="0 0 138 138" fill="none">
                    <path d={PEBBLE_PATH} fill={r.charFill}/>
                    <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
                    <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
                  </svg>
                </div>
                <div>
                  <div className="community-card-name">Parent (child age {r.age})</div>
                  <div className="community-card-time">{r.time}</div>
                </div>
              </div>
              <div className="community-activity-tag">Activity: {shortTitle}</div>
              <p className="community-card-text">{r.text}</p>
              <div className="community-card-footer">
                <div className="community-card-likes">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={HEART_PATH}/>
                  </svg>
                  {r.likes} likes
                </div>
                <span className="community-card-see" style={{ color: '#6b6761', cursor: 'pointer' }} onClick={() => toggleReply(idx)}>
                  Reply
                </span>
              </div>

              {/* Reply area */}
              {replies[idx]?.open && (
                <div className="reply-area open">
                  <textarea
                    className="reply-input"
                    rows={2}
                    placeholder="Share what resonates with you..."
                    value={replies[idx].inputText}
                    onChange={(e) => updateReply(idx, { inputText: e.target.value })}
                  />
                  <div
                    className={`reply-voice-bar${replies[idx].isRecording ? ' recording' : ''}`}
                    onClick={() => toggleReplyRecording(idx)}
                  >
                    <svg width="24" height="24" viewBox="0 0 138 138" fill="none">
                      <path d={PEBBLE_PATH} fill="#F9A3C4"/>
                      <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
                      <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
                    </svg>
                    <span className="reply-voice-label">{replies[idx].voiceLabel}</span>
                    {replies[idx].timerDisplay && (
                      <span className="reply-timer">{replies[idx].timerDisplay}</span>
                    )}
                  </div>
                  <div className="reply-btn-row">
                    <button className="reply-send-btn" onClick={() => sendReply(idx)}>Send</button>
                    <button className="reply-cancel-btn" onClick={() => cancelReply(idx)}>Cancel</button>
                  </div>
                </div>
              )}
              {confirmed[idx] && (
                <div style={{ fontFamily: 'Montserrat,sans-serif', fontSize: 12, color: '#6b6761', padding: '6px 0' }}>
                  Reply sent!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
