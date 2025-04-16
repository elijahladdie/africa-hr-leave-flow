
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Define leave types with colors
const leaveTypeColors = {
  "PTO": { bg: "bg-africa-terracotta/20", text: "text-africa-terracotta" },
  "Sick Leave": { bg: "bg-africa-blue/20", text: "text-africa-blue" },
  "Maternity Leave": { bg: "bg-africa-sage/20", text: "text-africa-sage" },
  "Compassionate Leave": { bg: "bg-gray-400/20", text: "text-gray-600" },
  "Public Holiday": { bg: "bg-africa-yellow/20", text: "text-africa-yellow" },
};

// Sample leave data
const sampleLeaves = [
  { 
    date: "2023-04-17", 
    employee: { name: "John Doe", avatar: undefined }, 
    type: "PTO" 
  },
  { 
    date: "2023-04-18", 
    employee: { name: "Jane Smith", avatar: undefined }, 
    type: "Sick Leave" 
  },
  { 
    date: "2023-04-20", 
    employee: { name: "John Doe", avatar: undefined }, 
    type: "PTO" 
  },
  { 
    date: "2023-04-21", 
    employee: { name: "Emily Wong", avatar: undefined }, 
    type: "Maternity Leave" 
  },
  { 
    date: "2023-04-21", 
    employee: { name: "Michael Johnson", avatar: undefined }, 
    type: "Compassionate Leave" 
  },
  // Add more sample data as needed
];

interface TeamCalendarProps {
  className?: string;
}

export function TeamCalendar({ className }: TeamCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Helper function to get month name and year
  const getMonthAndYear = (date: Date) => {
    return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
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
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
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
    // Format the date to match the format in sampleLeaves
    const formattedDate = date.toISOString().split('T')[0];
    
    return sampleLeaves.filter(leave => leave.date === formattedDate);
  };

  // Function to get avatar initials
  const getInitials = (name: string) => {
    return name.split(" ")
      .map(part => part[0])
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
          <Select onValueChange={setSelectedDepartment} defaultValue={selectedDepartment}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => {
            if (!day.isCurrentMonth) {
              return <div key={index} className="h-20 bg-muted/30 rounded-md"></div>;
            }
            
            // Get leave events for this day
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
                    const { bg, text } = leaveTypeColors[event.type as keyof typeof leaveTypeColors] || { bg: "bg-gray-200", text: "text-gray-700" };
                    
                    return (
                      <div key={eventIndex} className={`flex items-center ${bg} ${text} rounded-sm px-1 py-0.5 text-xs truncate`}>
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={event.employee.avatar} />
                          <AvatarFallback className="text-[8px]">
                            {getInitials(event.employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">{event.employee.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center flex-wrap gap-2">
          {Object.entries(leaveTypeColors).map(([type, { bg, text }]) => (
            <div key={type} className="flex items-center">
              <div className={`h-3 w-3 rounded-sm ${bg} ${text} mr-1`}></div>
              <span className="text-xs text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
