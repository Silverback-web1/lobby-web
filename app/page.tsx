import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import { SkillBracket } from '../components/SkillBracket';
import styles from './page.module.css';

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    features: ['Browse and post to the board', 'Automatic match suggestions', 'Unlimited chat with matches'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$4.99/mo',
    features: ['Unlimited LFG posts', 'See who viewed your profile', 'Priority placement on the board'],
    featured: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99/mo',
    features: ['Everything in Plus', 'Advanced matchmaking filters', 'Verified skill badge'],
  },
];

const STEPS = [
  { n: '01', title: 'Post what you\u2019re looking for', body: 'Pick a game, rate your own skill, and set the range you\u2019re willing to play with. Takes under a minute.' },
  { n: '02', title: 'Get matched or browse', body: 'The board ranks compatible players automatically, or scroll and reach out to anyone yourself.' },
  { n: '03', title: 'Chat and squad up', body: 'Message right in the app, agree on a time, and go play. No skill gate at the door.' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>LOBBY</span>
        <nav className={styles.nav}>
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <Link href="/login" className={styles.navLoginLink}>Sign in</Link>
          <Link href="/signup" className={styles.navCta}>Get started</Link>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>MATCHMAKING, NOT TRYOUTS</span>
            <h1 className={styles.h1}>Find your next teammate,<br />not a tryout.</h1>
            <p className={styles.heroSub}>
              Post what you\u2019re looking for and get matched by skill range \u2014 automatically,
              or by browsing the board yourself. Every skill level welcome, every time.
            </p>
            <div className={styles.heroActions}>
              <Link href="/signup" className={styles.primaryBtn}>Get started free</Link>
              <a href="#how-it-works" className={styles.ghostBtn}>See how it works</a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <SkillBracket />
          </div>
        </section>

        <section id="how-it-works" className={styles.steps}>
          {STEPS.map((step) => (
            <div key={step.n} className={styles.step}>
              <span className={styles.stepNumber}>{step.n}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className={styles.pricing}>
          <h2 className={styles.h2}>Pick your tier</h2>
          <p className={styles.pricingSub}>Matching is free, always. Upgrade for priority and better visibility.</p>
          <div className={styles.tierGrid}>
            {TIERS.map((tier) => (
              <div key={tier.id} className={styles.tierCard} data-featured={!!tier.featured}>
                {tier.featured && <span className={styles.tierBadge}>Most popular</span>}
                <h3 className={styles.tierName}>{tier.name}</h3>
                <p className={styles.tierPrice}>{tier.price}</p>
                <ul className={styles.tierFeatures}>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href={tier.id === 'free' ? '/signup' : '/app/profile'}
                  className={styles.tierCta}
                >
                  {tier.id === 'free' ? 'Create free account' : 'Choose ' + tier.name}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Lobby</span>
        <div className={styles.footerLinks}>
          <Link href="/privacy">Privacy</Link>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
  );
}
