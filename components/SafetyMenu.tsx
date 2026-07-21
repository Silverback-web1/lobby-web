'use client';

import { useState } from 'react';
import { api } from '../lib/api';
import { Button, Textarea } from './ui';
import styles from './SafetyMenu.module.css';

const REASONS: { id: string; label: string }[] = [
  { id: 'harassment_or_abuse', label: 'Harassment or abuse' },
  { id: 'hate_speech', label: 'Hate speech' },
  { id: 'spam_or_scam', label: 'Spam or scam' },
  { id: 'inappropriate_content', label: 'Inappropriate content' },
  { id: 'impersonation', label: 'Impersonation' },
  { id: 'underage_user', label: 'Underage user' },
  { id: 'other', label: 'Something else' },
];

interface SafetyMenuProps {
  userId: string;
  username: string;
  onBlocked?: () => void;
}

export function SafetyMenu({ userId, username, onBlocked }: SafetyMenuProps) {
  const [open, setOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [blocking, setBlocking] = useState(false);

  async function handleBlock() {
    if (!confirm(`Block ${username}? You won't see them on the board, in suggestions, or be able to message them anymore.`)) {
      setOpen(false);
      return;
    }
    setBlocking(true);
    try {
      await api.post('/safety/block', { user_id: userId });
      onBlocked?.();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBlocking(false);
      setOpen(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Actions for ${username}`}
        aria-expanded={open}
      >
        ⋯
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.menu} role="menu">
            <button className={styles.menuItem} data-danger onClick={handleBlock} disabled={blocking}>
              {blocking ? 'Blocking…' : 'Block'}
            </button>
            <button className={styles.menuItem} data-danger onClick={() => { setReporting(true); setOpen(false); }}>
              Report
            </button>
            <button className={styles.menuItem} onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </>
      )}

      {reporting && (
        <ReportModal
          userId={userId}
          username={username}
          onClose={() => setReporting(false)}
          onSubmitted={() => { setReporting(false); onBlocked?.(); }}
        />
      )}
    </div>
  );
}

function ReportModal({ userId, username, onClose, onSubmitted }: {
  userId: string;
  username: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!reason) return setError('Pick a reason first');
    setLoading(true);
    setError('');
    try {
      await api.post('/safety/report', { reported_id: userId, reason, details: details || undefined });
      alert(`${username} has been reported and blocked. You won't see them again.`);
      onSubmitted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Report {username}</h3>
        <p className={styles.modalSub}>Reporting also blocks this person immediately.</p>

        <div className={styles.reasonList}>
          {REASONS.map((r) => (
            <button
              key={r.id}
              className={styles.reasonRow}
              data-selected={reason === r.id}
              onClick={() => setReason(r.id)}
            >
              <span className={styles.radio} data-selected={reason === r.id} />
              {r.label}
            </button>
          ))}
        </div>

        <Textarea
          label="Additional details (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Anything that would help us understand what happened"
        />

        {error && <p className={styles.error}>{error}</p>}

        <Button onClick={submit} loading={loading} variant="danger" style={{ width: '100%', marginTop: 8 }}>
          Submit report
        </Button>
        <Button onClick={onClose} variant="ghost" style={{ width: '100%', marginTop: 8 }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
