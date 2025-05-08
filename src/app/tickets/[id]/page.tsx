
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter }s from 'next/navigation';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket, Comment, TicketStatus, TicketPriority, UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send, MessageSquare, UserCircle, ShieldAlert, Clock, Edit3, Star, Loader2, Briefcase, Building } from 'lucide-react';
import { format } from 'date-fns';
import { ticketStatuses, ticketPriorities } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const getPriorityBadgeVariant = (priority: Ticket['priority']) => {
  switch (priority) {
    case 'Urgent': return 'destructive';
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    case 'Low': return 'outline';
    default: return 'default';
  }
};

const getStatusBadgeVariant = (status: Ticket['status']) => {
  switch (status) {
    case 'Open': return 'default';
    case 'In Progress': return 'secondary';
    case 'Pending Customer': return 'outline';
    case 'Resolved': return 'default';
    case 'Closed': return 'outline';
    default: return 'default';
  }
};


export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  
  const { getTicketById, updateTicket, addCommentToTicket, isLoading: ticketsLoading } = useTickets();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [ticket, setTicket] = useState<Ticket | null | undefined>(undefined); // undefined for initial, null if not found
  const [newComment, setNewComment] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [editingStatus, setEditingStatus] = useState<TicketStatus | undefined>(undefined);
  const [editingPriority, setEditingPriority] = useState<TicketPriority | undefined>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticketId) {
      const foundTicket = getTicketById(ticketId);
      setTicket(foundTicket);
      if (foundTicket) {
        setEditingStatus(foundTicket.status);
        setEditingPriority(foundTicket.priority);
        setRating(foundTicket.rating);
      }
    }
  }, [ticketId, getTicketById]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !ticket || !user) return;
    setIsSubmitting(true);
    const addedComment = await addCommentToTicket(ticket.id, newComment, isInternalNote && user.role !== 'customer');
    if (addedComment) {
      setTicket(prev => prev ? {...prev, comments: [...prev.comments, addedComment]} : null);
      setNewComment('');
      setIsInternalNote(false);
    }
    setIsSubmitting(false);
  };

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket || !user || user.role === 'customer') return;
    setIsSubmitting(true);
    const updated = await updateTicket(ticket.id, { status: newStatus });
    if (updated) {
      setTicket(updated);
      setEditingStatus(updated.status);
      toast({ title: "Status Updated", description: `Ticket status changed to ${newStatus}` });
    }
    setIsSubmitting(false);
  };
  
  const handlePriorityChange = async (newPriority: TicketPriority) => {
    if (!ticket || !user || user.role === 'customer') return;
    setIsSubmitting(true);
    const updated = await updateTicket(ticket.id, { priority: newPriority });
    if (updated) {
      setTicket(updated);
      setEditingPriority(updated.priority);
      toast({ title: "Priority Updated", description: `Ticket priority changed to ${newPriority}` });
    }
    setIsSubmitting(false);
  };

  const handleRatingSubmit = async (newRating: number) => {
    if (!ticket || !user || user.role !== 'customer' || (ticket.status !== 'Resolved' && ticket.status !== 'Closed')) return;
    setIsSubmitting(true);
    const updated = await updateTicket(ticket.id, { rating: newRating as Ticket['rating'] });
    if (updated) {
      setTicket(updated);
      setRating(newRating);
      toast({ title: "Rating Submitted", description: `You rated this ticket ${newRating} stars.` });
    }
    setIsSubmitting(false);
  };
  
  if (ticketsLoading || ticket === undefined) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-8 w-1/4" /></CardContent></Card>
        <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-8 w-1/3" /></CardContent></Card>
      </div>
    );
  }

  if (!ticket) {
    return <p className="text-center text-xl text-muted-foreground py-10">Ticket not found.</p>;
  }
  
  const canEdit = isAuthenticated && user && (user.role === 'agent' || user.role === 'admin');
  const canComment = isAuthenticated && user;
  const canRate = isAuthenticated && user && user.role === 'customer' && (ticket.status === 'Resolved' || ticket.status === 'Closed');


  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-card-foreground/5 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-2xl text-primary">{ticket.title}</CardTitle>
            <Badge variant={getStatusBadgeVariant(ticket.status)} className="px-3 py-1 text-sm">{ticket.status}</Badge>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Ticket ID: {ticket.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg text-primary">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
            
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-primary mb-2">Attachments:</h4>
                <div className="flex flex-wrap gap-3">
                  {ticket.attachments.map(att => (
                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <Card className="w-32 h-32 p-2 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                        <Paperclip className="h-8 w-8 text-muted-foreground group-hover:text-accent mb-1" />
                        <span className="text-xs text-muted-foreground group-hover:text-accent truncate w-full" data-ai-hint="document file">{att.fileName}</span>
                         {att.url.startsWith("https://picsum.photos") && <Image src={att.url} alt={att.fileName} width={40} height={40} className="mt-1 rounded-sm object-cover" data-ai-hint="placeholder image"/>}
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-accent" />
              <div>
                <span className="font-medium text-primary">Created By:</span>
                <p className="text-muted-foreground">{ticket.createdBy.name} ({ticket.createdBy.email})</p>
              </div>
            </div>
             <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-accent" />
               <div>
                <span className="font-medium text-primary">Priority:</span>
                {canEdit ? (
                  <Select value={editingPriority} onValueChange={handlePriorityChange} disabled={isSubmitting}>
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketPriorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                   <Badge variant={getPriorityBadgeVariant(ticket.priority)} className="ml-2">{ticket.priority}</Badge>
                )}
              </div>
            </div>
             <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-accent" />
               <div>
                <span className="font-medium text-primary">Department:</span>
                <p className="text-muted-foreground">{ticket.department}</p>
              </div>
            </div>
            {ticket.assignedTo && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                 <div>
                  <span className="font-medium text-primary">Assigned To:</span>
                  <p className="text-muted-foreground">{ticket.assignedTo.name}</p>
                </div>
              </div>
            )}
             <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
               <div>
                <span className="font-medium text-primary">Created At:</span>
                <p className="text-muted-foreground">{format(new Date(ticket.createdAt), "PPP p")}</p>
              </div>
            </div>
             <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-accent" />
               <div>
                <span className="font-medium text-primary">Last Updated:</span>
                <p className="text-muted-foreground">{format(new Date(ticket.updatedAt), "PPP p")}</p>
              </div>
            </div>
            {canEdit && (
              <div className="pt-2">
                <Label htmlFor="status-update" className="font-medium text-primary">Update Status:</Label>
                <Select value={editingStatus} onValueChange={handleStatusChange} disabled={isSubmitting}>
                  <SelectTrigger id="status-update" className="mt-1 h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
         {canRate && (
          <CardFooter className="p-6 border-t">
            <div className="w-full">
              <h3 className="font-semibold text-lg text-primary mb-2">Rate Support Experience</h3>
              {ticket.rating ? (
                <div className="flex items-center">
                  <p className="text-muted-foreground mr-2">You rated:</p>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-6 w-6 ${i < ticket.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Button key={i} variant="ghost" size="icon" onClick={() => handleRatingSubmit(i + 1)} disabled={isSubmitting} className="hover:text-yellow-400">
                      <Star className={`h-6 w-6 ${rating && i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    </Button>
                  ))}
                   {isSubmitting && rating && <Loader2 className="h-5 w-5 animate-spin text-accent ml-2" />}
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      <Card className="shadow-xl">
        <CardHeader className="p-6">
          <CardTitle className="text-xl flex items-center gap-2 text-primary"><MessageSquare className="h-6 w-6 text-accent" /> Comments & Updates</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {ticket.comments.length > 0 ? (
            ticket.comments.map(comment => (
              (!comment.isInternalNote || (comment.isInternalNote && canEdit)) && (
                <div key={comment.id} className={`flex gap-3 ${comment.isInternalNote ? 'bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md' : ''}`}>
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={`https://i.pravatar.cc/40?u=${comment.authorId}`} alt={comment.authorName} data-ai-hint="avatar person" />
                    <AvatarFallback>{comment.authorName.substring(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-primary">{comment.authorName} {comment.isInternalNote && <Badge variant="outline" className="ml-2 text-xs border-yellow-500 text-yellow-700">Internal Note</Badge>}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              )
            ))
          ) : (
            <p className="text-center text-muted-foreground">No comments yet.</p>
          )}
        </CardContent>
        {canComment && (
          <CardFooter className="p-6 border-t">
            <div className="w-full space-y-3">
              <Label htmlFor="new-comment" className="font-medium text-primary">Add Comment</Label>
              <Textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
                rows={4}
                disabled={isSubmitting}
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                {user?.role !== 'customer' && (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="internal-note" 
                      checked={isInternalNote} 
                      onChange={(e) => setIsInternalNote(e.target.checked)} 
                      className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="internal-note" className="text-sm text-muted-foreground">Mark as internal note</Label>
                  </div>
                )}
                <Button onClick={handleCommentSubmit} disabled={!newComment.trim() || isSubmitting} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Post Comment
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
