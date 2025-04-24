import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import HttpRequest from '@/lib/HttpRequest';
import { TeamDTO } from '@/types/dto';
import { ResponseData } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface TeamState {
  teams: TeamDTO[];
  currentTeam: TeamDTO | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  isLoading: false,
  error: null,
};

// Get all teams
export const getAllTeams = createAsyncThunk(
  'teams/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<TeamDTO[]>(`${BASE_URL}/api/teams`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get team by ID
export const getTeamById = createAsyncThunk(
  'teams/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<TeamDTO>(`${BASE_URL}/api/teams/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create team
export const createTeam = createAsyncThunk(
  'teams/create',
  async (data: TeamDTO, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.post<ResponseData>(`${BASE_URL}/api/teams`, data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update team
export const updateTeam = createAsyncThunk(
  'teams/update',
  async ({ id, data }: { id: string; data: TeamDTO }, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.put<TeamDTO>(`${BASE_URL}/api/teams/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete team
export const deleteTeam = createAsyncThunk(
  'teams/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await HttpRequest.delete(`${BASE_URL}/api/teams/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get teams by department
export const getTeamsByDepartment = createAsyncThunk(
  'teams/getByDepartment',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<TeamDTO[]>(
        `${BASE_URL}/api/teams/department/${departmentId}`
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamError: (state) => {
      state.error = null;
    },
    clearCurrentTeam: (state) => {
      state.currentTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all teams
      .addCase(getAllTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(getAllTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get team by ID
      .addCase(getTeamById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeam = action.payload;
      })
      .addCase(getTeamById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create team
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload.data);
        state.currentTeam = action.payload.data;
      })
      // Update team
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex((team) => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        state.currentTeam = action.payload;
      })
      // Delete team
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((team) => team.id !== action.payload);
        if (state.currentTeam?.id === action.payload) {
          state.currentTeam = null;
        }
      })
      // Get teams by department
      .addCase(getTeamsByDepartment.fulfilled, (state, action) => {
        state.teams = action.payload;
      });
  },
});

export const { clearTeamError, clearCurrentTeam } = teamSlice.actions;

// Selectors
export const selectAllTeams = (state: RootState) => state.teams.teams;
export const selectCurrentTeam = (state: RootState) => state.teams.currentTeam;
export const selectTeamLoading = (state: RootState) => state.teams.isLoading;
export const selectTeamError = (state: RootState) => state.teams.error;

export default teamSlice.reducer;