import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, UserCheck, Users, Shield, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  isDefault: boolean;
}

export const RoleManagement: React.FC = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Load roles from localStorage or initialize with defaults
  useEffect(() => {
    const savedRoles = localStorage.getItem('userRoles');
    if (savedRoles) {
      try {
        const parsed = JSON.parse(savedRoles);
        const rolesWithDates = parsed.map((role: any) => ({
          ...role,
          createdAt: new Date(role.createdAt)
        }));
        setRoles(rolesWithDates);
      } catch {
        initializeDefaultRoles();
      }
    } else {
      initializeDefaultRoles();
    }
  }, []);

  // Save roles to localStorage whenever roles change
  useEffect(() => {
    if (roles.length > 0) {
      localStorage.setItem('userRoles', JSON.stringify(roles));
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('rolesDataChanged'));
    }
  }, [roles]);

  const initializeDefaultRoles = () => {
    const defaultRoles: Role[] = [
      {
        id: 'admin-role',
        name: 'Administrator',
        description: 'Full system access and management privileges',
        permissions: ['manage_users', 'manage_finances', 'manage_courts', 'view_reports', 'system_settings'],
        createdAt: new Date('2025-09-18'),
        isDefault: true
      },
      {
        id: 'player-role',
        name: 'Player',
        description: 'Standard club member with basic access',
        permissions: ['view_profile', 'book_courts', 'view_schedule'],
        createdAt: new Date('2025-09-18'),
        isDefault: true
      }
    ];
    setRoles(defaultRoles);
  };

  const handleAddRole = () => {
    if (!newRole.name.trim() || !newRole.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both role name and description.",
        variant: "destructive",
      });
      return;
    }

    const role: Role = {
      id: `role-${Date.now()}`,
      name: newRole.name.trim(),
      description: newRole.description.trim(),
      permissions: newRole.permissions,
      createdAt: new Date(),
      isDefault: false
    };

    setRoles([...roles, role]);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsAddRoleOpen(false);

    toast({
      title: "Role Added",
      description: `${role.name} role has been created successfully.`,
    });
  };

  const handleEditRole = () => {
    if (!selectedRole || !newRole.name.trim() || !newRole.description.trim()) {
      return;
    }

    const oldRoleName = selectedRole.name;
    const newRoleName = newRole.name.trim();

    const updatedRoles = roles.map(role =>
      role.id === selectedRole.id
        ? {
            ...role,
            name: newRoleName,
            description: newRole.description.trim(),
            permissions: newRole.permissions
          }
        : role
    );

    setRoles(updatedRoles);

    // If role name changed, update all players with the old role name
    if (oldRoleName !== newRoleName) {
      updatePlayersWithNewRoleName(oldRoleName, newRoleName);
    }

    setIsEditRoleOpen(false);
    setSelectedRole(null);
    setNewRole({ name: '', description: '', permissions: [] });

    toast({
      title: "Role Updated",
      description: `Role updated successfully. ${oldRoleName !== newRoleName ? 'All players with this role have been updated.' : ''}`,
    });
  };

  const updatePlayersWithNewRoleName = (oldRoleName: string, newRoleName: string) => {
    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
      try {
        const playersData = JSON.parse(savedPlayers);
        const updatedPlayersData = playersData.map((player: any) => 
          player.role === oldRoleName 
            ? { ...player, role: newRoleName }
            : player
        );
        
        // Only update if there were actual changes
        const hasChanges = updatedPlayersData.some((player: any, index: number) => 
          player.role !== playersData[index].role
        );

        if (hasChanges) {
          localStorage.setItem('playersData', JSON.stringify(updatedPlayersData));
          // Dispatch event to notify Players page of the change
          window.dispatchEvent(new CustomEvent('playersDataChanged'));
        }
      } catch (error) {
        console.error('Error updating player roles:', error);
      }
    }
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default roles cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    if (!role) return;

    // Check if any players have this role
    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
      try {
        const playersData = JSON.parse(savedPlayers);
        const playersWithRole = playersData.filter((player: any) => player.role === role.name);
        
        if (playersWithRole.length > 0) {
          toast({
            title: "Cannot Delete Role",
            description: `${playersWithRole.length} player(s) are assigned this role. Please reassign them first.`,
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error('Error checking player roles:', error);
      }
    }

    setRoles(roles.filter(r => r.id !== roleId));
    toast({
      title: "Role Deleted",
      description: "Role has been deleted successfully.",
    });
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setIsEditRoleOpen(true);
  };

  const resetAddDialog = () => {
    setNewRole({ name: '', description: '', permissions: [] });
    setIsAddRoleOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Shield className="h-5 w-5" />
                Role Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage player roles and permissions
              </p>
            </div>
            <Button onClick={resetAddDialog} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Roles Stats */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-orange-800">Total Roles</h3>
                  <p className="text-sm text-orange-600">Available role types</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {roles.length}
              </div>
            </div>
          </div>

          {/* Roles List */}
          <div className="space-y-4">
            {roles.map((role) => (
              <Card key={role.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{role.name}</h3>
                          {role.isDefault && (
                            <Badge variant="outline" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {role.description}
                      </p>
                      
                      <div className="text-xs text-muted-foreground">
                        Created: {role.createdAt.toLocaleDateString('en-GB')}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openEditDialog(role)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {!role.isDefault && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-orange-600" />
              Add New Role
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Enter role name"
              />
            </div>
            <div>
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe the role and its purpose"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddRole} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Add Role
              </Button>
              <Button variant="outline" onClick={() => setIsAddRoleOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-orange-600" />
              Edit Role
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input
                id="edit-role-name"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                placeholder="Enter role name"
                disabled={selectedRole?.isDefault}
              />
            </div>
            <div>
              <Label htmlFor="edit-role-description">Description</Label>
              <Textarea
                id="edit-role-description"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe the role and its purpose"
                rows={3}
              />
            </div>
            {selectedRole?.isDefault && (
              <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                Note: Role name cannot be changed for default roles.
              </p>
            )}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditRole} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Update Role
              </Button>
              <Button variant="outline" onClick={() => setIsEditRoleOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};