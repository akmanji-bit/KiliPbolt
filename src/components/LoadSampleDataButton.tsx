import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { loadSampleData } from '@/utils/sampleData';
import { Database, Upload } from 'lucide-react';

export const LoadSampleDataButton: React.FC = () => {
  const { toast } = useToast();

  const handleLoadSampleData = () => {
    try {
      const { players, transactions } = loadSampleData();
      
      toast({
        title: "Sample Data Loaded",
        description: `Added ${players.length} players and ${transactions.length} transactions successfully.`,
      });
      
      // Refresh the page to show the new data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error Loading Sample Data",
        description: "There was an error loading the sample data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleLoadSampleData}
      variant="outline"
      className="gap-2"
    >
      <Database className="h-4 w-4" />
      Load Sample Data
    </Button>
  );
};