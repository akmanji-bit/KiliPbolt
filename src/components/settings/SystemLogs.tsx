import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  User, 
  AlertTriangle, 
  Shield, 
  Activity,
  RefreshCw,
  Download
} from 'lucide-react';
import { useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  message: string;
  user?: string;
  details?: string;
}

export const SystemLogs = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in real app, this would come from Supabase
  const userLogins: LogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:22',
      type: 'success',
      category: 'Authentication',
      message: 'User logged in successfully',
      user: 'admin@clubhouse.com',
      details: 'IP: 192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-01-15 13:45:10',
      type: 'warning',
      category: 'Authentication',
      message: 'Failed login attempt',
      user: 'unknown@example.com',
      details: 'Invalid credentials - IP: 203.0.113.42'
    },
    {
      id: '3',
      timestamp: '2024-01-15 12:15:30',
      type: 'success',
      category: 'Authentication',
      message: 'User logged out',
      user: 'manager@clubhouse.com'
    }
  ];

  const systemEvents: LogEntry[] = [
    {
      id: '4',
      timestamp: '2024-01-15 15:20:15',
      type: 'info',
      category: 'Player Management',
      message: 'New player registered',
      details: 'Player: John Doe, ID: PLR-001'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:55:08',
      type: 'success',
      category: 'Payments',
      message: 'Payment processed successfully',
      details: 'Amount: 50,000 TZS, Player: Jane Smith'
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:30:45',
      type: 'info',
      category: 'Court Configuration',
      message: 'Court schedule updated',
      details: 'Court 2 - Morning slots modified'
    },
    {
      id: '7',
      timestamp: '2024-01-15 13:20:22',
      type: 'info',
      category: 'Data Management',
      message: 'Database backup completed',
      details: 'Size: 2.3 MB, Duration: 45 seconds'
    }
  ];

  const errorLogs: LogEntry[] = [
    {
      id: '8',
      timestamp: '2024-01-15 11:30:15',
      type: 'error',
      category: 'Database',
      message: 'Connection timeout error',
      details: 'Failed to connect to database after 30 seconds'
    },
    {
      id: '9',
      timestamp: '2024-01-15 10:45:32',
      type: 'warning',
      category: 'Validation',
      message: 'Invalid email format detected',
      details: 'Player registration form validation failed'
    }
  ];

  const auditTrail: LogEntry[] = [
    {
      id: '10',
      timestamp: '2024-01-15 16:10:20',
      type: 'info',
      category: 'Security',
      message: 'User role updated',
      user: 'admin@clubhouse.com',
      details: 'Changed user role from Member to Manager'
    },
    {
      id: '11',
      timestamp: '2024-01-15 15:45:18',
      type: 'info',
      category: 'Configuration',
      message: 'System settings modified',
      user: 'admin@clubhouse.com',
      details: 'Updated court booking time limits'
    },
    {
      id: '12',
      timestamp: '2024-01-15 14:20:35',
      type: 'warning',
      category: 'Data',
      message: 'Bulk data deletion performed',
      user: 'manager@clubhouse.com',
      details: 'Deleted 15 archived payment records'
    }
  ];

  const getTypeIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
    }
  };

  const getTypeBadge = (type: LogEntry['type']) => {
    const variants = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive',
      info: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[type]} className="text-xs">
        {type.toUpperCase()}
      </Badge>
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    const allLogs = {
      exportDate: new Date().toISOString(),
      systemEvents: systemEvents,
      userLogins: userLogins,
      errorLogs: errorLogs,
      auditTrail: auditTrail,
      summary: {
        totalSystemEvents: systemEvents.length,
        totalUserLogins: userLogins.length,
        totalErrors: errorLogs.length,
        totalAuditEntries: auditTrail.length,
        totalEntries: systemEvents.length + userLogins.length + errorLogs.length + auditTrail.length
      }
    };

    // Create formatted text report
    const reportText = `
PICKLEBALL CLUB MANAGEMENT SYSTEM - SYSTEM LOGS EXPORT
===================================================
Export Date: ${new Date().toLocaleString()}

SUMMARY
=======
Total System Events: ${allLogs.summary.totalSystemEvents}
Total User Logins: ${allLogs.summary.totalUserLogins}
Total Errors: ${allLogs.summary.totalErrors}
Total Audit Entries: ${allLogs.summary.totalAuditEntries}
Total Log Entries: ${allLogs.summary.totalEntries}

SYSTEM EVENTS
=============
${systemEvents.map(log => `[${log.timestamp}] ${log.type.toUpperCase()} - ${log.category}: ${log.message}${log.details ? `\n  Details: ${log.details}` : ''}${log.user ? `\n  User: ${log.user}` : ''}`).join('\n\n')}

USER LOGIN ACTIVITY
===================
${userLogins.map(log => `[${log.timestamp}] ${log.type.toUpperCase()} - ${log.category}: ${log.message}${log.details ? `\n  Details: ${log.details}` : ''}${log.user ? `\n  User: ${log.user}` : ''}`).join('\n\n')}

ERROR TRACKING
==============
${errorLogs.map(log => `[${log.timestamp}] ${log.type.toUpperCase()} - ${log.category}: ${log.message}${log.details ? `\n  Details: ${log.details}` : ''}${log.user ? `\n  User: ${log.user}` : ''}`).join('\n\n')}

AUDIT TRAIL
===========
${auditTrail.map(log => `[${log.timestamp}] ${log.type.toUpperCase()} - ${log.category}: ${log.message}${log.details ? `\n  Details: ${log.details}` : ''}${log.user ? `\n  User: ${log.user}` : ''}`).join('\n\n')}

===================================================
End of System Logs Export
`;

    // Create and download text report
    const textBlob = new Blob([reportText], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
    URL.revokeObjectURL(textUrl);

    // Create and download JSON report
    const jsonBlob = new Blob([JSON.stringify(allLogs, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
  };

  const LogList = ({ logs, emptyMessage }: { logs: LogEntry[]; emptyMessage: string }) => (
    <ScrollArea className="h-[400px]">
      {logs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={log.id}>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 mt-1">
                  {getTypeIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.category}</span>
                      {getTypeBadge(log.type)}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{log.message}</p>
                  {log.user && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.user}
                    </p>
                  )}
                  {log.details && (
                    <p className="text-xs text-muted-foreground mt-1 p-2 bg-muted rounded">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
              {index < logs.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Logs</h2>
          <p className="text-muted-foreground">
            Monitor system activity, user actions, and application events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system-events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system-events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            System Events
          </TabsTrigger>
          <TabsTrigger value="user-logins" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Logins
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Error Tracking
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system-events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Events
              </CardTitle>
              <CardDescription>
                Recent system activities and application events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogList 
                logs={systemEvents} 
                emptyMessage="No system events recorded" 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-logins" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Login Activity
              </CardTitle>
              <CardDescription>
                Authentication events and user session tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogList 
                logs={userLogins} 
                emptyMessage="No login activity recorded" 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error Tracking
              </CardTitle>
              <CardDescription>
                System errors, warnings, and technical issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogList 
                logs={errorLogs} 
                emptyMessage="No errors recorded - system running smoothly!" 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Audit Trail
              </CardTitle>
              <CardDescription>
                Security events, configuration changes, and administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LogList 
                logs={auditTrail} 
                emptyMessage="No audit events recorded" 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};