
"use client";

import { useState, useEffect, useCallback } from 'react';
// import type { Comment, TicketStatus, TicketPriority, TicketDepartment } from './lib/types';
// import { mockTickets as initialMockTickets } from '@/lib/mockData';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Ticket } from '../lib/types';
import { sendNotification } from '../services/notification';


export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching tickets
    setIsLoading(true);
    setTimeout(() => {
      const storedTickets = localStorage.getItem('tickets');
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        setTickets(initialMockTickets);
        localStorage.setItem('tickets', JSON.stringify(initialMockTickets));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const persistTickets = useCallback((updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
  }, []);

  const getTicketById = useCallback((id: string): Ticket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  }, [tickets]);

  const createTicket = useCallback(async (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'createdBy'>): Promise<Ticket | null> => {
    if (!user) {
      setError("User not authenticated");
      toast({ title: "Error", description: "You must be logged in to create a ticket.", variant: "destructive" });
      return null;
    }
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket: Ticket = {
        ...newTicketData,
        id: `ticket${Date.now()}`,
        createdBy: { id: user.id, name: user.name, email: user.email },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      };
      const updatedTickets = [...tickets, ticket];
      persistTickets(updatedTickets);
      toast({ title: "Success", description: "Ticket created successfully." });
      // Notify admin/relevant agents (mock)
      sendNotification({
        recipient: 'admin@example.com',
        subject: `New Ticket Created: ${ticket.title}`,
        body: `A new ticket titled "${ticket.title}" has been created by ${user.name}.`,
      });
      return ticket;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to create ticket";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, tickets, persistTickets, toast]);

  const updateTicket = useCallback(async (id: string, updates: Partial<Ticket>): Promise<Ticket | null> => {
     if (!user) {
      setError("User not authenticated");
      toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
      return null;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticketIndex = tickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) throw new Error("Ticket not found");

      const originalTicket = tickets[ticketIndex];
      const updatedTicket = { ...originalTicket, ...updates, updatedAt: new Date().toISOString() };
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex] = updatedTicket;
      persistTickets(updatedTickets);
      toast({ title: "Success", description: `Ticket "${updatedTicket.title}" updated.`});

      // Notify customer if status changed or comment added by agent
      if (user.role === 'agent' && (updates.status || (updates.comments && updates.comments.length > originalTicket.comments.length))) {
        const lastComment = updates.comments?.[updates.comments.length -1];
        if (!lastComment || !lastComment.isInternalNote) {
          sendNotification({
            recipient: originalTicket.createdBy.email,
            subject: `Update on your ticket: ${originalTicket.title}`,
            body: `Your ticket "${originalTicket.title}" has been updated. New status: ${updatedTicket.status}. ${lastComment ? 'A new comment has been added.' : ''}`,
          });
        }
      }
      return updatedTicket;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to update ticket";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, tickets, persistTickets, toast]);
  
  const addCommentToTicket = useCallback(async (ticketId: string, commentContent: string, isInternalNote: boolean): Promise<Comment | null> => {
    if (!user) {
      setError("User not authenticated for adding comment");
      toast({ title: "Error", description: "Authentication error.", variant: "destructive" });
      return null;
    }
    
    const ticket = getTicketById(ticketId);
    if (!ticket) {
      setError("Ticket not found");
      toast({ title: "Error", description: "Ticket not found.", variant: "destructive" });
      return null;
    }

    const newComment: Comment = {
      id: `comment${Date.now()}`,
      ticketId,
      authorId: user.id,
      authorName: user.name,
      content: commentContent,
      createdAt: new Date().toISOString(),
      isInternalNote,
    };
    
    const updatedComments = [...ticket.comments, newComment];
    await updateTicket(ticketId, { comments: updatedComments });
    
    return newComment;

  }, [user, getTicketById, updateTicket, toast]);


  return { tickets, isLoading, error, getTicketById, createTicket, updateTicket, addCommentToTicket };
};
