
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface TeamMemberLeave {
  id: string;
  name: string;
  avatar?: string;
  startDate: string;
  endDate: string;
  leaveType: string;
}

interface UpcomingLeavesProps {
  leaves: TeamMemberLeave[];
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
    
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    }
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  };

  return (
    <Card className="africa-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Upcoming Team Leaves</CardTitle>
      </CardHeader>
      <CardContent>
        {leaves.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No upcoming leaves scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div key={leave.id}>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={leave.avatar} />
                    <AvatarFallback className="bg-africa-sage/10 text-africa-sage text-xs">
                      {getInitials(leave.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{leave.name}</p>
                      <span className="text-xs bg-africa-cream px-2 py-0.5 rounded-full">
                        {leave.leaveType}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateRange(leave.startDate, leave.endDate)}
                    </p>
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
