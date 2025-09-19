import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, RotateCcw } from 'lucide-react';

interface Payment {
  id: string;
  type: 'player' | 'court' | 'others';
  playerId?: string;
  playerName?: string;
  amount: number;
  notes?: string;
  timestamp: Date;
  archived?: boolean;
}

interface ViewArchivedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  archivedPayments: Payment[];
  onRestorePayment: (paymentId: string) => void;
  onRestoreAll: () => void;
}

export const ViewArchivedDialog = ({ 
  isOpen, 
  onClose, 
  archivedPayments, 
  onRestorePayment,
  onRestoreAll 
}: ViewArchivedDialogProps) => {
  const formatCurrency = (amount: number) => {
    return `TZS ${Math.abs(amount).toLocaleString()}`;
  };

  const getCategoryBadgeColor = (type: string) => {
    switch (type) {
      case 'player':
        return 'bg-blue-100 text-blue-800';
      case 'court':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-orange-500" />
            Archived Payment Records
          </DialogTitle>
          <DialogDescription>
            View and manage archived payment records. You can restore individual payments or all at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Archive Statistics */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Archive Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-gray-600">
                  {archivedPayments.length} archived payments
                </span>
                {archivedPayments.length > 0 && (
                  <Button 
                    onClick={onRestoreAll}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Archived Payments List */}
          <div className="max-h-[350px] overflow-y-auto space-y-3">
            {archivedPayments.length === 0 ? (
              <div className="text-center py-12">
                <Archive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Archived Payments</h3>
                <p className="text-gray-600">You haven't archived any payment records yet.</p>
              </div>
            ) : (
              archivedPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.playerName || (payment.type === 'court' ? 'Court Charges' : 'Other Transactions')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.timestamp.toLocaleDateString()} at {payment.timestamp.toLocaleTimeString()}
                      </div>
                      {payment.notes && (
                        <div className="text-sm text-gray-600 italic mt-1">{payment.notes}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-semibold ${payment.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.amount >= 0 ? '+' : '-'}{formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.amount >= 0 ? 'Credit' : 'Debit'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(payment.type)}`}>
                        {payment.type === 'player' ? 'Player' : payment.type === 'court' ? 'Court' : 'Others'}
                      </span>
                      <Button
                        onClick={() => onRestorePayment(payment.id)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};