import { useEffect, useState } from 'react';
import type { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import AvatarBubble, { PEBBLE_PATH } from '../components/AvatarBubble';
import { EXPLORE_ACTS, COMMUNITY_REFLECTIONS } from '../data/activities';
import { fetchSharedReflections, likeReflection, timeAgo } from '../lib/communityApi';
import type { SharedReflection } from '../lib/communityApi';

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

const BUBBLE_COLORS: [string, string][] = [
  ['#fdd15e', '#9CD3F8'],
  ['#d6e475', '#F9A3C4'],
  ['#F9A3C4', '#FDD15E'],
  ['#9CD3F8', '#d6e475'],
];

interface Props {
  showScreen: (s: Screen) => void;
  onExpandCard: (activityId: string) => void;
}

// A reflection a parent chose to share, fetched from Supabase.
function LiveCard({ r, index }: { r: SharedReflection; index: number }) {
  const [likes, setLikes] = useState(r.likes);
  const [liked, setLiked] = useState(false);
  const [bg, fill] = BUBBLE_COLORS[index % BUBBLE_COLORS.length];

  function handleLike() {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    likeReflection(r.id).catch(() => {});
  }

  return (
    <div className="community-card">
      <div className="community-card-head">
        <div className="community-avatar-bub" style={{ background: bg }}>
          <svg width="30" height="30" viewBox="0 0 138 138" fill="none">
            <path d={PEBBLE_PATH} fill={fill}/>
            <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
            <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
          </svg>
        </div>
        <div>
          <div className="community-card-name">
            Parent{r.child_age ? ` (child age ${r.child_age})` : ''}
          </div>
          <div className="community-card-time">{timeAgo(r.created_at)}</div>
        </div>
      </div>
      <div className="community-activity-tag">Activity: {r.activity_title}</div>
      <p className="community-card-text" style={{ whiteSpace: 'pre-line' }}>
        {r.summary.replace(/\*/g, '').replace(/^[-•]\s*/gm, '')}
      </p>
      <div className="community-card-footer">
        <div
          className="community-card-likes"
          onClick={handleLike}
          style={{ cursor: liked ? 'default' : 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#F9A3C4' : 'none'} stroke="#6b6761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={HEART_PATH}/>
          </svg>
          {likes} likes
        </div>
      </div>
    </div>
  );
}

export default function CommunityScreen({ showScreen, onExpandCard }: Props) {
  const [live, setLive] = useState<SharedReflection[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchSharedReflections()
      .then((rows) => { if (!cancelled) setLive(rows); })
      .catch(() => {}); // browse list still works offline via seeded counts
    return () => { cancelled = true; };
  }, []);

  // Reflections per activity: live shared rows + the seeded examples.
  const liveCounts = new Map<string, number>();
  live.forEach((r) => liveCounts.set(r.activity_id, (liveCounts.get(r.activity_id) ?? 0) + 1));
  const activities = EXPLORE_ACTS
    .map((a) => ({
      act: a,
      count: (liveCounts.get(a.id) ?? 0) + (COMMUNITY_REFLECTIONS[a.id]?.length ?? 0),
    }))
    .sort((x, y) => y.count - x.count);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="community-wrap">
        {/* Header */}
        <div className="community-header-row">
          <div>
            <div className="community-heading">Community</div>
            <div className="community-subheading">See what other parents tried, activity by activity</div>
          </div>
          <AvatarBubble />
        </div>

        {/* Browse by activity — tap to see all its reflections */}
        <div className="ce-section-label" style={{ marginTop: 4 }}>BY ACTIVITY</div>
        <div className="community-activity-list">
          {activities.map(({ act, count }, i) => (
            <div key={act.id} className="community-activity-row" onClick={() => onExpandCard(act.id)}>
              <div className="community-avatar-bub" style={{ background: BUBBLE_COLORS[i % BUBBLE_COLORS.length][0], width: 38, height: 38, borderRadius: 19, flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 138 138" fill="none">
                  <path d={PEBBLE_PATH} fill={BUBBLE_COLORS[i % BUBBLE_COLORS.length][1]}/>
                  <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
                  <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="community-activity-row-title">{act.title.split(':')[0]}</div>
                <div className="community-activity-row-meta">
                  {act.skills[0]} · {count === 0 ? 'No reflections yet — be the first!' : `${count} reflection${count === 1 ? '' : 's'}`}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9d9da0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          ))}
        </div>

        {/* Latest shared reflections across all activities */}
        {live.length > 0 && (
          <>
            <div className="ce-section-label" style={{ marginTop: 16 }}>RECENT REFLECTIONS</div>
            {live.slice(0, 5).map((r, i) => <LiveCard key={r.id} r={r} index={i} />)}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab="community" showScreen={showScreen} />
    </div>
  );
}
