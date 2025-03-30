'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';

interface Creator {
  address: string;
  name: string;
  description: string;
  monthlyPrice: string;
  subscribers: number;
  category: string;
}

const mockCreators: Creator[] = [
  {
    address: '0x1234...5678',
    name: 'Tech Insights Daily',
    description: 'Daily technical analysis and blockchain news',
    monthlyPrice: '10',
    subscribers: 1250,
    category: 'Technology',
  },
  {
    address: '0x2345...6789',
    name: 'DeFi Research Hub',
    description: 'In-depth DeFi protocol research and analysis',
    monthlyPrice: '25',
    subscribers: 890,
    category: 'Finance',
  },
  {
    address: '0x3456...7890',
    name: 'NFT Art Gallery',
    description: 'Exclusive digital art and NFT collections',
    monthlyPrice: '15',
    subscribers: 2100,
    category: 'Art',
  },
  {
    address: '0x4567...8901',
    name: 'Web3 Developer Tutorials',
    description: 'Learn smart contract development step by step',
    monthlyPrice: '20',
    subscribers: 1560,
    category: 'Education',
  },
  {
    address: '0x5678...9012',
    name: 'Crypto Market Insights',
    description: 'Market analysis and trading strategies',
    monthlyPrice: '30',
    subscribers: 780,
    category: 'Finance',
  },
  {
    address: '0x6789...0123',
    name: 'Blockchain Gaming News',
    description: 'Latest updates in Web3 gaming and metaverse',
    monthlyPrice: '12',
    subscribers: 1890,
    category: 'Gaming',
  },
];

export default function SubscribePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Technology', 'Finance', 'Art', 'Education', 'Gaming'];

  const filteredCreators =
    selectedCategory === 'All'
      ? mockCreators
      : mockCreators.filter((c) => c.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-white">
          Reclaim
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-white hover:text-purple-300">
            My Subscriptions
          </Link>
          <Link href="/creator" className="text-white hover:text-purple-300">
            Creator Dashboard
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-white mb-4">Browse Creators</h1>
        <p className="text-xl text-gray-300 mb-12">
          Discover and support amazing content creators with decentralized subscriptions
        </p>

        <div className="flex gap-3 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {creator.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-purple-600/50 text-purple-200 rounded-full text-sm">
                    {creator.category}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{creator.description}</p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-3xl font-bold text-white">
                    ${creator.monthlyPrice}
                    <span className="text-sm text-gray-400">/month</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Subscribers</p>
                  <p className="text-white font-semibold">{creator.subscribers}</p>
                </div>
              </div>

              <Link
                href={`/subscribe/${creator.address}`}
                className="block w-full text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
              >
                Subscribe Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


