import React, { useState } from 'react';
import { ethers } from 'ethers';
import { createSubscription, approveToken } from '../utils/contractHelpers';

interface SubscribeFormProps {
  creatorAddress?: string;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: Error) => void;
}

export const SubscribeForm: React.FC<SubscribeFormProps> = ({
  creatorAddress: initialCreator = '',
  onSuccess,
  onError,
}) => {
  const [creatorAddress, setCreatorAddress] = useState(initialCreator);
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('monthly');
  const [token, setToken] = useState('USDC');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'approving' | 'subscribing'>('form');

  const intervalSeconds: Record<string, number> = {
    daily: 86400,
    weekly: 604800,
    monthly: 2592000,
    yearly: 31536000,
  };

  const tokenAddresses: Record<string, string> = {
    USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '',
    USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '',
    DAI: process.env.NEXT_PUBLIC_DAI_ADDRESS || '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!creatorAddress || !amount || !interval) {
      alert('Please fill in all fields');
      return;
    }

    if (!ethers.isAddress(creatorAddress)) {
      alert('Invalid creator address');
      return;
    }

    try {
      setIsLoading(true);
      const { ethereum } = window as any;
      
      if (!ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const amountWei = ethers.parseEther(amount);
      const tokenAddress = tokenAddresses[token];
      const paymentManagerAddress = process.env.NEXT_PUBLIC_PAYMENT_MANAGER_ADDRESS || '';

      // Step 1: Approve token
      setStep('approving');
      const approveTx = await approveToken(
        signer,
        tokenAddress,
        paymentManagerAddress,
        amountWei
      );
      await approveTx.wait();

      // Step 2: Create subscription
      setStep('subscribing');
      const tx = await createSubscription(
        signer,
        creatorAddress,
        tokenAddress,
        amountWei,
        intervalSeconds[interval]
      );

      const receipt = await tx.wait();

      // Extract subscription ID from event
      const subscriptionId = receipt?.logs[0]?.topics[1] || '0';

      onSuccess?.(subscriptionId);
      
      // Reset form
      setCreatorAddress('');
      setAmount('');
      setInterval('monthly');
      setStep('form');
    } catch (error) {
      console.error('Subscription error:', error);
      onError?.(error as Error);
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Subscribe to Creator</h2>

      {/* Creator Address */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Creator Address
        </label>
        <input
          type="text"
          value={creatorAddress}
          onChange={(e) => setCreatorAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          required
        />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Subscription Amount
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10"
            step="0.01"
            min="0"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            required
          />
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="DAI">DAI</option>
          </select>
        </div>
      </div>

      {/* Interval */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Payment Frequency
        </label>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Summary */}
      {amount && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            You will be charged{' '}
            <span className="font-semibold">
              {amount} {token}
            </span>{' '}
            <span className="font-semibold">{interval}</span>
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {step === 'approving' && 'Approving Token...'}
            {step === 'subscribing' && 'Creating Subscription...'}
          </span>
        ) : (
          'Subscribe Now'
        )}
      </button>

      {/* Info */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        First payment will be processed immediately. Subsequent payments will be charged automatically.
      </p>
    </form>
  );
};

export default SubscribeForm;

