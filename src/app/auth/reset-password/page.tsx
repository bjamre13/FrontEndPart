
"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Mail, Send, Loader2, KeyRound } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset requested for:', data.email);
    
    // In a real app, you would call your backend here to send a reset link.
    // For demo, we'll just show a success message.
    
    setEmailSent(true);
    setIsSubmitting(false);
    toast({
      title: "Password Reset Email Sent",
      description: `If an account exists for ${data.email}, you will receive an email with instructions to reset your password.`,
    });
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-block mx-auto p-3 bg-accent/10 rounded-full mb-4">
            <KeyRound className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            {emailSent 
              ? "Check your email for a password reset link." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        {!emailSent ? (
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Reset Link
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Remember your password?{' '}
                <Link href="/auth/login" legacyBehavior>
                  <a className="font-medium text-accent hover:underline">Log in here</a>
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <CardContent>
            <p className="text-center text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again later.
            </p>
            <Button variant="link" asChild className="w-full mt-4 text-accent">
               <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
