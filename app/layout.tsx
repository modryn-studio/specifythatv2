import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpecifyThat | Planning & Prompt Engine',
  description: 'Transform raw ideas into build-ready specs in under 60 seconds. Optimized for Cursor, Claude, ChatGPT, Bolt, v0 & Emergent.',
  keywords: ['spec generator', 'AI', 'project planning', 'prompt engineering', 'development specs'],
  authors: [{ name: 'SpecifyThat' }],
  openGraph: {
    title: 'SpecifyThat | Planning & Prompt Engine',
    description: 'Transform raw ideas into build-ready specs in under 60 seconds',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpecifyThat | Planning & Prompt Engine',
    description: 'Transform raw ideas into build-ready specs in under 60 seconds',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-dark-900 text-white antialiased`}>
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-dark-900 via-dark-900 to-accent-900/20 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
