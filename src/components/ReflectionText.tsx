// Renders a reflection/summary: paragraphs split on newlines, with the known
// section labels ("What went well:", etc.) shown in bold — matching the peer
// reflection style. Used for AI summaries across Reflection, Community, Toolkit.
const LABEL_RE =
  /^(What went well|What could have gone better|Hope for the future|What I'd try differently|Activity engagement|Focus on mechanics over sensation|Key takeaway):/;

/** Split a reflection/summary into its display paragraphs. */
export function splitReflection(text: string): string[] {
  return text.replace(/\*/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
}

export default function ReflectionText({ text, className, max }: {
  text: string;
  className?: string;
  /** Render at most this many paragraphs (for collapsed cards). */
  max?: number;
}) {
  const all = splitReflection(text);
  const paras = max != null ? all.slice(0, max) : all;
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
