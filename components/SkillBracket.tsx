import styles from './SkillBracket.module.css';

// Visualizes the thing the product actually does: two players' accepted
// skill ranges (on the app's 1–10 scale) overlapping, with the overlap zone
// — the actual match — called out. This stands in for the generic gradient
// hero graphic; it's built from the real matching mechanic, not decoration.

const SCALE_MIN = 1;
const SCALE_MAX = 10;

function pct(value: number) {
  return ((value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

interface BracketRowProps {
  name: string;
  rangeStart: number;
  rangeEnd: number;
  variant: 'you' | 'them';
}

function BracketRow({ name, rangeStart, rangeEnd, variant }: BracketRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{name}</span>
      <div className={styles.track}>
        <div
          className={styles.range}
          data-variant={variant}
          style={{ left: `${pct(rangeStart)}%`, width: `${pct(rangeEnd) - pct(rangeStart)}%` }}
        />
      </div>
    </div>
  );
}

export function SkillBracket() {
  // You: willing to play with skill 3–8. Them: skill 5–9. Overlap: 5–8.
  const overlapStart = 5;
  const overlapEnd = 8;

  return (
    <div className={styles.wrap} role="img" aria-label="Two players' accepted skill ranges overlapping between skill level 5 and 8, marked as a match">
      <BracketRow name="YOU" rangeStart={3} rangeEnd={8} variant="you" />
      <BracketRow name="RYU_K" rangeStart={5} rangeEnd={9} variant="them" />

      <div className={styles.overlapLayer}>
        <div
          className={styles.overlapZone}
          style={{ left: `${pct(overlapStart)}%`, width: `${pct(overlapEnd) - pct(overlapStart)}%` }}
        >
          <span className={styles.pulse} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.readout}>
        <span className={styles.readoutLabel}>MATCH ZONE</span>
        <span className={styles.readoutValue}>SKILL {overlapStart}–{overlapEnd}</span>
      </div>
    </div>
  );
}
