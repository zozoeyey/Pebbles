import type { Screen } from '../types';

interface Props {
  showScreen: (s: Screen) => void;
}

export default function WelcomeScreen({ showScreen }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeUp 0.3s ease both' }}>
      <div className="welcome-v2">
        <div className="welcome-top">
          <img src="assets/pebbles logo.svg" className="welcome-logo" alt="Pebbles" />
          <div className="welcome-scene">
            <img src="assets/arc.svg" className="welcome-arc" alt="" />
            <img src="assets/char-yellow.svg" className="char-yellow" alt="" />
            <img src="assets/char-pink.svg" className="char-pink" alt="" />
          </div>
        </div>
        <div className="welcome-card">
          <div className="welcome-texts">
            <div className="welcome-heading">Welcome to Pebbles!</div>
            <p className="welcome-subtext">
              Guide your kid through big emotions,<br />one small moment at a time
            </p>
          </div>
          <button className="welcome-cta" onClick={() => showScreen('age')}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
