import React from 'react';
import { TriangleAlert, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeleteAllConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  type: 'players' | 'transactions';
  count: number;
}

export const DeleteAllConfirmDialog: React.FC<DeleteAllConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  type,
  count,
}) => {
  const handleDelete = () => {
    onConfirm();
  };

  const isPlayers = type === 'players';
  const title = isPlayers ? 'Delete All Players' : 'Delete All Finance Transactions';
  const itemName = isPlayers ? 'players' : 'finance transactions';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-red-600" />
            <DialogTitle className="text-xl font-semibold text-foreground">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground">
            Are you absolutely sure you want to permanently delete{' '}
            <span className="font-medium text-foreground">
              all {count} {itemName}
            </span>
            ?
          </p>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              This action will permanently remove:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {isPlayers ? (
                <>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    All player profiles and personal information
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Player contact details and membership information
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Player balances and account data
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    All associated player records
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    All payment records and transaction history
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Player account balances (will be reset to zero)
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Financial transaction notes and metadata
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    All payment type records and amounts
                  </li>
                </>
              )}
            </ul>
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-red-600 font-medium">
              This action cannot be undone!
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="px-6 bg-red-600 hover:bg-red-700"
            >
              Yes, Delete All {isPlayers ? 'Players' : 'Transactions'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};