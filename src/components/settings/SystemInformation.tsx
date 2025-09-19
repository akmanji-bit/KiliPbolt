import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Server, 
  Database, 
  Activity, 
  Clock, 
  HardDrive, 
  Upload, 
  Download,
  AlertCircle,
  CheckCircle,
  Settings,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Calendar,
  Users,
  CreditCard,
  MapPin,
  Wifi,
  WifiOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SystemInformation: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    checkSupabaseConnection();
    loadLocalData();
    setLastUpdate(new Date());
  }, []);

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('players').select('count').limit(1);
      setSupabaseConnected(!error);
    } catch (error) {
      setSupabaseConnected(false);
    }
  };

  const loadLocalData = () => {
    const storedPlayers = localStorage.getItem('players');
    const storedPayments = localStorage.getItem('payments');
    
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    }
    
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }
  };

  const formatUptime = () => {
    const uptimeMs = performance.now();
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2) + ' KB';
  };

  const getConnectionStatus = () => {
    return navigator.onLine;
  };

  const exportSystemReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      systemHealth: {
        serverUptime: formatUptime(),
        connectionStatus: getConnectionStatus() ? 'Online' : 'Offline',
        databaseStatus: supabaseConnected ? 'Connected' : 'Local Storage',
        lastUpdated: lastUpdate.toISOString(),
      },
      dataManagement: {
        storageUsed: getStorageSize(),
        playersCount: players.length,
        paymentsCount: payments.length,
        locationsCount: JSON.parse(localStorage.getItem('locations') || '[]').length,
      },
      configuration: {
        enabledFeatures: [
          { name: 'Player Management', status: 'Active' },
          { name: 'Payment Tracking', status: 'Active' },
          { name: 'Court Configuration', status: 'Active' },
          { name: 'Data Export/Import', status: 'Active' },
          { name: 'Real-time Updates', status: 'Pending' },
        ],
        securitySettings: [
          { name: 'Authentication', status: 'Mock Login' },
          { name: 'Data Encryption', status: 'Local Only' },
          { name: 'User Sessions', status: 'Browser Based' },
          { name: 'Access Control', status: 'Basic' },
        ],
        integrationStatus: [
          { name: 'Supabase Database', status: supabaseConnected ? 'Connected' : 'Available' },
          { name: 'Real-time Sync', status: 'Disabled' },
          { name: 'File Storage', status: 'Not Configured' },
          { name: 'Email Service', status: 'Not Configured' },
        ],
        systemInformation: [
          { name: 'Environment', value: 'Development' },
          { name: 'Browser', value: navigator.userAgent.split(' ')[0] },
          { name: 'Storage Type', value: 'LocalStorage' },
          { name: 'Build Version', value: '1.0.0' },
        ],
      },
      rawData: {
        localStorage: {
          keys: Object.keys(localStorage),
          totalSize: getStorageSize(),
        },
        players: players.length > 0 ? players : 'No player data available',
        payments: payments.length > 0 ? payments : 'No payment data available',
        locations: JSON.parse(localStorage.getItem('locations') || '[]'),
      },
    };

    // Create formatted report
    const reportText = `
TENNIS CLUB MANAGEMENT SYSTEM - SYSTEM REPORT
===============================================
Generated: ${new Date().toLocaleString()}

SYSTEM HEALTH
=============
Server Uptime: ${reportData.systemHealth.serverUptime}
Connection Status: ${reportData.systemHealth.connectionStatus}
Database Status: ${reportData.systemHealth.databaseStatus}
Last Updated: ${new Date(reportData.systemHealth.lastUpdated).toLocaleString()}

DATA MANAGEMENT
===============
Storage Used: ${reportData.dataManagement.storageUsed}
Players Count: ${reportData.dataManagement.playersCount}
Payments Count: ${reportData.dataManagement.paymentsCount}
Locations Count: ${reportData.dataManagement.locationsCount}

CONFIGURATION OVERVIEW
======================

Enabled Features:
${reportData.configuration.enabledFeatures.map(f => `- ${f.name}: ${f.status}`).join('\n')}

Security Settings:
${reportData.configuration.securitySettings.map(s => `- ${s.name}: ${s.status}`).join('\n')}

Integration Status:
${reportData.configuration.integrationStatus.map(i => `- ${i.name}: ${i.status}`).join('\n')}

System Information:
${reportData.configuration.systemInformation.map(s => `- ${s.name}: ${s.value}`).join('\n')}

RAW DATA SUMMARY
================
LocalStorage Keys: ${reportData.rawData.localStorage.keys.join(', ')}
Total Storage Size: ${reportData.rawData.localStorage.totalSize}

Players Data: ${typeof reportData.rawData.players === 'string' ? reportData.rawData.players : `${reportData.rawData.players.length} records available`}
Payments Data: ${typeof reportData.rawData.payments === 'string' ? reportData.rawData.payments : `${reportData.rawData.payments.length} records available`}
Locations Data: ${reportData.rawData.locations.length} location(s) configured

===============================================
End of Report
`;

    // Create and download the report
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also create JSON version
    const jsonBlob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `system-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
  };

  return (
    <div className="space-y-6">
      {/* System Health Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Activity className="h-6 w-6 text-accent" />
          System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                Server Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{formatUptime()}</div>
              <p className="text-xs text-muted-foreground">Session duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {getConnectionStatus() ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getConnectionStatus() ? (
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                ) : (
                  <Badge variant="destructive">Offline</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Network connectivity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {supabaseConnected ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="secondary">Local Storage</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {supabaseConnected ? 'Supabase' : 'Browser storage'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {lastUpdate.toLocaleTimeString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Management Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <HardDrive className="h-6 w-6 text-accent" />
          Data Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{getStorageSize()}</div>
              <p className="text-xs text-muted-foreground">Local storage size</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Players Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{players.length}</div>
              <p className="text-xs text-muted-foreground">Total registered players</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payments Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{payments.length}</div>
              <p className="text-xs text-muted-foreground">Total payment records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {JSON.parse(localStorage.getItem('locations') || '[]').length}
              </div>
              <p className="text-xs text-muted-foreground">Configured court locations</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Configuration Overview Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-6 w-6 text-accent" />
          Configuration Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Enabled Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Player Management</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Tracking</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Court Configuration</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Export/Import</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Updates</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <Badge variant="secondary">Mock Login</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Encryption</span>
                <Badge variant="secondary">Local Only</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Sessions</span>
                <Badge variant="secondary">Browser Based</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Access Control</span>
                <Badge variant="secondary">Basic</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Supabase Database</span>
                {supabaseConnected ? (
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                ) : (
                  <Badge variant="secondary">Available</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Sync</span>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Storage</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge variant="secondary">Not Configured</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Environment</span>
                <Badge variant="outline">Development</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Browser</span>
                <Badge variant="outline">{navigator.userAgent.split(' ')[0]}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Type</span>
                <Badge variant="outline">LocalStorage</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Build Version</span>
                <Badge variant="outline">1.0.0</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button 
          onClick={() => {
            setLastUpdate(new Date());
            checkSupabaseConnection();
            loadLocalData();
          }}
          variant="default"
          className="gap-2"
        >
          <Activity className="h-4 w-4" />
          Refresh System Status
        </Button>
        <Button 
          onClick={exportSystemReport}
          variant="outline" 
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export System Report
        </Button>
      </div>
    </div>
  );
};