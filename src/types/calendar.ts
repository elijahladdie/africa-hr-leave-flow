export enum CalendarEventType {
  HOLIDAY = 'HOLIDAY',
  MEETING = 'MEETING',
  EVENT = 'EVENT'
}

export interface CalendarDTO {
  title: string;
  description: string;
  eventType: CalendarEventType;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
}

export interface CalendarResponseDTO extends CalendarDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarState {
  events: CalendarResponseDTO[];
  currentEvent: CalendarResponseDTO | null;
  holidays: CalendarResponseDTO[];
  recurringEvents: CalendarResponseDTO[];
  isLoading: boolean;
  error: string | null;
}