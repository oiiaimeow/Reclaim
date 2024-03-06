'use client';

import Link from 'next/link';

interface SubscriptionCardProps {
  address: string;
  name: string;
  description: string;
  monthlyPrice: string;
  subscribers: number;
  category: string;
}

export default function SubscriptionCard({
  address,
  name,
  description,
  monthlyPrice,
  subscribers,
  category,
}: SubscriptionCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
          <span className="inline-block px-3 py-1 bg-purple-600/50 text-purple-200 rounded-full text-sm">
            {category}
          </span>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{description}</p>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-3xl font-bold text-white">
            ${monthlyPrice}
            <span className="text-sm text-gray-400">/month</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Subscribers</p>
          <p className="text-white font-semibold">{subscribers}</p>
        </div>
      </div>

      <Link
        href={`/subscribe/${address}`}
        className="block w-full text-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
      >
        Subscribe Now
      </Link>
    </div>
  );
}

