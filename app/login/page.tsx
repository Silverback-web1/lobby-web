'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/ui';
import styles from '../auth.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/app/board');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.logo}>🎮</div>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.sub}>Find your squad. No tryouts required.</p>

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 8 }}>
          Sign in
        </Button>

        <p className={styles.switchLink}>
          No account? <Link href="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
}
