import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeaveRequest {
  id: string;
   leaveType: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER";
  startDate: string;
  endDate: string;
  duration: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason?: string;
}

interface LeaveHistoryListProps {
  leaveRequests: LeaveRequest[];
}

export function LeaveHistoryList({ leaveRequests }: LeaveHistoryListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="leave-status-pending">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="leave-status-approved">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="leave-status-rejected">Rejected</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="leave-status-rejected">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredRequests = useMemo(() => {
    return leaveRequests?.filter((request) => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesType = typeFilter === "all" || request.leaveType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [leaveRequests, statusFilter, typeFilter]);

  const uniqueTypes = [...new Set(leaveRequests.map(req => req.leaveType))];

  return (
    <Card className="africa-card animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Leave History</CardTitle>
          <div className="flex gap-3">
            <Select onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Leave Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.leaveType}</TableCell>
                    <TableCell>
                      {new Date(request.startDate).toLocaleDateString()} -{" "}
                      {new Date(request.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{request.duration}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
