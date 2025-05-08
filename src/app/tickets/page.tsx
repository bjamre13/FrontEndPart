
"use client";

// This page will essentially replicate the AgentDashboard functionality for now,
// but is intended as a dedicated "All Tickets" view, especially for Admins.
// For Customers, it should redirect to their dashboard or show an error.

import AgentDashboard from '@/components/dashboards/AgentDashboard';
import CustomerDashboard from '@/components/dashboards/CustomerDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AllTicketsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-32 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // This should ideally be handled by AuthProvider redirecting to login
    return <p className="text-center text-muted-foreground py-10">Please log in to view tickets.</p>;
  }

  // If user is a customer, they should not see "all" tickets,
  // but rather their own tickets. Redirect or show their dashboard.
  if (user.role === 'customer') {
    return <CustomerDashboard />;
  }

  // For agents and admins, show the AgentDashboard component which includes filtering
  // AgentDashboard can be enhanced or a new AdminTicketView component can be created
  // to show ALL tickets without assignment filtering for admins.
  // For now, AgentDashboard will show assigned/unassigned which is a good start.
  return <AgentDashboard />;
}
