declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  address: string;
  name: string;
  decimals: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  gasUsed?: string;
  gasPrice?: string;
}

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}

export interface WalletState {
  address: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string;
  chainId: string;
  balance: string;
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  isLoadingBalance: boolean;
}

export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: string) => Promise<void>;
  refreshBalance: () => void;
  isMetamaskInstalled: boolean;
}