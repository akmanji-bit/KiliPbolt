import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, MapPin, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  addLocation,
  updateLocation,
  getDefaultCourtCharges,
  getDefaultPlayerLimits,
  type Location,
  type CourtCharge,
  type PlayerLimit,
} from '@/utils/locationsStorage';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  onSuccess: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  location,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sessionFee: 10000,
    currency: 'TZS',
  });
  const [courtCharges, setCourtCharges] = useState<CourtCharge[]>(getDefaultCourtCharges());
  const [playerLimits, setPlayerLimits] = useState<PlayerLimit[]>(getDefaultPlayerLimits());
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (location) {
        setFormData({
          name: location.name,
          sessionFee: location.sessionFee,
          currency: location.currency,
        });
        setCourtCharges(location.courtCharges);
        setPlayerLimits(location.playerLimits);
      } else {
        setFormData({
          name: '',
          sessionFee: 10000,
          currency: 'TZS',
        });
        setCourtCharges(getDefaultCourtCharges());
        setPlayerLimits(getDefaultPlayerLimits());
      }
      setActiveTab('basic');
    }
  }, [isOpen, location]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const locationData = {
        name: formData.name.trim(),
        sessionFee: formData.sessionFee,
        currency: formData.currency,
        courtCharges,
        playerLimits,
      };

      if (location) {
        updateLocation(location.id, locationData);
        toast({
          title: "Location Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        addLocation(locationData);
        toast({
          title: "Location Created",
          description: `${formData.name} has been created successfully.`,
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location.",
        variant: "destructive",
      });
    }
  };

  const addCourtCharge = () => {
    const maxDuration = Math.max(...courtCharges.map(c => parseFloat(c.duration)));
    const newDuration = maxDuration + 0.5;
    const newAmount = newDuration * 25000;
    
    setCourtCharges([
      ...courtCharges,
      { duration: newDuration.toString(), amount: newAmount }
    ]);
  };

  const removeCourtCharge = (index: number) => {
    setCourtCharges(courtCharges.filter((_, i) => i !== index));
  };

  const updateCourtCharge = (index: number, field: keyof CourtCharge, value: string | number) => {
    const updated = [...courtCharges];
    updated[index] = { ...updated[index], [field]: value };
    setCourtCharges(updated);
  };

  const addPlayerLimit = () => {
    const maxCourts = Math.max(...playerLimits.map(p => p.courts));
    const newCourts = maxCourts + 1;
    
    setPlayerLimits([
      ...playerLimits,
      { courts: newCourts, maxPlayers: 30 }
    ]);
  };

  const removePlayerLimit = (index: number) => {
    setPlayerLimits(playerLimits.filter((_, i) => i !== index));
  };

  const updatePlayerLimit = (index: number, field: keyof PlayerLimit, value: number) => {
    const updated = [...playerLimits];
    updated[index] = { ...updated[index], [field]: value };
    setPlayerLimits(updated);
  };

  const formatDuration = (duration: string) => {
    const hours = parseFloat(duration);
    if (hours === 0.5) return '30 min';
    if (hours === 1) return '1 hr';
    if (hours % 1 === 0) return `${hours} hrs`;
    return `${hours} hrs`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {location ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="charges">Court Charges</TabsTrigger>
            <TabsTrigger value="limits">Courts</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Location Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Downtown Court, Main Branch"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionFee">Session Fee (TZS) *</Label>
                  <Input
                    id="sessionFee"
                    type="number"
                    value={formData.sessionFee}
                    onChange={(e) => setFormData({ ...formData, sessionFee: parseInt(e.target.value) || 0 })}
                    placeholder="10000"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Fixed fee per session regardless of duration
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charges" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Court Charges by Duration
                </CardTitle>
                <Button onClick={addCourtCharge} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Duration
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courtCharges.map((charge, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label>Duration (hours)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={charge.duration}
                          onChange={(e) => updateCourtCharge(index, 'duration', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Amount (TZS)</Label>
                        <Input
                          type="number"
                          value={charge.amount}
                          onChange={(e) => updateCourtCharge(index, 'amount', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex-shrink-0 pt-6">
                        <span className="text-sm text-muted-foreground mr-2">
                          {formatDuration(charge.duration)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourtCharge(index)}
                          disabled={courtCharges.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Maximum Players Per Court
                </CardTitle>
                <Button onClick={addPlayerLimit} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Courts
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {playerLimits.map((limit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label>Number of Courts</Label>
                        <Input
                          type="number"
                          min="1"
                          value={limit.courts}
                          onChange={(e) => updatePlayerLimit(index, 'courts', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Maximum Players</Label>
                        <Input
                          type="number"
                          min="1"
                          value={limit.maxPlayers}
                          onChange={(e) => updatePlayerLimit(index, 'maxPlayers', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="flex-shrink-0 pt-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlayerLimit(index)}
                          disabled={playerLimits.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="orange">
            {location ? 'Update Location' : 'Create Location'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};