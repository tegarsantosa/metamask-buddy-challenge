export const CHAIN_NAMES: { [key: string]: string } = {
  '0x1': 'Ethereum Mainnet',
  '0x5': 'Goerli Testnet',
  '0xaa36a7': 'Sepolia Testnet',
};

export const SUPPORTED_CHAINS = [
  { chainId: '0x1', name: 'Ethereum Mainnet', rpcUrl: 'https://mainnet.infura.io/v3/' },
  { chainId: '0x5', name: 'Goerli Testnet', rpcUrl: 'https://goerli.infura.io/v3/' },
  { chainId: '0xaa36a7', name: 'Sepolia Testnet', rpcUrl: 'https://sepolia.infura.io/v3/' },
];

export const COMMON_TOKENS = [
  {
    address: '',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin'
  },
  {
    address: '',
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin'
  },
  {
    address: '',
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD'
  }
];

export const WALLET_CONSTANTS = {
  STORAGE_KEY: 'wallet_connected',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  BALANCE_REFRESH_INTERVAL: 30000,
};