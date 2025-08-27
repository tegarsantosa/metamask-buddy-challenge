import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWallet } from "../hooks/useWallet";
import { 
  Wallet, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Copy,
  RefreshCw,
  Network,
  TrendingUp,
  History,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatAddress, getChainName, copyToClipboard, formatTransactionHash } from "../utils/walletHelpers";
import { SUPPORTED_CHAINS } from "../utils/constants";

export const WalletCard = () => {
  const { 
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
    switchNetwork,
    isMetamaskInstalled,
    refreshBalance
  } = useWallet();

  const [showTokens, setShowTokens] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (address && await copyToClipboard(address)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwitchNetwork = async (targetChainId: string) => {
    await switchNetwork(targetChainId);
    setShowNetworks(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-crypto">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl font-bold">
            MetaMask Wallet
          </CardTitle>
            {!isConnected && (
              <CardDescription>
                Connect your MetaMask wallet to get started
              </CardDescription>
            )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isMetamaskInstalled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                MetaMask not detected. Please{" "}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  install MetaMask <ExternalLink className="h-3 w-3" />
                </a>{" "}
                to continue.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isConnected && address && (
            <>
              <div className="space-y-3 rounded-lg bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</span>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Address</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-slate-800 px-2 py-1 rounded">
                      {formatAddress(address)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyAddress}
                      className="h-6 w-6 p-0 hover:bg-slate-700"
                    >
                      {copied ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {chainId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Network</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getChainName(chainId)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowNetworks(!showNetworks)}
                        className="h-6 w-6 p-0 hover:bg-slate-700"
                      >
                        <Network className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {showNetworks && (
                  <div className="mt-2 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-2">
                    {SUPPORTED_CHAINS.map((chain) => (
                      <button
                        key={chain.chainId}
                        onClick={() => handleSwitchNetwork(chain.chainId)}
                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-700 transition-colors ${
                          chainId === chain.chainId ? 'bg-blue-700 dark:bg-blue-900' : ''
                        }`}
                      >
                        {chain.name}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {isLoadingBalance ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        `${balance} ETH`
                      )}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={refreshBalance}
                      disabled={isLoadingBalance}
                      className="h-6 w-6 p-0 hover:bg-slate-700"
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>

              {tokenBalances.length > 0 && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowTokens(!showTokens)}
                    className="w-full justify-between p-2 h-auto"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Token Balances (Mock)</span>
                    </div>
                    {showTokens ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  {showTokens && (
                    <div className="space-y-2 pl-4">
                      {tokenBalances.map((token) => (
                        <div key={token.address} className="flex items-center justify-between py-1">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{token.symbol}</span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">{token.name}</span>
                          </div>
                          <span className="text-sm font-mono">{token.balance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {transactions.length > 0 && (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowTransactions(!showTransactions)}
                    className="w-full justify-between p-2 h-auto"
                  >
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      <span className="text-sm font-medium">Recent Transactions (Mock)</span>
                    </div>
                    {showTransactions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  
                  {showTransactions && (
                    <div className="space-y-2 pl-4 max-h-48 overflow-y-auto">
                      {transactions.map((tx) => (
                        <div key={tx.hash} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                          <div className="flex flex-col">
                            <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                              {formatTransactionHash(tx.hash)}
                            </code>
                            <span className="text-xs text-slate-500">
                              {tx.from === address.toLowerCase() ? 'Sent' : 'Received'} {tx.value} ETH
                            </span>
                          </div>
                          <Badge 
                            variant={tx.status === 'success' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connect}
                disabled={!isMetamaskInstalled || isConnecting}
                className="flex-1 bg-gradient-crypto hover:shadow-glow transition-all duration-200"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={disconnect}
                className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-700"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};