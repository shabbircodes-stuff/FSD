import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'PARADOX — The Last Light at Bellweather', description: 'Every truth leaves a trace. Investigate Case 001 at Bellweather Museum.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
