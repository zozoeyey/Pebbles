interface Props {
  onClick: () => void;
}

export default function BackButton({ onClick }: Props) {
  return (
    <button className="back-btn" onClick={onClick}>
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M12 5L7 10L12 15" stroke="#3d3935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
  );
}
