import React from 'react';
import { SimpleFeedbackForm } from '@/components/beta/SimpleFeedbackForm';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Help Improve NaijaHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your feedback is crucial in helping us build a better platform for the Nigerian community.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-6 border mb-12">
            <SimpleFeedbackForm />
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Feedback Guidelines</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Be specific and detailed in your feedback</li>
              <li>If reporting a bug, include steps to reproduce it</li>
              <li>For feature requests, explain why it would be valuable</li>
              <li>Include screenshots if relevant (you can email them to feedback@naijahub.com)</li>
              <li>All feedback is reviewed by our team, though we may not be able to respond to each submission individually</li>
            </ul>
          </div>
        </div>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p> {new Date().getFullYear()} NaijaHub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default FeedbackPage;
