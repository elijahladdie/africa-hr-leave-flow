export interface TeamCalendarEventDTO {
  id: string;
  teamId: string;
  teamName: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
}

export interface TeamCalendarState {
  events: TeamCalendarEventDTO[];
  isLoading: boolean;
  error: string | null;
}