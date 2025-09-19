import React from 'react';
import { Mail, Phone, CreditCard, Calendar, FileText, User, Hash, Trophy, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format, differenceInYears } from 'date-fns';

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

interface PlayerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: Player;
}

const PlayerViewDialog: React.FC<PlayerViewDialogProps> = ({
  open,
  onOpenChange,
  player,
}) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const getAge = (birthDate: Date | undefined) => {
    if (!birthDate) return null;
    return differenceInYears(new Date(), birthDate);
  };

  const getRoleDescription = (role: string) => {
    return role === 'Administrator' ? 'Full system access and management privileges' : 'Standard player access';
  };

  // Mock joined date - in real app, this would come from the player data
  const joinedDate = new Date('2025-08-28');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Player Details</DialogTitle>
          <p className="text-sm text-muted-foreground">
            View and manage {player.firstName} {player.lastName}'s profile
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
              {getInitials(player.firstName, player.lastName)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                {player.firstName} {player.lastName}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs">
                  {player.kiliId}
                </Badge>
                {player.duprId && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    DUPR: {player.duprId}
                  </Badge>
                )}
                <Badge className={`px-2 py-1 text-xs ${
                  player.isActive 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}>
                  {player.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-medium text-muted-foreground mb-6 uppercase tracking-wide">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold text-foreground mb-1 text-sm">Email</p>
                  <p className="text-muted-foreground text-sm">{player.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold text-foreground mb-1 text-sm">Phone</p>
                  <p className="text-muted-foreground text-sm">{player.countryCode} {player.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-base font-medium text-muted-foreground mb-6 uppercase tracking-wide">
              Personal Information
            </h3>
            <div className="space-y-6">
              {player.birthDate && (
                <div className="flex items-start gap-4">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1 text-sm">Date of Birth</p>
                    <p className="text-muted-foreground text-sm">
                      {format(player.birthDate, "MMMM d, yyyy")} ({getAge(player.birthDate)} years old)
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <Shield className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold text-foreground mb-1 text-sm">Role</p>
                  <p className="text-muted-foreground text-sm">{player.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRoleDescription(player.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Membership */}
          <div>
            <h3 className="text-base font-medium text-muted-foreground mb-6 uppercase tracking-wide">
              Membership
            </h3>
            <div className="flex items-start gap-4">
              <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-semibold text-foreground mb-1 text-sm">Joined</p>
                <p className="text-muted-foreground text-sm">{format(joinedDate, "MMMM d, yyyy")}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {player.notes && (
            <div>
              <h3 className="text-base font-medium text-muted-foreground mb-6 uppercase tracking-wide">
                Notes
              </h3>
              <div className="flex items-start gap-4">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground mb-3 text-sm">Personal Notes</p>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-muted-foreground text-sm">{player.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PlayerViewDialog };