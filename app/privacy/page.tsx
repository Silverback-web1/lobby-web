import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy — Lobby',
  description: 'How Lobby collects, uses, and protects your information.',
};

const SECTIONS = [
  { id: 'who-we-are', title: '1. Who we are' },
  { id: 'what-we-collect', title: '2. Information we collect' },
  { id: 'how-we-use-it', title: '3. How we use your information' },
  { id: 'who-we-share-with', title: '4. Who we share information with' },
  { id: 'what-others-see', title: '5. What other users can see' },
  { id: 'safety', title: '6. Safety, moderation, and blocking' },
  { id: 'retention', title: '7. Data retention' },
  { id: 'your-rights', title: '8. Your rights and choices' },
  { id: 'children', title: "9. Children's privacy" },
  { id: 'security', title: '10. Security' },
  { id: 'international', title: '11. International data transfers' },
  { id: 'changes', title: '12. Changes to this policy' },
  { id: 'contact', title: '13. Contact us' },
];

function Fill({ children }: { children: React.ReactNode }) {
  return <span className={styles.fill}>{children}</span>;
}

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>LOBBY</Link>
      </header>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Table of contents">
          <span className={styles.tocLabel}>ON THIS PAGE</span>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={styles.tocLink}>{s.title}</a>
          ))}
        </nav>

        <main className={styles.content}>
          <h1 className={styles.h1}>Privacy Policy</h1>
          <p className={styles.meta}>
            Effective date: <Fill>[fill in before publishing]</Fill> &middot; Last updated: <Fill>[fill in before publishing]</Fill>
          </p>

          <div className={styles.notice}>
            <strong>Before this goes live:</strong> this document accurately describes
            what the Lobby app and backend actually collect — it isn't generic
            placeholder text. It still isn't a substitute for review by a lawyer,
            and it isn't legal advice. Privacy law (GDPR, CCPA/CPRA, COPPA, and
            Apple's own requirements) varies by where your users are and changes
            over time. Have this reviewed before publishing, and update it any
            time a feature that touches user data changes.
          </div>

          <section id="who-we-are" className={styles.section}>
            <h2 className={styles.h2}>1. Who we are</h2>
            <p>
              Lobby (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) operates the Lobby mobile app and
              website, a service that helps gamers find other gamers to play
              with, matched by game and skill compatibility.
            </p>
            <p>Contact: <Fill>[a real, monitored email address]</Fill></p>
          </section>

          <section id="what-we-collect" className={styles.section}>
            <h2 className={styles.h2}>2. Information we collect</h2>
            <p>We collect only what the app needs to function.</p>

            <h3 className={styles.h3}>Account information</h3>
            <ul>
              <li>Email address and username, collected at signup</li>
              <li>Password — we never store your actual password; we store a one-way cryptographic hash of it (bcrypt), which cannot be reversed to recover the original</li>
            </ul>

            <h3 className={styles.h3}>Profile information (optional, provided by you)</h3>
            <ul>
              <li>Bio, region, timezone, avatar image</li>
            </ul>

            <h3 className={styles.h3}>Gaming information</h3>
            <ul>
              <li>Games you add to your profile and your self-reported skill level, rank, and hours played for each</li>
              <li>Posts you create on the matchmaking board (game, skill range, region, voice chat preference, play style, and any description text you write)</li>
            </ul>

            <h3 className={styles.h3}>Communications</h3>
            <p>
              Messages you send through in-app chat are stored so both
              participants can see conversation history. Messages are visible
              to the match participants and to us for safety/moderation
              purposes (see Section 6).
            </p>

            <h3 className={styles.h3}>Subscription and payment information</h3>
            <p>
              If you subscribe to Plus or Pro, we store your subscription tier
              and status. Payment itself is handled entirely by Apple (via
              In-App Purchase) or Stripe (via web checkout) —{' '}
              <strong>we do not receive or store your card number,
              expiration date, or CVV.</strong> We receive only a subscription
              status and an identifier from Apple/Stripe used to verify your
              subscription.
            </p>

            <h3 className={styles.h3}>Device and technical information</h3>
            <ul>
              <li>A push notification token (if you enable notifications), used solely to deliver notifications about new matches and messages</li>
              <li>Standard technical data any server receives (IP address, general device type) — we do not currently run analytics or advertising SDKs that track you beyond this</li>
            </ul>

            <h3 className={styles.h3}>Safety reports</h3>
            <p>
              If you report another user, we store who reported whom, the
              reason selected, and any details you provide, for moderation
              review.
            </p>
          </section>

          <section id="how-we-use-it" className={styles.section}>
            <h2 className={styles.h2}>3. How we use your information</h2>
            <ul>
              <li>To create and secure your account</li>
              <li>To power matchmaking — comparing your skill range and preferences against other users' posts</li>
              <li>To deliver chat messages between matched users</li>
              <li>To process and verify subscriptions</li>
              <li>To send push notifications you've opted into</li>
              <li>To review safety reports and enforce blocks</li>
              <li>To maintain and improve the service, and detect abuse</li>
            </ul>
            <p>
              We do not sell your personal information, and we do not use
              your data to serve third-party advertising.
            </p>
          </section>

          <section id="who-we-share-with" className={styles.section}>
            <h2 className={styles.h2}>4. Who we share information with</h2>
            <p>We share data only with the services that make Lobby work, and only what each one needs:</p>
            <table className={styles.table}>
              <thead>
                <tr><th>Who</th><th>What they receive</th><th>Why</th></tr>
              </thead>
              <tbody>
                <tr><td>Apple (App Store / StoreKit)</td><td>Purchase/subscription events</td><td>Processing in-app purchases on iOS</td></tr>
                <tr><td>Stripe</td><td>Your email, and payment details you enter directly with Stripe</td><td>Processing web subscription payments</td></tr>
                <tr><td>Expo (push notification service)</td><td>Your device's push token</td><td>Delivering push notifications</td></tr>
                <tr><td>Our hosting/database provider</td><td>All data described above, as the infrastructure it's stored on</td><td>Running the service</td></tr>
              </tbody>
            </table>
            <p>
              We do not share your data with data brokers or advertisers. We
              may disclose information if required by law, to protect user
              safety, or to enforce our terms of service.
            </p>
          </section>

          <section id="what-others-see" className={styles.section}>
            <h2 className={styles.h2}>5. What other users can see</h2>
            <ul>
              <li>Your username, avatar, bio, region (if set), and skill/game information are visible to other users when you post to the board or appear in matchmaking suggestions</li>
              <li>Messages you send are visible to the other participant(s) in that match</li>
              <li>Your email address, password, and exact IP address are <strong>never</strong> shown to other users</li>
            </ul>
          </section>

          <section id="safety" className={styles.section}>
            <h2 className={styles.h2}>6. Safety, moderation, and blocking</h2>
            <p>
              Lobby lets you block or report other users. Reporting a user
              automatically blocks them as well, so you stop seeing them
              immediately. We review reports to enforce our community
              standards and may suspend or remove accounts that violate them.
              Reported content (including message content relevant to a
              report) may be retained longer than normal for moderation and
              safety purposes, even if you later delete your account.
            </p>
          </section>

          <section id="retention" className={styles.section}>
            <h2 className={styles.h2}>7. Data retention</h2>
            <p>
              We retain your information for as long as your account is
              active. If you delete your account, we delete or anonymize your
              personal information within <Fill>[e.g., 30 days]</Fill>, except
              where we're required to retain it longer (for example, records
              connected to an open safety report, or financial records
              required by law).
            </p>
          </section>

          <section id="your-rights" className={styles.section}>
            <h2 className={styles.h2}>8. Your rights and choices</h2>
            <p>
              Depending on where you live, you may have rights to access,
              correct, delete, or export your personal information, and to
              object to or restrict certain processing. To exercise these
              rights, contact us at <Fill>[email]</Fill>. You can also:
            </p>
            <ul>
              <li>Edit your profile information directly in the app</li>
              <li>Unblock users you've previously blocked from your profile settings</li>
              <li>Turn off push notifications in your device settings at any time</li>
              <li>Delete your account by contacting us at <Fill>[email — until an in-app self-service delete flow exists]</Fill></li>
            </ul>
          </section>

          <section id="children" className={styles.section}>
            <h2 className={styles.h2}>9. Children's privacy</h2>
            <p>
              Lobby is not directed at children, and we do not knowingly
              collect personal information from anyone under 13 (or the
              applicable minimum age in your country). If we learn a child
              has provided us personal information, we will delete it.
              Because Lobby involves open communication between strangers, it
              is intended for a mature audience — see the app's age rating on
              the App Store.
            </p>
          </section>

          <section id="security" className={styles.section}>
            <h2 className={styles.h2}>10. Security</h2>
            <p>
              We use industry-standard measures to protect your information,
              including encrypted password storage (bcrypt), encrypted
              connections (HTTPS/TLS) for all data in transit, and
              authenticated access (JWT) to protect API requests. No method
              of storage or transmission is 100% secure, and we can't
              guarantee absolute security.
            </p>
          </section>

          <section id="international" className={styles.section}>
            <h2 className={styles.h2}>11. International data transfers</h2>
            <p>
              If you use Lobby from outside the country where our servers are
              located, your information will be transferred to, stored, and
              processed in that country.{' '}
              <Fill>[fill in specifics once your hosting region/provider is finalized — matters especially for GDPR compliance if you have EU users]</Fill>
            </p>
          </section>

          <section id="changes" className={styles.section}>
            <h2 className={styles.h2}>12. Changes to this policy</h2>
            <p>
              We may update this policy as the app changes. We'll update the
              &ldquo;Last updated&rdquo; date above, and for material changes,
              we'll provide more prominent notice (such as an in-app
              notification).
            </p>
          </section>

          <section id="contact" className={styles.section}>
            <h2 className={styles.h2}>13. Contact us</h2>
            <p>Questions about this policy or your data: <Fill>[email]</Fill></p>
          </section>
        </main>
      </div>
    </div>
  );
}
