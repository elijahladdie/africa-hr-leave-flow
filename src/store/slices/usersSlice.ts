import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { User } from '@/types';

// Define pagination interface
interface PaginationParams {
  page: number;
  limit: number;
}

// Define users state interface
export interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

// Define initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
};

// Define response type for users fetch
interface UserResponse {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

// Define user update interface
interface UserUpdateData {
  userId: string;
  userData: Partial<Omit<User, 'id'>>;
}

// Async thunks for API operations
export const fetchUsers = createAsyncThunk<
  UserResponse,
  PaginationParams,
  { rejectValue: string }
>('users/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch(
      `/api/users?page=${params.page}&limit=${params.limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to fetch users');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

export const fetchUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>('users/fetchUserById', async (userId, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch(`/api/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to fetch user');
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

export const updateUser = createAsyncThunk<
  User,
  UserUpdateData,
  { rejectValue: string }
>('users/updateUser', async ({ userId, userData }, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to update user');
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

// Create users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users cases
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      });
    
    // Fetch user by ID cases
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user';
      });
    
    // Update user cases
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update user in the users array
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        // Update selected user if it's the same as updated user
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update user';
      });
  },
});

// Export actions
export const { clearSelectedUser, clearUsersError } = usersSlice.actions;

// Export selectors
export const selectUsers = (state: RootState) => state.users?.users ?? [];
export const selectSelectedUser = (state: RootState) => state.users?.selectedUser ?? null;
export const selectUsersLoading = (state: RootState) => state.users?.isLoading ?? false;
export const selectUsersError = (state: RootState) => state.users?.error ?? null;
export const selectUsersPagination = (state: RootState) => ({
  totalUsers: state.users?.totalUsers ?? 0,
  currentPage: state.users?.currentPage ?? 1,
  totalPages: state.users?.totalPages ?? 1,
});

// Export reducer
export default usersSlice.reducer;