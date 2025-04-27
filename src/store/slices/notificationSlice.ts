import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationResponseDTO, NotificationState } from '@/types/notification';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

// Get user notifications
export const getUserNotifications = createAsyncThunk(
    'notifications/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(
                `${BASE_URL}/api/notifications/user`
            );
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// Mark notification as read
export const    markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (id: string, { rejectWithValue }) => {
        try {
            if (!id) {
                toast.error("Notification ID is required to mark as read.");
            }
            const response = await HttpRequest.put<ResponseData>(
                `${BASE_URL}/api/notifications/${id}/read`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const initialState: NotificationState = {
    notifications: [],
    isLoading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload.data;
            })
            .addCase(getUserNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            });
    },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;