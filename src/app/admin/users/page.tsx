
"use client";

import { useState, useEffect } from 'react';

import { UserRole,User } from '../../../lib/types';
import { mockUsers } from '../../../lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Trash2, Edit, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';

const ROLES: UserRole[] = ['customer', 'agent', 'admin'];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate fetching users
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, fetch from API. For demo, use localStorage or mockData directly.
      const storedUsers = localStorage.getItem('appUsers');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(mockUsers);
        localStorage.setItem('appUsers', JSON.stringify(mockUsers));
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const persistUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      );
      persistUsers(updatedUsers);
      toast({ title: "Role Updated", description: `User ${userId}'s role changed to ${newRole}.` });
      setIsLoading(false);
    }, 300);
  };
  
  const handleDeleteUser = (userId: string) => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const updatedUsers = users.filter(user => user.id !== userId);
      persistUsers(updatedUsers);
      toast({ title: "User Deleted", description: `User ${userId} has been removed.`, variant: "destructive" });
      setIsLoading(false);
    }, 300);
  };


  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Manage Users</CardTitle>
           <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading Users...</Button>
        </div>
        <Card><CardContent className="pt-6"><Loader2 className="mx-auto h-12 w-12 animate-spin text-accent" /></CardContent></Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-accent" /> User Management
            </CardTitle>
            <Button disabled> {/* Implement add user functionality later */}
              <UserPlus className="mr-2 h-4 w-4" /> Add New User
            </Button>
          </div>
          <CardDescription>View, edit roles, and manage users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-center text-muted-foreground p-4"><Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Updating user list...</p>}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(role => (
                            <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" disabled className="hover:text-accent" title="Edit user (disabled)"> {/* Implement edit functionality */}
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" disabled={isLoading} className="hover:text-destructive" title="Delete user">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account for {user.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
           {users.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-8">No users found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
