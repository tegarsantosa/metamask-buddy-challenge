import { CHAIN_NAMES } from './constants';

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getChainName = (chainId: string): string => {
  return CHAIN_NAMES[chainId] || `Unknown Chain (${chainId})`;
};

export const formatBalance = (balance: string, decimals: number = 18): string => {
  const value = parseFloat(balance) / Math.pow(10, decimals);
  return value.toFixed(4);
};

export const formatEthBalance = (balance: string): string => {
  const ethValue = parseFloat(balance) / Math.pow(10, 18);
  return ethValue.toFixed(4);
};

export const isMetamaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.ethereum !== 'undefined' && 
         window.ethereum.isMetaMask;
};

export const getEthereumProvider = () => {
  if (typeof window === 'undefined') return null;
  return window.ethereum;
};

export const switchNetwork = async (chainId: string) => {
  const ethereum = getEthereumProvider();
  if (!ethereum) throw new Error('MetaMask not found');

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      throw new Error('Network not added to MetaMask');
    }
    throw error;
  }
};

export const addNetwork = async (networkConfig: {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}) => {
  const ethereum = getEthereumProvider();
  if (!ethereum) throw new Error('MetaMask not found');

  await ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [networkConfig],
  });
};

export const getTokenBalance = async (
  tokenAddress: string,
  walletAddress: string,
  provider: any
): Promise<string> => {
  // ERC-20 balanceOf function signature
  const balanceOfABI = ["function balanceOf(address) view returns (uint256)"];
  
  try {
    // This would require ethers.js in a real implementation
    // For now, returning mock data
    return "0";
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return "0";
  }
};

export const formatTransactionHash = (hash: string): string => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};