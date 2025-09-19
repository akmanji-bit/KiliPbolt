import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  isDefault: boolean;
}

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

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPlayer: (player: Player) => void;
  existingPlayers: Player[];
}

const countryCodes = [
  { code: '+255', country: 'Tanzania' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+254', country: 'Kenya' },
  { code: '+256', country: 'Uganda' },
  { code: '+250', country: 'Rwanda' },
];

export function AddPlayerDialog({ open, onOpenChange, onAddPlayer, existingPlayers }: AddPlayerDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+255');
  const [duprId, setDuprId] = useState('');
  const [role, setRole] = useState<string>('Player');
  const [notes, setNotes] = useState('');
  const [kiliId, setKiliId] = useState('');
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Load available roles from localStorage
  useEffect(() => {
    const loadRoles = () => {
      const savedRoles = localStorage.getItem('userRoles');
      if (savedRoles) {
        try {
          const parsed = JSON.parse(savedRoles);
          const rolesWithDates = parsed.map((role: any) => ({
            ...role,
            createdAt: new Date(role.createdAt)
          }));
          setAvailableRoles(rolesWithDates);
          // Set default role to 'Player' if available
          const playerRole = rolesWithDates.find((r: Role) => r.name === 'Player');
          if (playerRole) {
            setRole(playerRole.name);
          }
        } catch {
          // Fallback to default roles
          const defaultRoles = [
            { id: 'admin-role', name: 'Administrator', description: 'Full access', permissions: [], createdAt: new Date(), isDefault: true },
            { id: 'player-role', name: 'Player', description: 'Basic access', permissions: [], createdAt: new Date(), isDefault: true }
          ];
          setAvailableRoles(defaultRoles);
          setRole('Player');
        }
      }
    };

    loadRoles();

    // Listen for role changes
    const handleRolesChanged = () => {
      loadRoles();
    };

    window.addEventListener('rolesDataChanged', handleRolesChanged);
    return () => window.removeEventListener('rolesDataChanged', handleRolesChanged);
  }, []);

  // Generate Kili ID automatically
  useEffect(() => {
    if (firstName || lastName) {
      const nextNumber = existingPlayers.length + 1;
      const paddedNumber = nextNumber.toString().padStart(3, '0');
      setKiliId(`Kili-${paddedNumber}`);
    }
  }, [firstName, lastName, existingPlayers.length]);

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email) {
      return;
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      kiliId,
      firstName,
      lastName,
      email,
      birthDate,
      contactNumber,
      countryCode,
      duprId,
      role,
      notes,
      balance: 0,
      isActive: true,
    };

    onAddPlayer(newPlayer);
    handleClose();
  };

  const handleClose = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setBirthDate(undefined);
    setContactNumber('');
    setCountryCode('+255');
    setDuprId('');
    setRole('Player');
    setNotes('');
    setKiliId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Add New Player</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground mb-6">
          Enter the player details below. A Kili ID will be automatically generated.
        </p>

        {/* Profile Preview */}
        {(firstName || lastName) && (
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-lg">
                {getInitials(firstName, lastName)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">Profile Preview</h3>
                <p className="text-foreground">{firstName} {lastName}</p>
                <p className="text-muted-foreground text-sm">Kili ID: {kiliId}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-foreground font-medium">
                First Name *
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-foreground font-medium">
                Last Name *
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                required
                className="h-12"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
              className="h-12"
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-foreground font-medium">Birth Date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setBirthDate(date);
              }}
              className="h-12"
            />
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Contact Number</Label>
            <div className="flex gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="+255"
                className="w-32 h-12"
              />
              <Input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 h-12"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Number will be saved as: {countryCode} {contactNumber}
            </p>
          </div>

          {/* DUPR ID */}
          <div className="space-y-2">
            <Label htmlFor="duprId" className="text-foreground font-medium">
              DUPR ID
            </Label>
            <Input
              id="duprId"
              value={duprId}
              onChange={(e) => setDuprId(e.target.value)}
              placeholder="Enter DUPR ID (e.g., DWR5DM)"
              className="h-12"
            />
            <p className="text-sm text-muted-foreground">
              Dynamic Universal Pickleball Rating ID (alphanumeric code)
            </p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Role</Label>
            <Select value={role} onValueChange={(value: string) => setRole(value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((roleOption) => (
                  <SelectItem key={roleOption.id} value={roleOption.name}>
                    <div className="flex flex-col items-start">
                      <span>{roleOption.name}</span>
                      <span className="text-xs text-muted-foreground">{roleOption.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Assign a role to define the player's permissions and access level. 
              {availableRoles.length === 0 && " Loading roles..."}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground font-medium">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes"
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Add Player
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}