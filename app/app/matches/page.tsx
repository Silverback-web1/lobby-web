'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Card, Badge, Avatar, EmptyState } from '../../../components/ui';
import styles from './matches.module.css';

interface Match { id: string; status: string; created_at: string }

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Match[]>('/matches').catch(() => []).then((data) => {
      setMatches(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className={styles.status}>Loading…</p>;

  if (matches.length === 0) {
    return <EmptyState icon="💬" title="No matches yet" body="Reach out to a player on the board or check your suggestions." />;
  }

  return (
    <div>
      {matches.map((m) => (
        <Link key={m.id} href={`/app/matches/${m.id}`}>
          <Card className={styles.matchCard}>
            <Avatar username="??" size={44} />
            <div className={styles.matchText}>
              <strong>Match</strong>
              <span className={styles.date}>Started {new Date(m.created_at).toLocaleDateString()}</span>
            </div>
            <Badge label={m.status} color={m.status === 'active' ? 'success' : 'neutral'} />
          </Card>
        </Link>
      ))}
    </div>
  );
}
