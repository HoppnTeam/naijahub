import { BookOpen, Building2, FileText, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const BusinessResources = () => {
  const { toast } = useToast();

  const handleResourceClick = (name: string, link: string) => {
    toast({
      title: "Leaving NaijaHub",
      description: `You are being redirected to ${name}. This is an external website.`,
      duration: 3000,
    });
    window.open(link, '_blank');
  };

  const businessResources = [
    {
      title: "Government Resources",
      icon: <Building2 className="w-5 h-5" />,
      items: [
        { 
          name: "CAC Business Registration Guide", 
          link: "https://www.cac.gov.ng/registration-guidelines/" 
        },
        { 
          name: "FIRS Tax Compliance", 
          link: "https://www.firs.gov.ng/tax-compliance/" 
        },
        { 
          name: "Export Documentation", 
          link: "https://www.nepc.gov.ng/export-procedures" 
        }
      ]
    },
    {
      title: "Business Guides",
      icon: <FileText className="w-5 h-5" />,
      items: [
        { 
          name: "Starting a Business in Nigeria", 
          link: "https://www.cbn.gov.ng/devfin/entrepreneurship.asp" 
        },
        { 
          name: "SME Funding Options", 
          link: "https://www.boi.ng/sme-loans/" 
        },
        { 
          name: "Business Plan Templates", 
          link: "https://smedan.gov.ng/business-plans/" 
        }
      ]
    },
    {
      title: "Institutional Support",
      icon: <Award className="w-5 h-5" />,
      items: [
        { 
          name: "SMEDAN Resources", 
          link: "https://smedan.gov.ng/resources/" 
        },
        { 
          name: "BOI Loan Programs", 
          link: "https://www.boi.ng/apply-loan/" 
        },
        { 
          name: "NEXIM Bank Services", 
          link: "https://neximbank.com.ng/products-services/" 
        }
      ]
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 sticky top-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Business Resources</h2>
      </div>
      
      {businessResources.map((section, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            {section.icon}
            <h3 className="font-medium">{section.title}</h3>
          </div>
          <ul className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <button
                  onClick={() => handleResourceClick(item.name, item.link)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left w-full"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};