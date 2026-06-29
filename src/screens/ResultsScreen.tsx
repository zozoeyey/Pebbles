import { useState, useEffect } from 'react';
import { EXPLORE_ACTS } from '../data/activities';
import type { Screen, ExploreAct } from '../types';
import BottomNav from '../components/BottomNav';

interface Props {
  showScreen: (s: Screen) => void;
  onSelectActivity: (id: string) => void;
  activeTab: Screen;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

export default function ResultsScreen({ showScreen, onSelectActivity, activeTab, isSaved, toggleSaved }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [skillVal, setSkillVal] = useState('all');
  const [timeVal, setTimeVal] = useState('all');

  useEffect(() => {
    setSelectedId(null);
    setSearchTerm('');
    setFilterOpen(false);
    setSkillVal('all');
    setTimeVal('all');
  }, []);

  const visible = EXPLORE_ACTS.filter((a) => {
    if (skillVal !== 'all' && a.skillVal !== skillVal) return false;
    if (timeVal !== 'all' && a.timeVal !== timeVal) return false;
    const q = searchTerm.toLowerCase();
    if (q && !a.title.toLowerCase().includes(q) && !a.desc.toLowerCase().includes(q) && !a.skill.toLowerCase().includes(q)) return false;
    return true;
  });

  function toggleCard(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function tryAct(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    onSelectActivity(id);
    showScreen('detail');
  }

  function setSkill(val: string) {
    setSkillVal(val);
    setSelectedId(null);
  }

  function setTime(val: string) {
    setTimeVal(val);
    setSelectedId(null);
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="explore-wrap">
        <div className="explore-scroll">
          {/* Header */}
          <div className="explore-header">
            <img src="assets/pebbles logo.svg" className="explore-logo" alt="Pebbles" />
            <div className="explore-avatar">
              <img src="assets/char-pink.svg" alt="" />
            </div>
          </div>

          {/* Search + filter toggle */}
          <div className="explore-search-row">
            <div className="explore-search-bar">
              <div className="search-icon-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                className="explore-search-input"
                type="text"
                placeholder="Search activities"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSelectedId(null); }}
              />
            </div>
            <button
              className={`explore-filter-btn${filterOpen ? ' filter-open' : ''}`}
              onClick={() => setFilterOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="2" y1="4.5" x2="16" y2="4.5"/>
                <line x1="4.5" y1="9" x2="13.5" y2="9"/>
                <line x1="7" y1="13.5" x2="11" y2="13.5"/>
              </svg>
            </button>
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <div className="explore-filter-panel open">
              <div className="filter-sec">
                <div className="filter-sec-label">SEL Skills</div>
                <div className="filter-chips-wrap">
                  {['all', 'Identifying emotions', 'Self-perception'].map((val, i) => (
                    <button
                      key={val}
                      className={`ex-chip${skillVal === val ? ' active' : ''}`}
                      onClick={() => setSkill(val)}
                    >
                      {i === 0 ? 'All skills' : val}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-sec">
                <div className="filter-sec-label">Duration</div>
                <div className="filter-chips-wrap">
                  {[
                    { val: 'all', label: 'Any time' },
                    { val: 'under10', label: 'Under 10 mins' },
                    { val: '10to20', label: '10 – 20 mins' },
                    { val: '20to30', label: '20 – 30 mins' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      className={`ex-chip${timeVal === val ? ' active' : ''}`}
                      onClick={() => setTime(val)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Activity list */}
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: '#6b6761', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
            Suggested Activities
          </div>
          <div id="exploreList">
            {visible.length === 0 ? (
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#9d9da0', textAlign: 'center', padding: '24px 0' }}>
                No activities match your search.
              </p>
            ) : (
              visible.map((a: ExploreAct) => (
                <ExploreCard
                  key={a.id}
                  act={a}
                  selected={selectedId === a.id}
                  saved={isSaved(a.id)}
                  onToggle={() => toggleCard(a.id)}
                  onTry={(e) => tryAct(e, a.id)}
                  onSave={(e) => { e.stopPropagation(); toggleSaved(a.id); }}
                />
              ))
            )}
          </div>

          {/* Create your own */}
          <button className="explore-create-btn" onClick={() => showScreen('create-activity')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create your own activity
          </button>
        </div>

        {/* Bottom nav */}
        <BottomNav activeTab={activeTab} showScreen={showScreen} />
      </div>
    </div>
  );
}

function ExploreCard({ act, selected, saved, onToggle, onTry, onSave }: {
  act: ExploreAct;
  selected: boolean;
  saved: boolean;
  onToggle: () => void;
  onTry: (e: React.MouseEvent) => void;
  onSave: (e: React.MouseEvent) => void;
}) {
  return (
    <div className={`ex-card${selected ? ' selected' : ''}`} onClick={onToggle}>
      <div className="ex-card-header">
        <div className={`ex-radio${selected ? ' on' : ''}`} />
        <div className="ex-card-title">{act.title}</div>
        <button
          className="ex-save-btn"
          onClick={onSave}
          aria-label={saved ? 'Unsave' : 'Save'}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#3d3935' : 'none'} stroke="#3d3935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
      <div className="ex-card-tags">
        <span className="ex-tag ex-tag-time">{act.time}</span>
        <span className="ex-tag ex-tag-skill">{act.skill}</span>
        <span className="ex-tag ex-tag-ref">{act.refs}</span>
      </div>
      {selected && <div className="ex-card-desc">{act.desc}</div>}
      {selected && (
        <div className="ex-card-action">
          <button className="ex-try-btn" onClick={onTry}>Try Activity →</button>
        </div>
      )}
    </div>
  );
}
