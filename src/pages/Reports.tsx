import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  PieChart,
  ChevronLeft,
  FileText,
  Download,
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
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";

import { DateRange } from "@/types/reports";
import { fetchLeaveHistory } from "@/store/slices/leaveHistorySlice";
import { getAllLeavebalance, getLeaveTypes } from "@/store/slices/leaveSlice";
import { getUserProfile } from "@/store/slices/userSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Colors for the pie chart
const COLORS = ["#E57373", "#64B5F6", "#81C784", "#FFD54F", "#9575CD"];

export default function Reports() {
  const dispatch = useAppDispatch();
  const { requests } = useAppSelector((state) => state.leaveHistory);
  const { leaveTypes, LeaveBalance } = useAppSelector((state) => state.leave);
  const { user } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    start: "",
    end: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          dispatch(fetchLeaveHistory()).unwrap(),
          dispatch(getLeaveTypes()).unwrap(),
          dispatch(getUserProfile()).unwrap(),
          dispatch(getAllLeavebalance()).unwrap(),
        ]);
      } catch (err) {
        toast.error("Failed to load report data");
        console.error("Data loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Transform leave history data for the bar chart
  const leaveDistributionData = requests.reduce((acc, request) => {
    const month = new Date(request.startDate).toLocaleString("default", {
      month: "short",
    });
    const leaveType = request.leaveType;

    const monthData = acc.find((item) => item.month === month) || {
      month,
      "Annual Leave": 0,
      "Sick Leave": 0,
      Other: 0,
    };

    if (leaveType === "ANNUAL") {
      monthData["Annual Leave"]++;
    } else if (leaveType === "SICK") {
      monthData["Sick Leave"]++;
    } else {
      monthData["Other"]++;
    }

    if (!acc.find((item) => item.month === month)) {
      acc.push(monthData);
    }

    return acc;
  }, []);

  // Transform leave types data for the pie chart
  const leaveTypeData = leaveTypes.map((type) => ({
    name: type.name,
    value: requests.filter((req) => req.leaveType === type.leaveType).length,
  }));

  // Generate reports based on user's leave balances
  const availableReports = [
    {
      id: "leave-summary",
      title: "Leave Summary Report",
      description: "Summary of all leave requests and their status",
      data: requests,
      lastUpdated: new Date().toLocaleString(),
    },
    {
      id: "balance-report",
      title: "Leave Balance Report",
      description: "Current leave balances for all leave types",
      data: LeaveBalance || [],
      lastUpdated: new Date().toLocaleString(),
    },
  ];

  const handleDownloadReport = (reportId: string) => {
    const report = availableReports.find((r) => r.id === reportId);
    if (!report) return;

    // Create CSV content
    const csvContent = generateCSVContent(report.data);

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${report.title}.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const generateCSVContent = (data: any[]) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]);
    const rows = data.map((item) => headers.map((header) => item[header]));

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-africa-terracotta">
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            View and generate leave management reports
          </p>
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
                  <Bar dataKey="Annual Leave" fill="#E57373" />
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
                <RechartsPieChart
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <Pie
                    data={leaveTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {leaveTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
              <FileText className="h-5 w-5 mr-2 text-africa-terracotta" />
              Available Reports
            </h2>
          </div>

          <div className="space-y-4">
            {availableReports.map((report) => (
              <Card key={report.id} className="africa-card animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      Download
                    </Button>
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

        {/* Leave Balance Table */}

        <div className="overflow-x-auto mt-8 space-y-2">
          <Card className="africa-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                Leave Balances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Names</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Allocated</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LeaveBalance?.map((bal, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          {bal.userName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {bal.leaveType}
                        </TableCell>
                        <TableCell>{bal.totalDays} days</TableCell>
                        <TableCell>{bal.usedDays} days</TableCell>
                        <TableCell>{bal.remainingDays} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Table */}

        <div className="overflow-x-auto mt-8">
          <Card className="africa-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Names</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="hidden md:table-cell">
                        comments
                      </TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">
                          {req.userName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {req.leaveType}
                        </TableCell>
                        <TableCell>{req.reason}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {req.reason}
                        </TableCell>
                        <TableCell>{req.startDate}</TableCell>
                        <TableCell>{req.endDate}</TableCell>
                        <TableCell>{req.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
