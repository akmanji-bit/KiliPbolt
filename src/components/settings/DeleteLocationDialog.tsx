import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  locationName: string;
}

export const DeleteLocationDialog: React.FC<DeleteLocationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  locationName,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Location</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{locationName}"? This action cannot be undone.
            All pricing and configuration data for this location will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Location
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};