import './VerticalJarBar.css';

interface VerticalJarBarProps {
  percent: number;
  color: string;
}

export default function VerticalJarBar({ percent, color }: VerticalJarBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="vbar">
      <div
        className="vbar__track"
        role="img"
        aria-label={`${Math.round(clamped)}% of point goal reached`}
      >
        <div className="vbar__fill" style={{ height: `${clamped}%`, background: color }} />
      </div>
      <div className="vbar__percent" style={{ color }}>{Math.round(clamped)}%</div>
    </div>
  );
}
