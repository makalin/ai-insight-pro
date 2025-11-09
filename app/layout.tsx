import type { Metadata } from 'next';
import './globals.css';
import ThemeProvider from './components/ThemeProvider';

export const metadata: Metadata = {
  title: 'AI Insight Pro - Professional AI-Image Authenticity Analyzer',
  description:
    'Analyze uploaded photos to estimate the likelihood that they were AI-generated or manipulated. Get detailed confidence metrics, metadata analysis, and downloadable PDF reports.',
  keywords: [
    'AI detection',
    'image authenticity',
    'deepfake detection',
    'AI-generated image',
    'image analysis',
    'metadata extraction',
  ],
  authors: [{ name: 'Mehmet T. Akalın' }],
  openGraph: {
    title: 'AI Insight Pro - Professional AI-Image Authenticity Analyzer',
    description:
      'Analyze uploaded photos to estimate the likelihood that they were AI-generated or manipulated.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

