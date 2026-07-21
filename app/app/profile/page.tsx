'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import { Card, Badge, Button, SkillBadge, Avatar } from '../../../components/ui';
import styles from './profile.module.css';

interface Subscription { tier_id: string; tier_name?: string }
interface UserGame { game_name: string; skill_level: number; rank: string | null }
interface BlockedUser { id: string; username: string; blocked_at: string }

const TIERS = [
  { id: 'plus', name: 'Plus', price: '$4.99/mo', features: ['Unlimited LFG posts', 'See who viewed your profile', 'Priority placement'] },
  { id: 'pro', name: 'Pro', price: '$9.99/mo', features: ['Everything in Plus', 'Advanced filters', 'Verified skill badge'] },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [games, setGames] = useState<UserGame[]>([]);
  const [blocked, setBlocked] = useState<BlockedUser[]>([]);
  const [unblocking, setUnblocking] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Subscription>('/subscriptions/me').then(setSub).catch(console.error);
    api.get<UserGame[]>('/users/me/games').then(setGames).catch(console.error);
    api.get<BlockedUser[]>('/safety/blocked').then(setBlocked).catch(console.error);
  }, []);

  async function unblock(u: BlockedUser) {
    setUnblocking(u.id);
    try {
      await api.delete(`/safety/block/${u.id}`);
      setBlocked((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUnblocking(null);
    }
  }

  async function startCheckout(tierId: string) {
    setCheckingOut(tierId);
    setError('');
    try {
      const { url } = await api.post<{ url: string }>('/subscriptions/checkout', {
        tier_id: tierId,
        success_url: `${window.location.origin}/app/profile?checkout=success`,
        cancel_url: `${window.location.origin}/app/profile?checkout=canceled`,
      });
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setCheckingOut(null);
    }
  }

  const tierLabel = sub?.tier_id === 'pro' ? 'Pro' : sub?.tier_id === 'plus' ? 'Plus' : 'Free';
  const tierColor = sub?.tier_id === 'pro' ? 'danger' : sub?.tier_id === 'plus' ? 'brand' : 'neutral';

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.avatarLarge}>{user?.username.slice(0, 2).toUpperCase()}</div>
        <h1 className={styles.name}>{user?.username}</h1>
        <p className={styles.email}>{user?.email}</p>
        <Badge label={`${tierLabel} tier`} color={tierColor} />
      </div>

      <h2 className={styles.sectionTitle}>Your games</h2>
      {games.length === 0
        ? <p className={styles.muted}>No games added yet.</p>
        : games.map((g) => (
          <Card key={g.game_name} className={styles.gameCard}>
            <div className={styles.gameText}>
              <strong>{g.game_name}</strong>
              {g.rank && <span className={styles.rank}>{g.rank}</span>}
            </div>
            <SkillBadge level={g.skill_level} />
          </Card>
        ))
      }

      <h2 className={styles.sectionTitle}>Blocked users</h2>
      {blocked.length === 0
        ? <p className={styles.muted}>Nobody's blocked. Anyone you block or report shows up here.</p>
        : blocked.map((u) => (
          <Card key={u.id} className={styles.gameCard}>
            <div className={styles.blockedRow}>
              <Avatar username={u.username} size={32} />
              <span>{u.username}</span>
            </div>
            <Button
              variant="secondary"
              loading={unblocking === u.id}
              onClick={() => unblock(u)}
            >
              Unblock
            </Button>
          </Card>
        ))
      }

      <h2 className={styles.sectionTitle}>Upgrade</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.tierGrid}>
        {TIERS.map((tier) => (
          <Card key={tier.id} className={styles.tierCard} data-active={sub?.tier_id === tier.id}>
            <strong className={styles.tierName}>{tier.name}</strong>
            <span className={styles.tierPrice}>{tier.price}</span>
            <ul className={styles.tierFeatures}>
              {tier.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Button
              loading={checkingOut === tier.id}
              disabled={sub?.tier_id === tier.id}
              onClick={() => startCheckout(tier.id)}
              style={{ width: '100%' }}
            >
              {sub?.tier_id === tier.id ? 'Current plan' : `Subscribe to ${tier.name}`}
            </Button>
          </Card>
        ))}
      </div>

      <Button variant="danger" onClick={logout} style={{ marginTop: 24 }}>Sign out</Button>
    </div>
  );
}
