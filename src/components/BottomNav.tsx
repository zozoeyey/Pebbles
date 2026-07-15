import type { Screen } from '../types';

interface Props {
  activeTab: Screen;
  showScreen: (s: Screen) => void;
}

export default function BottomNav({ activeTab, showScreen }: Props) {
  const isExplore = activeTab === 'results';
  const isCommunity = activeTab === 'community' || activeTab === 'community-expand';
  const isToolkit = activeTab === 'toolkit';
  const isProfile = activeTab === 'profile';

  return (
    <div className="explore-nav">
      <div className="explore-nav-inner">
        {/* Explore */}
        <div className={`nav-tab${isExplore ? ' active' : ''}`} onClick={() => showScreen('results')} style={{ cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={isExplore ? '#3d3935' : '#888'} strokeWidth={isExplore ? '1.8' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12L12 4l9 8"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-4h4v4h4a1 1 0 0 0 1-1v-9"/>
          </svg>
          <span className="nav-tab-label">Explore</span>
        </div>

        {/* Community */}
        <div className={`nav-tab${isCommunity ? ' active' : ''}`} onClick={() => showScreen('community')} style={{ cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={isCommunity ? '#3d3935' : '#888'} strokeWidth={isCommunity ? '1.8' : '1.5'} strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span className="nav-tab-label">Community</span>
        </div>

        {/* Toolkit */}
        <div className={`nav-tab${isToolkit ? ' active' : ''}`} onClick={() => showScreen('toolkit')} style={{ cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={isToolkit ? '#3d3935' : '#888'} strokeWidth={isToolkit ? '1.8' : '1.5'} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
          <span className="nav-tab-label">Toolkit</span>
        </div>

        {/* Profile */}
        <div className={`nav-tab${isProfile ? ' active' : ''}`} onClick={() => showScreen('profile')} style={{ cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={isProfile ? '#3d3935' : '#888'} strokeWidth={isProfile ? '1.8' : '1.5'} strokeLinecap="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span className="nav-tab-label">Profile</span>
        </div>
      </div>
    </div>
  );
}
