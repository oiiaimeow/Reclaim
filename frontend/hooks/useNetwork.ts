import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useNetwork = () => {
  const [chainId, setChainId] = useState<number | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    checkNetwork();
    setupListeners();

    return () => {
      removeListeners();
    };
  }, []);

  const checkNetwork = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) return;

      const provider = new ethers.BrowserProvider(ethereum);
      const network = await provider.getNetwork();
      const networkId = Number(network.chainId);

      setChainId(networkId);
      
      const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 11155111);
      setIsCorrectNetwork(networkId === targetChainId);
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const setupListeners = () => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    ethereum.on('chainChanged', handleChainChanged);
  };

  const removeListeners = () => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    ethereum.removeListener('chainChanged', handleChainChanged);
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  return { chainId, isCorrectNetwork };
};

export default useNetwork;

