
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { TeamCalendar } from "@/components/calendar/team-calendar";

export default function TeamCalendarPage() {
  return (
    <div className="flex-1  p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-africa-terracotta">Team Calendar</h1>
          <p className="text-muted-foreground mt-1">View your team's leave schedule and public holidays.</p>
        </div>
        
        <TeamCalendar className="w-full" />
      </div>
    </div>
  );
}
