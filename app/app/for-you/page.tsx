'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Card, Badge, SkillBadge, Avatar, Button, EmptyState } from '../../../components/ui';
import { SafetyMenu } from '../../../components/SafetyMenu';
import styles from './for-you.module.css';

interface Suggestion {
  score: number;
  post: {
    id: string;
    user_id: string;
    username: string;
    game_name: string;
    skill_level: number;
    region: string | null;
    voice_chat: string;
    play_style: string;
    description: string | null;
  };
}

interface UserPost { id: string; game_name: string; skill_level: number; status: string }

export default function ForYouPage() {
  const router = useRouter();
  const [myPosts, setMyPosts] = useState<UserPost[]>([]);
  const [selected, setSelected] = useState<UserPost | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    api.get<UserPost[]>('/lfg?my=true')
      .catch(() => [])
      .then((posts) => {
        const open = posts.filter((p) => p.status === 'open');
        setMyPosts(open);
        if (open[0]) loadSuggestions(open[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function loadSuggestions(post: UserPost) {
    setSelected(post);
    setLoadingSuggestions(true);
    const data = await api.get<Suggestion[]>(`/lfg/${post.id}/suggestions`).catch(() => []);
    setSuggestions(data);
    setLoadingSuggestions(false);
  }

  async function connect(s: Suggestion) {
    setConnecting(s.post.id);
    try {
      const match = await api.post<{ id: string }>('/matches', { their_post_id: s.post.id, my_post_id: selected?.id });
      router.push(`/app/matches/${match.id}`);
    } finally {
      setConnecting(null);
    }
  }

  function scoreLabel(score: number) {
    if (score >= 25) return { label: 'Great match', color: 'success' as const };
    if (score >= 15) return { label: 'Good match', color: 'brand' as const };
    return { label: 'Decent match', color: 'neutral' as const };
  }

  if (loading) return <p className={styles.status}>Loading…</p>;

  if (myPosts.length === 0) {
    return (
      <>
        <EmptyState icon="🔍" title="No open posts" body="Post to the board first and the system will find compatible players for you." />
        <Link href="/app/board/new"><Button style={{ width: '100%' }}>Go post</Button></Link>
      </>
    );
  }

  return (
    <div>
      {myPosts.length > 1 && (
        <div className={styles.postPicker}>
          {myPosts.map((p) => (
            <button
              key={p.id}
              className={styles.postChip}
              data-active={selected?.id === p.id}
              onClick={() => loadSuggestions(p)}
            >
              {p.game_name} · skill {p.skill_level}
            </button>
          ))}
        </div>
      )}

      {loadingSuggestions ? (
        <p className={styles.status}>Finding players…</p>
      ) : suggestions.length === 0 ? (
        <EmptyState icon="🔍" title="No matches yet" body="Check back soon, or broaden your skill range." />
      ) : (
        suggestions.map((s) => {
          const { label, color } = scoreLabel(s.score);
          return (
            <Card key={s.post.id}>
              <div className={styles.row}>
                <Avatar username={s.post.username} size={36} />
                <div className={styles.rowText}>
                  <strong>{s.post.username}</strong>
                  <span className={styles.gameLine}>{s.post.game_name}</span>
                </div>
                <Badge label={label} color={color} />
                <SafetyMenu
                  userId={s.post.user_id}
                  username={s.post.username}
                  onBlocked={() => setSuggestions((prev) => prev.filter((x) => x.post.user_id !== s.post.user_id))}
                />
              </div>

              <div className={styles.tags}>
                <SkillBadge level={s.post.skill_level} />
                <Badge label={s.post.play_style} color="neutral" />
                <Badge label={`${s.post.voice_chat} mic`} color="neutral" />
                {s.post.region && <Badge label={`📍 ${s.post.region}`} color="neutral" />}
              </div>

              {s.post.description && <p className={styles.description}>{s.post.description}</p>}

              <Button loading={connecting === s.post.id} onClick={() => connect(s)} style={{ width: '100%' }}>
                Connect
              </Button>
            </Card>
          );
        })
      )}
    </div>
  );
}
