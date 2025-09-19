import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface DeletePaymentDialogProps {
  payment: Payment;
  onDeletePayment: (paymentId: string) => void;
  trigger?: React.ReactNode;
}

export function DeletePaymentDialog({ payment, onDeletePayment, trigger }: DeletePaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(Math.abs(amount));
  };

  const handleDelete = () => {
    onDeletePayment(payment.id);
    setOpen(false);
    
    toast({
      title: "Payment Deleted",
      description: "The payment has been permanently deleted.",
      variant: "destructive"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Payment
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. Please confirm the deletion.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Details */}
          <div className="border rounded-lg p-4 bg-background">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {payment.playerName || 'Court Charges'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {payment.playerId || 'System Transaction'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium text-green-600">
                  {payment.currency} {formatAmount(payment.amount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {formatDate(payment.timestamp)}
                </span>
              </div>

              {payment.notes && (
                <div className="pt-2 border-t">
                  <p className="text-muted-foreground mb-1">Notes:</p>
                  <p className="text-sm">{payment.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-red-900">Warning</h4>
                <p className="text-sm text-red-800">
                  This payment transaction for {payment.playerName || 'court charges'} will be 
                  permanently deleted and their balance will be updated.
                </p>
                <p className="text-sm text-red-800 font-medium">
                  This action will affect the player's balance calculations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1" 
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            className="flex-1"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}