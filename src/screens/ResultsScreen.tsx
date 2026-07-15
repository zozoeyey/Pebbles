import { useState, useEffect } from 'react';
import { EXPLORE_ACTS, PRESET_CHALLENGES } from '../data/activities';
import { fetchAiSuggestions } from '../lib/suggestActivities';
import type { AiSuggestion } from '../lib/suggestActivities';
import type { Screen, ExploreAct } from '../types';
import BottomNav from '../components/BottomNav';
import AvatarBubble from '../components/AvatarBubble';

interface Props {
  showScreen: (s: Screen) => void;
  onSelectActivity: (id: string) => void;
  activeTab: Screen;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  selectedAge: number | null;
  selectedChallenges: Set<string>;
  customChallengeText: string;
  selAnswers: { selDefinition: string; emotionHandling: string };
}

/** Parse 'Ages 4–7' into [4, 7]; null if unparseable. */
function parseAges(ages: string): [number, number] | null {
  const m = ages.match(/(\d+)\D+(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

// Maps each onboarding challenge to the SEL skills/tags that help with it.
const CHALLENGE_SKILLS: Record<string, string[]> = {
  naming: ['Identifying emotions'],
  meltdowns: ['Self-regulation', 'Interoception'],
  transitions: ['Self-regulation'],
  calming: ['Interoception', 'Self-regulation'],
  confidence: ['Self-regulation'], // rolling with mistakes (e.g. Musical Drawings) is the closest fit
};

function actSkills(a: ExploreAct): string[] {
  return a.skills;
}

export default function ResultsScreen({
  showScreen, onSelectActivity, activeTab, isSaved, toggleSaved,
  selectedAge, selectedChallenges, customChallengeText, selAnswers,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [skillVal, setSkillVal] = useState('all');
  const [timeVal, setTimeVal] = useState('all');

  // AI-picked suggestions from the Claude edge function. Null until it returns.
  const [aiIds, setAiIds] = useState<string[] | null>(null);
  const [aiReasons, setAiReasons] = useState<Record<string, string>>({});
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  useEffect(() => {
    setSelectedId(null);
    setSearchTerm('');
    setFilterOpen(false);
    setSkillVal('all');
    setTimeVal('all');
  }, []);

  const childLabel = selectedAge ? `your ${selectedAge}-year-old` : 'your child';
  const hasOnboarding = selectedAge != null || selectedChallenges.size > 0 || customChallengeText.trim() !== '';

  // Stable key so the AI call only re-runs when the onboarding answers change.
  const challengeIds = [...selectedChallenges].sort();
  const onboardKey = `${selectedAge ?? ''}|${challengeIds.join(',')}|${customChallengeText.trim()}|${selAnswers.selDefinition}|${selAnswers.emotionHandling}`;

  useEffect(() => {
    if (!hasOnboarding) { setAiIds(null); setAiState('idle'); return; }
    let cancelled = false;
    setAiState('loading');
    const labelFor = (id: string) => PRESET_CHALLENGES.find((c) => c.id === id)?.label ?? id;
    fetchAiSuggestions({
      childAge: selectedAge,
      challenges: challengeIds.map(labelFor),
      customText: customChallengeText.trim(),
      selDefinition: selAnswers.selDefinition,
      emotionHandling: selAnswers.emotionHandling,
      activities: EXPLORE_ACTS,
      count: 2,
    })
      .then((list: AiSuggestion[]) => {
        if (cancelled) return;
        const valid = list.filter((s) => EXPLORE_ACTS.some((a) => a.id === s.id)).slice(0, 2);
        if (valid.length === 0) { setAiState('error'); return; }
        setAiIds(valid.map((s) => s.id));
        setAiReasons(Object.fromEntries(valid.map((s) => [s.id, s.reason])));
        setAiState('done');
      })
      .catch(() => { if (!cancelled) setAiState('error'); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardKey]);

  const isFiltering = searchTerm.trim() !== '' || skillVal !== 'all' || timeVal !== 'all';

  const visible = EXPLORE_ACTS.filter((a) => {
    if (skillVal !== 'all' && !a.skills.includes(skillVal)) return false;
    if (timeVal !== 'all' && a.timeVal !== timeVal) return false;
    const q = searchTerm.toLowerCase();
    if (q && !a.title.toLowerCase().includes(q) && !a.desc.toLowerCase().includes(q) && !a.skills.join(' ').toLowerCase().includes(q)) return false;
    return true;
  });

  // Local heuristic — the fallback shown until (or if) the AI call returns.
  // Mirrors the rubric in docs/suggestion-rubric.md: age fit first, then challenge→skill match.
  const wantedSkills = new Set<string>();
  selectedChallenges.forEach((id) => (CHALLENGE_SKILLS[id] ?? []).forEach((s) => wantedSkills.add(s)));
  const customWords = `${customChallengeText} ${selAnswers.emotionHandling}`
    .toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const ranked = EXPLORE_ACTS.map((a, i) => {
    let score = actSkills(a).reduce((n, s) => n + (wantedSkills.has(s) ? 1 : 0), 0);
    const hay = `${a.title} ${a.desc} ${a.skills.join(' ')}`.toLowerCase();
    if (customWords.some((w) => hay.includes(w))) score += 1;
    // Age fit: in range +2, within a year of it 0, further out -2.
    const range = parseAges(a.ages);
    if (selectedAge != null && range) {
      if (selectedAge >= range[0] && selectedAge <= range[1]) score += 2;
      else if (selectedAge < range[0] - 1 || selectedAge > range[1] + 1) score -= 2;
    }
    return { a, score, i };
  }).sort((x, y) => y.score - x.score || x.i - y.i);
  // Diversity: avoid two picks with the same primary skill when an alternative exists.
  const top = ranked[0];
  const second = ranked.slice(1).find((r) => r.a.skills[0] !== top.a.skills[0] && r.score >= ranked[1].score - 1) ?? ranked[1];
  const ruleSuggestedIds = [top, second].map((r) => r.a.id);

  // Prefer the AI picks once they arrive; otherwise use the heuristic.
  const aiActive = aiState === 'done' && aiIds != null && aiIds.length > 0;
  const suggestedIds = aiActive ? aiIds! : ruleSuggestedIds;
  const suggested = suggestedIds
    .map((id) => EXPLORE_ACTS.find((a) => a.id === id))
    .filter((a): a is ExploreAct => Boolean(a));
  const rest = EXPLORE_ACTS.filter((a) => !suggestedIds.includes(a.id));

  let suggestSubtitle = '';
  if (hasOnboarding) {
    if (aiState === 'loading') suggestSubtitle = `Finding the best picks for ${childLabel}…`;
    else if (aiActive) suggestSubtitle = `Chosen by Pebbles AI for ${childLabel}`;
    else suggestSubtitle = `Picked for ${childLabel} based on what you told us`;
  }

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

  const renderCard = (a: ExploreAct, note?: string) => (
    <ExploreCard
      key={a.id}
      act={a}
      note={note}
      selected={selectedId === a.id}
      saved={isSaved(a.id)}
      onToggle={() => toggleCard(a.id)}
      onTry={(e) => tryAct(e, a.id)}
      onSave={(e) => { e.stopPropagation(); toggleSaved(a.id); }}
    />
  );

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="explore-wrap">
        <div className="explore-scroll">
          {/* Header */}
          <div className="explore-header">
            <img src="assets/pebbles logo.svg" className="explore-logo" alt="Pebbles" />
            <AvatarBubble />
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
                  {['all', 'Identifying emotions', 'Interoception', 'Self-regulation'].map((val, i) => (
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
          {isFiltering ? (
            <>
              <div className="explore-section-label">All Activities</div>
              <div className="explore-list">
                {visible.length === 0 ? (
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#9d9da0', textAlign: 'center', padding: '24px 0' }}>
                    No activities match your search.
                  </p>
                ) : (
                  visible.map((a) => renderCard(a))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="explore-section-label">Suggested Activities</div>
              {suggestSubtitle && <div className="explore-section-sub">{suggestSubtitle}</div>}
              <div className="explore-list">
                {suggested.map((a) => renderCard(a, aiActive ? aiReasons[a.id] : undefined))}
              </div>

              <div className="explore-section-label" style={{ marginTop: 22 }}>All Activities</div>
              <div className="explore-list" style={{ marginTop: 0 }}>{rest.map((a) => renderCard(a))}</div>
            </>
          )}
        </div>

        {/* Bottom nav */}
        <BottomNav activeTab={activeTab} showScreen={showScreen} />
      </div>
    </div>
  );
}

function ExploreCard({ act, note, selected, saved, onToggle, onTry, onSave }: {
  act: ExploreAct;
  note?: string;
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
        <span className="ex-tag ex-tag-age">{act.ages}</span>
        {act.skills.map((s) => (
          <span key={s} className="ex-tag ex-tag-skill">{s}</span>
        ))}
        <span className="ex-tag ex-tag-ref">{act.refs}</span>
      </div>
      {note && <div className="ex-card-note">✨ {note}</div>}
      {selected && <div className="ex-card-desc">{act.desc}</div>}
      {selected && (
        <div className="ex-card-action">
          <button className="ex-try-btn" onClick={onTry}>Try Activity →</button>
        </div>
      )}
    </div>
  );
}
