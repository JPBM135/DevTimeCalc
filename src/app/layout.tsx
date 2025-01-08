import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Freelance Hour Calculator',
  description: 'Calculate your dev hours for freelance projects.',
  openGraph: {
    title: 'Freelance Hour Calculator',
    description: 'Calculate your dev hours for freelance projects.',
    url: 'https://dev-hours.jpbm.dev',
    type: 'website',
    images: []
  },
  twitter: {
    site: '@borges135_',
    title: 'Dev Hour Calculator',
    description: 'Calculate your dev hours for freelance projects.'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>{children}</body>
    </html>
  );
}
