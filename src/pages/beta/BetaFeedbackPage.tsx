import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BetaFeedbackForm } from '@/components/beta/BetaFeedbackForm';
import { useAuth } from '@/contexts/AuthContext';

export const BetaFeedbackPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-6 text-muted-foreground">
            You need to be logged in as a beta tester to submit feedback.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/beta')}>
              Back to Beta Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Beta Feedback
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your feedback is crucial in helping us improve NaijaHub. Share your thoughts, report bugs, or suggest new features.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-6 border mb-12">
            <BetaFeedbackForm />
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Feedback Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Be specific and detailed in your feedback</li>
              <li>If reporting a bug, include steps to reproduce it</li>
              <li>For feature requests, explain why it would be valuable</li>
              <li>Include screenshots if relevant (you can email them to beta@naijahub.com)</li>
              <li>All feedback is reviewed by our team, though we may not be able to respond to each submission individually</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Other Ways to Provide Feedback</h2>
            <p className="text-muted-foreground mb-6">
              In addition to this form, you can also provide feedback through:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">
                  Send detailed feedback directly to beta@naijahub.com
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Community Forum</h3>
                <p className="text-sm text-muted-foreground">
                  Discuss with other beta testers in our dedicated forum
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Weekly Surveys</h3>
                <p className="text-sm text-muted-foreground">
                  Watch for our weekly email surveys on specific features
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NaijaHub. All rights reserved.</p>
          <p className="mt-2">
            <Button variant="link" onClick={() => navigate('/terms')}>Terms of Service</Button> |
            <Button variant="link" onClick={() => navigate('/privacy')}>Privacy Policy</Button>
          </p>
        </footer>
      </div>
    </div>
  );
};
