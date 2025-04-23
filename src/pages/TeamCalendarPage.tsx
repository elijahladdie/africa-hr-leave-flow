import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Download,
  Filter,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TeamCalendar } from "@/components/calendar/team-calendar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getTeamsByDepartment } from "@/store/slices/teamSlice";
import { toast } from "sonner";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { getAllTeamCalendarEvents } from "@/store/slices/teamCalendarSlice";
import { getLeaveTypes } from "@/store/slices/leaveSlice";
import { getAllDepartments } from "@/store/slices/departmentSlice";

// Mock upcoming holidays
const publicHolidays = [
  { date: "2025-05-01", name: "Workers' Day", country: "All" },
  { date: "2025-05-25", name: "Africa Day", country: "All" },
  { date: "2025-06-16", name: "Youth Day", country: "South Africa" },
  { date: "2025-07-01", name: "Republic Day", country: "Ghana" },
  { date: "2025-09-24", name: "Heritage Day", country: "South Africa" },
];
const leaveTypeColors: Record<string, string> = {
  ANNUAL: "bg-blue-100 text-blue-800 border-blue-300",
  SICK: "bg-red-100 text-red-800 border-red-300",
  MATERNITY: "bg-pink-100 text-pink-800 border-pink-300",
  PATERNITY: "bg-indigo-100 text-indigo-800 border-indigo-300",
  OTHER: "bg-amber-100 text-amber-800 border-amber-300",
  UNPAID: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function TeamCalendarPage() {
  const { events, isLoading, error } = useAppSelector(
    (state: RootState) => state.teamCalendar
  );
  const { leaveTypes } = useAppSelector((state: RootState) => state.leave);
  const dispatch = useAppDispatch();
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedView, setSelectedView] = useState("calendar");
  const [onLeaveToday, setOnLeaveToday] = useState([]);
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

    if (events.length === 0) {
      setOnLeaveToday([]);
      return;
    }

    const today = new Date().toISOString().split("T")[0]; // Format: "YYYY-MM-DD"

    const onLeaveToday = events.filter((event) => {
      const start = new Date(event.startDate).toISOString().split("T")[0];
      const end = new Date(event.endDate).toISOString().split("T")[0];
      return start === today || end === today || (start < today && end > today);
    });

    setOnLeaveToday(onLeaveToday);
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link
              to="/"
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-africa-terracotta flex items-center">
            <CalendarIcon className="h-6 w-6 mr-2 hidden sm:inline" />
            Team Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            View your team's leave schedule and public holidays.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              defaultValue="calendar"
              value={selectedView}
              onValueChange={setSelectedView}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 w-full sm:w-[200px]">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs
              defaultValue="calendar"
              value={selectedView}
              onValueChange={setSelectedView}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 w-full sm:w-[200px]">
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="mt-0">
                <div className="bg-white rounded-lg border shadow-sm">
                  <TeamCalendar className="w-full p-2" />
                </div>
              </TabsContent>
              <TabsContent value="list" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Team Leave Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Coming soon: List view of all team leave schedules with
                        sorting and filtering options.
                      </p>
                      <Button onClick={() => setSelectedView("calendar")}>
                        Switch to Calendar View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Color coding legend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Leave Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {leaveTypes.map((type) => (
                    <Badge
                      key={type.name}
                      variant="outline"
                      className={
                        leaveTypeColors[type.leaveType] ||
                        "bg-slate-100 text-slate-800 border-slate-300"
                      }
                    >
                      {type.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Public holidays */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  Upcoming Public Holidays
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {publicHolidays.map((holiday) => (
                    <div key={holiday.name} className="px-4 py-3">
                      <p className="text-sm font-medium">{holiday.name}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {holiday.country}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(holiday.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* On leave today */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team Members on Leave Today
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {onLeaveToday.length > 0 ? (
                  <div className="divide-y">
                    {onLeaveToday.map((member) => (
                      <div key={member.id} className="px-4 py-3">
                        <p className="text-sm font-medium">{member.userName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.teamName}
                        </p>
                        <div className="flex justify-between mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-100 text-blue-800 border-blue-300"
                          >
                            {member.eventType}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Returns:{" "}
                            {new Date(member.endDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No team members on leave today
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
