import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ProfessionalDirectory = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Professional Directory</CardTitle>
          <CardDescription>
            Browse and connect with beauty professionals.
          </CardDescription>
          <Button 
            variant="default" 
            className="mt-4 bg-[#32a852] hover:bg-[#32a852]/90 text-white"
            onClick={() => navigate('/categories/fashion-beauty/business-hub/professionals')}
          >
            View Professionals
          </Button>
        </CardHeader>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Register as Professional</CardTitle>
          <CardDescription>
            Create your professional profile and reach more clients.
          </CardDescription>
          <Button 
            variant="default" 
            className="mt-4 bg-[#32a852] hover:bg-[#32a852]/90 text-white"
            onClick={() => navigate('/categories/fashion-beauty/business-hub/professionals/register')}
          >
            Register Now
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProfessionalDirectory;
