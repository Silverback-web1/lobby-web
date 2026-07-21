'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { Card, Badge, SkillBadge, Avatar, Button, EmptyState } from '../../../components/ui';
import { SafetyMenu } from '../../../components/SafetyMenu';
import styles from './board.module.css';

interface LfgPost {
  id: string;
  user_id: string;
  username: string;
  game_name: string;
  skill_level: number;
  looking_for_skill_min: number;
  looking_for_skill_max: number;
  region: string | null;
  voice_chat: string;
  play_style: string;
  description: string | null;
  created_at: string;
}

const VOICE_ICON: Record<string, string> = { none: '🔇', optional: '🎙️', required: '🎤' };

export default function BoardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<LfgPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [reachingOut, setReachingOut] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<LfgPost[]>('/lfg')
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function reachOut(post: LfgPost) {
    setReachingOut(post.id);
    try {
      const match = await api.post<{ id: string }>('/matches', { their_post_id: post.id });
      router.push(`/app/matches/${match.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setReachingOut(null);
    }
  }

  return (
    <div>
      <div className={styles.topRow}>
        <h1 className={styles.title}>{loading ? 'Board' : `${posts.length} players looking`}</h1>
        <Link href="/app/board/new"><Button>+ Post</Button></Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {!loading && posts.length === 0 && (
        <EmptyState icon="🎮" title="Nobody's posted yet" body="Be the first. Post that you're looking." />
      )}

      {posts.map((post) => (
        <Card key={post.id}>
          <div className={styles.postHeader}>
            <Avatar username={post.username} size={36} />
            <div className={styles.postHeaderText}>
              <strong>{post.username}</strong>
              <span className={styles.timestamp}>{formatTimeAgo(post.created_at)}</span>
            </div>
            <Badge label={post.game_name} color="brand" />
            <SafetyMenu
              userId={post.user_id}
              username={post.username}
              onBlocked={() => setPosts((prev) => prev.filter((p) => p.user_id !== post.user_id))}
            />
          </div>

          <div className={styles.tags}>
            <SkillBadge level={post.skill_level} />
            <Badge label={post.play_style} color="neutral" />
            <Badge label={`${VOICE_ICON[post.voice_chat]} ${post.voice_chat}`} color="neutral" />
            {post.region && <Badge label={`📍 ${post.region}`} color="neutral" />}
          </div>

          {post.description && <p className={styles.description}>{post.description}</p>}

          <p className={styles.range}>
            Looking for: skill {post.looking_for_skill_min}–{post.looking_for_skill_max}
          </p>

          <Button
            variant="secondary"
            loading={reachingOut === post.id}
            onClick={() => reachOut(post)}
            style={{ width: '100%' }}
          >
            Reach out
          </Button>
        </Card>
      ))}
    </div>
  );
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
