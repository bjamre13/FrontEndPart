
"use client";

import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import TicketList from '@/components/tickets/TicketList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, RotateCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerDashboard() {
  const { tickets, isLoading, error } = useTickets();
  const { user } = useAuth();

  if (!user) return <p>Please log in to view your dashboard.</p>;

  const customerTickets = tickets.filter(ticket => ticket.createdBy.id === user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My Support Tickets</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/tickets/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Ticket
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <p className="text-destructive">Error loading tickets: {error}</p>}
      
      {!isLoading && !error && (
        customerTickets.length > 0 ? (
          <TicketList tickets={customerTickets} />
        ) : (
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">You haven't created any tickets yet.</p>
              <Button asChild variant="link" className="text-accent mt-2">
                <Link href="/tickets/new">Create your first ticket</Link>
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
