import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, User, DollarSign, FileText, Calendar } from "lucide-react";

interface Payment {
  id: string;
  playerId?: string;
  playerName?: string;
  amount: number;
  currency: string;
  notes: string;
  timestamp: Date;
  type: 'player' | 'court' | 'others';
  archived?: boolean;
}

interface PaymentViewDialogProps {
  payment: Payment;
  trigger?: React.ReactNode;
  playerBalance?: number;
}

export function PaymentViewDialog({ payment, trigger, playerBalance }: PaymentViewDialogProps) {
  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(Math.abs(amount));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'player': return 'Player Payment';
      case 'court': return 'Court Charges';
      case 'others': return 'Other Charges';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'player': return 'bg-blue-100 text-blue-800';
      case 'court': return 'bg-green-100 text-green-800';
      case 'others': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate actual current balance from localStorage if not provided
  const getCurrentBalance = () => {
    if (playerBalance !== undefined) return playerBalance;
    
    // Fallback to calculating from localStorage
    const savedPayments = localStorage.getItem('financePayments');
    if (savedPayments && payment.playerId) {
      try {
        const payments = JSON.parse(savedPayments);
        const playerPayments = payments.filter((p: any) => 
          p.playerId === payment.playerId && !p.archived
        );
        return playerPayments.reduce((sum: number, p: any) => sum + p.amount, 0);
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const currentBalance = getCurrentBalance();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            Payment Details
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            View complete payment transaction information
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Player Information */}
          {payment.type === 'player' && payment.playerName && (
            <div className="border rounded-lg p-4 bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{payment.playerName}</h3>
                  </div>
                </div>
                <Badge className={getTypeColor(payment.type)}>
                  {getTypeLabel(payment.type)}
                </Badge>
              </div>
            </div>
          )}

          {/* Transaction Amount */}
          <div className="border rounded-lg p-4 bg-background">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                payment.amount > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <DollarSign className={`h-5 w-5 ${
                  payment.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Amount</p>
                    <p className={`text-2xl font-bold ${payment.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {payment.currency} {formatAmount(payment.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {payment.amount > 0 ? 'Money received or added to account' : 'Money charged or deducted from account'}
                    </p>
                  </div>
                  <Badge 
                    variant={payment.amount > 0 ? 'default' : 'destructive'} 
                    className={payment.amount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {payment.amount > 0 ? 'Credit' : 'Debit'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Current Player Balance */}
          {payment.type === 'player' && (
            <div className="border rounded-lg p-4 bg-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Player Balance</p>
                  <p className={`text-2xl font-bold ${
                    currentBalance > 0 ? 'text-green-600' : 
                    currentBalance < 0 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {payment.currency} {formatAmount(currentBalance)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {payment.notes && (
            <div className="border rounded-lg p-4 bg-background">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{payment.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Date & Details */}
          <div className="border rounded-lg p-4 bg-background">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Transaction Date</p>
                <p className="font-semibold mb-3">{formatDate(payment.timestamp)}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-muted-foreground">Payment ID</p>
                    <p className="font-mono">{payment.id}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-muted-foreground">Currency</p>
                    <p>{payment.currency}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}