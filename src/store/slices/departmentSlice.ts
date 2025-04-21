import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Department, DepartmentDTO } from '@/types/admin';
import HttpRequest from '@/lib/HttpRequest';
import { ResponseData } from '@/types';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL_LOCAL;

interface DepartmentState {
    departments: Department[];
    currentDepartment: Department | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: DepartmentState = {
    departments: [],
    currentDepartment: null,
    isLoading: false,
    error: null,
};

export const getAllDepartments = createAsyncThunk<ResponseData>(

    'departments/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/departments`);
            if (response.resp_code !== 200) {
                toast.error(response.resp_msg || "couln't get departments right now");
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const getDepartmentById = createAsyncThunk(
    'departments/getById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.get<ResponseData>(`${BASE_URL}/api/departments/${id}`);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createDepartment = createAsyncThunk(
    'departments/create',
    async (data: DepartmentDTO, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.post<ResponseData>(`${BASE_URL}/api/departments`, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'departments/update',
    async ({ id, data }: { id: string; data: DepartmentDTO }, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.put<ResponseData>(`${BASE_URL}/api/departments/${id}`, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'departments/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await HttpRequest.delete<ResponseData>(`${BASE_URL}/api/departments/${id}`);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const departmentSlice = createSlice({
    name: 'departments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllDepartments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllDepartments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.departments = action.payload.data;
            })
            .addCase(getAllDepartments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
        // Add other cases for remaining actions
        // ...
    },
});

export default departmentSlice.reducer;