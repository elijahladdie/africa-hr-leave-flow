import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveHistoryState, LeaveRequest } from '@/types/leave';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';

const initialState: LeaveHistoryState = {
  requests: [],
  isLoading: false,
  error: null,
};

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;


export const fetchLeaveHistory = createAsyncThunk(
  'leaveHistory/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/leave-requests/user`);
      return response.data;
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
        state.requests = action.payload;
      })
      .addCase(fetchLeaveHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default leaveHistorySlice.reducer;