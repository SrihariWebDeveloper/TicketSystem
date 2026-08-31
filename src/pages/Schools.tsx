import { GraduationCap } from "lucide-react";
import { Card } from "../components/ui";

export function SchoolsPage() {
  return (
    <div className="schools-placeholder">
      <Card className="schools-placeholder-card">
        <div className="schools-placeholder-icon">
          <GraduationCap size={30} />
        </div>
        <h1>Schools</h1>
        <h2>Updating Soon</h2>
        <p>The school management section is currently under development.</p>
      </Card>
    </div>
  );
}
