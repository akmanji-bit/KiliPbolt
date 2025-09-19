import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Receipt, Users, Building, CreditCard, Archive, Eye, Search, Filter, RotateCcw, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AddPaymentDialog } from '@/components/AddPaymentDialog';
import { ArchivePaymentsDialog } from '@/components/ArchivePaymentsDialog';
import { ViewArchivedDialog } from '@/components/ViewArchivedDialog';
import { PaymentViewDialog } from '@/components/PaymentViewDialog';
import { EditPaymentDialog } from '@/components/EditPaymentDialog';
import { DeletePaymentDialog } from '@/components/DeletePaymentDialog';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: string;
  kiliId: string;
  firstName: string;
  lastName: string;
  balance: number;
}

interface Payment {
  id: string;
  type: 'player' | 'court' | 'others';
  playerId?: string;
  playerName?: string;
  playerKiliId?: string;
  amount: number;
  currency: string;
  notes: string;
  timestamp: Date;
  archived?: boolean;
}

const Finance = () => {
  const { toast } = useToast();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isViewArchivedOpen, setIsViewArchivedOpen] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rowsPerPageValue, setRowsPerPageValue] = useState<string>('10');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Load players from localStorage and keep them synced
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        return Array.isArray(parsed) ? parsed.map(player => ({
          id: player.id,
          kiliId: player.kiliId,
          firstName: player.firstName,
          lastName: player.lastName,
          balance: player.balance || 0
        })) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Load payments from localStorage or start with empty array
  const [payments, setPayments] = useState<Payment[]>(() => {
    const savedPayments = localStorage.getItem('financePayments');
    if (savedPayments) {
      try {
        const parsed = JSON.parse(savedPayments);
        // Convert timestamp strings back to Date objects
        return Array.isArray(parsed) ? parsed.map(payment => ({
          ...payment,
          timestamp: new Date(payment.timestamp)
        })) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save payments to localStorage whenever payments change
  useEffect(() => {
    localStorage.setItem('financePayments', JSON.stringify(payments));
  }, [payments]);

  // Listen for custom data events (when DataManagement clears data)
  useEffect(() => {
    const handleFinanceDataChange = () => {
      const savedPayments = localStorage.getItem('financePayments');
      if (!savedPayments) {
        setPayments([]);
      } else {
        try {
          const parsed = JSON.parse(savedPayments);
          // Convert timestamp strings back to Date objects
          const paymentsWithDates = Array.isArray(parsed) ? parsed.map(payment => ({
            ...payment,
            timestamp: new Date(payment.timestamp)
          })) : [];
          setPayments(paymentsWithDates);
        } catch {
          setPayments([]);
        }
      }
    };

    const handlePlayersDataChange = () => {
      const savedPlayers = localStorage.getItem('playersData');
      if (!savedPlayers) {
        setPlayers([]);
      } else {
        try {
          const parsed = JSON.parse(savedPlayers);
          const playersForFinance = Array.isArray(parsed) ? parsed.map(player => ({
            id: player.id,
            kiliId: player.kiliId,
            firstName: player.firstName,
            lastName: player.lastName,
            balance: player.balance || 0
          })) : [];
          setPlayers(playersForFinance);
        } catch {
          setPlayers([]);
        }
      }
    };

    window.addEventListener('financeDataChanged', handleFinanceDataChange);
    window.addEventListener('playersDataChanged', handlePlayersDataChange);
    
    return () => {
      window.removeEventListener('financeDataChanged', handleFinanceDataChange);
      window.removeEventListener('playersDataChanged', handlePlayersDataChange);
    };
  }, []);

  // Also listen for storage events to sync when players are added/updated
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'playersData') {
        const savedPlayers = localStorage.getItem('playersData');
        if (savedPlayers) {
          try {
            const parsed = JSON.parse(savedPlayers);
            const playersForFinance = Array.isArray(parsed) ? parsed.map(player => ({
              id: player.id,
              kiliId: player.kiliId,
              firstName: player.firstName,
              lastName: player.lastName,
              balance: player.balance || 0
            })) : [];
            setPlayers(playersForFinance);
          } catch {
            setPlayers([]);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAddPayment = (paymentData: {
    type: 'player' | 'court' | 'others';
    playerId?: string;
    amount: number;
    notes?: string;
  }) => {
    const selectedPlayer = paymentData.playerId ? players.find(p => p.id === paymentData.playerId) : null;
    
    const newPayment: Payment = {
      id: Date.now().toString(),
      type: paymentData.type,
      playerId: paymentData.playerId,
      playerName: selectedPlayer ? `${selectedPlayer.firstName} ${selectedPlayer.lastName}` : undefined,
      playerKiliId: selectedPlayer?.kiliId,
      amount: paymentData.amount,
      currency: 'TZS',
      notes: paymentData.notes || '',
      timestamp: new Date(),
      archived: false
    };

    setPayments([newPayment, ...payments]);

    // Update player balance if it's a player payment
    if (paymentData.playerId && selectedPlayer) {
      const updatedBalance = selectedPlayer.balance + paymentData.amount;
      
      // Update local players state
      setPlayers(players.map(p => 
        p.id === paymentData.playerId 
          ? { ...p, balance: updatedBalance }
          : p
      ));

      // Update balance in playersData localStorage to sync with Players page
      const savedPlayersData = localStorage.getItem('playersData');
      if (savedPlayersData) {
        try {
          const playersData = JSON.parse(savedPlayersData);
          const updatedPlayersData = playersData.map((p: any) => 
            p.id === paymentData.playerId 
              ? { ...p, balance: updatedBalance }
              : p
          );
          localStorage.setItem('playersData', JSON.stringify(updatedPlayersData));
          // Dispatch event to notify Players page of the change
          window.dispatchEvent(new CustomEvent('playersDataChanged'));
        } catch (error) {
          console.error('Error updating player balance:', error);
        }
      }
    }

    toast({
      title: "Payment Added",
      description: `Payment of ${paymentData.amount.toLocaleString()} TZS has been recorded.`,
    });
  };

  // Filter and search payments
  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Include/exclude archived
    if (!includeArchived) {
      filtered = filtered.filter(payment => !payment.archived);
    }

    // Filter by player
    if (selectedPlayer !== 'all') {
      filtered = filtered.filter(payment => payment.playerId === selectedPlayer);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(payment => payment.type === selectedType);
    }

    // Filter by category (positive/negative amounts)
    if (selectedCategory === 'income') {
      filtered = filtered.filter(payment => payment.amount > 0);
    } else if (selectedCategory === 'expense') {
      filtered = filtered.filter(payment => payment.amount < 0);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.notes.toLowerCase().includes(searchLower) ||
        payment.playerName?.toLowerCase().includes(searchLower) ||
        payment.playerKiliId?.toLowerCase().includes(searchLower) ||
        payment.amount.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [payments, includeArchived, selectedPlayer, selectedType, selectedCategory, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const activePayments = payments.filter(p => !p.archived);
    const totalIncome = activePayments.filter(p => p.amount > 0).reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = activePayments.filter(p => p.amount < 0).reduce((sum, p) => sum + p.amount, 0);
    const netProfit = totalIncome + totalExpenses; // totalExpenses is already negative
    const totalTransactions = activePayments.length;

    // Calculate charges by type (keep actual values, not absolute)
    const totalPlayerCharges = activePayments.filter(p => p.type === 'player').reduce((sum, p) => sum + p.amount, 0);
    const totalCourtCharges = activePayments.filter(p => p.type === 'court').reduce((sum, p) => sum + p.amount, 0);
    const totalOtherCharges = activePayments.filter(p => p.type === 'others').reduce((sum, p) => sum + p.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      totalTransactions,
      totalPlayerCharges,
      totalCourtCharges,
      totalOtherCharges
    };
  }, [payments]);

  // Pagination
  const paginatedPayments = useMemo(() => {
    if (rowsPerPage >= filteredPayments.length) {
      return filteredPayments; // Show all if rowsPerPage is greater than or equal to total
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPayments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredPayments, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / Math.min(rowsPerPage, filteredPayments.length)));

  const handleUpdatePayment = (paymentId: string, updatedPayment: Partial<Payment>) => {
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, ...updatedPayment } : p
    ));
    
    toast({
      title: "Payment Updated",
      description: "The payment has been successfully updated.",
    });
  };

  const handleConfirmDeletePayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    
    // Remove the payment first
    const updatedPayments = payments.filter(p => p.id !== paymentId);
    setPayments(updatedPayments);
    
    if (payment && payment.playerId) {
      // Recalculate player balance based on remaining transactions
      const playerTransactions = updatedPayments.filter(p => 
        p.playerId === payment.playerId && !p.archived
      );
      const newBalance = playerTransactions.reduce((sum, p) => sum + p.amount, 0);
      
      // Update player balance in localStorage and local state
      const savedPlayersData = localStorage.getItem('playersData');
      if (savedPlayersData) {
        try {
          const playersData = JSON.parse(savedPlayersData);
          const updatedPlayersData = playersData.map((p: any) => 
            p.id === payment.playerId 
              ? { ...p, balance: newBalance }
              : p
          );
          localStorage.setItem('playersData', JSON.stringify(updatedPlayersData));
          
          // Update local players state
          setPlayers(players.map(p => 
            p.id === payment.playerId 
              ? { ...p, balance: newBalance }
              : p
          ));
          
          // Dispatch event to notify Players page of the change
          window.dispatchEvent(new CustomEvent('playersDataChanged'));
        } catch (error) {
          console.error('Error updating player balance:', error);
        }
      }
    }
    
    toast({
      title: "Payment Deleted",
      description: "The payment has been successfully deleted.",
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedPlayer('all');
    setSelectedType('all');
    setSelectedCategory('all');
    setIncludeArchived(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-orange-500" />
              Finance Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Track payments, manage transactions, and monitor financial performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(true)}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Selected
            </Button>
            <Button variant="outline" onClick={() => setIsViewArchivedOpen(true)}>
              <Archive className="h-4 w-4 mr-2" />
              View Archived
            </Button>
            <Button onClick={() => setIsAddPaymentOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Player Charges</p>
                  <p className={`text-lg font-bold ${
                    stats.totalPlayerCharges === 0 ? 'text-yellow-600' : 
                    stats.totalPlayerCharges > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.totalPlayerCharges.toLocaleString()} TZS
                  </p>
                </div>
                <Users className={`h-6 w-6 ${
                  stats.totalPlayerCharges === 0 ? 'text-yellow-600' : 
                  stats.totalPlayerCharges > 0 ? 'text-green-600' : 'text-red-600'
                } flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Court Charges</p>
                  <p className={`text-lg font-bold ${
                    stats.totalCourtCharges === 0 ? 'text-yellow-600' : 
                    stats.totalCourtCharges > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.totalCourtCharges.toLocaleString()} TZS
                  </p>
                </div>
                <Building className={`h-6 w-6 ${
                  stats.totalCourtCharges === 0 ? 'text-yellow-600' : 
                  stats.totalCourtCharges > 0 ? 'text-green-600' : 'text-red-600'
                } flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Other Charges</p>
                  <p className={`text-lg font-bold ${
                    stats.totalOtherCharges === 0 ? 'text-yellow-600' : 
                    stats.totalOtherCharges > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.totalOtherCharges.toLocaleString()} TZS
                  </p>
                </div>
                <CreditCard className={`h-6 w-6 ${
                  stats.totalOtherCharges === 0 ? 'text-yellow-600' : 
                  stats.totalOtherCharges > 0 ? 'text-green-600' : 'text-red-600'
                } flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Income</p>
                  <p className={`text-lg font-bold ${
                    stats.totalIncome === 0 ? 'text-yellow-600' : 
                    stats.totalIncome > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.totalIncome.toLocaleString()} TZS
                  </p>
                </div>
                <TrendingUp className={`h-6 w-6 ${
                  stats.totalIncome === 0 ? 'text-yellow-600' : 
                  stats.totalIncome > 0 ? 'text-green-600' : 'text-red-600'
                } flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Total Expenses</p>
                  <p className={`text-lg font-bold ${
                    stats.totalExpenses === 0 ? 'text-yellow-600' : 
                    stats.totalExpenses > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.totalExpenses.toLocaleString()} TZS
                  </p>
                </div>
                <TrendingDown className={`h-6 w-6 ${
                  stats.totalExpenses === 0 ? 'text-yellow-600' : 
                  stats.totalExpenses > 0 ? 'text-green-600' : 'text-red-600'
                } flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">Balance</p>
                  <p className={`text-lg font-bold ${
                    stats.netProfit === 0 ? 'text-yellow-600' : 
                    stats.netProfit > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.netProfit.toLocaleString()} TZS
                  </p>
                </div>
                <DollarSign className={`h-6 w-6 ${
                  stats.netProfit === 0 ? 'text-yellow-600' : 
                  stats.netProfit > 0 ? 'text-green-600' : 'text-red-600'
                } flex-shrink-0 ml-2`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Top row: Search and filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Players" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Players</SelectItem>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.firstName} {player.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                      <SelectItem value="court">Court</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-archived"
                      checked={includeArchived}
                      onCheckedChange={setIncludeArchived}
                    />
                    <label htmlFor="include-archived" className="text-sm font-medium">
                      Include Archived
                    </label>
                  </div>

                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
              
              {/* Bottom row: Transaction count and rows per page */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''}
                  {searchTerm || selectedPlayer !== 'all' || selectedType !== 'all' || selectedCategory !== 'all' || includeArchived ? 
                    ` (filtered from ${payments.filter(p => !includeArchived ? !p.archived : true).length} total)` : 
                    ''}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <Select value={rowsPerPageValue} onValueChange={(value) => {
                    setRowsPerPageValue(value);
                    if (value === 'all') {
                      setRowsPerPage(filteredPayments.length || 1);
                    } else {
                      setRowsPerPage(Number(value));
                    }
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table or Empty State */}
        {filteredPayments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {payments.length === 0 ? 'No payments recorded' : 'No payments match your search'}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {payments.length === 0 
                  ? 'Start tracking your financial transactions by adding your first payment record.'
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              <Button onClick={() => setIsAddPaymentOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Payment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Players/Details</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {payment.timestamp.toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {payment.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {payment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.playerName ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{payment.playerName}</span>
                            <span className="text-xs text-muted-foreground">{payment.playerKiliId}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {payment.type === 'court' ? 'Court Revenue' : 'Other Transaction'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`font-medium ${
                            payment.amount > 0 
                              ? 'text-green-600 border-green-200 bg-green-50' 
                              : 'text-red-600 border-red-200 bg-red-50'
                          }`}
                        >
                          {payment.amount > 0 ? 'Credit' : 'Debit'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          payment.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString()} {payment.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{payment.notes}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <PaymentViewDialog
                            payment={payment}
                            playerBalance={players.find(p => p.id === payment.playerId)?.balance}
                            trigger={
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                            }
                          />
                          <EditPaymentDialog
                            payment={payment}
                            players={players.map(p => ({
                              id: p.id,
                              name: `${p.firstName} ${p.lastName}`,
                              balance: p.balance
                            }))}
                            onUpdatePayment={handleUpdatePayment}
                            trigger={
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                            }
                          />
                          <DeletePaymentDialog
                            payment={payment}
                            onDeletePayment={handleConfirmDeletePayment}
                            trigger={
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <AddPaymentDialog
          isOpen={isAddPaymentOpen}
          onClose={() => setIsAddPaymentOpen(false)}
          onAddPayment={handleAddPayment}
          players={players}
        />

        <ArchivePaymentsDialog
          isOpen={isArchiveDialogOpen}
          onClose={() => setIsArchiveDialogOpen(false)}
          onArchive={() => {}}
        />

        <ViewArchivedDialog
          isOpen={isViewArchivedOpen}
          onClose={() => setIsViewArchivedOpen(false)}
          archivedPayments={payments.filter(p => p.archived)}
          onRestorePayment={() => {}}
          onRestoreAll={() => {}}
        />
      </div>
    </div>
  );
};

export default Finance;