import { ApprovalCard } from "@/components/approval/approval-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import { getPendingApprovals, updateLeaveRequest } from "@/store/slices/approvalSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApprovalDashboard() {
  const dispatch = useAppDispatch();
  const { pendingRequests, isLoading, error } = useAppSelector((state) => state.approvals);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        await dispatch(getPendingApprovals()).unwrap();
      } catch (err) {
        toast.error('Failed to load pending approvals');
        console.error('Approvals loading error:', err);
      }
    };
    fetchApprovals();

    return () => {
      // Cleanup if needed
    };
  }, [dispatch]);

  // Sample history data
  const approvedRequests = [
    {
      id: "4",
      employeeName: "Samuel Maina",
      avatar: undefined,
      leaveType: "Annual Leave",
      startDate: "2025-03-15",
      endDate: "2025-03-20",
      duration: "6 days",
      reason: "Family vacation",
      submittedDate: "2025-03-01",
    },
  ];
  
  const rejectedRequests = [
    {
      id: "5",
      employeeName: "Aisha Hassan",
      avatar: undefined,
      leaveType: "Annual Leave",
      startDate: "2025-02-10",
      endDate: "2025-02-15",
      duration: "6 days",
      reason: "Short notice application",
      submittedDate: "2025-02-08",
    },
  ];

  const handleLeaveApproval = async (leaveId: string, status: 'APPROVED' | 'REJECTED', comment?: string) => {
    setIsProcessing(true);
    try {
      const response = await dispatch(
        updateLeaveRequest({
          leaveId,
          status,
          comment
        })
      ).unwrap();
      console.log("Leave request updated:", response);
      toast.success(`Leave request ${status.toLowerCase()} successfully`);
    } catch (err) {
      toast.error("Failed to update leave request");
    } finally {
      setIsProcessing(false);
    }
  };

  // Update the pending TabsContent to show loading state
  const renderPendingContent = () => (
    <TabsContent value="pending" className="mt-0">
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-[200px] w-full" />
          ))}
        </div>
      ) : error ? (
        <Card className="col-span-1 lg:col-span-2">
          <CardContent className="py-10 text-center text-red-500">
            <p>{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingRequests.map((approval) => (
            <ApprovalCard
              key={approval.id}
              request={approval}
              onApprove={(id) => handleLeaveApproval(id, 'APPROVED')}
              onReject={(id) => handleLeaveApproval(id, 'REJECTED')}
            />
          ))}
          
          {pendingRequests.length === 0 && (
            <Card className="col-span-1 lg:col-span-2">
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No pending leave requests to approve.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </TabsContent>
  );

  return (
    <div className="flex-1  p-8 ">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2 sm:mb-4">
              <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-africa-terracotta">Leave Approvals</h1>
            <p className="text-muted-foreground mt-1">Review and manage team leave requests.</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4 sm:mt-0 self-start flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="relative">
              Pending
              <span className="ml-1 bg-africa-terracotta text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingRequests.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          {renderPendingContent()}
          
          <TabsContent value="approved" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {approvedRequests.map((approval) => (
                <Card key={approval.id} className="africa-card animate-fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">
                      {approval.employeeName} - {approval.leaveType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Period</p>
                        <p className="font-medium">
                          {new Date(approval.startDate).toLocaleDateString()} - {new Date(approval.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{approval.duration}</p>
                      </div>
                      {approval.reason && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Reason</p>
                          <p className="font-medium">{approval.reason}</p>
                        </div>
                      )}
                      <div className="col-span-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-africa-sage/20 text-africa-sage border border-africa-sage/30">
                          Approved
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {approvedRequests.length === 0 && (
                <Card className="col-span-1 lg:col-span-2">
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No approved leave requests found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rejectedRequests.map((approval) => (
                <Card key={approval.id} className="africa-card animate-fade-in">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium">
                      {approval.employeeName} - {approval.leaveType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Period</p>
                        <p className="font-medium">
                          {new Date(approval.startDate).toLocaleDateString()} - {new Date(approval.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-medium">{approval.duration}</p>
                      </div>
                      {approval.reason && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Reason</p>
                          <p className="font-medium">{approval.reason}</p>
                        </div>
                      )}
                      <div className="col-span-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-africa-red/20 text-africa-red border border-africa-red/30">
                          Rejected
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {rejectedRequests.length === 0 && (
                <Card className="col-span-1 lg:col-span-2">
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No rejected leave requests found.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
