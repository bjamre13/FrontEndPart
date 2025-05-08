
export type UserRole = "customer" | "agent" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type TicketStatus = "Open" | "In Progress" | "Pending Customer" | "Resolved" | "Closed";
export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
export type TicketDepartment = "Technical Support" | "Billing" | "General Inquiry" | "Sales";

export interface Attachment {
  id: string;
  fileName: string;
  url: string; // In a real app, this would be a URL to the stored file
  uploadedAt: string;
}

export interface Comment {
  id:string;
  ticketId: string;
  authorId: string;
  authorName: string; // denormalized for display
  content: string;
  createdAt: string;
  isInternalNote: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  department: TicketDepartment;
  createdBy: Pick<User, "id" | "name" | "email">; // Customer who created it
  assignedTo?: Pick<User, "id" | "name">; // Agent assigned
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  comments: Comment[];
  rating?: 1 | 2 | 3 | 4 | 5;
  reminderDate?: string;
}

export interface PerformanceMetric {
  name: string;
  value: string | number;
  unit?: string;
}
