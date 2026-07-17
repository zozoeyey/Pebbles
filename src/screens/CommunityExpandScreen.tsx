import { useState, useRef, useEffect } from 'react';
import BackButton from '../components/BackButton';
import { EXPLORE_ACTS, ACTIVITIES } from '../data/activities';
import { fetchSharedReflections, fetchReplies, getLikedIds, postReply, postVoiceReply, likeReflection, unlikeReflection, timeAgo } from '../lib/communityApi';
import type { ReflectionReply } from '../lib/communityApi';
import { logEvent } from '../lib/analytics';
import ReflectionText from '../components/ReflectionText';
import type { CommunityReflection, Screen } from '../types';

const LIVE_COLORS: [string, string][] = [
  ['#fdd15e', '#9CD3F8'],
  ['#d6e475', '#F9A3C4'],
  ['#F9A3C4', '#FDD15E'],
  ['#9CD3F8', '#d6e475'],
];

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
  const shortTitle = act ? act.title.split(':')[0] : actId;

  // Live shared reflections for this activity, mapped into the card shape.
  // `liveId` marks them likeable; the seeded examples below have none.
  const [liveRefl, setLiveRefl] = useState<(CommunityReflection & { liveId: string })[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(getLikedIds);

  // Public replies for this activity, grouped under each reflection.
  const [replyList, setReplyList] = useState<ReflectionReply[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchReplies(actId)
      .then((rows) => { if (!cancelled) setReplyList(rows); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [actId]);

  useEffect(() => {
    logEvent('community_activity_opened', { activityId: actId });
    let cancelled = false;
    fetchSharedReflections(50, actId)
      .then((rows) => {
        if (cancelled) return;
        setLiveRefl(rows.map((r, i) => ({
          liveId: r.id,
          age: r.child_age ?? 0,
          time: timeAgo(r.created_at),
          bg: LIVE_COLORS[i % LIVE_COLORS.length][0],
          charFill: LIVE_COLORS[i % LIVE_COLORS.length][1],
          text: r.summary.replace(/\*/g, '').replace(/^[-•]\s*/gm, ''),
          likes: r.likes,
        })));
      })
      .catch(() => {}); // seeded examples still render
    return () => { cancelled = true; };
  }, [actId]);

  const reflections: (CommunityReflection & { liveId?: string })[] = liveRefl;

  function handleLike(liveId: string) {
    const unliking = likedIds.has(liveId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      unliking ? next.delete(liveId) : next.add(liveId);
      return next;
    });
    setLiveRefl((prev) => prev.map((r) =>
      r.liveId === liveId ? { ...r, likes: Math.max(0, r.likes + (unliking ? -1 : 1)) } : r,
    ));
    (unliking ? unlikeReflection(liveId) : likeReflection(liveId)).catch(() => {});
    logEvent(unliking ? 'reflection_unliked' : 'reflection_liked', { activityId: actId, payload: { reflection: liveId } });
  }

  // Keyed by card index (the list grows when live reflections arrive).
  const [replies, setReplies] = useState<Record<number, ReplyState>>({});
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});
  const getReply = (idx: number) => replies[idx] ?? makeDefaultReply();

  // Reply recording refs (one per card)
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const replyMimeRef = useRef('audio/webm');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);
  const activeIdxRef = useRef<number | null>(null);

  function updateReply(idx: number, patch: Partial<ReplyState>) {
    setReplies((prev) => ({ ...prev, [idx]: { ...(prev[idx] ?? makeDefaultReply()), ...patch } }));
  }

  function toggleReply(idx: number) {
    const isOpen = getReply(idx).open;
    // Close all others first
    setReplies((prev) => {
      const next: Record<number, ReplyState> = {};
      for (const [k, r] of Object.entries(prev)) {
        const i = Number(k);
        if (i !== idx && r.open) {
          if (activeIdxRef.current === i) stopRecordingFor(i);
          next[i] = makeDefaultReply();
        } else {
          next[i] = r;
        }
      }
      return next;
    });
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
      replyMimeRef.current = mimeType;
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
    setReplies((prev) => ({ ...prev, [idx]: makeDefaultReply() }));
    chunksRef.current = [];
  }

  function replyRef(idx: number): string {
    return reflections[idx]?.liveId ?? `unknown-${actId}-${idx}`;
  }

  function sendReply(idx: number) {
    const r = getReply(idx);
    const text = r.inputText.trim();
    const hasAudio = chunksRef.current.length > 0 && !r.isRecording;
    if (!text && !hasAudio) {
      alert('Please type a reply or record a voice note first.');
      return;
    }
    const ref = replyRef(idx);
    logEvent('reflection_replied', {
      activityId: actId,
      payload: { reflection: ref, text: text || null, voice: hasAudio },
    });
    if (text) {
      // Optimistic append; the row persists for every visitor.
      setReplyList((prev) => [...prev, {
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        reflection_ref: ref,
        activity_id: actId,
        reply_text: text,
        kind: 'text',
      }]);
      postReply(ref, actId, text).catch(() => {});
    } else if (hasAudio) {
      // Voice note: audio is stored and transcribed server-side; the
      // transcript appears in the thread once it comes back.
      const audio = new Blob(chunksRef.current, { type: replyMimeRef.current });
      postVoiceReply(ref, actId, audio)
        .then((transcript) => {
          setReplyList((prev) => [...prev, {
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString(),
            reflection_ref: ref,
            activity_id: actId,
            reply_text: transcript,
            kind: 'voice',
          }]);
        })
        .catch(() => {});
    }
    cancelReply(idx);
    setConfirmed((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => setConfirmed((prev) => ({ ...prev, [idx]: false })), 2500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                {act.skills[0] ?? ''}
              </span>
              <span className="ce-tag" style={{ background: '#fdd15e' }}>
                {`${reflections.length} reflection${reflections.length === 1 ? '' : 's'}`}
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
              <ReflectionText text={r.text} className="community-card-text" />
              <div className="community-card-footer">
                <div
                  className="community-card-likes"
                  onClick={r.liveId ? () => handleLike(r.liveId!) : undefined}
                  style={r.liveId ? { cursor: 'pointer' } : undefined}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={r.liveId && likedIds.has(r.liveId) ? '#F9A3C4' : 'none'} stroke="#6b6761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={HEART_PATH}/>
                  </svg>
                  {r.likes} likes
                </div>
                <span className="community-card-see" style={{ color: '#6b6761', cursor: 'pointer' }} onClick={() => toggleReply(idx)}>
                  Reply
                </span>
              </div>

              {/* Reply area */}
              {getReply(idx).open && (
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

              {/* Replies from other parents */}
              {replyList.filter((rp) => rp.reflection_ref === replyRef(idx)).map((rp) => (
                <div className="ce-reply" key={rp.id}>
                  <div className="ce-reply-meta">
                    A parent{rp.kind === 'voice' ? ' · 🎙 voice note' : ''} · {timeAgo(rp.created_at)}
                  </div>
                  <div className="ce-reply-text">{rp.reply_text}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
