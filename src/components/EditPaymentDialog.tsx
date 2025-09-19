import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, User, Building2, Settings, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

interface Player {
  id: string;
  name: string;
  balance: number;
}

interface EditPaymentDialogProps {
  payment: Payment;
  players: Player[];
  onUpdatePayment: (paymentId: string, updatedPayment: Partial<Payment>) => void;
  trigger?: React.ReactNode;
}

const formSchema = z.object({
  type: z.enum(['player', 'court', 'others']),
  playerId: z.string().optional(),
  amount: z.number().min(-999999, "Amount too small").max(999999, "Amount too large"),
  currency: z.string().min(1, "Currency is required"),
  notes: z.string().max(255, "Notes must be 255 characters or less"),
});

export function EditPaymentDialog({ payment, players, onUpdatePayment, trigger }: EditPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: payment.type,
      playerId: payment.playerId || "",
      amount: payment.amount,
      currency: payment.currency,
      notes: payment.notes,
    }
  });

  const watchedType = watch('type');
  const watchedAmount = watch('amount');
  const watchedPlayerId = watch('playerId');

  useEffect(() => {
    if (watchedPlayerId) {
      const player = players.find(p => p.id === watchedPlayerId);
      setSelectedPlayer(player || null);
    }
  }, [watchedPlayerId, players]);

  useEffect(() => {
    if (payment) {
      reset({
        type: payment.type,
        playerId: payment.playerId || "",
        amount: payment.amount,
        currency: payment.currency,
        notes: payment.notes,
      });
      
      if (payment.playerId) {
        const player = players.find(p => p.id === payment.playerId);
        setSelectedPlayer(player || null);
      }
    }
  }, [payment, players, reset]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const updatedPayment: Partial<Payment> = {
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      notes: data.notes,
    };

    if (data.type === 'player' && data.playerId) {
      const player = players.find(p => p.id === data.playerId);
      updatedPayment.playerId = data.playerId;
      updatedPayment.playerName = player?.name;
    } else {
      updatedPayment.playerId = undefined;
      updatedPayment.playerName = undefined;
    }

    onUpdatePayment(payment.id, updatedPayment);
    setOpen(false);
    
    toast({
      title: "Payment Updated",
      description: "The payment has been successfully updated.",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(Math.abs(amount));
  };

  const getBalanceChange = () => {
    if (!selectedPlayer || watchedType !== 'player') return null;
    
    const currentAmount = payment.amount;
    const newAmount = watchedAmount || 0;
    const balanceChange = newAmount - currentAmount;
    const newBalance = selectedPlayer.balance + balanceChange;
    
    return {
      change: balanceChange,
      newBalance: newBalance,
      isIncrease: balanceChange > 0
    };
  };

  const balanceChange = getBalanceChange();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-orange-500" />
            Edit Payment
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Modify the payment transaction details. Choose between player payments or court charges.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Payment Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Payment Type *</Label>
            <RadioGroup
              value={watchedType}
              onValueChange={(value) => setValue('type', value as any)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="player" id="player" />
                <Label htmlFor="player" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4 text-blue-500" />
                  Player Payment
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="court" id="court" />
                <Label htmlFor="court" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4 text-green-500" />
                  Court Charges
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="others" id="others" />
                <Label htmlFor="others" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4 text-purple-500" />
                  Others
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Select "Player Payment" for individual member transactions or "Court Charges" for general court-related expenses.
            </p>
          </div>

          {/* Player Selection */}
          {watchedType === 'player' && (
            <div className="space-y-3">
              <Label htmlFor="playerId" className="text-sm font-medium">Player Name *</Label>
              <Select value={watchedPlayerId} onValueChange={(value) => setValue('playerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.playerId && (
                <p className="text-sm text-red-500">{errors.playerId.message}</p>
              )}
            </div>
          )}

          {/* Selected Player Info */}
          {selectedPlayer && watchedType === 'player' && (
            <div className="p-3 bg-blue-50 rounded-lg border">
              <h4 className="font-medium text-sm mb-1">Selected Player</h4>
              <p className="text-sm font-medium">{selectedPlayer.name}</p>
              <p className="text-sm text-muted-foreground">Current Balance: TZS {formatAmount(selectedPlayer.balance)}</p>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-medium">Amount (TZS) *</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="pr-12"
                placeholder="Enter amount"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-sm text-muted-foreground">TZS</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Positive amount = Credit (money received from player)</p>
              <p>• Negative amount = Debit (money owed by player)</p>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Transaction Preview */}
          {balanceChange && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-sm mb-2">Transaction Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium text-green-600">TZS {formatAmount(watchedAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>This will {balanceChange.isIncrease ? 'increase' : 'decrease'} the balance</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes about this payment..."
              className="resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{watch('notes')?.length || 0}/255 characters</span>
            </div>
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
              Update Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}