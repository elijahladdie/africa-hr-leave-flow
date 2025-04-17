
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  PieChart, 
  ChevronLeft, 
  FileChart, 
  Download
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

// Sample leave distribution data
const leaveDistributionData = [
  { month: "Jan", "Personal Time Off": 12, "Sick Leave": 5, "Other": 2 },
  { month: "Feb", "Personal Time Off": 8, "Sick Leave": 7, "Other": 1 },
  { month: "Mar", "Personal Time Off": 15, "Sick Leave": 4, "Other": 3 },
  { month: "Apr", "Personal Time Off": 10, "Sick Leave": 6, "Other": 2 },
  { month: "May", "Personal Time Off": 18, "Sick Leave": 8, "Other": 4 },
  { month: "Jun", "Personal Time Off": 20, "Sick Leave": 5, "Other": 2 }
];

// Sample leave type distribution data
const leaveTypeData = [
  { name: "Personal Time Off", value: 83 },
  { name: "Sick Leave", value: 35 },
  { name: "Maternity Leave", value: 12 },
  { name: "Compassionate", value: 8 },
  { name: "Other", value: 14 }
];

// Colors for the pie chart
const COLORS = ["#E57373", "#64B5F6", "#81C784", "#FFD54F", "#9575CD"];

// Available reports list
const availableReports = [
  {
    id: "1",
    title: "Annual Leave Summary",
    description: "Summary of all leave types taken by employees for the current year",
    lastUpdated: "Today, 9:45 AM"
  },
  {
    id: "2",
    title: "Department Absence Analysis",
    description: "Analysis of absences per department including sick leave patterns",
    lastUpdated: "Yesterday, 5:30 PM"
  },
  {
    id: "3",
    title: "Leave Balance Report",
    description: "Current leave balances for all employees",
    lastUpdated: "Apr 12, 2023"
  },
  {
    id: "4",
    title: "Public Holiday Schedule",
    description: "List of upcoming public holidays and affected employees",
    lastUpdated: "Mar 28, 2023"
  }
];

export default function Reports() {
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-africa-terracotta">Reports</h1>
          <p className="text-muted-foreground mt-1">View and generate leave management reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Leave Distribution Chart */}
          <Card className="africa-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-africa-terracotta" />
                Monthly Leave Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart
                  data={leaveDistributionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Personal Time Off" fill="#E57373" />
                  <Bar dataKey="Sick Leave" fill="#64B5F6" />
                  <Bar dataKey="Other" fill="#81C784" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leave Type Distribution Chart */}
          <Card className="africa-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-africa-terracotta" />
                Leave Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    data={leaveTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {leaveTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Available Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium flex items-center">
              <FileChart className="h-5 w-5 mr-2 text-africa-terracotta" />
              Available Reports
            </h2>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate New Report
            </Button>
          </div>

          <div className="space-y-4">
            {availableReports.map((report) => (
              <Card key={report.id} className="africa-card animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <Button size="sm" variant="secondary">Download</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">
                    {report.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {report.lastUpdated}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
