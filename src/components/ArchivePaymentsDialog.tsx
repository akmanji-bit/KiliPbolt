import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Info } from 'lucide-react';

interface ArchivePaymentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onArchive: (fromDate: string, toDate: string) => void;
}

export const ArchivePaymentsDialog = ({ isOpen, onClose, onArchive }: ArchivePaymentsDialogProps) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromDate && toDate) {
      onArchive(fromDate, toDate);
      onClose();
      setFromDate('');
      setToDate('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            Archive Payment Records
          </DialogTitle>
          <DialogDescription>
            Archive payments within a specific date range to reduce clutter. 
            Archived payments can be viewed and restored later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date *</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate">To Date *</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                min={fromDate}
              />
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="font-medium text-blue-600">Archive Information:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Archived payments will be hidden from the main payments view</li>
                <li>You can view archived payments using the "View Archived" button</li>
                <li>Archived payments can be restored individually or all at once</li>
                <li>This action does not delete any data permanently</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Archive Payments
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};