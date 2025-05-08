
"use client";

import type { Ticket } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, User, Tag, ShieldAlert, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
}

const getPriorityBadgeVariant = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'Urgent': return 'destructive';
    case 'High': return 'destructive'; // Or a custom 'warning' variant if available
    case 'Medium': return 'secondary';
    case 'Low': return 'outline';
    default: return 'default';
  }
};

const getStatusBadgeVariant = (status: Ticket['status']) => {
  switch (status) {
    case 'Open': return 'default'; // Blue or primary
    case 'In Progress': return 'secondary'; // Yellow or secondary
    case 'Pending Customer': return 'outline'; // Orange or custom
    case 'Resolved': return 'default'; // Green or custom 'success'
    case 'Closed': return 'outline'; // Gray
    default: return 'default';
  }
};


export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg leading-tight mb-1">
            <Link href={`/tickets/${ticket.id}`} className="hover:text-accent transition-colors">
              {ticket.title}
            </Link>
          </CardTitle>
          <Badge variant={getStatusBadgeVariant(ticket.status)} className="ml-2 whitespace-nowrap">{ticket.status}</Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">ID: {ticket.id}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{ticket.description}</p>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>Created by: {ticket.createdBy.name}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-accent" />
              <span>Assigned to: {ticket.assignedTo.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5" />
            <span>Department: {ticket.department}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant={getPriorityBadgeVariant(ticket.priority)} className="text-xs">
            <ShieldAlert className="h-3 w-3 mr-1" />
            {ticket.priority}
          </Badge>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-accent hover:text-accent/90">
          <Link href={`/tickets/${ticket.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
