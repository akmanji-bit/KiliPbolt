import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Phone, IdCard } from 'lucide-react';

export const ClubInformation: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Building className="h-5 w-5" />
            Club Information
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kili Pickleball Club configuration and details
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Club Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Club Name
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Kili Pickleball Club</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Dar es Salaam, Tanzania</span>
              </div>
            </div>

            {/* Default Country Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Default Country Code
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">+255 (Tanzania)</span>
              </div>
            </div>

            {/* Player ID Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Player ID Format
              </label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Kili-### (Auto-generated)</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Building className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-1">
                  Club Configuration
                </h4>
                <p className="text-xs text-orange-700">
                  These settings define the basic information and format standards for your club. 
                  Player IDs are automatically generated following the Kili-### pattern.
                </p>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 pt-4 border-t">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              Active Club
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              Tanzania Region
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
              Pickleball Club
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};