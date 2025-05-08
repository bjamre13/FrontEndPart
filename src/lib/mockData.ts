import type { User, Ticket, Comment, Attachment, UserRole, TicketStatus, TicketPriority, TicketDepartment } from './types';

export const mockUsers: User[] = [
  { id: 'user1', email: 'customer1@example.com', name: 'Alice Wonderland', role: 'customer' },
  { id: 'user2', email: 'agent1@example.com', name: 'Bob The Builder', role: 'agent' },
  { id: 'user3', email: 'admin1@example.com', name: 'Charlie Admin', role: 'admin' },
  { id: 'user4', email: 'customer2@example.com', name: 'Diana Prince', role: 'customer' },
  { id: 'user5', email: 'agent2@example.com', name: 'Edward Agent', role: 'agent' },
];

const generateAttachments = (count: number): Attachment[] => Array.from({ length: count }, (_, i) => ({
  id: `att${Date.now()}${i}`,
  fileName: `screenshot-${i + 1}.png`,
  url: `https://picsum.photos/seed/att${i}/200/300`,
  uploadedAt: new Date(Date.now() - (i * 1000 * 60 * 60 * 24)).toISOString(),
}));

const generateComments = (ticketId: string, count: number): Comment[] => Array.from({ length: count }, (_, i) => {
  const author = mockUsers[i % mockUsers.length];
  return {
    id: `comment${ticketId}${i}`,
    ticketId,
    authorId: author.id,
    authorName: author.name,
    content: `This is comment number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    createdAt: new Date(Date.now() - (i * 1000 * 60 * 30)).toISOString(),
    isInternalNote: i % 3 === 0 && author.role !== 'customer',
  };
});


export const mockTickets: Ticket[] = [
  {
    id: 'ticket1',
    title: 'Cannot login to my account',
    description: 'I am unable to login to my account. It says "Invalid credentials" even though I am sure my password is correct. I have tried resetting it but the issue persists.',
    status: 'Open',
    priority: 'High',
    department: 'Technical Support',
    createdBy: mockUsers[0],
    assignedTo: mockUsers[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    attachments: generateAttachments(1),
    comments: generateComments('ticket1', 2),
  },
  {
    id: 'ticket2',
    title: 'Billing inquiry about last invoice',
    description: 'I have a question regarding my last invoice (INV-2024-001). There is a charge I do not recognize. Could you please clarify?',
    status: 'In Progress',
    priority: 'Medium',
    department: 'Billing',
    createdBy: mockUsers[3],
    assignedTo: mockUsers[4],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    attachments: generateAttachments(0),
    comments: generateComments('ticket2', 1),
  },
  {
    id: 'ticket3',
    title: 'Feature request: Dark mode',
    description: 'It would be great if the application had a dark mode option. It would be easier on the eyes, especially at night.',
    status: 'Pending Customer',
    priority: 'Low',
    department: 'General Inquiry',
    createdBy: mockUsers[0],
    assignedTo: mockUsers[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    attachments: [],
    comments: generateComments('ticket3', 3),
    rating: 4,
  },
   {
    id: 'ticket4',
    title: 'Website is down',
    description: 'The main website seems to be inaccessible. I am getting a 503 error. This is urgent for our business operations.',
    status: 'Open',
    priority: 'Urgent',
    department: 'Technical Support',
    createdBy: mockUsers[3],
    assignedTo: mockUsers[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    attachments: generateAttachments(1),
    comments: [],
  },
  {
    id: 'ticket5',
    title: 'Product information request',
    description: 'I would like more information about product X, specifically its integration capabilities with Y.',
    status: 'Resolved',
    priority: 'Medium',
    department: 'Sales',
    createdBy: mockUsers[0],
    assignedTo: mockUsers[4],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // A week ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // Resolved 2 days ago
    attachments: [],
    comments: generateComments('ticket5', 4),
    rating: 5,
  }
];

export const ticketStatuses: TicketStatus[] = ["Open", "In Progress", "Pending Customer", "Resolved", "Closed"];
export const ticketPriorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];
export const ticketDepartments: TicketDepartment[] = ["Technical Support", "Billing", "General Inquiry", "Sales"];

export const performanceMetrics = [
    { name: "Average Response Time", value: "2.5", unit: "hours" },
    { name: "Resolution Rate", value: "85", unit: "%" },
    { name: "Open Tickets", value: mockTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length },
    { name: "Customer Satisfaction", value: "4.2/5" },
];
