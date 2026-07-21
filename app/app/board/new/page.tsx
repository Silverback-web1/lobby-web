'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Button, Input, Textarea } from '../../../../components/ui';
import styles from './new.module.css';

interface Game { id: string; name: string }

const VOICE_OPTIONS = ['none', 'optional', 'required'] as const;
const STYLE_OPTIONS = ['casual', 'competitive'] as const;

export default function CreatePostPage() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState('');
  const [mySkill, setMySkill] = useState(5);
  const [skillMin, setSkillMin] = useState(1);
  const [skillMax, setSkillMax] = useState(10);
  const [voiceChat, setVoiceChat] = useState<typeof VOICE_OPTIONS[number]>('optional');
  const [playStyle, setPlayStyle] = useState<typeof STYLE_OPTIONS[number]>('casual');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Game[]>('/games').then((data) => {
      setGames(data);
      if (data[0]) setGameId(data[0].id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gameId) return setError('Pick a game first');
    setError('');
    setLoading(true);
    try {
      await api.post('/lfg', {
        game_id: gameId,
        skill_level: mySkill,
        looking_for_skill_min: skillMin,
        looking_for_skill_max: skillMax,
        voice_chat: voiceChat,
        play_style: playStyle,
        region: region || undefined,
        description: description || undefined,
      });
      router.push('/app/board');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={styles.title}>Post to the board</h1>

      <label className={styles.label}>Game</label>
      <select className={styles.select} value={gameId} onChange={(e) => setGameId(e.target.value)}>
        {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      <label className={styles.label}>Your skill level: {mySkill}/10</label>
      <input type="range" min={1} max={10} value={mySkill} onChange={(e) => setMySkill(Number(e.target.value))} className={styles.slider} />

      <label className={styles.label}>Skill range you'll play with: {skillMin}–{skillMax}</label>
      <div className={styles.rangeRow}>
        <input type="range" min={1} max={skillMax} value={skillMin} onChange={(e) => setSkillMin(Number(e.target.value))} className={styles.slider} />
        <input type="range" min={skillMin} max={10} value={skillMax} onChange={(e) => setSkillMax(Number(e.target.value))} className={styles.slider} />
      </div>

      <label className={styles.label}>Voice chat</label>
      <div className={styles.pillRow}>
        {VOICE_OPTIONS.map((v) => (
          <button type="button" key={v} className={styles.pill} data-active={voiceChat === v} onClick={() => setVoiceChat(v)}>
            {v}
          </button>
        ))}
      </div>

      <label className={styles.label}>Play style</label>
      <div className={styles.pillRow}>
        {STYLE_OPTIONS.map((s) => (
          <button type="button" key={s} className={styles.pill} data-active={playStyle === s} onClick={() => setPlayStyle(s)}>
            {s}
          </button>
        ))}
      </div>

      <Input label="Region (optional)" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. East US, EU West" />
      <Textarea label="Say something (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What kind of session are you looking for?" />

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" loading={loading} style={{ width: '100%' }}>Post to the board</Button>
    </form>
  );
}
