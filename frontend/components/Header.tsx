import React from 'react';
import WalletButton from './WalletButton';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-600">Reclaim</h1>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/subscribe" className="hover:text-blue-600">Subscribe</a>
            <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          </nav>
          <WalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header;

