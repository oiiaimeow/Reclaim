'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useState } from 'react';

interface Subscriber {
  address: string;
  amount: string;
  startDate: string;
  nextPayment: string;
  status: 'Active' | 'Cancelled';
}

const mockSubscribers: Subscriber[] = [
  {
    address: '0xabcd...1234',
    amount: '10',
    startDate: '2024-01-15',
    nextPayment: '2024-06-15',
    status: 'Active',
  },
  {
    address: '0xbcde...2345',
    amount: '10',
    startDate: '2024-02-20',
    nextPayment: '2024-06-20',
    status: 'Active',
  },
  {
    address: '0xcdef...3456',
    amount: '10',
    startDate: '2024-03-10',
    nextPayment: '2024-06-10',
    status: 'Cancelled',
  },
];

export default function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'settings'>(
    'overview'
  );

  const totalRevenue = mockSubscribers
    .filter((s) => s.status === 'Active')
    .reduce((sum, s) => sum + parseFloat(s.amount), 0);

  const activeSubscribers = mockSubscribers.filter((s) => s.status === 'Active').length;

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
          <Link href="/dashboard" className="text-white hover:text-purple-300">
            My Subscriptions
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-white mb-4">Creator Dashboard</h1>
        <p className="text-xl text-gray-300 mb-12">
          Manage your subscriptions and track your revenue
        </p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'subscribers'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <p className="text-gray-400 mb-2">Active Subscribers</p>
                <p className="text-4xl font-bold text-white">{activeSubscribers}</p>
                <p className="text-green-400 text-sm mt-2">+3 this month</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <p className="text-gray-400 mb-2">Monthly Revenue</p>
                <p className="text-4xl font-bold text-white">${totalRevenue}</p>
                <p className="text-green-400 text-sm mt-2">+15% from last month</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <p className="text-gray-400 mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-white">$240</p>
                <p className="text-gray-400 text-sm mt-2">All time</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Revenue Chart</h3>
              <div className="h-64 flex items-end justify-around gap-4">
                {[45, 62, 58, 73, 89, 95].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                      style={{ height: `${height}%` }}
                    ></div>
                    <p className="text-gray-400 text-sm mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              Subscriber List ({mockSubscribers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Address
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Start Date
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Next Payment
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockSubscribers.map((subscriber, index) => (
                    <tr key={index} className="border-b border-white/10">
                      <td className="py-4 px-4 text-white font-mono">
                        {subscriber.address}
                      </td>
                      <td className="py-4 px-4 text-white">
                        ${subscriber.amount} USDC
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {subscriber.startDate}
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        {subscriber.nextPayment}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            subscriber.status === 'Active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {subscriber.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6">
              Subscription Settings
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Monthly Price (USDC)
                </label>
                <input
                  type="number"
                  defaultValue="10"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Description
                </label>
                <textarea
                  rows={4}
                  defaultValue="Support my work with a monthly subscription"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-semibold">
                  Refund Policy (Days)
                </label>
                <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500">
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


