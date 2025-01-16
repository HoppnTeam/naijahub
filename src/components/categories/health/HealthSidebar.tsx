export const HealthSidebar = () => {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-card rounded-lg p-4 border">
        <h3 className="font-semibold mb-4">Daily Wellness Tip</h3>
        <p className="text-sm text-muted-foreground">
          Stay hydrated! Drink at least 8 glasses of water daily to maintain good health and energy levels.
        </p>
      </div>

      <div className="bg-card rounded-lg p-4 border">
        <h3 className="font-semibold mb-4">Health Resources</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="text-primary hover:underline">
              Mental Health Support Groups
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Fitness Training Programs
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Nutrition Guidelines
            </a>
          </li>
          <li>
            <a href="#" className="text-primary hover:underline">
              Disease Prevention Tips
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};