import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, UserCheck, Database, FileText, Building, Settings as SettingsIcon, Info } from 'lucide-react';
import { DataManagement } from '@/components/settings/DataManagement';
import { ClubInformation } from '@/components/settings/ClubInformation';
import { ApplicationInfo } from '@/components/settings/ApplicationInfo';
import { RoleManagement } from '@/components/settings/RoleManagement';
import { CourtConfiguration } from '@/components/settings/CourtConfiguration';
import { SystemInformation } from '@/components/settings/SystemInformation';
import { SystemLogs } from '@/components/settings/SystemLogs';

const Settings = () => {
  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Club configuration, user preferences, and system settings
        </p>
      </div>
      
      <Tabs defaultValue="court-configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6">
          <TabsTrigger value="court-configuration" className="flex items-center gap-2 px-3 py-1.5">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Court Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="access-rights" className="flex items-center gap-2 px-3 py-1.5">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Access Rights</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 px-3 py-1.5">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2 px-3 py-1.5">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2 px-3 py-1.5">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="club-details" className="flex items-center gap-2 px-3 py-1.5">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Club Details</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2 px-3 py-1.5">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2 px-3 py-1.5">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="court-configuration" className="mt-6">
          <CourtConfiguration />
        </TabsContent>
        
        <TabsContent value="access-rights" className="mt-6">
          <RoleManagement />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <p className="text-2xl text-muted-foreground">
              Users - Content coming soon...
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-6">
          <DataManagement />
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <SystemLogs />
        </TabsContent>
        
        <TabsContent value="club-details" className="mt-6">
          <ClubInformation />
        </TabsContent>
        
        <TabsContent value="system" className="mt-6">
          <SystemInformation />
        </TabsContent>
        
        <TabsContent value="info" className="mt-6">
          <ApplicationInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;