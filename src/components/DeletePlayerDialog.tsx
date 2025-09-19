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

interface Player {
  id: string;
  kiliId: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date | undefined;
  contactNumber: string;
  countryCode: string;
  duprId: string;
  role: string;
  notes: string;
  balance: number;
  isActive: boolean;
}

interface DeletePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
  onConfirm: () => void;
}

export const DeletePlayerDialog: React.FC<DeletePlayerDialogProps> = ({
  open,
  onOpenChange,
  player,
  onConfirm,
}) => {
  const handleDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-red-600" />
            <DialogTitle className="text-xl font-semibold text-foreground">Delete Player</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-muted-foreground">
            Are you absolutely sure you want to permanently delete{' '}
            <span className="font-medium text-foreground">
              {player.firstName} {player.lastName}
            </span>
            ?
          </p>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              This action will permanently remove:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Player profile and personal information
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Kili ID: <span className="font-medium">{player.kiliId}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Email: <span className="font-medium">{player.email}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                DUPR rating and contact details
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full mt-2 mr-3 flex-shrink-0"></span>
                All associated player data
              </li>
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
              Yes, Delete {player.firstName}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};