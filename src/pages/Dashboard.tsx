
import { LeaveBalanceCard } from "@/components/dashboard/leave-balance-card";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TeamCalendar } from "@/components/calendar/team-calendar";
import { UpcomingLeaves } from "@/components/dashboard/upcoming-leaves";
import { UserProfile } from "@/components/dashboard/user-profile";

export default function Dashboard() {
  // Sample leave balance data
  const leaveBalances = [
    {
      leaveType: "Personal Time Off (PTO)",
      usedDays: 8,
      totalDays: 21,
      accrued: 1.66, // Days per month
      expiring: 3,
    },
    {
      leaveType: "Sick Leave",
      usedDays: 3,
      totalDays: 15,
    },
    {
      leaveType: "Maternity Leave",
      usedDays: 0,
      totalDays: 84,
    },
    {
      leaveType: "Compassionate Leave",
      usedDays: 1,
      totalDays: 5,
    },
  ];

  // Sample notifications
  const notifications = [
    {
      id: "1",
      title: "Leave Request Approved",
      message: "Your PTO request for April 20-22 has been approved.",
      timestamp: "2 hours ago",
      type: "success" as "success",
      read: false,
    },
    {
      id: "2",
      title: "New Company Holiday",
      message: "A new public holiday has been added: Liberation Day, July 4.",
      timestamp: "1 day ago",
      type: "info" as "info",
      read: true,
    },
    {
      id: "3",
      title: "Document Required",
      message: "Please upload supporting document for your sick leave request.",
      timestamp: "2 days ago",
      type: "warning" as "warning",
      read: false,
    },
  ];
  
  // Sample team leave data
  const teamLeaves = [
    {
      id: "1",
      name: "Jane Smith",
      avatar: undefined,
      startDate: "2023-04-15",
      endDate: "2023-04-18",
      leaveType: "PTO",
    },
    {
      id: "2",
      name: "Michael Johnson",
      avatar: undefined,
      startDate: "2023-04-20",
      endDate: "2023-04-22",
      leaveType: "Sick Leave",
    },
    {
      id: "3",
      name: "Sarah Williams",
      avatar: undefined,
      startDate: "2023-04-25",
      endDate: "2023-05-02",
      leaveType: "PTO",
    },
  ];

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-africa-terracotta">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-1">
            <UserProfile 
              name="John Doe"
              role="Software Engineer"
              department="Engineering"
              manager="Sarah Johnson"
              joinDate="Jan 15, 2022"
            />
            <div className="mt-6">
              <QuickActions />
            </div>
            <div className="mt-6">
              <NotificationsPanel notifications={notifications} />
            </div>
          </div>
          
          {/* Middle and right columns - now with responsive grid */}
          <div className="col-span-1 lg:col-span-2">
            {/* Leave balance cards in a responsive 2-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {leaveBalances.map((balance, index) => (
                <LeaveBalanceCard key={index} {...balance} />
              ))}
            </div>
            
            {/* Team calendar and upcoming leaves in a responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UpcomingLeaves leaves={teamLeaves} />
              <TeamCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
