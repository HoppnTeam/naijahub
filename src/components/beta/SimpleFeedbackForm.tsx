import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/lib/error-handling';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  category: z.enum(['bug', 'feature', 'improvement', 'other'], {
    required_error: 'Please select a category',
  }),
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  rating: z.enum(['1', '2', '3', '4', '5'], {
    required_error: 'Please rate your experience',
  }),
  email: z.string().email({ message: 'Please enter a valid email' }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const SimpleFeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'improvement',
      title: '',
      description: '',
      rating: '5',
      email: user?.email || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // Store feedback in a simple table without complex relationships
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id || null,
          user_email: values.email || user?.email || null,
          category: values.category,
          title: values.title,
          description: values.description,
          rating: parseInt(values.rating),
          source: 'beta',
        });

      if (error) throw error;

      // Success
      setIsSuccess(true);
      form.reset();
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback! It helps us improve NaijaHub.',
      });
    } catch (error) {
      handleAsyncError(error, 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Beta Feedback</CardTitle>
        <CardDescription>
          Help us improve NaijaHub by sharing your experience and suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="text-center py-4">
            <h3 className="text-lg font-medium mb-2">Thank you for your feedback!</h3>
            <p className="text-muted-foreground mb-4">
              Your input is valuable and will help us improve NaijaHub.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSuccess(false)}
            >
              Submit another feedback
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief summary of your feedback" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide details about your feedback" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!user && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Your email address" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide your email if you'd like us to follow up with you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Rate your experience</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <FormItem key={rating} className="flex items-center space-x-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={rating.toString()} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {rating}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      1 = Poor, 5 = Excellent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground text-center">
          Your feedback helps us create a better experience for all users.
        </p>
      </CardFooter>
    </Card>
  );
};
