import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TeamCalendarEventDTO, TeamCalendarState } from '@/types/teamCalendar';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

// Get team calendar events
export const getTeamCalendarEvents = createAsyncThunk(
    'teamCalendar/getEvents',
    async (teamId: string, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/team-calendar/${teamId}`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);
export const getTeamCalendarByDepartId = createAsyncThunk(
    'teamCalendar/bydepartmentId',
    async (teamId: string, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/team-calendar/bydepartment/${teamId}`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);
export const getAllTeamCalendarEvents = createAsyncThunk(
    'teamCalendar/getAllTeamCalendarEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/team-calendar/events`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Get team calendar events by date range
export const getTeamCalendarEventsByDateRange = createAsyncThunk(
    'teamCalendar/getEventsByDateRange',
    async ({
        teamId,
        startDate,
        endDate
    }: {
        teamId: string;
        startDate: string;
        endDate: string;
    }, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/team-calendar/${teamId}/range`,
                {
                    params: { startDate, endDate }
                }
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const initialState: TeamCalendarState = {
    events: [],
    isLoading: false,
    error: null,
};

const teamCalendarSlice = createSlice({
    name: 'teamCalendar',
    initialState,
    reducers: {
        clearTeamCalendarError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get team calendar events
            .addCase(getTeamCalendarEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTeamCalendarEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.data;
            })
            .addCase(getTeamCalendarEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Get team calendar events by date range
            .addCase(getTeamCalendarEventsByDateRange.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTeamCalendarEventsByDateRange.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.data;
            })
            .addCase(getTeamCalendarEventsByDateRange.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllTeamCalendarEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllTeamCalendarEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.data;
            })
            .addCase(getAllTeamCalendarEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getTeamCalendarByDepartId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTeamCalendarByDepartId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload.data;
            })
            .addCase(getTeamCalendarByDepartId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearTeamCalendarError } = teamCalendarSlice.actions;
export default teamCalendarSlice.reducer;