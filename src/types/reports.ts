export interface LeaveReport {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  data: any; // Replace with specific data structure
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ReportState {
  reports: LeaveReport[];
  isLoading: boolean;
  error: string | null;
}