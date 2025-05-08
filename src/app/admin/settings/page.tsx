
import { Settings } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
       <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-7 w-7 text-accent" /> System Settings
          </CardTitle>
          <CardDescription>Configure various system-level settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Settings className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">System settings interface will be implemented here.</p>
            <p className="text-sm text-muted-foreground"> (e.g., notification preferences, integrations, branding) </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
