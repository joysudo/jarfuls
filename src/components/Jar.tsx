import './Jar.css';

interface JarProps {
  name: string;
  emoji: string;
  color: string;
  colorSoft: string;
  points: number;
  percent: number;       // 0-100
  hours: number;
  mainQuestPoints: number;
  mainQuest: string;
}

// Jar geometry (viewBox 0 0 160 220)
// The jar body spans roughly y=40 (shoulder) to y=210 (base).
const JAR_TOP = 46;     // top of liquid fill area (just below the neck)
const JAR_BOTTOM = 206; // bottom interior of jar
const JAR_HEIGHT = JAR_BOTTOM - JAR_TOP;

export default function Jar({
  name,
  emoji,
  color,
  // colorSoft,
  points,
  percent,
  hours,
  mainQuestPoints,
  mainQuest,
}: JarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const liquidHeight = (clamped / 100) * JAR_HEIGHT;
  const liquidY = JAR_BOTTOM - liquidHeight;
  const gradientId = `jarGradient-${name.replace(/\s+/g, '')}`;
  const clipId = `jarClip-${name.replace(/\s+/g, '')}`;

  return (
    <div className="jar">
      <svg
        className="jar__svg"
        viewBox="0 0 160 220"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${name}'s jar is ${Math.round(clamped)}% full`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <clipPath id={clipId}>
            <path d="M30 40 C30 34 34 30 40 30 L120 30 C126 30 130 34 130 40 L130 196 C130 204 122 212 110 212 L50 212 C38 212 30 204 30 196 Z" />
          </clipPath>
        </defs>

        {/* Jar body outline */}
        {/* <path
          d="M30 40 C30 34 34 30 40 30 L120 30 C126 30 130 34 130 40 L130 196 C130 204 122 212 110 212 L50 212 C38 212 30 204 30 196 Z"
          fill="transparent"
          stroke="var(--jar-outline)"
          strokeWidth="3"
        /> */}

        {/* Liquid fill, clipped to jar interior */}
        <g clipPath={`url(#${clipId})`}>
          <rect
            className="jar__liquid"
            x="20"
            y={liquidY}
            width="140"
            height={liquidHeight + 20}
            fill={`url(#${gradientId})`}
          />
          {/* wavy surface line */}
          {clamped > 0 && (
            <path
              d={`M20 ${liquidY - 4} q 10 -4 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 v 10 h -120 z`}
              fill={color}
              opacity="1"
            />
          )}
        </g>

        {/* Jar rim / lid */}
        <rect x="34" y="14" width="92" height="16" rx="6" fill={color} />
        <rect x="34" y="14" width="92" height="6" rx="3" fill="#fff" opacity="0.35" />

        {/* Jar outline on top (re-stroke for crisp edge over liquid) */}
        <path
          d="M30 40 C30 34 34 30 40 30 L120 30 C126 30 130 34 130 40 L130 196 C130 204 122 212 110 212 L50 212 C38 212 30 204 30 196 Z"
          fill="none"
          stroke="var(--jar-outline)"
          strokeWidth="3"
        />

        {/* Percent label */}
        <text
          x="80"
          y="125"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="600"
          fontSize="28"
          fill={clamped > 45 ? '#fff' : 'var(--ink)'}
        >
          {/* {Math.round(clamped)}% */}
          {points}pts
        </text>
      </svg>

      <div className="jar__label">
        <div className="jar__name">
          <span aria-hidden="true">{emoji}</span> {name}
        </div>
        <div className="jar__stat">
          {hours.toFixed(1)} hrs logged · {Math.round(mainQuestPoints)} pts toward quest
        </div>
        <div className="jar__quest">{mainQuest}</div>
      </div>
    </div>
  );
}
