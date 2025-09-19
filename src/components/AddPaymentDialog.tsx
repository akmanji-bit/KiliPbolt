import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, User, Building, Receipt, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const paymentSchema = z.object({
  type: z.enum(['player', 'court', 'others']),
  playerId: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  notes: z.string().max(255, 'Notes cannot exceed 255 characters').optional(),
}).refine((data) => {
  if (data.type === 'player') {
    return data.playerId && data.playerId.length > 0;
  }
  return true;
}, {
  message: "Player selection is required for player payments",
  path: ["playerId"],
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface Player {
  id: string;
  kiliId: string;
  firstName: string;
  lastName: string;
  balance: number;
}

interface AddPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPayment: (payment: {
    type: 'player' | 'court' | 'others';
    playerId?: string;
    amount: number;
    notes?: string;
  }) => void;
  players: Player[];
}

export const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({
  isOpen,
  onClose,
  onAddPayment,
  players,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      type: 'player',
      amount: '',
      notes: '',
    },
  });

  const watchedType = form.watch('type');
  const watchedAmount = form.watch('amount');
  const watchedPlayerId = form.watch('playerId');

  // Update selected player when playerId changes
  React.useEffect(() => {
    if (watchedPlayerId) {
      const player = players.find(p => p.id === watchedPlayerId);
      setSelectedPlayer(player || null);
    } else {
      setSelectedPlayer(null);
    }
  }, [watchedPlayerId, players]);

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(Math.abs(num));
  };

  const getTransactionPreview = () => {
    const amount = parseFloat(watchedAmount) || 0;
    const isPositive = amount > 0;
    const isNegative = amount < 0;

    if (watchedType === 'player' && selectedPlayer) {
      return {
        amount: formatAmount(watchedAmount),
        color: isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-foreground',
        description: isPositive 
          ? "This will increase the player's balance" 
          : isNegative 
          ? "This will decrease the player's balance"
          : "This will not change the player's balance"
      };
    } else if (watchedType === 'court') {
      return {
        amount: formatAmount(watchedAmount),
        color: isNegative ? 'text-red-600' : isPositive ? 'text-green-600' : 'text-foreground',
        description: isNegative 
          ? "This will add to court expenses" 
          : isPositive 
          ? "This will reduce court expenses"
          : "This will not affect court expenses"
      };
    } else {
      return {
        amount: formatAmount(watchedAmount),
        color: isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-foreground',
        description: "This will be recorded as miscellaneous transaction"
      };
    }
  };

  const onSubmit = (data: PaymentFormData) => {
    const amount = parseFloat(data.amount);
    onAddPayment({
      type: data.type,
      playerId: data.type === 'player' ? data.playerId : undefined,
      amount,
      notes: data.notes,
    });
    form.reset();
    setSelectedPlayer(null);
    onClose();
  };

  const preview = getTransactionPreview();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-600" />
            <DialogTitle className="text-xl font-semibold">Add Payment</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground">
            Record a payment transaction. Choose between player payments, court charges, or other expenses.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Payment Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="player" id="player" />
                          <User className="h-5 w-5 text-blue-600" />
                          <Label htmlFor="player" className="text-base cursor-pointer">
                            Player Payment
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="court" id="court" />
                          <Building className="h-5 w-5 text-green-600" />
                          <Label htmlFor="court" className="text-base cursor-pointer">
                            Court Charges
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="others" id="others" />
                          <Receipt className="h-5 w-5 text-orange-600" />
                          <Label htmlFor="others" className="text-base cursor-pointer">
                            Others
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-2">
                      Select "Player Payment" for individual member transactions, "Court Charges" 
                      for court expenses, or "Others" for miscellaneous transactions.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedType === 'player' && (
                <FormField
                  control={form.control}
                  name="playerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Player Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a player" />
                          </SelectTrigger>
                          <SelectContent>
                            {players.map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.firstName} {player.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {selectedPlayer && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <h4 className="font-medium">Selected Player</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedPlayer.firstName} {selectedPlayer.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Current Balance: TZS {selectedPlayer.balance.toLocaleString()}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchedType === 'court' && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Court Charges</h4>
                  <p className="text-sm text-muted-foreground">
                    General court-related expenses and charges
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Amount (TZS) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          step="any"
                          placeholder="Enter amount"
                          className="pr-12"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          TZS
                        </div>
                      </div>
                    </FormControl>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Positive amount = Credit (money received from player)</p>
                      <p>• Negative amount = Debit (money owed by player)</p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedAmount && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Transaction Preview</h4>
                  <p className="text-sm">
                    Amount: <span className={preview.color}>{preview.amount}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{preview.description}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter payment description (optional)"
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      {field.value?.length || 0}/255 characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  Add Payment
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};