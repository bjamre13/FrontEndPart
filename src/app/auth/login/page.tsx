
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
// import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { LogIn, Mail, KeyRound, UserCheck, Loader2, Ticket } from 'lucide-react';
import { UserRole } from '../../../lib/types';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../hooks/useAuth';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';


const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'), // Min length for demo; real app: min 8
  roleOverride: z.custom<UserRole>().optional(), // For demo purposes
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);


  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '', // Default to customer1 for easier demo
      password: 'password', // Default password for demo
    }
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsSubmittingForm(true);
    const success = await login(data.email, data.roleOverride);
    if (!success) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    // On success, AuthContext handles redirect
    setIsSubmittingForm(false);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto p-3 bg-accent/10 rounded-full mb-4">
            <Ticket className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Log in to manage your support tickets.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" {...register('email')} placeholder="you@example.com" className="pl-10" />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" {...register('password')} placeholder="••••••••" className="pl-10" />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            
            {/* Demo only: Role override */}
            <div className="space-y-2">
              <Label htmlFor="roleOverride">Login as (Demo)</Label>
              <Select onValueChange={(value: UserRole) => setValue('roleOverride', value)}>
                <SelectTrigger id="roleOverride">
                  <SelectValue placeholder="Select role to simulate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer (e.g. customer1@example.com)</SelectItem>
                  <SelectItem value="agent">Agent (e.g. agent1@example.com)</SelectItem>
                  <SelectItem value="admin">Admin (e.g. admin1@example.com)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Use any email from mock data with 'password'. Select a role here to override the user's default role for this session.</p>
            </div>


          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || isSubmittingForm}>
              {isLoading || isSubmittingForm ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Log In
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Forgot your password?{' '}
              <Link href="/auth/reset-password" legacyBehavior>
                <a className="font-medium text-accent hover:underline">Reset it here</a>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
