import { useState } from 'react';
import { TOOLKIT_ACTIVE_DATES, EXPLORE_ACTS } from '../data/activities';
import type { Screen } from '../types';
import BottomNav from '../components/BottomNav';

const PEBBLE_PATH =
  'M101.2 0C121.524 0 138 16.4759 138 36.7998C138 50.657 130.339 62.7231 119.023 69C130.339 75.2769 138 87.3429 138 101.2C138 121.524 121.524 138 101.2 138H36.7998C16.4759 138 0 121.524 0 101.2C4.49801e-05 87.3433 7.66 75.277 18.9756 69C7.66 62.723 4.77943e-05 50.6567 0 36.7998C0 16.4759 16.4759 0 36.7998 0H101.2Z';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }

  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
  const active = new Set(TOOLKIT_ACTIVE_DATES[key] || []);
  const today = new Date();
  if (today.getFullYear() === calYear && today.getMonth() === calMonth) {
    active.add(today.getDate());
  }

  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const startCol = (firstDow + 6) % 7; // Mon-first
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startCol; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <div style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="toolkit-wrap">
        {/* Header */}
        <div className="toolkit-header-row">
          <div>
            <div className="toolkit-heading">Your Toolkit</div>
            <div className="toolkit-subheading">See your progress through time</div>
          </div>
          <div className="community-avatar-bub" style={{ background: '#d6e475' }}>
            <svg width="30" height="30" viewBox="0 0 138 138" fill="none">
              <path d={PEBBLE_PATH} fill="#F9A3C4"/>
              <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
              <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
        </div>

        {/* Voice card */}
        <div className="toolkit-voice-card">
          <div className="toolkit-voice-title">What's on your mind?</div>
          <div className="toolkit-record-bar" style={{ cursor: 'pointer' }}>
            <svg width="42" height="42" viewBox="0 0 138 138" fill="none" style={{ flexShrink: 0 }}>
              <path d={PEBBLE_PATH} fill="#F9A3C4"/>
              <rect x="55" y="30" width="28" height="44" rx="14" fill="#3d3935"/>
              <path d="M42 74C42 93 56 105 69 105C82 105 96 93 96 74" stroke="#3d3935" strokeWidth="6" strokeLinecap="round"/>
              <line x1="69" y1="105" x2="69" y2="116" stroke="#3d3935" strokeWidth="6" strokeLinecap="round"/>
              <line x1="55" y1="116" x2="83" y2="116" stroke="#3d3935" strokeWidth="6" strokeLinecap="round"/>
            </svg>
            <span className="toolkit-record-bar-label">Record a voice note</span>
          </div>
        </div>

        {/* This month label */}
        <div className="toolkit-section-label">THIS MONTH</div>

        {/* Stat row 1 */}
        <div className="toolkit-stat-row">
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num-row">
              <span className="toolkit-stat-num">7</span>
              <span className="toolkit-stat-unit">days</span>
            </div>
            <div className="toolkit-stat-label">Streak</div>
            <svg className="toolkit-stat-deco" style={{ width: 72, height: 80, right: -6, bottom: -10, transform: 'rotate(-15deg)' }} viewBox="0 0 138 138" fill="none">
              <path d={PEBBLE_PATH} fill="#9CD3F8"/>
              <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
              <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num">12</div>
            <div className="toolkit-stat-label">Activities Done</div>
            <svg className="toolkit-stat-deco" style={{ width: 70, height: 70, right: -8, top: -14 }} viewBox="0 0 170 170" fill="none">
              <path d="M51.7391 23.1575C63.7961 -7.71918 106.204 -7.71918 118.261 23.1575C121.304 30.9517 128.422 36.2683 136.552 36.8352C168.706 39.0773 181.885 80.624 157.126 101.898C150.859 107.282 148.142 115.897 150.137 124.053C158.021 156.278 123.638 181.882 96.3208 164.245C89.4108 159.784 80.5892 159.784 73.6792 164.245C46.3619 181.882 11.9794 156.278 19.8626 124.053C21.8578 115.897 19.1412 107.282 12.8745 101.898C-11.8845 80.624 1.29418 39.0773 33.4485 36.8352C41.5782 36.2683 48.6956 30.9517 51.7391 23.1575Z" fill="#FDD15E"/>
              <ellipse cx="114" cy="64" rx="7" ry="9" fill="#666"/>
              <ellipse cx="129" cy="64" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
        </div>

        {/* Stat row 2 */}
        <div className="toolkit-stat-row">
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num">5</div>
            <div className="toolkit-stat-label">SEL Skills</div>
            <svg className="toolkit-stat-deco" style={{ width: 68, height: 68, right: -8, bottom: -14, transform: 'rotate(180deg)' }} viewBox="0 0 138 138" fill="none">
              <path d={PEBBLE_PATH} fill="#F9A3C4"/>
              <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
              <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
          <div className="toolkit-stat-card">
            <div className="toolkit-stat-num">15</div>
            <div className="toolkit-stat-label">Reflections</div>
            <svg className="toolkit-stat-deco" style={{ width: 80, height: 80, right: -14, bottom: -16, transform: 'rotate(-17deg)' }} viewBox="0 0 170 170" fill="none">
              <path d="M51.7391 23.1575C63.7961 -7.71918 106.204 -7.71918 118.261 23.1575C121.304 30.9517 128.422 36.2683 136.552 36.8352C168.706 39.0773 181.885 80.624 157.126 101.898C150.859 107.282 148.142 115.897 150.137 124.053C158.021 156.278 123.638 181.882 96.3208 164.245C89.4108 159.784 80.5892 159.784 73.6792 164.245C46.3619 181.882 11.9794 156.278 19.8626 124.053C21.8578 115.897 19.1412 107.282 12.8745 101.898C-11.8845 80.624 1.29418 39.0773 33.4485 36.8352C41.5782 36.2683 48.6956 30.9517 51.7391 23.1575Z" fill="#D6E475"/>
            </svg>
          </div>
        </div>

        {/* Saved activities */}
        {savedActivities.length > 0 && (
          <>
            <div className="toolkit-section-label">SAVED ACTIVITIES</div>
            {savedActivities.map(a => (
              <div
                key={a.id}
                className="toolkit-refl-entry"
                style={{ cursor: 'pointer' }}
                onClick={() => { onSelectActivity(a.id); showScreen('detail'); }}
              >
                <div className="toolkit-refl-top">
                  <span className="toolkit-refl-tag" style={{ background: '#d6e475' }}>{a.skill}</span>
                  <span className="toolkit-refl-date">{a.time}</span>
                </div>
                <div className="toolkit-refl-text" style={{ fontWeight: 600, color: '#3d3935' }}>{a.title}</div>
              </div>
            ))}
          </>
        )}

        {/* Reflections label */}
        <div className="toolkit-section-label">MY REFLECTIONS</div>

        {/* Calendar */}
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

        {/* Reflection log */}
        <div className="toolkit-refl-entry">
          <div className="toolkit-refl-top">
            <span className="toolkit-refl-tag" style={{ background: '#9CD3F8' }}>Activity: Emotional Playbook</span>
            <span className="toolkit-refl-date">May 17</span>
          </div>
          <div className="toolkit-refl-text">"She surprised me completely — named 'frustrated' before I even said a word..."</div>
        </div>
        <div className="toolkit-refl-entry">
          <div className="toolkit-refl-top">
            <span className="toolkit-refl-tag" style={{ background: '#d6e475' }}>Personal Note</span>
            <span className="toolkit-refl-date">May 17</span>
          </div>
          <div className="toolkit-refl-text">"She surprised me completely — I want to slow down more and let her lead..."</div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab="toolkit" showScreen={showScreen} />
    </div>
  );
}
