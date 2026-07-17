import { useEffect, useState } from 'react';
import type { Screen } from '../types';
import BottomNav from '../components/BottomNav';
import AvatarBubble, { PEBBLE_PATH } from '../components/AvatarBubble';
import ReflectionText, { splitReflection } from '../components/ReflectionText';
import { EXPLORE_ACTS, ACTIVITIES } from '../data/activities';
import { fetchSharedReflections, getLikedIds, getMySharedIds, likeReflection, unlikeReflection, timeAgo } from '../lib/communityApi';
import { logEvent } from '../lib/analytics';

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

// One feed entry — either a live shared reflection (likeable) or a seeded example.
interface Post {
  key: string;
  activityId: string;
  activityTitle: string;
  childAge: number | null;
  time: string;
  text: string;
  likes: number;
  liveId?: string; // present → real row, heart works
}

function activityTitle(id: string): string {
  const act = EXPLORE_ACTS.find((a) => a.id === id) || ACTIVITIES.find((a) => a.id === id);
  return (act?.title ?? id).split(':')[0];
}

function PostCard({ post, index, mine, liked, showSeeAll, onLike, onSeeAll }: {
  post: Post; index: number; mine: boolean; liked: boolean; showSeeAll: boolean; onLike: () => void; onSeeAll: () => void;
}) {
  const [bg, fill] = BUBBLE_COLORS[index % BUBBLE_COLORS.length];
  const likeable = Boolean(post.liveId);
  // Collapse long labeled reflections to the first 2 lines with a Show more.
  const [expanded, setExpanded] = useState(false);
  const collapsible = splitReflection(post.text).length > 2;
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
            {mine ? 'You' : 'Parent'}{post.childAge ? ` (child age ${post.childAge})` : ''}
          </div>
          <div className="community-card-time">{post.time}</div>
        </div>
      </div>
      <div className="community-activity-tag">Activity: {post.activityTitle}</div>
      <ReflectionText
        text={post.text}
        className="community-card-text"
        max={collapsible && !expanded ? 2 : undefined}
      />
      {collapsible && (
        <button className="community-showmore" onClick={() => setExpanded((v) => !v)}>
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      <div className="community-card-footer">
        <div
          className="community-card-likes"
          onClick={likeable ? onLike : undefined}
          style={likeable ? { cursor: 'pointer' } : undefined}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? '#F9A3C4' : 'none'} stroke="#6b6761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={HEART_PATH}/>
          </svg>
          {post.likes} likes
        </div>
        {showSeeAll && (
          <div className="community-card-see" onClick={onSeeAll} style={{ cursor: 'pointer' }}>
            See all for this activity →
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityScreen({ showScreen, onExpandCard }: Props) {
  const [livePosts, setLivePosts] = useState<Post[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(getLikedIds);
  const [filterId, setFilterId] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All Activities' },
    ...EXPLORE_ACTS.map((a) => ({ id: a.id, label: a.title.split(':')[0] })),
  ];
  const filterLabel = filterOptions.find((o) => o.id === filterId)?.label ?? 'All Activities';

  useEffect(() => {
    let cancelled = false;
    fetchSharedReflections()
      .then((rows) => {
        if (cancelled) return;
        setLivePosts(rows.map((r) => ({
          key: r.id,
          activityId: r.activity_id,
          activityTitle: activityTitle(r.activity_id),
          childAge: r.child_age,
          time: timeAgo(r.created_at),
          text: r.summary.replace(/\*/g, '').replace(/^[-•]\s*/gm, ''),
          likes: r.likes,
          liveId: r.id,
        })));
      })
      .catch(() => {}); // seeded examples still render
    return () => { cancelled = true; };
  }, []);

  // Your own shares pin to the top (so a fresh share is instantly visible),
  // then everyone else's, most popular first.
  const mine = new Set(getMySharedIds());
  const posts = livePosts
    .filter((p) => filterId === 'all' || p.activityId === filterId)
    .sort((a, b) => {
      const am = mine.has(a.key) ? 1 : 0, bm = mine.has(b.key) ? 1 : 0;
      return bm - am || b.likes - a.likes;
    });

  function handleLike(post: Post) {
    if (!post.liveId) return;
    const id = post.liveId;
    const unliking = likedIds.has(id);
    setLikedIds((prev) => {
      const next = new Set(prev);
      unliking ? next.delete(id) : next.add(id);
      return next;
    });
    setLivePosts((prev) => prev.map((p) =>
      p.liveId === id ? { ...p, likes: Math.max(0, p.likes + (unliking ? -1 : 1)) } : p,
    ));
    (unliking ? unlikeReflection(id) : likeReflection(id)).catch(() => {});
    logEvent(unliking ? 'reflection_unliked' : 'reflection_liked', { activityId: post.activityId, payload: { reflection: id } });
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="community-wrap">
        {/* Header */}
        <div className="community-header-row">
          <div>
            <div className="community-heading">Community</div>
            <div className="community-subheading">See what other parents are reflecting on</div>
          </div>
          <AvatarBubble onClick={() => showScreen('profile')} />
        </div>

        {/* Activity filter — custom dropdown in app style */}
        <div className="community-filter-wrap">
          <button className="community-filter-btn" onClick={() => setFilterOpen((o) => !o)}>
            {filterLabel}
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="#3d3935" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform 0.15s', transform: filterOpen ? 'rotate(180deg)' : 'none' }}
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>
          {filterOpen && (
            <div className="community-filter-menu">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  className={`community-filter-item${filterId === opt.id ? ' active' : ''}`}
                  onClick={() => { setFilterId(opt.id); setFilterOpen(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ce-section-label" style={{ marginTop: 4 }}>MOST POPULAR</div>
        {posts.length === 0 ? (
          <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 13, color: '#9d9da0', textAlign: 'center', padding: '24px 0' }}>
            No reflections for this activity yet — be the first to share one!
          </p>
        ) : (
          posts.map((p, i) => (
            <PostCard
              key={p.key}
              post={p}
              index={i}
              mine={mine.has(p.key)}
              liked={Boolean(p.liveId && likedIds.has(p.liveId))}
              showSeeAll={filterId === 'all'}
              onLike={() => handleLike(p)}
              onSeeAll={() => onExpandCard(p.activityId)}
            />
          ))
        )}
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab="community" showScreen={showScreen} />
    </div>
  );
}
