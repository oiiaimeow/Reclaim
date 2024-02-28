'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

interface UserSubscription {
  id: number;
  creator: string;
  creatorName: string;
  amount: string;
  interval: string;
  nextPayment: string;
  totalPaid: string;
  status: 'Active' | 'Cancelled' | 'Paused';
}

const mockSubscriptions: UserSubscription[] = [
  {
    id: 1,
    creator: '0x1234...5678',
    creatorName: 'Tech Insights Daily',
    amount: '10',
    interval: 'Monthly',
    nextPayment: '2024-07-15',
    totalPaid: '60',
    status: 'Active',
  },
  {
    id: 2,
    creator: '0x2345...6789',
    creatorName: 'DeFi Research Hub',
    amount: '25',
    interval: 'Monthly',
    nextPayment: '2024-07-20',
    totalPaid: '100',
    status: 'Active',
  },
  {
    id: 3,
    creator: '0x4567...8901',
    creatorName: 'Web3 Developer Tutorials',
    amount: '20',
    interval: 'Monthly',
    nextPayment: '-',
    totalPaid: '40',
    status: 'Cancelled',
  },
];

export default function UserDashboard() {
  const activeSubscriptions = mockSubscriptions.filter(
    (s) => s.status === 'Active'
  ).length;

  const monthlySpend = mockSubscriptions
    .filter((s) => s.status === 'Active')
    .reduce((sum, s) => sum + parseFloat(s.amount), 0);

  const totalSpent = mockSubscriptions.reduce(
    (sum, s) => sum + parseFloat(s.totalPaid),
    0
  );

  const handleCancelSubscription = (id: number) => {
    console.log('Cancelling subscription:', id);
    // TODO: Implement actual cancellation logic
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-white">
          Reclaim
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/subscribe" className="text-white hover:text-purple-300">
            Browse Creators
          </Link>
          <Link href="/creator" className="text-white hover:text-purple-300">
            Creator Dashboard
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-white mb-4">My Subscriptions</h1>
        <p className="text-xl text-gray-300 mb-12">
          Manage your active subscriptions and track your spending
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <p className="text-gray-400 mb-2">Active Subscriptions</p>
            <p className="text-4xl font-bold text-white">{activeSubscriptions}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <p className="text-gray-400 mb-2">Monthly Spending</p>
            <p className="text-4xl font-bold text-white">${monthlySpend}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <p className="text-gray-400 mb-2">Total Spent</p>
            <p className="text-4xl font-bold text-white">${totalSpent}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-6">
            Your Subscriptions
          </h3>
          <div className="space-y-4">
            {mockSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">
                      {subscription.creatorName}
                    </h4>
                    <p className="text-gray-400 font-mono text-sm">
                      {subscription.creator}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subscription.status === 'Active'
                        ? 'bg-green-500/20 text-green-400'
                        : subscription.status === 'Paused'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {subscription.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-white font-semibold">
                      ${subscription.amount} USDC
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Interval</p>
                    <p className="text-white font-semibold">
                      {subscription.interval}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Next Payment</p>
                    <p className="text-white font-semibold">
                      {subscription.nextPayment}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Paid</p>
                    <p className="text-white font-semibold">
                      ${subscription.totalPaid}
                    </p>
                  </div>
                </div>

                {subscription.status === 'Active' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCancelSubscription(subscription.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                    >
                      Cancel Subscription
                    </button>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
                      Request Refund
                    </button>
                  </div>
                )}

                {subscription.status === 'Cancelled' && (
                  <p className="text-gray-400 text-sm">
                    This subscription has been cancelled
                  </p>
                )}
              </div>
            ))}
          </div>

          {mockSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">
                You don't have any subscriptions yet
              </p>
              <Link
                href="/subscribe"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
              >
                Browse Creators
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

