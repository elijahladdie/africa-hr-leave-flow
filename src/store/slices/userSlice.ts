import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserRoleUpdateDTO } from '@/types/admin';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData, User } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface UserState {
    user: User;
    users: User[];
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    users: [],
    isLoading: false,
    error: null,
};

export const getUserProfile = createAsyncThunk(
    'users/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/users/profile`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'users/updateProfile',
    async (data: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.put<User>(`${BASE_URL}/api/users/profile`, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deactivateUser = createAsyncThunk(
    'users/deactivate',
    async (userId: string, { rejectWithValue }) => {
        try {
            await HttpRequest.delete(`${BASE_URL}/api/users/${userId}`);
            return userId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    'users/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/users`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'users/updateRole',
    async (data: UserRoleUpdateDTO, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.put<User>(
                `${BASE_URL}/api/auth/user/${data.userId}`,
                { role: data.role }
            );
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUserFromEncodedData: (state, action) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(deactivateUser.fulfilled, (state, action) => {
                state.user = state.user?.id === action.payload ? null : state.user;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            });
    },
});
export const { setUserFromEncodedData } = userSlice.actions
export default userSlice.reducer;