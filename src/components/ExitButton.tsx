interface Props {
  onClick: () => void;
}

// Bails out of the activity flow back to Explore in one tap,
// instead of backing through each screen. Sits at the right edge.
export default function ExitButton({ onClick }: Props) {
  return (
    <button className="exit-btn" onClick={onClick} aria-label="Exit to Explore">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L15 15M15 5L5 15" stroke="white" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    </button>
  );
}
