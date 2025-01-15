import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JobDetailsProps {
  salaryRange: string;
  skills: string[];
  applicationUrl: string;
  onFieldChange: (field: string, value: string | string[]) => void;
}

export const JobDetails = ({
  salaryRange,
  skills,
  applicationUrl,
  onFieldChange,
}: JobDetailsProps) => {
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(",").map((skill) => skill.trim());
    onFieldChange("skills", skillsArray);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="salary_range">Salary Range</Label>
        <Input
          id="salary_range"
          value={salaryRange}
          onChange={(e) => onFieldChange("salary_range", e.target.value)}
          placeholder="e.g. ₦500,000 - ₦800,000 per month"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Required Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={skills.join(", ")}
          onChange={handleSkillsChange}
          placeholder="e.g. React, TypeScript, Node.js"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="application_url">Application URL</Label>
        <Input
          id="application_url"
          type="url"
          value={applicationUrl}
          onChange={(e) => onFieldChange("application_url", e.target.value)}
          placeholder="https://..."
          required
        />
      </div>
    </>
  );
};