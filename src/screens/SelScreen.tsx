import { useState, useEffect, useRef } from 'react';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import { getSessionId } from '../lib/session';

interface Props {
  showResults: () => void;
  /** Returns false when skipping is blocked (first visit) — show a message instead. */
  onSkip: () => boolean;
  selectedAge: number | null;
  selectedChallenges: Set<string>;
  customChallengeText: string;
  onSelAnswers: (selDefinition: string, emotionHandling: string) => void;
}

export default function SelScreen({ showResults, onSkip, selectedAge, selectedChallenges, customChallengeText, onSelAnswers }: Props) {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [saving, setSaving] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [skipMsg, setSkipMsg] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleSkip() {
    if (!onSkip()) {
      setSkipMsg(true);
      setTimeout(() => setSkipMsg(false), 4000);
    }
  }

  useEffect(() => {
    return () => {
      if (iframeRef.current) iframeRef.current.src = '';
    };
  }, []);

  const canSubmit = q1.trim().length > 0 && q2.trim().length > 0;

  function playSelVideo() {
    setShowVideo(true);
  }

  async function submitSelOnboarding() {
    if (!canSubmit) return;
    setSaving(true);
    onSelAnswers(q1.trim(), q2.trim());
    // Persistent per-device id, so this parent's rows can be connected later.
    const sessionId = getSessionId();

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/onboarding_responses`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          session_id: sessionId,
          selected_age: selectedAge,
          selected_challenge: [...selectedChallenges].join(', ') || customChallengeText,
          sel_definition: q1.trim(),
          emotion_handling: q2.trim(),
        }),
      });
    } catch (e) {
      console.error('Supabase insert failed:', e);
    }

    setSaving(false);
    showResults();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="sel-wrap">
        <div className="sel-progress">
          <div className="progress-segs">
            <div className="progress-seg"><div className="progress-seg-fill" style={{ width: '100%' }} /></div>
            <div className="progress-seg"><div className="progress-seg-fill" style={{ width: '100%' }} /></div>
            <div className="progress-seg"><div className="progress-seg-fill" style={{ width: '50%' }} /></div>
          </div>
          <button className="progress-skip" onClick={handleSkip}>Skip</button>
        </div>
        {skipMsg && (
          <div className="onboard-skip-msg">
            Almost there! Your answers here help us tailor everything for your child. 💛
          </div>
        )}

        <div className="sel-prelabel">Before we start, watch this video</div>
        <div className="sel-heading">What is Social-Emotional Learning (SEL)?</div>

        <div className="sel-video-box">
          {!showVideo ? (
            <div id="selVideoPlaceholder" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="assets/char-yellow.svg" className="sel-char sel-char-1" alt="" />
              <svg className="sel-char sel-char-2" viewBox="0 0 105 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M77 0C92.4638 0 105 12.5362 105 28C105 38.5434 99.1714 47.7241 90.5615 52.5C99.1714 57.2759 105 66.4566 105 77C105 92.4638 92.4638 105 77 105H28C12.5362 105 0 92.4638 0 77C8.22277e-05 66.4569 5.82805 57.276 14.4375 52.5C5.82805 47.724 9.06667e-05 38.5431 0 28C0 12.5362 12.5362 0 28 0H77Z" fill="#9CD3F8"/>
                <path d="M27.5145 25.8692C27.5145 29.2182 26.0562 30.3345 24.2573 30.3345C22.4583 30.3345 21 29.2182 21 25.8692C21 22.5202 22.4583 21.4038 24.2573 21.4038C26.0562 21.4038 27.5145 22.1601 27.5145 25.8692Z" fill="#666"/>
                <path d="M41.8936 25.8692C41.8936 29.2182 40.4353 30.3345 38.6364 30.3345C36.8375 30.3345 35.3791 29.2182 35.3791 25.8692C35.3791 22.5202 36.8375 21.4038 38.6364 21.4038C40.4353 21.4038 41.8936 22.1601 41.8936 25.8692Z" fill="#666"/>
              </svg>
              <img src="assets/char-pink.svg" className="sel-char sel-char-3" alt="" />
              <button className="sel-play-ring" onClick={playSelVideo}>
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                  <path d="M1 1.5L17 10L1 18.5V1.5Z" fill="#3d3935" stroke="#3d3935" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="sel-iframe-wrap">
              <iframe
                ref={iframeRef}
                src="https://www.youtube.com/embed/Y-XNp3h3h4A?autoplay=1"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          )}
        </div>

        <div className="sel-question">
          <label className="sel-q-label" htmlFor="selQ1">
            In your own words, what is SEL and why does it matter for your child?
          </label>
          <input
            type="text"
            className="sel-input"
            id="selQ1"
            placeholder="Type your answer…"
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
          />
        </div>

        <div className="sel-question">
          <label className="sel-q-label" htmlFor="selQ2">
            How do you usually handle big emotions with your child?
          </label>
          <input
            type="text"
            className="sel-input"
            id="selQ2"
            placeholder="Type your answer…"
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
          />
        </div>

        <button
          className="onboard-cta"
          disabled={!canSubmit || saving}
          onClick={submitSelOnboarding}
        >
          {saving ? 'Saving…' : 'Next'}
        </button>
      </div>
    </div>
  );
}
