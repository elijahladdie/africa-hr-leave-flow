export interface LeaveApplicationDTO {
  leaveType: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER";
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason?: string;
  documents?: File[];
  submittedAt: string;
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  reason: string;
  profilePictureUrl?: string;
  userName?: string;
  leaveType?: string;
}

export interface LeaveHistoryState {
  requests: LeaveRequest[];
  isLoading: boolean;
  error: string | null;
}

export interface LeaveRequestDTO {
  leaveType: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER";
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason: string;
  submittedAt: string;
}
export interface LeaveType {
  id: string;
  name: string;
  leaveType: "ANNUAL" | "SICK" | "MATERNITY" | "PATERNITY" | "UNPAID" | "OTHER";
  description: string;
  defaultDays: number;
  requiresApproval: boolean;
  isPaid: boolean;
  maxDays: number;
  createdAt: string;
  updatedAt: string;
}