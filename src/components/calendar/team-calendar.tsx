import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getLeaveTypes } from "@/store/slices/leaveSlice";
import {
  getAllTeamCalendarEvents,
  getTeamCalendarByDepartId,
} from "@/store/slices/teamCalendarSlice";
import { getAllDepartments } from "@/store/slices/departmentSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { format } from "date-fns";

// Define leave types with colors
const leaveTypeColors: Record<string, { bg: string; text: string }> = {
  ANNUAL: { bg: "bg-africa-terracotta/20", text: "text-africa-terracotta" },
  SICK: { bg: "bg-africa-blue/20", text: "text-africa-blue" },
  MATERNITY: { bg: "bg-africa-sage/20", text: "text-africa-sage" },
  PATERNITY: { bg: "bg-africa-purple/20", text: "text-africa-purple" },
  OTHER: { bg: "bg-gray-400/20", text: "text-gray-600" },
  UNPAID: { bg: "bg-gray-300/20", text: "text-gray-500" },
};

interface TeamCalendarProps {
  className?: string;
}

export function TeamCalendar({ className }: TeamCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const { events, isLoading, error } = useAppSelector(
    (state: RootState) => state.teamCalendar
  );
  const { leaveTypes } = useAppSelector((state: RootState) => state.leave);
  const dispatch = useAppDispatch();
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("calendar");
  const departments = useAppSelector(
    (state: RootState) => state.departments.departments
  );

  useEffect(() => {
    const handleTeamSchedule = async () => {
      await dispatch(getLeaveTypes()).unwrap();
      await dispatch(getAllTeamCalendarEvents()).unwrap;
      await dispatch(getAllDepartments()).unwrap();
    };
    handleTeamSchedule();
  }, []);
  // Helper function to get month name and year
  const getMonthAndYear = (date: Date) => {
    return date.toLocaleDateString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const previousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Generate days for the current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Generate array of days
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: 0, isCurrentMonth: false });
    }

    // Add days of the current month
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Add empty cells to complete the grid if needed
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 0; i < remainingCells; i++) {
      days.push({ day: 0, isCurrentMonth: false });
    }

    return days;
  };

  // Get leave events for a specific date

  const getLeaveEvents = (date: Date) => {
    const targetDate = format(date, "yyyy-MM-dd");

    return events?.filter((leave) => {
      const start = leave.startDate.split("T")[0];
      const end = leave.endDate.split("T")[0];
      return targetDate >= start && targetDate <= end;
    });
  };
  const handleDayClick = (day) => {
    if (day.startDate && day.endDate) {
      setSelectedDay(day);
      setIsDialogOpen(true);
    }
  };
  const HandleCalenderChange = async (value) => {
    setSelectedDepartment(value);
    if (value == "all") {
      await dispatch(getAllTeamCalendarEvents()).unwrap();
    } else {
      await dispatch(getTeamCalendarByDepartId(value)).unwrap();
    }
  };
  // Function to get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Generate days
  const calendarDays = generateCalendarDays();

  return (
    <Card className={`africa-card ${className} animate-fade-in`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Team Calendar
          </CardTitle>
          <Select
            onValueChange={(value) => HandleCalenderChange(value)}
            defaultValue={selectedDepartment}
          >
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">{getMonthAndYear(currentMonth)}</h3>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            if (!day.isCurrentMonth) {
              return (
                <div key={index} className="h-20 bg-muted/30 rounded-md"></div>
              );
            }

            // Get leave events for this day
            console.log(" ====== || ==== ", day);
            const events = day.date ? getLeaveEvents(day.date) : [];

            return (
              <div
                key={index}
                className="h-20 border border-border rounded-md p-1 overflow-hidden hover:border-africa-terracotta/50 transition-colors"
              >
                <div className="text-right text-xs font-medium mb-1">
                  {day.day}
                </div>
                <div className="space-y-1">
                  {events.map((event, eventIndex) => {
                    const { bg, text } = leaveTypeColors[
                      event.eventType as keyof typeof leaveTypeColors
                    ] || { bg: "bg-gray-200", text: "text-gray-700" };

                    return (
                      <div
                        key={eventIndex}
                        className={`flex items-center ${bg} ${text} rounded-sm px-1 py-0.5 text-xs truncate`}
                        onClick={() => handleDayClick(event)}
                      >
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={event?.userAvatar} />
                          <AvatarFallback className="text-[8px]">
                            {getInitials(event.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{event.userName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center flex-wrap gap-2">
          {leaveTypes?.map(({ name, leaveType, description }) => {
            const color = leaveTypeColors[leaveType] || {
              bg: "bg-gray-200",
              text: "text-gray-600",
            };

            return (
              <div
                key={leaveType}
                className="flex items-center"
                title={description}
              >
                <div
                  className={`h-3 w-3 rounded-sm ${color.bg} ${color.text} mr-1`}
                ></div>
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            );
          })}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>
                  {selectedDay?.startDate &&
                    format(selectedDay.startDate, "EEEE, MMMM d, yyyy")}
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="py-4">
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events
                    .filter((event) => {
                      const eventStart = new Date(event.startDate);
                      const eventEnd = new Date(event.endDate);
                      const selectedStart = new Date(selectedDay?.startDate);
                      const selectedEnd = new Date(selectedDay?.endDate);

                      return (
                        eventStart <= selectedEnd && eventEnd >= selectedStart
                      );
                    })
                    .map((event, index) => {
                      const { bg, text } = leaveTypeColors[event.eventType] || {
                        bg: "bg-gray-200",
                        text: "text-gray-700",
                      };

                      return (
                        <div
                          key={index}
                          className="flex items-start p-3 rounded-lg border border-border"
                        >
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={event?.userAvatar} />
                            <AvatarFallback className={`${bg} ${text}`}>
                              {getInitials(event.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{event.userName}</div>
                            <div className={`text-sm ${text} font-medium mt-1`}>
                              {event.eventType}
                            </div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </div>
                            )}
                            {event.startDate && event.endDate && (
                              <div className="text-xs text-muted-foreground mt-2">
                                {event.startDate} - {event.endDate}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-muted-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-muted-foreground">
                    No events planned for this day
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
