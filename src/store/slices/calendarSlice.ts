import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { CalendarDTO, CalendarEventType, CalendarState } from '@/types/calendar';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';
import { CalendarDTO, CalendarEventType, CalendarState } from '@/types/calendar';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

// Create calendar event
export const createCalendarEvent = createAsyncThunk(
    'calendar/create',
    async (calendarDTO: CalendarDTO, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.post<ResponseData>(
                `${BASE_URL}/api/calendar`,
                calendarDTO
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Update calendar event
export const updateCalendarEvent = createAsyncThunk(
    'calendar/update',
    async ({ id, data }: { id: string; data: CalendarDTO }, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.put<ResponseData>(
                `${BASE_URL}/api/calendar/${id}`,
                data
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Get all calendar events
export const getAllCalendarEvents = createAsyncThunk(
    'calendar/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/calendar`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Get events by date range
export const getEventsByDateRange = createAsyncThunk(
    'calendar/getByDateRange',
    async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/calendar/date-range`,
                { params: { startDate, endDate } }
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Get events by type
export const getEventsByType = createAsyncThunk(
    'calendar/getByType',
    async (eventType: CalendarEventType, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData[]>(
                `${BASE_URL}/api/calendar/type/${eventType}`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Get holidays
export const getHolidays = createAsyncThunk(
    'calendar/getHolidays',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/calendar/holidays`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Delete calendar event
export const deleteCalendarEvent = createAsyncThunk(
    'calendar/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await HttpRequest.delete(`${BASE_URL}/api/calendar/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const initialState: CalendarState = {
    events: [],
    currentEvent: null,
    holidays: [],
    recurringEvents: [],
    isLoading: false,
    error: null,
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        clearCalendarError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create calendar event
            .addCase(createCalendarEvent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCalendarEvent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events.push(action.payload.data);
                state.currentEvent = action.payload.data;
            })
            .addCase(createCalendarEvent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get all events
            .addCase(getAllCalendarEvents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllCalendarEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.data;
            })
            .addCase(getAllCalendarEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get holidays
            .addCase(getHolidays.fulfilled, (state, action) => {
                state.holidays = action.payload.data;
            })
            // Delete event
            .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
                state.events = state.events.filter(event => event.id !== action.payload);
            });
    },
});

export const { clearCalendarError } = calendarSlice.actions;
export default calendarSlice.reducer;