export const PEBBLE_PATH =
  'M101.2 0C121.524 0 138 16.4759 138 36.7998C138 50.657 130.339 62.7231 119.023 69C130.339 75.2769 138 87.3429 138 101.2C138 121.524 121.524 138 101.2 138H36.7998C16.4759 138 0 121.524 0 101.2C4.49801e-05 87.3433 7.66 75.277 18.9756 69C7.66 62.723 4.77943e-05 50.6567 0 36.7998C0 16.4759 16.4759 0 36.7998 0H101.2Z';

// The app's header avatar: pink pebble in a green circle. One source of truth
// so every screen shows the same character.
export default function AvatarBubble({ size = 50 }: { size?: number }) {
  return (
    <div className="community-avatar-bub" style={{ background: '#d6e475', width: size, height: size, borderRadius: size / 2 }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 138 138" fill="none">
        <path d={PEBBLE_PATH} fill="#F9A3C4"/>
        <ellipse cx="61.5" cy="34" rx="7" ry="9" fill="#666"/>
        <ellipse cx="80.5" cy="34" rx="7" ry="9" fill="#666"/>
      </svg>
    </div>
  );
}
