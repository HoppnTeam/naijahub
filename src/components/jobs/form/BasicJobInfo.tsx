import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicJobInfoProps {
  title: string;
  companyName: string;
  description: string;
  requirements: string;
  onFieldChange: (field: string, value: string) => void;
}

export const BasicJobInfo = ({
  title,
  companyName,
  description,
  requirements,
  onFieldChange,
}: BasicJobInfoProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          placeholder="e.g. Senior React Developer"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          value={companyName}
          onChange={(e) => onFieldChange("company_name", e.target.value)}
          placeholder="Enter company name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Describe the role and responsibilities"
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={requirements}
          onChange={(e) => onFieldChange("requirements", e.target.value)}
          placeholder="List the job requirements"
          className="min-h-[100px]"
          required
        />
      </div>
    </>
  );
};