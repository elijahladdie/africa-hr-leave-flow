/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveRequest, LeaveApplicationDTO, LeaveRequestDTO, LeaveType } from '@/types/leave';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface LeaveState {
  leaves: LeaveRequest[];
  leaveTypes: LeaveType[];
  LeaveBalance: any[];
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
      return response.data;
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
export const getAllLeavebalance = createAsyncThunk(
  'LeaveTypes/getAllLeavebalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/leave-balances/all`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leave types:', error);
      return rejectWithValue(error.message);
    }
  }
);
export const createLeaveType = createAsyncThunk(
  'leave/createType',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.post<ResponseData>(
        `${BASE_URL}/api/leave-requests/types`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateLeaveType = createAsyncThunk(
  'leave/updateType',
  async ({ id, ...data }: any & { id: string }, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.put<ResponseData>(
        `${BASE_URL}/api/leave-requests/types/${id}`,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteLeaveType = createAsyncThunk(
  'leave/deleteType',
  async (id: string, { rejectWithValue }) => {
    try {
      await HttpRequest.delete(`${BASE_URL}/api/leave-requests/types/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState: LeaveState = {
  leaves: [],
  leaveTypes: [],
  activeRequest: [],
  LeaveBalance: [],
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
        state.leaveTypes = action.payload;
      })
      .addCase(getLeaveTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllLeavebalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllLeavebalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.LeaveBalance = action.payload;
      })
      .addCase(getAllLeavebalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getTeamActiveRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamActiveRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRequest = action.payload;
      })
      .addCase(getTeamActiveRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createLeaveType.fulfilled, (state, action) => {
        state.leaveTypes.push(action.payload.data);
      })
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        const index = state.leaveTypes.findIndex(type => type.id === action.payload.data.id);
        if (index !== -1) {
          state.leaveTypes[index] = action.payload.data;
        }
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.leaveTypes = state.leaveTypes.filter(type => type.id !== action.payload);
      })
      ;
  }
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;