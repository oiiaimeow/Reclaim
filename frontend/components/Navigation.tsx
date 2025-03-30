'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
      <Link href="/" className="text-3xl font-bold text-white hover:text-purple-300 transition">
        Reclaim
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/subscribe" className="text-white hover:text-purple-300 transition">
          Browse Creators
        </Link>
        <Link href="/dashboard" className="text-white hover:text-purple-300 transition">
          My Subscriptions
        </Link>
        <Link href="/creator" className="text-white hover:text-purple-300 transition">
          Creator Dashboard
        </Link>
        <ConnectButton />
      </div>
    </nav>
  );
}


