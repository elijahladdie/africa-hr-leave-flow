import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApprovalState, UpdateLeaveRequestPayload } from '@/types/approval';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

const initialState: ApprovalState = {
  pendingRequests: [],
  approvedRequests: [],
  rejectedRequests: [],
  isLoading: false,
  error: null,
};

export const getPendingApprovals = createAsyncThunk(
  'approvals/getPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<ResponseData>(
        `${BASE_URL}/api/leave-requests/manager/pending`
      );
      if (response.resp_code !== 200) {
        toast.error(response.resp_msg || 'Failed to fetch Pending Approvals');
      }
      return response;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      return rejectWithValue(error.response);
    }
  }
);

export const updateLeaveRequest = createAsyncThunk(
  'approvals/updateRequest',
  async (payload: UpdateLeaveRequestPayload, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.put<ResponseData>(
        `${BASE_URL}/api/leave-requests/${payload.leaveId}`,
        { status: payload.status, comments: payload.comment }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const approvalSlice = createSlice({
  name: 'approvals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingApprovals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPendingApprovals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = action.payload.data;
      })
      .addCase(getPendingApprovals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        const { id, status } = action.payload.data;
        state.pendingRequests = state.pendingRequests.filter(
          request => request.id !== id
        );
        if (status === 'APPROVED') {
          state.approvedRequests.push(action.payload.data);
        } else if (status === 'REJECTED') {
          state.rejectedRequests.push(action.payload.data);
        }
      });
  },
});

export default approvalSlice.reducer;