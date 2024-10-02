import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Subscriber {
  id: string;
  address: string;
  amount: bigint;
  startDate: number;
  status: string;
}

interface CreatorStats {
  totalSubscribers: number;
  activeSubscribers: number;
  monthlyRevenue: bigint;
  totalRevenue: bigint;
}

export const CreatorDashboard: React.FC = () => {
  const [stats, setStats] = useState<CreatorStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0n,
    totalRevenue: 0n,
  });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // This would connect to your smart contract
    // Placeholder implementation
    setLoading(false);
  };

  const formatAmount = (amount: bigint): string => {
    return ethers.formatEther(amount);
  };

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Total Subscribers</p>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalSubscribers}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Active Subscribers</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.activeSubscribers}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Monthly Revenue</p>
          <p className="text-3xl font-bold text-purple-600">
            {formatAmount(stats.monthlyRevenue)} USDC
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-indigo-600">
            {formatAmount(stats.totalRevenue)} USDC
          </p>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Subscribers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No subscribers yet
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {shortenAddress(subscriber.address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatAmount(subscriber.amount)} USDC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(subscriber.startDate * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          subscriber.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;

