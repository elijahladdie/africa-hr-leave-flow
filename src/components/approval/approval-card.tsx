import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Clock, File, HelpCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { LeaveApproval } from "@/types/approval";

interface ApprovalCardProps {
  request: LeaveApproval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalCard({
  request,
  onApprove,
  onReject,
}: ApprovalCardProps) {
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  // Handle action click
  const handleActionClick = (action: "approve" | "reject") => {
    setActionType(action);
    setShowCommentBox(true);
  };

  // Handle submit
  const handleSubmit = () => {
    console.log(
      "Action:",
      actionType,
      "Request ID:",
      request.id,
      "Comment:",
      comment
    );
    if (actionType === "approve") {
      onApprove(request.id);
    } else {
      onReject(request.id);
    }

    setComment("");
    setShowCommentBox(false);
    setActionType(null);
  };

  return (
    <Card className="africa-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={request.profilePictureUrl} />
              <AvatarFallback className="bg-africa-blue/10 text-africa-blue">
                {getInitials(request.userName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">
                {request.userName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {request.leaveType}
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>
              Submitted: {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Period</p>
              <p className="font-medium">
                {formatDateRange(request.startDate, request.endDate)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">{request.duration}</p>
            </div>
          </div>

          {request.reason && (
            <div className="text-sm">
              <p className="text-muted-foreground">Reason</p>
              <p className="font-medium">{request.reason}</p>
            </div>
          )}

          {request?.documentUrl && (
            <div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs w-full flex items-center justify-center mt-2"
              >
                <File className="h-4 w-4 mr-1" />
                View Attached Document
              </Button>
            </div>
          )}

          {showCommentBox && (
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground">Your Comment</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        {actionType === "approve"
                          ? "Add any notes about this approval."
                          : "Please provide a reason for rejection."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                placeholder={
                  actionType === "approve"
                    ? "Add any notes (optional)"
                    : "Provide reason for rejection"
                }
                className="min-h-[80px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3">
        {showCommentBox ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCommentBox(false);
                setActionType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={actionType === "reject" && !comment}
              className={
                actionType === "approve"
                  ? "bg-africa-sage hover:bg-africa-sage/90"
                  : "bg-africa-red hover:bg-africa-red/90"
              }
            >
              {actionType === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="border-africa-red text-africa-red hover:bg-africa-red/10"
              onClick={() => handleActionClick("reject")}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-africa-sage text-africa-sage hover:bg-africa-sage/10"
              onClick={() => handleActionClick("approve")}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
