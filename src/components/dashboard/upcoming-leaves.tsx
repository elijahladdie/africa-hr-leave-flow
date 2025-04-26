import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LeaveRequest } from "@/types/leave";
import {
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval,
  isBefore,
  isAfter,
} from "date-fns";
// interface TeamMemberLeave {
//   id: string;
//   name: string;
//   avatar?: string;
//   startDate: string;
//   endDate: string;
//   leaveType: string;
// }

interface UpcomingLeavesProps {
  leaves: LeaveRequest[];
}

export function UpcomingLeaves({ leaves }: UpcomingLeavesProps) {
  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Helper function to format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startMonth = startDate.toLocaleString("default", { month: "short" });
    const endMonth = endDate.toLocaleString("default", { month: "short" });

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

  return (
    <Card className="africa-card animate-fade-in ">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Upcoming Team Leaves
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No upcoming leaves scheduled</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(50vh-132px)] overflow-y-auto">
            {leaves
              ?.filter((leave) => {
                const start = parseISO(leave.startDate);
                const end = parseISO(leave.endDate);
                return (
                  isWithinInterval(start, { start: weekStart, end: weekEnd }) ||
                  isWithinInterval(end, { start: weekStart, end: weekEnd }) ||
                  (isBefore(start, weekStart) && isAfter(end, weekEnd)) // spans the whole week
                );
              })
              .map((leave) => (
                <div key={leave.id}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={leave.profilePictureUrl} />
                      <AvatarFallback className="bg-africa-sage/10 text-africa-sage text-xs">
                        {getInitials(leave.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{leave.userName}</p>
                        <span className="text-xs bg-africa-cream px-2 py-0.5 rounded-full">
                          {leave.leaveType}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateRange(leave.startDate, leave.endDate)}
                        </p>
                        <p
                          className={`text-xs text-muted-foreground mt-0.5 w-fit px-2 py-0.5 rounded-full
                          ${
                            leave.status === "APPROVED"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                          `}
                        >
                          {leave.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
