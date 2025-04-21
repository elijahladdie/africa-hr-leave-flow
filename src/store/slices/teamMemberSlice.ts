import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { TeamMember, TeamMemberDTO } from '@/types/team';
import { RootState } from '../index';
import HttpRequest  from '@/lib/HttpRequest';
import { TeamMember, TeamMemberDTO } from '@/types/dto';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface TeamMemberState {
  teamMembers: TeamMember[];
  currentTeamMember: TeamMember | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamMemberState = {
  teamMembers: [],
  currentTeamMember: null,
  isLoading: false,
  error: null,
};

// Get all team members
export const getAllTeamMembers = createAsyncThunk(
  'teamMembers/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<TeamMember[]>(`${BASE_URL}/api/team-members`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get team member by ID
export const getTeamMemberById = createAsyncThunk(
  'teamMembers/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.get<TeamMember>(`${BASE_URL}/api/team-members/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create team member
export const createTeamMember = createAsyncThunk(
  'teamMembers/create',
  async (data: TeamMemberDTO, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.post<TeamMember>(`${BASE_URL}/api/team-members`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update team member
export const updateTeamMember = createAsyncThunk(
  'teamMembers/update',
  async ({ id, data }: { id: string; data: TeamMemberDTO }, { rejectWithValue }) => {
    try {
      const response = await HttpRequest.put<TeamMember>(`${BASE_URL}/api/team-members/${id}`, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete team member
export const deleteTeamMember = createAsyncThunk(
  'teamMembers/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await HttpRequest.delete(`${BASE_URL}/api/team-members/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const teamMemberSlice = createSlice({
  name: 'teamMembers',
  initialState,
  reducers: {
    clearTeamMemberError: (state) => {
      state.error = null;
    },
    clearCurrentTeamMember: (state) => {
      state.currentTeamMember = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all team members
      .addCase(getAllTeamMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamMembers = action.payload;
      })
      .addCase(getAllTeamMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get team member by ID
      .addCase(getTeamMemberById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTeamMemberById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTeamMember = action.payload;
      })
      .addCase(getTeamMemberById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create team member
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.teamMembers.push(action.payload);
        state.currentTeamMember = action.payload;
      })
      // Update team member
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        const index = state.teamMembers.findIndex(
          (member) => member.id === action.payload.id
        );
        if (index !== -1) {
          state.teamMembers[index] = action.payload;
        }
        state.currentTeamMember = action.payload;
      })
      // Delete team member
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.teamMembers = state.teamMembers.filter(
          (member) => member.id !== action.payload
        );
        if (state.currentTeamMember?.id === action.payload) {
          state.currentTeamMember = null;
        }
      });
  },
});

export const { clearTeamMemberError, clearCurrentTeamMember } = teamMemberSlice.actions;

// Selectors
export const selectAllTeamMembers = (state: RootState) => state.teamMembers.teamMembers;
export const selectCurrentTeamMember = (state: RootState) => state.teamMembers.currentTeamMember;
export const selectTeamMemberLoading = (state: RootState) => state.teamMembers.isLoading;
export const selectTeamMemberError = (state: RootState) => state.teamMembers.error;

export default teamMemberSlice.reducer;