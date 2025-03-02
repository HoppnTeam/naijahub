import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BetaInviteForm } from '@/components/beta/BetaInviteForm';

export const BetaLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to NaijaHub Beta
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our exclusive beta program and help shape the future of Nigeria's premier online community platform.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">What is NaijaHub?</h2>
              <p className="text-muted-foreground">
                NaijaHub is a modern platform designed to connect Nigerians worldwide through news, discussions, and commerce. 
                Our mission is to create a vibrant online community that celebrates Nigerian culture and innovation.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Beta Features</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Specialized marketplace for Nigerian products</li>
                <li>Dynamic news and discussion forums</li>
                <li>Community engagement tools</li>
                <li>Mobile-optimized experience</li>
                <li>Real-time notifications and updates</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Why Join the Beta?</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Early access to all NaijaHub features</li>
                <li>Shape the platform with your feedback</li>
                <li>Connect with like-minded Nigerians</li>
                <li>Exclusive beta tester badge on your profile</li>
                <li>Priority support and feature requests</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button 
                onClick={() => navigate('/beta/faq')}
                variant="outline"
                className="mr-4"
              >
                Learn More
              </Button>
              <Button onClick={() => navigate('/login')}>
                Beta Tester Login
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border">
            <BetaInviteForm />
          </div>
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-semibold mb-6">What Beta Testers Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-lg border">
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.location}</div>
              </div>
            ))}
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

const testimonials = [
  {
    quote: "NaijaHub is exactly what we've been waiting for. A modern platform that truly represents Nigerian culture and innovation.",
    name: "Chioma A.",
    location: "Lagos, Nigeria"
  },
  {
    quote: "As a Nigerian in diaspora, NaijaHub helps me stay connected to home. The marketplace feature is a game-changer!",
    name: "Emeka O.",
    location: "London, UK"
  },
  {
    quote: "The user experience is fantastic. Clean design, fast loading times, and the community is already vibrant even in beta.",
    name: "Amina B.",
    location: "Abuja, Nigeria"
  }
];
