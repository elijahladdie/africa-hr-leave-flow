
import { ApprovalCard } from "@/components/approval/approval-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function ApprovalDashboard() {
  // Sample pending approval data
  const pendingApprovals = [
    {
      id: "1",
      employeeName: "Ibrahim Ahmed",
      avatar: undefined,
      leaveType: "Annual Leave",
      startDate: "2025-05-15",
      endDate: "2025-05-22",
      duration: "6 days",
      reason: "Family wedding celebration",
      submittedDate: "2025-04-18",
    },
    {
      id: "2",
      employeeName: "Grace Mutua",
      avatar: undefined,
      leaveType: "Study Leave",
      startDate: "2025-06-01",
      endDate: "2025-06-05",
      duration: "5 days",
      reason: "Final examination period",
      documentUrl: "/documents/exam-schedule.pdf",
      submittedDate: "2025-04-19",
    },
    {
      id: "3",
      employeeName: "Zainab Omar",
      avatar: undefined,
      leaveType: "Sick Leave",
      startDate: "2025-04-22",
      endDate: "2025-04-23",
      duration: "2 days",
      reason: "Medical appointment",
      documentUrl: "/documents/medical-note.pdf",
      submittedDate: "2025-04-19",
    },
  ];

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

  return (
    <div className="flex-1  p-8 bg-background">
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
                {pendingApprovals.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApprovals.map((approval) => (
                <ApprovalCard key={approval.id} request={approval} />
              ))}
              
              {pendingApprovals.length === 0 && (
                <Card className="col-span-1 lg:col-span-2">
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">No pending leave requests to approve.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
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
