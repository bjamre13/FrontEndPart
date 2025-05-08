
"use client";

import { useTickets } from '@/hooks/useTickets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { performanceMetrics, ticketStatuses, ticketDepartments } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Settings, ListFilter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

export default function AdminDashboard() {
  const { tickets, isLoading: ticketsLoading } = useTickets();

  const ticketsByStatus = ticketStatuses.map(status => ({
    name: status,
    count: tickets.filter(t => t.status === status).length,
  }));

  const ticketsByDepartment = ticketDepartments.map(dept => ({
    name: dept,
    value: tickets.filter(t => t.department === dept).length,
  }));
  
  const averageResolutionTime = () => {
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');
    if (resolvedTickets.length === 0) return 'N/A';
    const totalTime = resolvedTickets.reduce((sum, t) => {
      const created = new Date(t.createdAt).getTime();
      const resolved = new Date(t.updatedAt).getTime(); // Assuming updatedAt is resolution time for resolved/closed
      return sum + (resolved - created);
    }, 0);
    const avgMs = totalTime / resolvedTickets.length;
    const avgHours = avgMs / (1000 * 60 * 60);
    return `${avgHours.toFixed(1)} hours`;
  };
  
  const dynamicPerformanceMetrics = [
    ...performanceMetrics.filter(m => m.name !== "Average Response Time" && m.name !== "Open Tickets"), // Remove mock values if we calculate them
    { name: "Average Resolution Time", value: averageResolutionTime() },
    { name: "Open Tickets", value: tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length },
  ];


  if (ticketsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="shadow-lg"><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
          <Card className="shadow-lg"><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/users"><Users className="mr-2 h-4 w-4" /> Manage Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings"><Settings className="mr-2 h-4 w-4" /> System Settings</Link>
          </Button>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dynamicPerformanceMetrics.map(metric => (
            <Card key={metric.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">
                  {metric.value}
                  {metric.unit && <span className="text-sm font-normal text-muted-foreground"> {metric.unit}</span>}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Ticket Analysis</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Tickets by Status</CardTitle>
              <CardDescription>Distribution of tickets across different statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketsByStatus} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="var(--accent)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Tickets by Department</CardTitle>
               <CardDescription>Breakdown of tickets per department.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketsByDepartment}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ticketsByDepartment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListFilter className="h-5 w-5 text-accent" /> All Tickets Overview</CardTitle>
            <CardDescription>View and manage all tickets in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">A comprehensive list of all tickets can be found on the main ticket management page, accessible with admin privileges.</p>
            <Button asChild>
              <Link href="/tickets">View All Tickets</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
