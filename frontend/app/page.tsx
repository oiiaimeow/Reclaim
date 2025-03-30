'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-3xl font-bold text-white">Reclaim</div>
        <ConnectButton />
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Decentralized Subscription Platform
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Support your favorite creators with automated recurring payments powered by
            blockchain technology and Account Abstraction
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/subscribe"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              Browse Creators
            </Link>
            <Link
              href="/creator"
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded-lg transition"
            >
              Become a Creator
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Automated Payments
            </h3>
            <p className="text-gray-300">
              Set up once and forget. Smart contracts handle recurring payments
              automatically using ERC-4337 Account Abstraction
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Multi-Currency Support
            </h3>
            <p className="text-gray-300">
              Pay with your preferred stablecoin. USDC, USDT, DAI, and more are
              supported
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Secure & Transparent
            </h3>
            <p className="text-gray-300">
              All transactions are on-chain and verifiable. Cancel anytime with
              built-in refund mechanisms
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-purple-800/30 rounded-lg p-6">
              <div className="text-5xl font-bold text-purple-400 mb-4">1</div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Connect Wallet
              </h4>
              <p className="text-gray-300">
                Connect your Web3 wallet to get started
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-lg p-6">
              <div className="text-5xl font-bold text-purple-400 mb-4">2</div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Choose Creator
              </h4>
              <p className="text-gray-300">
                Browse and select creators you want to support
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-lg p-6">
              <div className="text-5xl font-bold text-purple-400 mb-4">3</div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Set Subscription
              </h4>
              <p className="text-gray-300">
                Configure payment amount and billing frequency
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-lg p-6">
              <div className="text-5xl font-bold text-purple-400 mb-4">4</div>
              <h4 className="text-xl font-semibold text-white mb-2">
                Auto-Payment
              </h4>
              <p className="text-gray-300">
                Sit back as smart contracts handle everything
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-6 py-8 border-t border-white/10 mt-20">
        <div className="text-center text-gray-400">
          <p>© 2024 Reclaim. Built with ❤️ on Ethereum</p>
        </div>
      </footer>
    </main>
  );
}


