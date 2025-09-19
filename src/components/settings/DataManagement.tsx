import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DeleteAllConfirmDialog } from './DeleteAllConfirmDialog';

export const DataManagement = () => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [deletePlayersOpen, setDeletePlayersOpen] = useState(false);
  const [deleteTransactionsOpen, setDeleteTransactionsOpen] = useState(false);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = () => {
    try {
      // Get actual player count from localStorage (same as Players page uses)
      const savedPlayers = localStorage.getItem('playersData');
      const players = savedPlayers ? JSON.parse(savedPlayers) : [];
      
      // Get actual transaction count from localStorage (same as Finance page uses)
      const savedPayments = localStorage.getItem('financePayments');
      const payments = savedPayments ? JSON.parse(savedPayments) : [];

      setTotalPlayers(players.length);
      setTotalTransactions(payments.length);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleDeleteAllPlayers = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear actual player data from localStorage
      localStorage.removeItem('playersData');
      localStorage.removeItem('playerBalances');
      
      toast.success('All players deleted successfully - Please refresh the page to see changes');
      setTotalPlayers(0);
      setDeletePlayersOpen(false);
    } catch (error) {
      toast.error('An error occurred while deleting players');
    }
  };

  const handleDeleteAllTransactions = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear actual finance data from localStorage
      localStorage.removeItem('financePayments');
      // Reset all player balances to 0
      localStorage.removeItem('playerBalances');

      toast.success('All finance transactions deleted - Please refresh the page to see changes');
      setTotalTransactions(0);
      setDeleteTransactionsOpen(false);
    } catch (error) {
      toast.error('An error occurred while deleting finance transactions');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-500" />
          Data Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage player data and system cleanup operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Total Players</p>
              <p className="text-xs text-muted-foreground">Current database entries</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-orange-500">{totalPlayers}</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Total Finance Transactions</p>
              <p className="text-xs text-muted-foreground">Payment records in system</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-orange-500">{totalTransactions}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-red-600 mb-1">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            These actions cannot be undone. Please proceed with caution.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="destructive"
            onClick={() => setDeletePlayersOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={totalPlayers === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Players
          </Button>

          <Button
            variant="destructive"
            onClick={() => setDeleteTransactionsOpen(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={totalTransactions === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Finance Transactions
          </Button>
        </div>
      </div>

      <DeleteAllConfirmDialog
        open={deletePlayersOpen}
        onOpenChange={setDeletePlayersOpen}
        onConfirm={handleDeleteAllPlayers}
        type="players"
        count={totalPlayers}
      />

      <DeleteAllConfirmDialog
        open={deleteTransactionsOpen}
        onOpenChange={setDeleteTransactionsOpen}
        onConfirm={handleDeleteAllTransactions}
        type="transactions"
        count={totalTransactions}
      />
    </div>
  );
};