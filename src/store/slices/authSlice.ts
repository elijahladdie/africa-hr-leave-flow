import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import HttpRequest from '@/lib/HttpRequest';
import { toast } from 'sonner';
import { setData, setToken } from '@/lib/authUtils';
import { ResponseData, User } from '@/types';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

// User interface

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  newUser: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}



// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  newUser: true,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// LOGIN INTERNAL (email/password)
export const loginInternal = createAsyncThunk<
  ResponseData,
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginInternal', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.post<ResponseData>(
      `${BASE_URL}/api/auth/login?loginType=INTERNAL`,
      { email, password }
    );
    console.log("re")
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Login failed');
  }
});
export const loginExternal = () => window.location.href = `${BASE_URL}/api/auth/login?loginType=EXTERNAL`;


// MICROSOFT LOGIN SUCCESS
export const fetchMicrosoftLoginSuccess = createAsyncThunk<
  ResponseData, string, { rejectValue: string }
>('auth/microsoftLoginSuccess', async (token, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.get<ResponseData>(
      `${BASE_URL}/api/auth/login/success`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    toast.success(response.resp_msg)
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Microsoft login failed');
  }
});

// MICROSOFT LOGIN FAILURE (optional)
export const fetchMicrosoftLoginFailure = createAsyncThunk<
  ResponseData,
  void,
  { rejectValue: string }
>('auth/microsoftLoginFailure', async (_, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.get<ResponseData>(
      `${BASE_URL}/api/auth/login/failure`
    );
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Microsoft login failure');
  }
});

// GET MICROSOFT STAFF INFO
export const getMicrosoftUserInfo = createAsyncThunk<
  ResponseData,
  void,
  { rejectValue: string }
>('auth/getMicrosoftUserInfo', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await HttpRequest.get<
      ResponseData
    >(
      `${BASE_URL}/api/auth/user-info`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch user info');
  }
});

// LOGOUT
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await HttpRequest.get(`${BASE_URL}/api/auth/logout`);
  } catch (err: any) {
    return rejectWithValue(err.message || 'Logout failed');
  }
});

// REGISTER EXTERNAL STAFF
export const registerExternalUser = createAsyncThunk<
  ResponseData,
  { email: string; password: string; firstName: string; lastName: string; profilePictureUrl?: string },
  { rejectValue: string }
>('auth/registerExternalUser', async (data, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.post<ResponseData>(
      `${BASE_URL}/api/auth/register-external`,
      data
    );
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Registration failed');
  }
});

export const updateUserByMemId = createAsyncThunk<
  ResponseData,
  { memId: string; data: any },
  { rejectValue: string }
>('auth/updateUserByMemId', async ({ memId, data }, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.put<ResponseData>(
      `${BASE_URL}/api/auth/user/${memId}`,
      data
    );
    return response;
  } catch (err: any) {
    return rejectWithValue(err.response.data.resp_msg || 'Update failed');
  }
});


// GET STAFF BY AZURE ID
export const getUserByMemId = createAsyncThunk<
  ResponseData,
  string,
  { rejectValue: string }
>('auth/getUserByMemId', async (memId, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.get<ResponseData>(
      `${BASE_URL}/api/auth/user/${memId}`
    );
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Fetch user failed');
  }
});

// CREATE STAFF FROM MICROSOFT
export const createUserFromMicrosoft = createAsyncThunk<
  ResponseData,
  any,
  { rejectValue: string }
>('auth/createUserFromMicrosoft', async (data, { rejectWithValue }) => {
  try {
    const response = await HttpRequest.post<ResponseData>(
      `${BASE_URL}/api/auth/user/create`,
      data
    );
    return response;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Create user failed');
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // loginInternal
    builder
      .addCase(loginInternal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginInternal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        setToken(action.payload.data.token);
        setData(action.payload.data.user);
        state.token = action.payload.data.token;
        state.newUser = action.payload.data.newUser;
      })
      .addCase(loginInternal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // fetchMicrosoftLoginSuccess
    builder
      .addCase(fetchMicrosoftLoginSuccess.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMicrosoftLoginSuccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.newUser = action.payload.data.newUser;
      })
      .addCase(fetchMicrosoftLoginSuccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Microsoft login failed';
      });

    // getMicrosoftUserInfo
    builder
      .addCase(getMicrosoftUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMicrosoftUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        // you can merge additional info into user if needed
      })
      .addCase(getMicrosoftUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user info';
      });

    // logoutUser
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // registerExternalUser
    builder
      .addCase(registerExternalUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerExternalUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(registerExternalUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });

    // updateUserByMemId
    builder
      .addCase(updateUserByMemId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserByMemId.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserByMemId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Update failed';
      });

    // getUserByMemId
    builder
      .addCase(getUserByMemId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserByMemId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
      })
      .addCase(getUserByMemId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Fetch user failed';
      });

    // createUserFromMicrosoft
    builder
      .addCase(createUserFromMicrosoft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserFromMicrosoft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
      })
      .addCase(createUserFromMicrosoft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Create user failed';
      });
  },
});

// Actions
export const { clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
