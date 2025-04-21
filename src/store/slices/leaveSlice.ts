import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveRequest, LeaveApplicationDTO, LeaveRequestDTO } from '@/types/leave';
import HttpRequest  from '@/lib/HttpRequest';
import { ResponseData } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface LeaveState {
  leaves: LeaveRequest[];
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

const initialState: LeaveState = {
  leaves: [],
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
      });
  }
});

export const { clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;