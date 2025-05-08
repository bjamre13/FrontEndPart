
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTickets } from '@/hooks/useTickets';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import type { TicketPriority, TicketDepartment } from '@/lib/types';
import { ticketPriorities, ticketDepartments } from '@/lib/mockData';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters long').max(2000),
  priority: z.enum(ticketPriorities as [TicketPriority, ...TicketPriority[]]),
  department: z.enum(ticketDepartments as [TicketDepartment, ...TicketDepartment[]]),
  attachments: z.custom<FileList>()
    .refine(files => !files || Array.from(files).every(file => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(files => !files || Array.from(files).every(file => ALLOWED_FILE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png, .pdf and .txt files are allowed.'
    ).optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export default function CreateTicketPage() {
  const { createTicket, isLoading: isSubmitting } = useTickets();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'Medium',
      department: 'Technical Support',
    },
  });

  const watchedFiles = watch("attachments");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      setValue("attachments", event.target.files); // For react-hook-form
    }
  };

  const onSubmit: SubmitHandler<TicketFormData> = async (data) => {
    if (!isAuthenticated || !user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a ticket.", variant: "destructive"});
      router.push('/auth/login');
      return;
    }

    // Simulate file upload and get URLs/references
    const uploadedAttachments = selectedFiles.map(file => ({
      id: `att-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      fileName: file.name,
      // In a real app, this would be the URL from blob storage after upload
      url: `https://picsum.photos/seed/${file.name}/200/150`, 
      uploadedAt: new Date().toISOString(),
    }));
    
    const newTicket = await createTicket({
      ...data,
      status: 'Open',
      attachments: uploadedAttachments,
    });

    if (newTicket) {
      router.push(`/tickets/${newTicket.id}`);
    }
  };

  if (!isAuthenticated && typeof window !== 'undefined') {
     router.push('/auth/login');
     return <p className="text-center">Redirecting to login...</p>;
  }


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Support Ticket</CardTitle>
          <CardDescription>
            Please fill out the form below to submit your support request. Provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} placeholder="e.g., Unable to login" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your issue in detail..."
                rows={6}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value: TicketPriority) => setValue('priority', value)}
                  defaultValue={ticketPriorities.includes('Medium') ? 'Medium' : ticketPriorities[0]}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketPriorities.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                 <Select
                  onValueChange={(value: TicketDepartment) => setValue('department', value)}
                  defaultValue={ticketDepartments.includes('Technical Support') ? 'Technical Support' : ticketDepartments[0]}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {ticketDepartments.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="attachments-input" className="flex items-center gap-2 cursor-pointer text-accent hover:text-accent/90 border border-dashed border-accent p-2 rounded-md hover:bg-accent/10 transition-colors">
                  <Paperclip className="h-5 w-5" />
                  <span>Choose files...</span>
                </Label>
                <Input
                  id="attachments-input"
                  type="file"
                  {...register('attachments')}
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept={ALLOWED_FILE_TYPES.join(',')}
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium">Selected files:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {selectedFiles.map(file => (
                      <li key={file.name}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}
              {errors.attachments && <p className="text-sm text-destructive">{errors.attachments.message}</p>}
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Ticket
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
