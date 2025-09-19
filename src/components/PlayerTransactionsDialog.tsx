import React, { useState, useMemo } from 'react';
import { X, BarChart3, Receipt, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface Player {
  id: string;
  kiliId: string;
  firstName: string;
  lastName: string;
  balance: number;
}

interface PlayerTransactionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
  payments: Payment[];
}

export const PlayerTransactionsDialog: React.FC<PlayerTransactionsDialogProps> = ({
  open,
  onOpenChange,
  player,
  payments
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Filter payments for this specific player and ensure timestamps are Date objects
  const playerPayments = useMemo(() => {
    return payments
      .filter(payment => 
        payment.type === 'player' && 
        payment.playerId === player.id &&
        !payment.archived
      )
      .map(payment => ({
        ...payment,
        timestamp: new Date(payment.timestamp) // Ensure timestamp is a Date object
      }));
  }, [payments, player.id]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const credits = playerPayments.filter(p => p.amount > 0);
    const debits = playerPayments.filter(p => p.amount < 0);
    
    const totalCredits = credits.reduce((sum, p) => sum + p.amount, 0);
    const totalDebits = Math.abs(debits.reduce((sum, p) => sum + p.amount, 0));
    
    const firstTransaction = playerPayments.length > 0 
      ? new Date(Math.min(...playerPayments.map(p => p.timestamp.getTime())))
      : null;
    
    const lastTransaction = playerPayments.length > 0
      ? new Date(Math.max(...playerPayments.map(p => p.timestamp.getTime())))
      : null;

    // Calculate average monthly activity
    const monthsActive = firstTransaction && lastTransaction
      ? Math.max(1, Math.ceil((lastTransaction.getTime() - firstTransaction.getTime()) / (1000 * 60 * 60 * 24 * 30)))
      : 1;
    
    const avgMonthlyTransactions = Math.round(playerPayments.length / monthsActive);
    const avgAmount = playerPayments.length > 0 
      ? Math.round(totalCredits / credits.length) 
      : 0;

    return {
      totalCredits,
      totalDebits,
      creditsCount: credits.length,
      debitsCount: debits.length,
      firstTransaction,
      lastTransaction,
      avgMonthlyTransactions,
      avgAmount,
      totalTransactions: playerPayments.length
    };
  }, [playerPayments]);

  const formatCurrency = (amount: number) => {
    return `TZS ${Math.abs(amount).toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getAccountHealth = () => {
    if (player.balance > 30000) return 'Excellent';
    if (player.balance > 10000) return 'Good';
    if (player.balance > 0) return 'Fair';
    return 'Poor';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <div className="text-orange-600 font-bold text-lg">
                {player.firstName.charAt(0)}{player.lastName.charAt(0)}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Payment History</h2>
              <p className="text-sm text-muted-foreground">
                {player.firstName} {player.lastName} • {player.kiliId}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-3 w-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2 text-sm">
              <Receipt className="h-3 w-3" />
              All Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-3 w-3" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Current Balance Card */}
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-foreground">Current Account Balance</h3>
                  <DollarSign className="h-4 w-4 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${player.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(player.balance)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${player.balance >= 0 ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {player.balance >= 0 ? 'Credit Balance' : 'Debit Balance'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Account status • Updated in real-time</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credits and Debits Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Credits</h3>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(analytics.totalCredits)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Payments received
                      <span className="float-right font-medium">{analytics.creditsCount} transactions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Debits</h3>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(analytics.totalDebits)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Charges applied
                      <span className="float-right font-medium">{analytics.debitsCount} transactions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Activity Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-base font-semibold text-foreground mb-6">Account Activity Summary</h3>
                
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {analytics.totalTransactions}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Transactions
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">
                      TZS {analytics.avgAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Average Amount
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Account Health</span>
                    <span className="text-sm font-bold text-foreground">{getAccountHealth()}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getAccountHealth() === 'Excellent' ? 'bg-green-600 w-full' :
                        getAccountHealth() === 'Good' ? 'bg-blue-600 w-3/4' :
                        getAccountHealth() === 'Fair' ? 'bg-yellow-600 w-1/2' :
                        'bg-red-600 w-1/4'
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-base font-semibold text-foreground">All Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  Complete transaction history for {player.firstName} {player.lastName}
                </p>
              </CardHeader>
              <CardContent>
                {playerPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-base text-muted-foreground mb-2">No transactions found</p>
                    <p className="text-sm text-muted-foreground">
                      This player hasn&apos;t made any transactions yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {playerPayments
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`${payment.amount >= 0 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                {payment.amount >= 0 ? 'Credit' : 'Debit'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">#{payment.id}</span>
                            </div>
                            
                            <div className="text-sm font-medium text-foreground mb-1">
                              {payment.timestamp.toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}, {payment.timestamp.toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            
                            <div className="text-sm text-muted-foreground truncate">
                              {payment.notes || 'No description'}
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              by admin
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-base font-bold ${payment.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {payment.amount >= 0 ? '+' : ''}{formatCurrency(payment.amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-base font-semibold text-foreground">Payment Insights</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transaction Breakdown */}
                <div>
                  <h4 className="text-base font-semibold text-foreground mb-4">Transaction Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-foreground">Credits</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground">{analytics.creditsCount}</div>
                        <div className="text-xs text-muted-foreground">transactions</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-foreground">Debits</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground">{analytics.debitsCount}</div>
                        <div className="text-xs text-muted-foreground">transactions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Summary */}
                <div>
                  <h4 className="text-base font-semibold text-foreground mb-4">Account Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">First Transaction</span>
                      <span className="text-sm font-medium text-foreground">
                        {analytics.firstTransaction ? 
                          analytics.firstTransaction.toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short' 
                          }) : 
                          'No transactions'
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Transaction</span>
                      <span className="text-sm font-medium text-foreground">
                        {analytics.lastTransaction ? 
                          analytics.lastTransaction.toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: 'short' 
                          }) : 
                          'No transactions'
                        }
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Monthly Activity</span>
                      <span className="text-sm font-medium text-foreground">
                        {analytics.avgMonthlyTransactions} transactions
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};