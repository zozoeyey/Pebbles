import { useState, useRef, useEffect } from 'react';
import { EXPLORE_ACTS, ACT_CONFIGS } from '../data/activities';
import { fetchMyReflections } from '../lib/communityApi';
import { getTimeSpentMinutes } from '../lib/timeSpent';
import type { MyReflection } from '../lib/communityApi';
import type { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import AvatarBubble from '../components/AvatarBubble';

const PEBBLE_PATH =
  'M101.2 0C121.524 0 138 16.4759 138 36.7998C138 50.657 130.339 62.7231 119.023 69C130.339 75.2769 138 87.3429 138 101.2C138 121.524 121.524 138 101.2 138H36.7998C16.4759 138 0 121.524 0 101.2C4.49801e-05 87.3433 7.66 75.277 18.9756 69C7.66 62.723 4.77943e-05 50.6567 0 36.7998C0 16.4759 16.4759 0 36.7998 0H101.2Z';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TAG_COLORS = ['#9CD3F8', '#d6e475', '#F9A3C4', '#FDD15E'];

/** Claude summaries sometimes contain markdown bullets/bold — show plain text. */
function plainSummary(s: string): string {
  return s.replace(/\*/g, '').replace(/^[-•]\s*/gm, '');
}

function SectionHeader({ label, count, expanded, onToggle }: {
  label: string; count: number; expanded: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
      <div className="toolkit-section-label" style={{ marginTop: 0 }}>{label}</div>
      {count > 3 && (
        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 12, color: '#6b6761', padding: 0 }}
        >
          {expanded ? 'View less' : `View more (${count - 3}) →`}
        </button>
      )}
    </div>
  );
}

/** 'May 17' from an ISO timestamp. */
function monthDay(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}

/** Local YYYY-MM-DD, so calendar days match the parent's timezone. */
function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Consecutive days with ≥1 reflection, counting back from today (or yesterday). */
function calcStreak(dates: Set<string>): number {
  const day = new Date();
  if (!dates.has(localDateKey(day))) day.setDate(day.getDate() - 1); // today not over yet
  let streak = 0;
  while (dates.has(localDateKey(day))) {
    streak++;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

/** Simple, honest insights computed from the parent's own reflections. */
function buildInsights(refl: MyReflection[]): string[] {
  if (refl.length < 2) return [];
  const out: string[] = [];

  const byActivity = new Map<string, number>();
  refl.forEach((r) => byActivity.set(r.activity_id, (byActivity.get(r.activity_id) ?? 0) + 1));
  const [topId, topCount] = [...byActivity.entries()].sort((a, b) => b[1] - a[1])[0];
  const topAct = EXPLORE_ACTS.find((a) => a.id === topId);
  if (topAct && topCount > 1) {
    out.push(`${topAct.title.split(':')[0]} is your go-to — you've reflected on it ${topCount} times.`);
  }

  const bySkill = new Map<string, number>();
  refl.forEach((r) => {
    const act = EXPLORE_ACTS.find((a) => a.id === r.activity_id);
    act?.skills.forEach((s) => bySkill.set(s, (bySkill.get(s) ?? 0) + 1));
  });
  if (bySkill.size > 0) {
    const sorted = [...bySkill.entries()].sort((a, b) => b[1] - a[1]);
    const untouched = ['Identifying emotions', 'Interoception', 'Impulse control'].filter((s) => !bySkill.has(s));
    if (untouched.length > 0) {
      out.push(`You've practiced ${sorted[0][0].toLowerCase()} most — an activity on ${untouched[0].toLowerCase()} could round things out.`);
    }
  }

  const shared = refl.filter((r) => r.shared).length;
  if (shared > 0) {
    out.push(`You've shared ${shared} reflection${shared === 1 ? '' : 's'} with the community — other parents are learning from you.`);
  }
  return out;
}

interface Props {
  showScreen: (s: Screen) => void;
  savedIds: Set<string>;
  onSelectActivity: (id: string) => void;
}

export default function ToolkitScreen({ showScreen, savedIds, onSelectActivity }: Props) {
  const savedActivities = EXPLORE_ACTS.filter(a => savedIds.has(a.id));
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showAllSaved, setShowAllSaved] = useState(false);
  const [showAllRefl, setShowAllRefl] = useState(false);

  // This parent's own reflections drive every number on this screen.
  const [myRefl, setMyRefl] = useState<MyReflection[]>([]);
  useEffect(() => {
    let cancelled = false;
    fetchMyReflections()
      .then((rows) => { if (!cancelled) setMyRefl(rows); })
      .catch(() => {}); // offline → zeros/empty states
    return () => { cancelled = true; };
  }, []);

  const reflDates = new Set(myRefl.map((r) => localDateKey(new Date(r.created_at))));
  const streak = calcStreak(reflDates);
  const activitiesDone = new Set(myRefl.map((r) => r.activity_id)).size;
  // Real time measured in the activity player on this device.
  const spentMinutes = getTimeSpentMinutes();
  const insights = buildInsights(myRefl);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  function toggleAudio(id: string) {
    const config = ACT_CONFIGS[id];
    if (!config?.audioSrc) return;

    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = config.audioSrc;
        audioRef.current.play();
      }
      setPlayingId(id);
    }
  }

  function handleAudioEnded() { setPlayingId(null); }

  // Days in the shown month with at least one reflection, plus today.
  const active = new Set<number>();
  myRefl.forEach((r) => {
    const d = new Date(r.created_at);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) active.add(d.getDate());
  });
  const today = new Date();
  if (today.getFullYear() === calYear && today.getMonth() === calMonth) active.add(today.getDate());

  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const startCol = (firstDow + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="toolkit-wrap">

        {/* Header */}
        <div className="toolkit-header-row">
          <div>
            <div className="toolkit-heading">Your Toolkit</div>
            <div className="toolkit-subheading">See your progress through time</div>
          </div>
          <AvatarBubble onClick={() => showScreen('profile')} />
        </div>

        {/* ── 1. USAGE OVERVIEW ─────────────────────── */}
        <div className="toolkit-section-label">USAGE OVERVIEW</div>
        <div className="toolkit-stat-row">
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num-row">
              <span className="toolkit-stat-num">{streak}</span>
              <span className="toolkit-stat-unit">{streak === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="toolkit-stat-label">Streak</div>
            <svg className="toolkit-stat-deco" style={{ width: 72, height: 80, right: -6, bottom: -10, transform: 'rotate(-15deg)' }} viewBox="0 0 138 138" fill="none">
              <path d={PEBBLE_PATH} fill="#9CD3F8"/>
              <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
              <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num">{activitiesDone}</div>
            <div className="toolkit-stat-label">Activities Tried</div>
            <svg className="toolkit-stat-deco" style={{ width: 76, height: 76, right: -14, top: -10 }} viewBox="0 0 170 170" fill="none">
              <path d="M51.7391 23.1575C63.7961 -7.71918 106.204 -7.71918 118.261 23.1575C121.304 30.9517 128.422 36.2683 136.552 36.8352C168.706 39.0773 181.885 80.624 157.126 101.898C150.859 107.282 148.142 115.897 150.137 124.053C158.021 156.278 123.638 181.882 96.3208 164.245C89.4108 159.784 80.5892 159.784 73.6792 164.245C46.3619 181.882 11.9794 156.278 19.8626 124.053C21.8578 115.897 19.1412 107.282 12.8745 101.898C-11.8845 80.624 1.29418 39.0773 33.4485 36.8352C41.5782 36.2683 48.6956 30.9517 51.7391 23.1575Z" fill="#FDD15E"/>
              <ellipse cx="106" cy="64" rx="7" ry="9" fill="#666"/>
              <ellipse cx="130" cy="64" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
        </div>
        <div className="toolkit-stat-row">
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num">{myRefl.length}</div>
            <div className="toolkit-stat-label">Reflections</div>
            <svg className="toolkit-stat-deco" style={{ width: 80, height: 80, right: -14, bottom: -16, transform: 'rotate(-17deg)' }} viewBox="0 0 170 170" fill="none">
              <path d="M51.7391 23.1575C63.7961 -7.71918 106.204 -7.71918 118.261 23.1575C121.304 30.9517 128.422 36.2683 136.552 36.8352C168.706 39.0773 181.885 80.624 157.126 101.898C150.859 107.282 148.142 115.897 150.137 124.053C158.021 156.278 123.638 181.882 96.3208 164.245C89.4108 159.784 80.5892 159.784 73.6792 164.245C46.3619 181.882 11.9794 156.278 19.8626 124.053C21.8578 115.897 19.1412 107.282 12.8745 101.898C-11.8845 80.624 1.29418 39.0773 33.4485 36.8352C41.5782 36.2683 48.6956 30.9517 51.7391 23.1575Z" fill="#D6E475"/>
              <ellipse cx="70" cy="64" rx="7" ry="9" fill="#666"/>
              <ellipse cx="85" cy="64" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num-row">
              <span className="toolkit-stat-num">
                {spentMinutes < 60 ? spentMinutes : (spentMinutes / 60).toFixed(1)}
              </span>
              <span className="toolkit-stat-unit">{spentMinutes < 60 ? 'min' : 'hrs'}</span>
            </div>
            <div className="toolkit-stat-label">Time Together</div>
            <svg className="toolkit-stat-deco" style={{ width: 68, height: 68, right: -8, bottom: -14 }} viewBox="0 0 138 138" fill="none">
              <path d={PEBBLE_PATH} fill="#F9A3C4"/>
              <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
              <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
        </div>

        {/* ── 2. ACTIVITIES DONE ────────────────────── */}
        <div className="toolkit-section-label" style={{ marginTop: 8 }}>ACTIVITIES DONE</div>
        <div className="toolkit-calendar">
          <div className="cal-header">
            <button className="cal-nav-btn" onClick={prevMonth}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d3935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <span className="cal-month-label">{MONTHS[calMonth]}</span>
            <button className="cal-nav-btn" onClick={nextMonth}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d3935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          <div className="cal-weekdays">
            {['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'].map((d) => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>
          <div className="cal-grid">
            {rows.map((row, ri) => (
              <div key={ri} className="cal-row">
                {row.map((d, ci) => (
                  <div key={ci} className={`cal-cell${d !== null && active.has(d) ? ' cal-active' : ''}`}>
                    {d !== null && active.has(d) ? <span>{d}</span> : d ?? ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. SAVED ACTIVITIES ───────────────────── */}
        {savedActivities.length > 0 && (
          <>
            <SectionHeader
              label="SAVED ACTIVITIES"
              count={savedActivities.length}
              expanded={showAllSaved}
              onToggle={() => setShowAllSaved(v => !v)}
            />
            {(showAllSaved ? savedActivities : savedActivities.slice(0, 3)).map(a => (
              <div key={a.id} className="toolkit-saved-card">
                <div
                  className="toolkit-saved-info"
                  onClick={() => { onSelectActivity(a.id); showScreen('detail'); }}
                >
                  <div className="toolkit-saved-title">{a.title}</div>
                  <div className="toolkit-saved-meta">
                    <span className="toolkit-refl-tag" style={{ background: '#d6e475' }}>{a.skills[0]}</span>
                    <span className="toolkit-refl-date">{a.time}</span>
                  </div>
                </div>
                {ACT_CONFIGS[a.id] && (
                  <button
                    className={`toolkit-audio-btn${playingId === a.id ? ' playing' : ''}`}
                    onClick={() => toggleAudio(a.id)}
                    aria-label={playingId === a.id ? 'Pause audio' : 'Play audio'}
                  >
                    {playingId === a.id ? (
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <rect x="1" y="1" width="4" height="14" rx="1.5" fill="currentColor"/>
                        <rect x="9" y="1" width="4" height="14" rx="1.5" fill="currentColor"/>
                      </svg>
                    ) : (
                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M2 1L13 8L2 15V1Z" fill="currentColor"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── 4. MY REFLECTIONS ────────────────────── */}
        <SectionHeader
          label="MY REFLECTIONS"
          count={myRefl.length}
          expanded={showAllRefl}
          onToggle={() => setShowAllRefl(v => !v)}
        />
        {myRefl.length === 0 ? (
          <div className="toolkit-refl-entry">
            <div className="toolkit-refl-text">
              No reflections yet — try an activity and record how it went. Your notes will show up here.
            </div>
          </div>
        ) : (
          myRefl.slice(0, showAllRefl ? myRefl.length : 3).map((r, i) => (
            <div className="toolkit-refl-entry" key={r.id}>
              <div className="toolkit-refl-top">
                <span className="toolkit-refl-tag" style={{ background: TAG_COLORS[i % TAG_COLORS.length] }}>
                  {(EXPLORE_ACTS.find((a) => a.id === r.activity_id)?.title ?? r.activity_title).split(':')[0]}
                </span>
                <span className="toolkit-refl-date">{monthDay(r.created_at)}</span>
              </div>
              <div className="toolkit-refl-text">{plainSummary(r.summary).split('\n')[0]}</div>
            </div>
          ))
        )}

        {/* ── 5. INSIGHTS ──────────────────────────── */}
        {insights.length > 0 && (
          <>
            <div className="toolkit-section-label" style={{ marginTop: 8 }}>INSIGHTS</div>
            <div className="toolkit-ai-card">
              <div className="toolkit-ai-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d3935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
                <span className="toolkit-ai-updated">Based on your reflections</span>
              </div>
              <ul className="toolkit-ai-bullets">
                {insights.map((b, i) => (
                  <li key={i} className="toolkit-ai-bullet">{b}</li>
                ))}
              </ul>
            </div>
          </>
        )}

      </div>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="none"
      />

      <BottomNav activeTab="toolkit" showScreen={showScreen} />
    </div>
  );
}
