import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider, noFlashScript } from '../components/ThemeProvider';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

// Display face: Bricolage Grotesque carries the personality of the page —
// a little mechanical, a little playful, distinct from the Inter-everywhere
// default. Used only for headlines, set with restraint.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

// Body face: IBM Plex Sans reads calmly at small sizes and pairs well
// against Bricolage's geometry without competing with it.
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

// Utility/mono face: reserved for the skill-bracket readouts and stat
// labels — a data-console feel that fits a matchmaking product without
// tipping into generic "gamer font" territory.
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['500', '600'],
});

export const metadata: Metadata = {
  title: 'Lobby — Find your next teammate',
  description: 'Post what you\u2019re looking for, get matched by skill range, and squad up. No tryouts required.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
