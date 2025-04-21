import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveHistoryState, LeaveRequest } from '@/types/leave';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';

const initialState: LeaveHistoryState = {
  requests: [],
  isLoading: false,
  error: null,
};

export const fetchLeaveHistory = createAsyncThunk(
  'leaveHistory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<ResponseData>('/api/leave-requests/user');
      return response;
    } catch (error) {
      console.error('Failed to fetch leave history:', error);
      return rejectWithValue(error.message);
    }
  }
);

const leaveHistorySlice = createSlice({
  name: 'leaveHistory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaveHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data;
      })
      .addCase(fetchLeaveHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default leaveHistorySlice.reducer;