'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import styles from './app-layout.module.css';

const NAV = [
  { href: '/app/board', label: 'Board' },
  { href: '/app/for-you', label: 'For You' },
  { href: '/app/matches', label: 'Matches' },
  { href: '/app/profile', label: 'Profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/app/board" className={styles.logo}>LOBBY</Link>
        <nav className={styles.nav}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              data-active={pathname?.startsWith(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
