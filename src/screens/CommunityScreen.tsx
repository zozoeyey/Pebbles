import type { Screen } from '../types';
import BottomNav from '../components/BottomNav';

const PEBBLE_PATH =
  'M101.2 0C121.524 0 138 16.4759 138 36.7998C138 50.657 130.339 62.7231 119.023 69C130.339 75.2769 138 87.3429 138 101.2C138 121.524 121.524 138 101.2 138H36.7998C16.4759 138 0 121.524 0 101.2C4.49801e-05 87.3433 7.66 75.277 18.9756 69C7.66 62.723 4.77943e-05 50.6567 0 36.7998C0 16.4759 16.4759 0 36.7998 0H101.2Z';

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

interface Props {
  showScreen: (s: Screen) => void;
  onExpandCard: (activityId: string) => void;
}

export default function CommunityScreen({ showScreen, onExpandCard }: Props) {
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="community-wrap">
        {/* Header */}
        <div className="community-header-row">
          <div>
            <div className="community-heading">Community</div>
            <div className="community-subheading">See what other parents are reflecting on</div>
          </div>
          <div className="community-avatar-bub" style={{ background: '#d6e475' }}>
            <svg width="30" height="30" viewBox="0 0 138 138" fill="none">
              <path d={PEBBLE_PATH} fill="#F9A3C4"/>
              <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
              <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
            </svg>
          </div>
        </div>

        {/* Card 1 */}
        <div className="community-card">
          <div className="community-card-head">
            <div className="community-avatar-bub" style={{ background: '#fdd15e' }}>
              <svg width="30" height="30" viewBox="0 0 138 138" fill="none">
                <path d={PEBBLE_PATH} fill="#9CD3F8"/>
                <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
                <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
              </svg>
            </div>
            <div>
              <div className="community-card-name">Parent (child age 8)</div>
              <div className="community-card-time">2h ago</div>
            </div>
          </div>
          <div className="community-activity-tag">Activity: Freeze Feelings</div>
          <p className="community-card-text">
            The activity created space for more open conversation than usual, with the child sharing feelings they typically don't express—showing how intentional slowing down unlocked emotional sharing.
          </p>
          <div className="community-card-footer">
            <div className="community-card-likes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={HEART_PATH}/>
              </svg>
              24 likes
            </div>
            <div className="community-card-see" onClick={() => onExpandCard('freeze-feelings')} style={{ cursor: 'pointer' }}>
              See full reflection →
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="community-card">
          <div className="community-card-head">
            <div className="community-avatar-bub" style={{ background: '#d6e475' }}>
              <svg width="30" height="30" viewBox="0 0 138 138" fill="none">
                <path d={PEBBLE_PATH} fill="#F9A3C4"/>
                <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
                <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
              </svg>
            </div>
            <div>
              <div className="community-card-name">Parent (child age 5)</div>
              <div className="community-card-time">2h ago</div>
            </div>
          </div>
          <div className="community-activity-tag">Activity: Emotional Playbook</div>
          <p className="community-card-text">
            Maya was able to name basic emotions easily and even added her own ("frustrated" when things don't go her way); she seemed especially engaged when we connected the scenario to something that actually happened at school.
          </p>
          <div className="community-card-footer">
            <div className="community-card-likes">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6761" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={HEART_PATH}/>
              </svg>
              18 likes
            </div>
            <div className="community-card-see" onClick={() => onExpandCard('emotional-intelligence-playbook')} style={{ cursor: 'pointer' }}>
              See full reflection →
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab="community" showScreen={showScreen} />
    </div>
  );
}
