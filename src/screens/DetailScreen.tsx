import { useState, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import { EXPLORE_ACTS, ACT_CONFIGS } from '../data/activities';
import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
  selectedActivityId: string | null;
  onStartActivity: (id: string) => void;
}

const PLAY_ICON = (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
    <path d="M1 1.5L17 10L1 18.5V1.5Z" fill="#3d3935" stroke="#3d3935" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const EXTERNAL_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 5, marginBottom: 1 }}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

export default function DetailScreen({ showScreen, selectedActivityId, onStartActivity }: Props) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current) videoRef.current.pause();
    };
  }, []);

  const actMaybe = EXPLORE_ACTS.find((a) => a.id === selectedActivityId);
  if (!actMaybe) return null;
  // Re-assign to a const so TypeScript knows it's non-null inside closures
  const act = actMaybe;

  const isLocalVideo = act.videoUrl && !act.videoUrl.startsWith('http');
  const isYouTube = act.videoUrl && act.videoUrl.startsWith('http');
  // Any activity with a step config gets the in-app player; others open their source link.
  const hasPlayerScreen = act.id in ACT_CONFIGS;

  function handleStartActivity() {
    if (hasPlayerScreen) {
      onStartActivity(act.id);
      showScreen('activity');
    } else {
      window.open(act.url, '_blank');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="detail-v2-wrap">
        <div className="detail-v2-topbar">
          <BackButton onClick={() => showScreen('results')} />
        </div>
        <div className="detail-v2-scroll">
          <div>
            <div className="detail-v2-heading">Let's get started!</div>
            <div className="detail-v2-subtext">Watch the quick intro, then open the activity.</div>
          </div>

          {/* Before You Begin card */}
          <div className="bub-card">
            <div className="bub-card-label">Before You Begin</div>
            {isLocalVideo ? (
              videoPlaying ? (
                <div className="bub-video-player">
                  <video ref={videoRef} src={act.videoUrl!} controls autoPlay playsInline style={{ width: '100%', display: 'block' }} />
                </div>
              ) : (
                <>
                  <div
                    className="bub-cream-area"
                    style={act.videoThumb ? { background: `url('${act.videoThumb}') center center / cover no-repeat` } : undefined}
                  >
                    <button className="bub-play-ring" onClick={() => setVideoPlaying(true)}>{PLAY_ICON}</button>
                  </div>
                  <div className="bub-desc-section">{act.videoDesc}</div>
                </>
              )
            ) : isYouTube ? (
              <>
                <div className="bub-iframe-wrap">
                  <iframe src={act.videoUrl!} allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
                </div>
                <div className="bub-desc-section">{act.videoDesc}</div>
              </>
            ) : (
              <>
                <div className="bub-coming-soon">
                  <div className="bub-coming-soon-label">Coming Soon</div>
                </div>
                <div className="bub-desc-section">{act.videoDesc}</div>
              </>
            )}
          </div>

          {/* Activity info card */}
          <div className="act-info-card">
            <div className="act-info-title">{act.title}</div>
            <div className="act-info-tags">
              <span className="act-info-tag" style={{ background: '#d6e475' }}>{act.time}</span>
              <span className="act-info-tag" style={{ background: '#9CD3F8' }}>{act.ages}</span>
              {act.skills.map((tag) => (
                <span key={tag} className="act-info-tag" style={{ background: '#ffa9bc' }}>{tag}</span>
              ))}
              <span className="act-info-tag" style={{ background: '#fdd15e' }}>{act.refs}</span>
            </div>
            <div className="act-info-desc">{act.detailDesc || act.desc}</div>
            {act.materials.length > 0 && (
              <div>
                <div className="act-materials-label">What You'll Need</div>
                <ul className="act-materials-list">
                  {act.materials.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            )}
            {act.tip && (
              <div className="act-tip-box">
                <div className="act-tip-label">Tips for Parents</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 500, fontSize: 13, color: '#6b6761', lineHeight: 1.7 }}>{act.tip}</div>
              </div>
            )}
            {act.whenHelps && (
              <div className="act-tip-box">
                <div className="act-tip-label">When This Helps</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 500, fontSize: 13, color: '#6b6761', lineHeight: 1.7 }}>{act.whenHelps}</div>
              </div>
            )}
            {act.olderKids && (
              <div className="act-tip-box">
                <div className="act-tip-label">For Older Kids</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 500, fontSize: 13, color: '#6b6761', lineHeight: 1.7 }}>{act.olderKids}</div>
              </div>
            )}
            <button className="act-start-btn" onClick={handleStartActivity}>
              Start Activity
            </button>
            <button className="act-open-btn" onClick={() => window.open(act.url, '_blank')}>
              See original source {EXTERNAL_ICON}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
