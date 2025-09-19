import React, { useState, useMemo, useEffect } from 'react';
import { Users, Plus, Edit, Eye, Trash2, UserX, DollarSign, Mail, Phone, CreditCard, Search, Download, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddPlayerDialog } from '@/components/AddPlayerDialog';
import { EditPlayerDialog } from '@/components/EditPlayerDialog';
import { PlayerViewDialog } from '@/components/PlayerViewDialog';
import { DeletePlayerDialog } from '@/components/DeletePlayerDialog';
import { useToast } from '@/hooks/use-toast';
import { PlayerTransactionsDialog } from '@/components/PlayerTransactionsDialog';
import * as XLSX from 'xlsx';
import kiliLogo from '@/assets/kili-logo.png';

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

const Players = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransactionsDialogOpen, setIsTransactionsDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Load players from localStorage or start with empty array
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
      try {
        const parsed = JSON.parse(savedPlayers);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [balanceFilter, setBalanceFilter] = useState<'all' | 'positive' | 'negative' | 'zero'>('all');

  // Get payments data from localStorage to show in transactions dialog
  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem('financePayments');
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  // Save players to localStorage whenever players state changes
  useEffect(() => {
    localStorage.setItem('playersData', JSON.stringify(players));
  }, [players]);

  // Recalculate player balances based on payments
  useEffect(() => {
    const recalculateBalances = () => {
      const updatedPlayers = players.map(player => {
        const playerPayments = payments.filter(p => 
          p.playerId === player.id && !p.archived
        );
        const calculatedBalance = playerPayments.reduce((sum, p) => sum + p.amount, 0);
        return { ...player, balance: calculatedBalance };
      });
      
      if (JSON.stringify(updatedPlayers) !== JSON.stringify(players)) {
        setPlayers(updatedPlayers);
      }
    };

    recalculateBalances();
  }, [payments]);

  // Listen for custom data events (when DataManagement clears data)
  useEffect(() => {
    const handleDataChange = () => {
      const savedPlayers = localStorage.getItem('playersData');
      if (!savedPlayers) {
        setPlayers([]);
      } else {
        setPlayers(JSON.parse(savedPlayers));
      }
    };

    window.addEventListener('playersDataChanged', handleDataChange);
    return () => window.removeEventListener('playersDataChanged', handleDataChange);
  }, []);

  // Filter and search players
  const filteredPlayers = useMemo(() => {
    let filtered = players;

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(player => player.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(player => !player.isActive);
    }

    // Apply balance filter
    if (balanceFilter === 'positive') {
      filtered = filtered.filter(player => player.balance > 0);
    } else if (balanceFilter === 'negative') {
      filtered = filtered.filter(player => player.balance < 0);
    } else if (balanceFilter === 'zero') {
      filtered = filtered.filter(player => player.balance === 0);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(player =>
        player.firstName.toLowerCase().includes(searchLower) ||
        player.lastName.toLowerCase().includes(searchLower) ||
        player.email.toLowerCase().includes(searchLower) ||
        player.kiliId.toLowerCase().includes(searchLower) ||
        player.duprId.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [players, searchTerm, statusFilter, balanceFilter]);

  // Count statistics
  const playerStats = useMemo(() => {
    const total = players.length;
    const active = players.filter(p => p.isActive).length;
    const inactive = players.filter(p => !p.isActive).length;
    const positiveBalance = players.filter(p => p.balance > 0).length;
    const negativeBalance = players.filter(p => p.balance < 0).length;
    const zeroBalance = players.filter(p => p.balance === 0).length;
    return { 
      total, 
      active, 
      inactive, 
      positiveBalance, 
      negativeBalance, 
      zeroBalance 
    };
  }, [players]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers([...players, { ...newPlayer, balance: 0, isActive: true }]);
  };

  const handleEditPlayer = (updatedPlayer: Player) => {
    setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setIsEditDialogOpen(false);
    setSelectedPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
    setIsDeleteDialogOpen(false);
    setSelectedPlayer(null);
  };

  const handleTogglePlayerStatus = (playerId: string) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleViewPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsDeleteDialogOpen(true);
  };

  const handleTransactions = (player: Player) => {
    setSelectedPlayer(player);
    setIsTransactionsDialogOpen(true);
  };

  const handleExport = () => {
    try {
      const exportData = players.map(player => ({
        'Kili ID': player.kiliId,
        'First Name': player.firstName,
        'Last Name': player.lastName,
        'Email': player.email,
        'Birth Date': player.birthDate ? player.birthDate.toISOString().split('T')[0] : '',
        'Contact Number': `${player.countryCode} ${player.contactNumber}`,
        'DUPR ID': player.duprId,
        'Role': player.role,
        'Balance': player.balance,
        'Status': player.isActive ? 'Active' : 'Inactive',
        'Notes': player.notes,
      }));

      const headers = [
        'Kili ID',
        'First Name', 
        'Last Name',
        'Email',
        'Birth Date',
        'Contact Number',
        'DUPR ID',
        'Role',
        'Balance',
        'Status',
        'Notes'
      ];

      const ws = XLSX.utils.json_to_sheet(exportData, { header: headers });
      
      if (exportData.length === 0) {
        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Players');
      XLSX.writeFile(wb, `Players_Export_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "Export Successful",
        description: `Exported ${players.length} players to Excel file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  const handleTemplate = () => {
    try {
      const templateData = [
        {
          'Kili ID': 'Kili-001',
          'First Name': 'John',
          'Last Name': 'Doe',
          'Email': 'john.doe@example.com',
          'Birth Date': '1990-01-15',
          'Contact Number': '+255 712 345 678',
          'DUPR ID': 'DUPR-123',
          'Role': 'Player',
          'Balance': 0,
          'Status': 'Active',
          'Notes': 'Regular member'
        },
        {
          'Kili ID': 'Kili-002',
          'First Name': 'Jane',
          'Last Name': 'Smith',
          'Email': 'jane.smith@example.com',
          'Birth Date': '1985-07-22',
          'Contact Number': '+255 754 987 321',
          'DUPR ID': 'DUPR-456',
          'Role': 'Coach',
          'Balance': 150.00,
          'Status': 'Active',
          'Notes': 'Certified instructor'
        }
      ];

      const headers = [
        'Kili ID',
        'First Name', 
        'Last Name',
        'Email',
        'Birth Date',
        'Contact Number',
        'DUPR ID',
        'Role',
        'Balance',
        'Status',
        'Notes'
      ];

      const ws = XLSX.utils.json_to_sheet(templateData, { header: headers });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Player Template');
      XLSX.writeFile(wb, `Player_Import_Template.xlsx`);

      toast({
        title: "Template Downloaded",
        description: "Import template with sample data downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the template.",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedPlayers: Player[] = jsonData.map((row: any, index) => ({
          id: Date.now().toString() + index,
          kiliId: row['Kili ID'] || `Kili-${String(index + 1).padStart(3, '0')}`,
          firstName: row['First Name'] || '',
          lastName: row['Last Name'] || '',
          email: row['Email'] || '',
          birthDate: row['Birth Date'] ? new Date(row['Birth Date']) : undefined,
          contactNumber: row['Contact Number']?.replace(/^\+\d+\s/, '') || '',
          countryCode: row['Contact Number']?.match(/^\+\d+/)?.[0] || '+255',
          duprId: row['DUPR ID'] || '',
          role: row['Role'] || 'Player',
          notes: row['Notes'] || '',
          balance: Number(row['Balance']) || 0,
          isActive: row['Status'] === 'Active'
        }));

        setPlayers([...players, ...importedPlayers]);

        toast({
          title: "Import Successful",
          description: `Imported ${importedPlayers.length} players.`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "There was an error importing the file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-500" />
              Player Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage player registrations, profiles, and account balances
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleTemplate}>
              <FileText className="h-4 w-4 mr-2" />
              Template
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Players</p>
                  <p className="text-lg font-bold text-orange-500">{playerStats.total}</p>
                </div>
                <Users className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-lg font-bold text-green-500">{playerStats.active}</p>
                </div>
                <UserX className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-lg font-bold text-red-500">{playerStats.inactive}</p>
                </div>
                <UserX className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Positive Balance</p>
                  <p className="text-lg font-bold text-green-500">{playerStats.positiveBalance}</p>
                </div>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Negative Balance</p>
                  <p className="text-lg font-bold text-red-500">{playerStats.negativeBalance}</p>
                </div>
                <DollarSign className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Zero Balance</p>
                  <p className={`text-lg font-bold ${playerStats.zeroBalance > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                    {playerStats.zeroBalance}
                  </p>
                </div>
                <DollarSign className={`h-6 w-6 ${playerStats.zeroBalance > 0 ? 'text-yellow-600' : 'text-muted-foreground'}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={balanceFilter} onValueChange={(value: 'all' | 'positive' | 'negative' | 'zero') => setBalanceFilter(value)}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Balance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Balances</SelectItem>
                    <SelectItem value="positive">Positive Balance</SelectItem>
                    <SelectItem value="negative">Negative Balance</SelectItem>
                    <SelectItem value="zero">Zero Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players Grid or Empty State */}
        {filteredPlayers.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {players.length === 0 ? 'No players registered' : 'No players match your search'}
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                {players.length === 0 
                  ? 'Get started by adding your first player or importing player data from a spreadsheet.'
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add First Player
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <Card key={player.id} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-orange-400/10 to-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative pb-4 pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                        {player.firstName} {player.lastName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium border-orange-200 text-orange-700 bg-orange-50/50">
                          {player.kiliId}
                        </Badge>
                        <Badge className="text-xs font-medium bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0">
                          {player.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant={player.isActive ? "default" : "secondary"}
                        className={player.isActive 
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-sm" 
                          : "bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0"
                        }
                      >
                        {player.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Contact info */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{player.email}</span>
                    </div>
                    {player.contactNumber && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{player.countryCode} {player.contactNumber}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  {/* Balance card */}
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/80 border border-slate-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Account Balance</span>
                      <div className="flex items-center gap-1">
                        <span className={`text-lg font-bold ${
                          player.balance > 0 ? 'text-green-600' : 
                          player.balance < 0 ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {Math.abs(player.balance).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">TZS</span>
                      </div>
                    </div>
                    {player.balance !== 0 && (
                      <div className="mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            player.balance > 0 
                              ? 'border-green-200 text-green-700 bg-green-50' 
                              : 'border-red-200 text-red-700 bg-red-50'
                          }`}
                        >
                          {player.balance > 0 ? 'Credit' : 'Debit'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-5 gap-1.5">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleViewPlayer(player)}
                      className="h-9 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleEditClick(player)}
                      className="h-9 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      title="Edit Player"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleTransactions(player)}
                      className="h-9 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      title="Transactions"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleTogglePlayerStatus(player.id)}
                      className={`h-9 transition-colors ${
                        player.isActive 
                          ? "hover:bg-orange-50 hover:text-orange-600" 
                          : "hover:bg-green-50 hover:text-green-600"
                      }`}
                      title={player.isActive ? "Deactivate" : "Activate"}
                    >
                      {player.isActive ? <UserX className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteClick(player)}
                      className="h-9 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete Player"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialogs */}
        <AddPlayerDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAddPlayer={handleAddPlayer}
          existingPlayers={players}
        />

        {selectedPlayer && (
          <EditPlayerDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            player={selectedPlayer}
            onSave={handleEditPlayer}
          />
        )}

        {selectedPlayer && (
          <PlayerViewDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            player={selectedPlayer}
          />
        )}

        {selectedPlayer && (
          <DeletePlayerDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            player={selectedPlayer}
            onConfirm={() => handleDeletePlayer(selectedPlayer.id)}
          />
        )}

        {selectedPlayer && (
          <PlayerTransactionsDialog
            open={isTransactionsDialogOpen}
            onOpenChange={setIsTransactionsDialogOpen}
            player={selectedPlayer}
            payments={payments}
          />
        )}
      </div>
    </div>
  );
};

export default Players;