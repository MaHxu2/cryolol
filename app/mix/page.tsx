"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowDownUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMixer } from '@/hooks/useMixer';
import { useSwap } from '@/hooks/useSwap';
import { ethers } from 'ethers';

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', address: 'native' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6b175474e89094c44da98b954eedeac495271d0f' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
];

export default function MixPage() {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [commitment, setCommitment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Swap state
  const [fromToken, setFromToken] = useState(tokens[0].symbol);
  const [toToken, setToToken] = useState(tokens[1].symbol);
  const [swapAmount, setSwapAmount] = useState('');
  const [swapQuote, setSwapQuote] = useState<number | null>(null);

  const { deposit, withdraw } = useMixer();
  const { getQuote, executeSwap } = useSwap();

  const handleMix = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      if (!ethers.utils.isAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      if (isNaN(Number(amount)) || Number(amount) <= 0) {
        throw new Error('Invalid amount');
      }

      setSuccess('Transaction submitted. Waiting for confirmation...');
      
      const newCommitment = await deposit(amount, recipientAddress);
      
      setSuccess('Transaction confirmed! Your funds have been mixed.');
      setAmount('');
      setRecipientAddress('');

    } catch (err: any) {
      console.error('Mixing error:', err);
      setError(err.message || 'An error occurred while mixing funds');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      if (!commitment) {
        throw new Error('Please enter a valid commitment');
      }

      setSuccess('Withdrawal submitted. Waiting for confirmation...');
      
      await withdraw(commitment);
      
      setSuccess('Withdrawal successful! The funds have been sent to your wallet.');
      setCommitment('');

    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setError(err.message || 'An error occurred while withdrawing funds');
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuote = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!swapAmount || isNaN(Number(swapAmount)) || Number(swapAmount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const quote = await getQuote(fromToken, toToken, swapAmount);
      setSwapQuote(quote);
    } catch (err: any) {
      console.error('Quote error:', err);
      setError(err.message || 'Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!window.ethereum) {
        throw new Error('Please install MetaMask to use this feature');
      }

      if (!swapAmount || isNaN(Number(swapAmount)) || Number(swapAmount) <= 0) {
        throw new Error('Please enter a valid amount');
      }

      setSuccess('Swap transaction submitted. Waiting for confirmation...');
      
      await executeSwap(fromToken, toToken, swapAmount);
      
      setSuccess('Swap successful!');
      setSwapAmount('');
      setSwapQuote(null);

    } catch (err: any) {
      console.error('Swap error:', err);
      setError(err.message || 'An error occurred while swapping tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSwitch = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setSwapQuote(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Crypto Mixer</h1>
      
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="deposit">Deposit & Mix</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount to mix"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full" 
                onClick={handleMix}
                disabled={loading || !amount || !recipientAddress}
              >
                {loading ? 'Processing...' : 'Mix Funds'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="commitment">Commitment Hash</Label>
                <Input
                  id="commitment"
                  type="text"
                  placeholder="Enter your commitment hash"
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the commitment hash you received when depositing funds
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button 
                className="w-full" 
                onClick={handleWithdraw}
                disabled={loading || !commitment}
              >
                {loading ? 'Processing...' : 'Withdraw Funds'}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="swap">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>From</Label>
                <div className="flex space-x-4">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleTokenSwitch}
                  className="rounded-full"
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>To</Label>
                <div className="flex space-x-4">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 flex items-center px-3 border rounded-md bg-muted">
                    {swapQuote ? swapQuote.toFixed(6) : '0.00'}
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleGetQuote}
                  disabled={loading || !swapAmount || !fromToken || !toToken}
                >
                  Get Quote
                </Button>
                <Button 
                  className="w-full" 
                  onClick={handleSwap}
                  disabled={loading || !swapAmount || !swapQuote}
                >
                  {loading ? 'Processing...' : 'Swap Tokens'}
                </Button>
              </div>
            </div>
          </Card>

          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">How to Swap</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Select the token you want to swap from</li>
              <li>Enter the amount you want to swap</li>
              <li>Select the token you want to receive</li>
              <li>Get a quote to see the estimated amount you'll receive</li>
              <li>Click "Swap Tokens" and confirm the transaction</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}