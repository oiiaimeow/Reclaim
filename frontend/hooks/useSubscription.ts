import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  getSubscription,
  getSubscriberSubscriptions,
  getCreatorSubscriptions,
  cancelSubscription,
} from '../utils/contractHelpers';

interface Subscription {
  id: string;
  subscriber: string;
  creator: string;
  paymentToken: string;
  amount: bigint;
  interval: number;
  nextPaymentDue: number;
  isActive: boolean;
  startTime: number;
}

export const useSubscription = (subscriptionId?: string) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (subscriptionId) {
      loadSubscription(subscriptionId);
    }
  }, [subscriptionId]);

  const loadSubscription = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const sub = await getSubscription(provider, parseInt(id));

      setSubscription({
        id,
        ...sub,
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      setError(null);

      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const tx = await cancelSubscription(signer, parseInt(subscription.id));
      await tx.wait();

      // Reload subscription
      await loadSubscription(subscription.id);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    loading,
    error,
    cancel,
    reload: () => subscriptionId && loadSubscription(subscriptionId),
  };
};

export const useSubscriberSubscriptions = (address?: string) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (address) {
      loadSubscriptions(address);
    }
  }, [address]);

  const loadSubscriptions = async (addr: string) => {
    try {
      setLoading(true);
      setError(null);

      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const ids = await getSubscriberSubscriptions(provider, addr);

      const subs = await Promise.all(
        ids.map(async (id) => {
          const sub = await getSubscription(provider, id);
          return {
            id: id.toString(),
            ...sub,
          };
        })
      );

      setSubscriptions(subs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    loading,
    error,
    reload: () => address && loadSubscriptions(address),
  };
};

export const useCreatorSubscriptions = (address?: string) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (address) {
      loadSubscriptions(address);
    }
  }, [address]);

  const loadSubscriptions = async (addr: string) => {
    try {
      setLoading(true);
      setError(null);

      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error('Please install MetaMask');
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const ids = await getCreatorSubscriptions(provider, addr);

      const subs = await Promise.all(
        ids.map(async (id) => {
          const sub = await getSubscription(provider, id);
          return {
            id: id.toString(),
            ...sub,
          };
        })
      );

      setSubscriptions(subs);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    loading,
    error,
    reload: () => address && loadSubscriptions(address),
  };
};

export default useSubscription;

