
import { LeaveApplicationForm } from "@/components/leave/leave-application-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LeaveApplication() {
  return (
    <div className="flex-1 ml-[240px] p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-africa-terracotta">New Leave Request</h1>
          <p className="text-muted-foreground mt-1">Request time off by completing the form below.</p>
        </div>
        
        <LeaveApplicationForm />
      </div>
    </div>
  );
}
