import React from 'react';
import { formatEther } from 'ethers';

interface SubscriptionCardProps {
  id: string;
  creator: string;
  amount: bigint;
  interval: number;
  nextPayment: number;
  isActive: boolean;
  token: string;
  onCancel?: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  id,
  creator,
  amount,
  interval,
  nextPayment,
  isActive,
  token,
  onCancel,
}) => {
  const formatInterval = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    if (days === 30) return 'Monthly';
    if (days === 7) return 'Weekly';
    if (days === 1) return 'Daily';
    return `${days} days`;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Subscription #{id}
          </h3>
          <p className="text-sm text-gray-600">
            Creator: {shortenAddress(creator)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">
            {formatEther(amount)} {token}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Frequency:</span>
          <span className="font-medium">{formatInterval(interval)}</span>
        </div>
        {isActive && (
          <div className="flex justify-between">
            <span className="text-gray-600">Next Payment:</span>
            <span className="font-medium">{formatDate(nextPayment)}</span>
          </div>
        )}
      </div>

      {isActive && onCancel && (
        <button
          onClick={() => onCancel(id)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Cancel Subscription
        </button>
      )}
    </div>
  );
};

export default SubscriptionCard;
