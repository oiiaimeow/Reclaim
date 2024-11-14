import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';

export const WalletButton: React.FC = () => {
  const { address, balance, isConnected, isConnecting, connect, disconnect } =
    useWallet();

  const shortenAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: bigint): string => {
    return parseFloat(ethers.formatEther(bal)).toFixed(4);
  };

  if (isConnecting) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed"
      >
        Connecting...
      </button>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <p className="text-sm text-gray-600">Balance</p>
          <p className="font-medium">{formatBalance(balance)} ETH</p>
        </div>
        <button
          onClick={disconnect}
          className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {shortenAddress(address)}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;

