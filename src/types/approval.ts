export interface LeaveApproval {
  id: string;
  userName: string;
  avatar?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: string;
  reason?: string;
  createdAt: string;
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
}

export interface UpdateLeaveRequestPayload {
  leaveId: string;
  status: 'APPROVED' | 'REJECTED';
  comment?: string;
}

export interface ApprovalState {
  pendingRequests: LeaveApproval[];
  approvedRequests: LeaveApproval[];
  rejectedRequests: LeaveApproval[];
  isLoading: boolean;
  error: string | null;
}