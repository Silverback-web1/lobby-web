'use client';

import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

const OPTIONS: { value: 'light' | 'dark' | 'system'; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'Auto' },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  return (
    <div className={styles.group} role="group" aria-label="Color theme">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setMode(opt.value)}
          className={styles.option}
          data-active={mode === opt.value}
          aria-pressed={mode === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
