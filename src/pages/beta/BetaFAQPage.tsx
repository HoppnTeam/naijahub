import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const BetaFAQPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate('/beta')}
          >
            ← Back to Beta Landing
          </Button>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            NaijaHub Beta: Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about participating in the NaijaHub beta program.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              If you couldn't find the answer to your question, feel free to contact us directly.
            </p>
            <Button onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to join the beta?</h2>
            <Button onClick={() => navigate('/beta')}>
              Request Beta Access
            </Button>
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

const faqs = [
  {
    question: "What is the NaijaHub Beta Program?",
    answer: "The NaijaHub Beta Program is an early access initiative that allows selected users to try out NaijaHub before its official launch. Beta testers get exclusive access to all features and play a crucial role in providing feedback to help us improve the platform."
  },
  {
    question: "How do I join the beta program?",
    answer: "To join the beta program, submit your email address through our beta signup form. We'll review your application and send you an invitation if you're selected. Due to high demand, we may not be able to accept all applications immediately."
  },
  {
    question: "How long will the beta period last?",
    answer: "We expect the beta period to last approximately 2-3 months. However, this timeline may be adjusted based on feedback and development progress. Beta testers will be notified of any changes to the schedule."
  },
  {
    question: "Is there a cost to join the beta program?",
    answer: "No, participation in the NaijaHub Beta Program is completely free. In fact, we value your feedback so much that beta testers will receive exclusive perks once we officially launch."
  },
  {
    question: "What kind of feedback are you looking for?",
    answer: "We're interested in all types of feedback, including bug reports, feature suggestions, usability issues, and general impressions. We particularly value detailed feedback that helps us understand your experience with specific features."
  },
  {
    question: "How do I submit feedback?",
    answer: "Once you're accepted into the beta program, you'll have access to an in-app feedback form. You can use this form to submit bug reports, feature requests, and general feedback. We review all submissions regularly."
  },
  {
    question: "Will my data be secure during the beta?",
    answer: "Yes, we take data security seriously even during the beta phase. All data is encrypted and stored securely. However, as with any beta software, there may be occasional bugs or issues. We recommend not using the platform for highly sensitive information during the beta period."
  },
  {
    question: "Can I invite others to join the beta?",
    answer: "Initially, beta access is limited to directly invited users. However, we plan to introduce a referral system later in the beta that will allow existing testers to invite friends and colleagues."
  },
  {
    question: "What happens after the beta ends?",
    answer: "After the beta period ends, we'll transition to the official launch of NaijaHub. Beta testers will automatically be migrated to regular user accounts, and all your data will be preserved. Beta testers will also receive special recognition and perks as a thank you for your early support."
  },
  {
    question: "What features are available in the beta?",
    answer: "The beta includes all core features of NaijaHub, including the marketplace, forums, news sections, and community tools. Some advanced features may be added during the beta period based on development progress and user feedback."
  }
];
