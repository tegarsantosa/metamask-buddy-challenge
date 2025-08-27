import { useState, useEffect, useCallback } from 'react';
import { 
  isMetamaskInstalled, 
  getEthereumProvider, 
  formatEthBalance,
  switchNetwork 
} from '../utils/walletHelpers';
import { WALLET_CONSTANTS, COMMON_TOKENS } from '../utils/constants';

interface TokenBalance {
  symbol: string;
  balance: string;
  address: string;
  name: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

export const useWallet = () => {
  const [address, setAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [chainId, setChainId] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);

  const ethereum = getEthereumProvider();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getAccountInfo = useCallback(async () => {
    if (!ethereum || !isConnected) return;

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setChainId(currentChainId);
        await getBalance(accounts[0]);
        await getTokenBalances(accounts[0]);
      }
    } catch (err: any) {
      console.error('Error getting account info:', err);
      setError(err.message || 'Failed to get account information');
    }
  }, [ethereum, isConnected]);

  const getBalance = useCallback(async (account: string) => {
    if (!ethereum || !account) return;

    setIsLoadingBalance(true);
    try {
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });
      setBalance(formatEthBalance(parseInt(balance, 16).toString()));
    } catch (err: any) {
      console.error('Error getting balance:', err);
      setError('Failed to get balance');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [ethereum]);

  const getTokenBalances = useCallback(async (account: string) => {
    // Mock token balances. In real app, it will connect to the real node and check the balance
    const mockBalances: TokenBalance[] = [
      { symbol: 'USDC', balance: '1250.50', address: COMMON_TOKENS[0].address, name: 'USD Coin' },
      { symbol: 'DAI', balance: '890.25', address: COMMON_TOKENS[1].address, name: 'Dai Stablecoin' },
    ];
    setTokenBalances(mockBalances);
  }, []);

  const connect = useCallback(async () => {
    if (!isMetamaskInstalled()) {
      setError('MetaMask is not installed');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        localStorage.setItem(WALLET_CONSTANTS.STORAGE_KEY, 'true');
        await getAccountInfo();
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  }, [ethereum, getAccountInfo]);

  const disconnect = useCallback(() => {
    setAddress('');
    setIsConnected(false);
    setChainId('');
    setBalance('');
    setTokenBalances([]);
    setTransactions([]);
    setError('');
    localStorage.removeItem(WALLET_CONSTANTS.STORAGE_KEY);
  }, []);

  // Switch network
  const handleSwitchNetwork = useCallback(async (targetChainId: string) => {
    try {
      await switchNetwork(targetChainId);
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    }
  }, []);

  useEffect(() => {
    const wasConnected = localStorage.getItem(WALLET_CONSTANTS.STORAGE_KEY);
    
    if (wasConnected && isMetamaskInstalled()) {
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            getAccountInfo();
          } else {
            localStorage.removeItem(WALLET_CONSTANTS.STORAGE_KEY);
          }
        })
        .catch(console.error);
    }
  }, [ethereum, getAccountInfo]);

  useEffect(() => {
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        getAccountInfo();
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(chainId);
      getAccountInfo();
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [ethereum, address, disconnect, getAccountInfo]);

  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(() => {
      getBalance(address);
    }, WALLET_CONSTANTS.BALANCE_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isConnected, address, getBalance]);

  useEffect(() => {
    if (isConnected) {
      const mockTransactions: Transaction[] = [
        {
          hash: '0x1234567890abcdef1234567890abcdef12345678',
          from: address,
          to: '0xabcdef1234567890abcdef1234567890abcdef12',
          value: '0.5',
          timestamp: Date.now() - 3600000,
          status: 'success'
        },
        {
          hash: '0xabcdef1234567890abcdef1234567890abcdef12',
          from: '0x9876543210fedcba9876543210fedcba98765432',
          to: address,
          value: '1.2',
          timestamp: Date.now() - 7200000,
          status: 'success'
        }
      ];
      setTransactions(mockTransactions);
    }
  }, [isConnected, address]);

  return {
    address,
    isConnected,
    isConnecting,
    error,
    chainId,
    balance,
    tokenBalances,
    transactions,
    isLoadingBalance,
    connect,
    disconnect,
    switchNetwork: handleSwitchNetwork,
    isMetamaskInstalled: isMetamaskInstalled(),
    refreshBalance: () => address && getBalance(address),
  };
};