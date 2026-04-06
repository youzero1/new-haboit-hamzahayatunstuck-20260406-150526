import type { Metadata } from 'next';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('./globals.css');

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your habits and build streaks'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
