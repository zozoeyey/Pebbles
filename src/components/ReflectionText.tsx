// Renders a reflection/summary: paragraphs split on newlines, with the known
// section labels ("What went well:", etc.) shown in bold — matching the peer
// reflection style. Used for AI summaries across Reflection, Community, Toolkit.
const LABEL_RE =
  /^(What went well|What could have gone better|Hope for the future|What I'd try differently|Activity engagement|Focus on mechanics over sensation|Key takeaway):/;

export default function ReflectionText({ text, className }: { text: string; className?: string }) {
  const paras = text.replace(/\*/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className={className}>
      {paras.map((p, i) => {
        const m = p.match(LABEL_RE);
        return (
          <p key={i} style={{ marginBottom: i < paras.length - 1 ? 6 : 0 }}>
            {m ? <><strong>{m[1]}:</strong>{p.slice(m[0].length)}</> : p}
          </p>
        );
      })}
    </div>
  );
}
