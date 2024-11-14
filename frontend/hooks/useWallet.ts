import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<bigint>(0n);
  const [chainId, setChainId] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
    setupListeners();

    return () => {
      removeListeners();
    };
  }, []);

  const checkConnection = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) return;

      const provider = new ethers.BrowserProvider(ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const bal = await provider.getBalance(addr);
        const network = await provider.getNetwork();

        setAddress(addr);
        setBalance(bal);
        setChainId(Number(network.chainId));
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      const { ethereum } = window as any;

      if (!ethereum) {
        alert('Please install MetaMask');
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send('eth_requestAccounts', []);

      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const bal = await provider.getBalance(addr);
      const network = await provider.getNetwork();

      setAddress(addr);
      setBalance(bal);
      setChainId(Number(network.chainId));
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress('');
    setBalance(0n);
    setChainId(0);
    setIsConnected(false);
  };

  const switchNetwork = async (targetChainId: number) => {
    try {
      const { ethereum } = window as any;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        alert('Please add this network to MetaMask');
      }
      throw error;
    }
  };

  const setupListeners = () => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);
  };

  const removeListeners = () => {
    const { ethereum } = window as any;
    if (!ethereum) return;

    ethereum.removeListener('accountsChanged', handleAccountsChanged);
    ethereum.removeListener('chainChanged', handleChainChanged);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  return {
    address,
    balance,
    chainId,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
  };
};

export default useWallet;

