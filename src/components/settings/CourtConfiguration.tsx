import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { LocationModal } from './LocationModal';
import { DeleteLocationDialog } from './DeleteLocationDialog';
import { getLocations, deleteLocation, type Location } from '@/utils/locationsStorage';
import { useToast } from '@/hooks/use-toast';

export const CourtConfiguration: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
    
    const handleStorageChange = () => {
      loadLocations();
    };
    
    window.addEventListener('locationsDataChanged', handleStorageChange);
    return () => {
      window.removeEventListener('locationsDataChanged', handleStorageChange);
    };
  }, []);

  const loadLocations = () => {
    const data = getLocations();
    setLocations(data);
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = (location: Location) => {
    setDeletingLocation(location);
  };

  const confirmDeleteLocation = () => {
    if (deletingLocation) {
      const success = deleteLocation(deletingLocation.id);
      if (success) {
        toast({
          title: "Location Deleted",
          description: `${deletingLocation.name} has been deleted successfully.`,
        });
        loadLocations();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete location.",
          variant: "destructive",
        });
      }
      setDeletingLocation(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDuration = (duration: string) => {
    const hours = parseFloat(duration);
    if (hours === 0.5) return '30 min';
    if (hours === 1) return '1 hr';
    if (hours % 1 === 0) return `${hours} hrs`;
    return `${hours} hrs`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Court Configuration</h2>
          <p className="text-muted-foreground">
            Manage your court locations, pricing, and player limits.
          </p>
        </div>
        <Button onClick={handleAddLocation} variant="orange" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      {locations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No locations configured</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding your first court location to configure pricing and player limits.
            </p>
            <Button onClick={handleAddLocation} variant="orange" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Card key={location.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {location.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {Math.max(...location.playerLimits.map(limit => limit.courts))} Courts
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditLocation(location)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLocation(location)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Session Fee</h4>
                  <p className="text-2xl font-bold text-accent">
                    {formatCurrency(location.sessionFee)}
                  </p>
                  <p className="text-xs text-muted-foreground">Fixed fee per session</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={editingLocation}
        onSuccess={loadLocations}
      />

      <DeleteLocationDialog
        isOpen={!!deletingLocation}
        onClose={() => setDeletingLocation(null)}
        onConfirm={confirmDeleteLocation}
        locationName={deletingLocation?.name || ''}
      />
    </div>
  );
};