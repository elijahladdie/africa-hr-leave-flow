export interface LeaveApplicationDTO {
  leaveType: string;
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
  leaveType: string;
  startDate: string;
  endDate: string;
  halfDay: boolean;
  reason: string;
  submittedAt: string;
}
export interface LeaveType {
  id: string;
  name: string;
  leaveType: string;
  description: string;
  maxDays: number;
  createdAt: string;
  updatedAt: string;
}