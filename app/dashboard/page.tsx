"use client";

import { useMixer } from '@/hooks/useMixer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ethers } from 'ethers';

export default function Dashboard() {
  const { state, isLoading, withdraw } = useMixer();

  const handleWithdraw = async (commitment: string) => {
    try {
      await withdraw(commitment);
    } catch (error) {
      console.error('Withdrawal error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total Deposited</h2>
          <p className="text-3xl font-bold">{state.totalDeposited} ETH</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Total Withdrawn</h2>
          <p className="text-3xl font-bold">{state.totalWithdrawn} ETH</p>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Deposits</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commitment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount (ETH)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading deposits...
                </TableCell>
              </TableRow>
            ) : state.deposits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No deposits found
                </TableCell>
              </TableRow>
            ) : (
              state.deposits.map((deposit) => (
                <TableRow key={deposit.commitment}>
                  <TableCell className="font-mono">
                    {`${deposit.commitment.slice(0, 6)}...${deposit.commitment.slice(-4)}`}
                  </TableCell>
                  <TableCell>{new Date(deposit.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{deposit.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deposit.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {deposit.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleWithdraw(deposit.commitment)}
                      disabled={deposit.status !== 'completed'}
                    >
                      Withdraw
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Withdrawals</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount (ETH)</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading withdrawals...
                </TableCell>
              </TableRow>
            ) : state.withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              state.withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.nullifierHash}>
                  <TableCell className="font-mono">
                    {`${withdrawal.nullifierHash.slice(0, 6)}...${withdrawal.nullifierHash.slice(-4)}`}
                  </TableCell>
                  <TableCell>{new Date(withdrawal.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>{withdrawal.amount}</TableCell>
                  <TableCell className="font-mono">
                    {`${withdrawal.recipient.slice(0, 6)}...${withdrawal.recipient.slice(-4)}`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        withdrawal.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}