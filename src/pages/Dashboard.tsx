import React from 'react';
import { LoadSampleDataButton } from '@/components/LoadSampleDataButton';

const Dashboard = () => {
  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Overview of club activities, member statistics, and recent bookings
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-16 text-center space-y-6">
        <p className="text-2xl text-muted-foreground">
          Content coming soon...
        </p>
        
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Get started by loading sample data to test the application
          </p>
          <LoadSampleDataButton />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;