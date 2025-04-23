import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveRequest, LeaveApplicationDTO, LeaveRequestDTO, LeaveType } from '@/types/leave';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface LeaveState {
  leaves: LeaveRequest[];
  leaveTypes: LeaveType[];
  activeRequest: LeaveRequest[];
  currentLeave: LeaveRequest | null;
  isLoading: boolean;
  error: string | null;
}

export const submitLeaveRequest = createAsyncThunk(
  'leave/submit',
  async (data: { leaveRequest: LeaveRequestDTO; document?: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Add the leave request data as a JSON string
      formData.append('leaveRequest', new Blob(
        [JSON.stringify(data.leaveRequest)],
        { type: 'application/json' }
      ));

      // Add the document if it exists
      if (data.document) {
        formData.append('document', data.document);
      }

      const response = await HttpRequest.post<ResponseData>(
        `${BASE_URL}/api/leave-requests`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);
// getLeaveTypes

export const getLeaveTypes = createAsyncThunk(
  'LeaveTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/leave-requests/types`);
      return response;
    } catch (error) {
      console.error('Failed to fetch leave types:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const getTeamActiveRequests = createAsyncThunk(
  'LeaveTypes/getTeamActiveRequests',
  async (teamId: string, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/leave-requests/active/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leave types:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState: LeaveState = {
  leaves: [],
  leaveTypes: [],
  activeRequest: [],
  currentLeave: null,
  isLoading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearLeaveError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLeaveRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaves.push(action.payload.data);
        state.currentLeave = action.payload.data;
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getLeaveTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaveTypes = action.payload.data;
      })
      .addCase(getLeaveTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getTeamActiveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamActiveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRequest = action.payload.data;
      })
      .addCase(getTeamActiveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;