import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/lib/error-handling';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const BetaInviteForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Check if email already exists
      const { data: existingTester, error: checkError } = await supabase
        .from('beta_testers')
        .select('id, status')
        .eq('email', values.email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingTester) {
        if (existingTester.status === 'active') {
          toast({
            title: 'Already registered',
            description: 'This email is already registered as a beta tester.',
            variant: 'destructive',
          });
          return;
        }

        // Re-invite if inactive or invited
        const { error: updateError } = await supabase
          .from('beta_testers')
          .update({
            invitation_token: crypto.randomUUID(),
            invited_at: new Date().toISOString(),
            status: 'invited',
            name: values.name || null,
          })
          .eq('id', existingTester.id);

        if (updateError) throw updateError;
      } else {
        // Create new beta tester
        const { error: insertError } = await supabase
          .from('beta_testers')
          .insert({
            email: values.email,
            name: values.name || null,
            status: 'invited',
          });

        if (insertError) throw insertError;
      }

      // Success
      setIsSuccess(true);
      form.reset();
      toast({
        title: 'Invitation sent!',
        description: 'Check your email for instructions to join the beta.',
      });

      // In a real app, you would trigger an email sending function here
      // For example, using a Supabase Edge Function or webhook

    } catch (error) {
      handleAsyncError(error, 'Failed to submit beta tester application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join the NaijaHub Beta</CardTitle>
        <CardDescription>
          Be among the first to experience NaijaHub and help shape its future.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-4">
            <h3 className="text-lg font-medium mb-2">Thank you for your interest!</h3>
            <p className="text-muted-foreground mb-4">
              We've added you to our beta testing program. Check your email for instructions on how to access the beta.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSuccess(false)}
            >
              Register another email
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll send beta access instructions to this email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Request Beta Access'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground text-center">
          By joining, you agree to provide feedback and report any issues you encounter.
        </p>
      </CardFooter>
    </Card>
  );
};
