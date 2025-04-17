
import { LeaveHistoryList } from "@/components/leave/leave-history-list";
import { Button } from "@/components/ui/button";
import { CalendarPlus, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LeaveHistory() {
  // Sample leave requests data
  const leaveRequests = [
    {
      id: "1",
      type: "Personal Time Off",
      startDate: "2023-03-15",
      endDate: "2023-03-18",
      duration: "4 days",
      status: "approved" as const,
      reason: "Family vacation",
    },
    {
      id: "2",
      type: "Sick Leave",
      startDate: "2023-02-08",
      endDate: "2023-02-09",
      duration: "2 days",
      status: "approved" as const,
      reason: "Fever and flu",
    },
    {
      id: "3",
      type: "Personal Time Off",
      startDate: "2023-04-25",
      endDate: "2023-04-28",
      duration: "4 days",
      status: "pending" as const,
      reason: "Personal matters",
    },
    {
      id: "4",
      type: "Compassionate Leave",
      startDate: "2023-01-10",
      endDate: "2023-01-12",
      duration: "3 days",
      status: "approved" as const,
      reason: "Family emergency",
    },
    {
      id: "5",
      type: "Sick Leave",
      startDate: "2022-12-01",
      endDate: "2022-12-02",
      duration: "2 days",
      status: "rejected" as const,
      reason: "Medical appointment",
    },
  ];

  return (
    <div className="flex-1  p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2 sm:mb-4">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-africa-terracotta">Leave Requests</h1>
            <p className="text-muted-foreground mt-1">View and manage your leave requests.</p>
          </div>
          <Button asChild className="mt-4 sm:mt-0 bg-africa-terracotta hover:bg-africa-terracotta/90 self-start">
            <Link to="/apply" className="flex items-center">
              <CalendarPlus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </Button>
        </div>
        
        <LeaveHistoryList leaveRequests={leaveRequests} />
      </div>
    </div>
  );
}
