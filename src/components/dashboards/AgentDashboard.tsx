
"use client";
import { useState, useMemo } from 'react';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import TicketList from '@/components/tickets/TicketList';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TicketStatus } from '@/lib/types';
import { ticketStatuses } from '@/lib/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';

export default function AgentDashboard() {
  const { tickets, isLoading, error } = useTickets();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');

  if (!user) return <p>Please log in to view the agent dashboard.</p>;

  const agentTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      // Show tickets assigned to this agent OR unassigned tickets with relevant department/priority (logic can be expanded)
      const isAssignedOrRelevant = ticket.assignedTo?.id === user.id || !ticket.assignedTo; 
      return matchesSearch && matchesStatus && isAssignedOrRelevant;
    });
  }, [tickets, searchTerm, statusFilter, user.id]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Agent Ticket Dashboard</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-accent" /> Filter Tickets</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets by title, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: TicketStatus | 'all') => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ticketStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
        agentTickets.length > 0 ? (
          <TicketList tickets={agentTickets} />
        ) : (
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No tickets match your current filters, or no tickets are assigned to you.</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
