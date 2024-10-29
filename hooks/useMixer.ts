"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getMixerContract } from '@/lib/contract';

export interface MixerState {
  deposits: {
    commitment: string;
    amount: string;
    timestamp: number;
    recipient: string;
    status: 'pending' | 'completed';
  }[];
  withdrawals: {
    nullifierHash: string;
    amount: string;
    recipient: string;
    timestamp: number;
    status: 'pending' | 'completed';
  }[];
  totalDeposited: string;
  totalWithdrawn: string;
}

export function useMixer() {
  const [state, setState] = useState<MixerState>({
    deposits: [],
    withdrawals: [],
    totalDeposited: '0',
    totalWithdrawn: '0',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMixerState();
    setupEventListeners();
  }, []);

  const loadMixerState = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = getMixerContract(provider);

      // Load stored commitments from localStorage
      const storedCommitments = Object.keys(localStorage)
        .filter(key => key.startsWith('0x'))
        .map(commitment => {
          const data = JSON.parse(localStorage.getItem(commitment) || '{}');
          return {
            commitment,
            amount: data.amount || '0',
            timestamp: data.timestamp || Date.now(),
            recipient: data.recipient || '',
            status: data.status || 'completed',
          };
        });

      setState(prev => ({
        ...prev,
        deposits: storedCommitments,
        totalDeposited: storedCommitments.reduce(
          (acc, curr) => acc + parseFloat(curr.amount),
          0
        ).toString(),
      }));
    } catch (error) {
      console.error('Error loading mixer state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupEventListeners = async () => {
    if (typeof window.ethereum === 'undefined') return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getMixerContract(provider);

    contract.on('Deposit', (commitment, leafIndex, timestamp) => {
      const storedData = JSON.parse(localStorage.getItem(commitment) || '{}');
      
      setState(prev => ({
        ...prev,
        deposits: [...prev.deposits, {
          commitment,
          amount: storedData.amount || '1.0', // Default to 1 ETH as per contract
          timestamp: timestamp.toNumber(),
          recipient: storedData.recipient || '',
          status: 'completed',
        }],
      }));
    });

    contract.on('Withdrawal', (to, nullifierHash) => {
      setState(prev => ({
        ...prev,
        withdrawals: [...prev.withdrawals, {
          nullifierHash,
          amount: '1.0', // Fixed amount as per contract
          recipient: to,
          timestamp: Date.now(),
          status: 'completed',
        }],
      }));
    });

    return () => {
      contract.removeAllListeners();
    };
  };

  const deposit = async (amount: string, recipientAddress: string) => {
    if (!window.ethereum) throw new Error('MetaMask is not installed');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = getMixerContract(signer);

    // Generate commitment
    const randomness = ethers.utils.randomBytes(32);
    const commitment = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['address', 'bytes32'],
        [recipientAddress, randomness]
      )
    );

    // Store commitment data
    localStorage.setItem(commitment, JSON.stringify({
      randomness: ethers.utils.hexlify(randomness),
      recipient: recipientAddress,
      amount,
      timestamp: Date.now(),
      status: 'pending',
    }));

    // Send transaction
    const tx = await contract.deposit(commitment, {
      value: ethers.utils.parseEther(amount),
    });

    setState(prev => ({
      ...prev,
      deposits: [...prev.deposits, {
        commitment,
        amount,
        timestamp: Date.now(),
        recipient: recipientAddress,
        status: 'pending',
      }],
    }));

    await tx.wait();

    // Update status to completed
    const updatedData = JSON.parse(localStorage.getItem(commitment) || '{}');
    updatedData.status = 'completed';
    localStorage.setItem(commitment, JSON.stringify(updatedData));

    setState(prev => ({
      ...prev,
      deposits: prev.deposits.map(d =>
        d.commitment === commitment ? { ...d, status: 'completed' } : d
      ),
    }));

    return commitment;
  };

  const withdraw = async (commitment: string) => {
    if (!window.ethereum) throw new Error('MetaMask is not installed');

    const storedData = JSON.parse(localStorage.getItem(commitment) || '{}');
    if (!storedData.randomness || !storedData.recipient) {
      throw new Error('Commitment data not found');
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = getMixerContract(signer);

    const nullifierHash = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'address'],
        [storedData.randomness, storedData.recipient]
      )
    );

    const tx = await contract.withdraw(nullifierHash, storedData.recipient);
    await tx.wait();

    setState(prev => ({
      ...prev,
      withdrawals: [...prev.withdrawals, {
        nullifierHash,
        amount: storedData.amount,
        recipient: storedData.recipient,
        timestamp: Date.now(),
        status: 'completed',
      }],
    }));

    // Remove commitment data after successful withdrawal
    localStorage.removeItem(commitment);

    return nullifierHash;
  };

  return {
    state,
    isLoading,
    deposit,
    withdraw,
  };
}