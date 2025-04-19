
import { LeaveBalanceCard } from "@/components/dashboard/leave-balance-card";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TeamCalendar } from "@/components/calendar/team-calendar";
import { UpcomingLeaves } from "@/components/dashboard/upcoming-leaves";
import { UserProfile } from "@/components/dashboard/user-profile";

export default function Dashboard() {
  // Sample leave balance data with more realistic values
  const leaveBalances = [
    {
      leaveType: "Annual Leave",
      usedDays: 12,
      totalDays: 24,
      accrued: 2,
      expiring: 5,
    },
    {
      leaveType: "Sick Leave",
      usedDays: 3,
      totalDays: 14,
      accrued: 1.16,
      expiring: 0,
    },
    {
      leaveType: "Study Leave",
      usedDays: 2,
      totalDays: 10,
      accrued: 0,
      expiring: 0,
    },
    {
      leaveType: "Family Responsibility",
      usedDays: 1,
      totalDays: 5,
      accrued: 0,
      expiring: 0,
    },
  ];

  // Sample notifications with IST Africa specific content
  const notifications = [
    {
      id: "1",
      title: "Leave Request Approved",
      message: "Your annual leave request for the Eid celebration has been approved by John Manager.",
      timestamp: "2 hours ago",
      type: "success" as "success",
      read: false,
    },
    {
      id: "2",
      title: "Team Leave Update",
      message: "Sarah from Finance will be on study leave next week. Plan accordingly.",
      timestamp: "1 day ago",
      type: "info" as "info",
      read: true,
    },
    {
      id: "3",
      title: "Policy Update",
      message: "New leave policy for Ramadan period is now available. Please review.",
      timestamp: "2 days ago",
      type: "warning" as "warning",
      read: false,
    },
  ];
  
  // Sample team leave data with African holidays and events
  const teamLeaves = [
    {
      id: "1",
      name: "Amina Hassan",
      avatar: undefined,
      startDate: "2025-04-22",
      endDate: "2025-04-25",
      leaveType: "Annual Leave",
    },
    {
      id: "2",
      name: "John Okafor",
      avatar: undefined,
      startDate: "2025-04-29",
      endDate: "2025-05-02",
      leaveType: "Study Leave",
    },
    {
      id: "3",
      name: "Fatima Mohammed",
      avatar: undefined,
      startDate: "2025-05-06",
      endDate: "2025-05-13",
      leaveType: "Annual Leave",
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
