import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Code, Calendar, Settings } from 'lucide-react';

export const ApplicationInfo: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Info className="h-5 w-5" />
            Application Info
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Version information and system details
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Version */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Version
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">1.0.0</span>
              </div>
            </div>

            {/* Environment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Environment
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Development</span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Last Updated
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">December 2024</span>
              </div>
            </div>

            {/* Framework */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Framework
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">React + TypeScript</span>
              </div>
            </div>
          </div>

          {/* Additional Technical Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  System Information
                </h4>
                <p className="text-xs text-blue-700">
                  Kili Pickleball Club Management System built with modern web technologies 
                  for efficient club operations and member management.
                </p>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 pt-4 border-t">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              Active
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              React 18
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
              TypeScript
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
              Vite
            </Badge>
          </div>

          {/* Build Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-700">v1.0.0</div>
              <div className="text-xs text-gray-500">Current Version</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-700">Dec 2024</div>
              <div className="text-xs text-gray-500">Release Date</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-700">Stable</div>
              <div className="text-xs text-gray-500">Build Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};