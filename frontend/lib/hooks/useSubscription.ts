'use client';

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { getPaymentManagerContract } from '../contracts';
import type { Subscription } from '../types';

export function useSubscription(subscriptionId: number | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  useEffect(() => {
    if (subscriptionId === null || !publicClient) return;

    const fetchSubscription = async () => {
      setLoading(true);
      setError(null);

      try {
        const contract = getPaymentManagerContract(publicClient);
        const data = await contract.getSubscription(subscriptionId);

        setSubscription({
          id: subscriptionId,
          subscriber: data.subscriber,
          creator: data.creator,
          paymentToken: data.paymentToken,
          amount: data.amount.toString(),
          interval: Number(data.interval),
          nextPaymentDue: Number(data.nextPaymentDue),
          isActive: data.isActive,
          startTime: Number(data.startTime),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscriptionId, publicClient]);

  return { subscription, loading, error };
}

export function useUserSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!address || !publicClient) return;

    const fetchSubscriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const contract = getPaymentManagerContract(publicClient);
        const subIds = await contract.getSubscriberSubscriptions(address);

        const subs = await Promise.all(
          subIds.map(async (id) => {
            const data = await contract.getSubscription(id);
            return {
              id: Number(id),
              subscriber: data.subscriber,
              creator: data.creator,
              paymentToken: data.paymentToken,
              amount: data.amount.toString(),
              interval: Number(data.interval),
              nextPaymentDue: Number(data.nextPaymentDue),
              isActive: data.isActive,
              startTime: Number(data.startTime),
            };
          })
        );

        setSubscriptions(subs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [address, publicClient]);

  return { subscriptions, loading, error };
}

export function useCreatorSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!address || !publicClient) return;

    const fetchSubscriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const contract = getPaymentManagerContract(publicClient);
        const subIds = await contract.getCreatorSubscriptions(address);

        const subs = await Promise.all(
          subIds.map(async (id) => {
            const data = await contract.getSubscription(id);
            return {
              id: Number(id),
              subscriber: data.subscriber,
              creator: data.creator,
              paymentToken: data.paymentToken,
              amount: data.amount.toString(),
              interval: Number(data.interval),
              nextPaymentDue: Number(data.nextPaymentDue),
              isActive: data.isActive,
              startTime: Number(data.startTime),
            };
          })
        );

        setSubscriptions(subs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [address, publicClient]);

  return { subscriptions, loading, error };
}


