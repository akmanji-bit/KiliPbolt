import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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

interface EditPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
  onSave: (player: Player) => void;
}

const EditPlayerDialog: React.FC<EditPlayerDialogProps> = ({
  open,
  onOpenChange,
  player,
  onSave,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [contactNumber, setContactNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+255');
  const [duprId, setDuprId] = useState('');
  const [role, setRole] = useState<string>('Player');
  const [notes, setNotes] = useState('');
  const [balance, setBalance] = useState(0);
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
        } catch {
          // Fallback to default roles
          const defaultRoles = [
            { id: 'admin-role', name: 'Administrator', description: 'Full access', permissions: [], createdAt: new Date(), isDefault: true },
            { id: 'player-role', name: 'Player', description: 'Basic access', permissions: [], createdAt: new Date(), isDefault: true }
          ];
          setAvailableRoles(defaultRoles);
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

  useEffect(() => {
    if (player) {
      setFirstName(player.firstName);
      setLastName(player.lastName);
      setEmail(player.email);
      setBirthDate(player.birthDate);
      setContactNumber(player.contactNumber);
      setCountryCode(player.countryCode);
      setDuprId(player.duprId);
      setRole(player.role);
      setNotes(player.notes);
      setBalance(player.balance);
    }
  }, [player]);

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !contactNumber.trim()) {
      return;
    }

    const updatedPlayer: Player = {
      ...player,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      birthDate,
      contactNumber: contactNumber.trim(),
      countryCode,
      duprId: duprId.trim(),
      role,
      notes: notes.trim(),
      balance,
    };

    onSave(updatedPlayer);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Player Details</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update {player.firstName} {player.lastName}'s information below.
          </p>
        </DialogHeader>

        {/* Profile Preview */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(firstName || player.firstName, lastName || player.lastName)}
            </div>
            <div>
              <h3 className="font-semibold text-base">Profile Preview</h3>
              <p className="text-sm text-foreground">{firstName || player.firstName} {lastName || player.lastName}</p>
              <p className="text-xs text-muted-foreground">Kili ID: {player.kiliId}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName" className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                id="edit-firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lastName" className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id="edit-lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Birth Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 text-sm",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  {birthDate ? format(birthDate, "dd/MM/yyyy") : "Select date"}
                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Contact Number</Label>
            <div className="flex gap-2">
              <Input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="+255"
                className="w-32 h-10 text-sm"
              />
              <Input
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 h-10 text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Number will be saved as: {countryCode} {contactNumber}
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="h-10 text-sm"
            />
          </div>

          {/* DUPR ID */}
          <div className="space-y-2">
            <Label htmlFor="edit-duprId" className="text-sm font-medium">
              DUPR ID
            </Label>
            <Input
              id="edit-duprId"
              value={duprId}
              onChange={(e) => setDuprId(e.target.value)}
              placeholder="Enter DUPR ID"
              className="h-10 text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Dynamic Universal Pickleball Rating ID (alphanumeric code)
            </p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Role</Label>
            <Select value={role} onValueChange={(value: string) => setRole(value)}>
              <SelectTrigger className="h-10 text-sm">
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
            <p className="text-xs text-muted-foreground">
              Assign a role to define the player's permissions and access level.
              {availableRoles.length === 0 && " Loading roles..."}
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-sm font-medium">
              Notes
            </Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={handleClose} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-6 bg-orange-500 hover:bg-orange-600 text-white"
          >
            Update Player
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EditPlayerDialog };