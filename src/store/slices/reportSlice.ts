import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LeaveReport, ReportState } from '@/types/reports';
import HttpRequest  from '@/lib/HttpRequest';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

// Action Creators
export const getLeaveReports = createAsyncThunk(
  'reports/getLeaveReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<LeaveReport[]>(`${BASE_URL}/api/reports`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateLeaveReport = createAsyncThunk(
  'reports/generateReport',
  async ({
    type,
    startDate,
    endDate
  }: {
    type: string;
    startDate: string;
    endDate: string;
  }, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.post<LeaveReport>(`${BASE_URL}/api/reports/generate`, {
        type,
        startDate,
        endDate
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportReport = createAsyncThunk(
  'reports/exportReport',
  async (reportId: string, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get(
        `${BASE_URL}/api/reports/${reportId}/export`,
        { responseType: 'blob' }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: ReportState = {
  reports: [],
  isLoading: false,
  error: null
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Leave Reports
      .addCase(getLeaveReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLeaveReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(getLeaveReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate Report
      .addCase(generateLeaveReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateLeaveReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.push(action.payload);
      })
      .addCase(generateLeaveReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;