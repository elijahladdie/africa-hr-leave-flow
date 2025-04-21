import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define task status and priority types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Define task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

// Define tasks state interface
export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
  };
}

// Define initial state
const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  filters: {},
};

// Define task creation interface
export interface CreateTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
}

// Define task update interface
export interface UpdateTaskData {
  taskId: string;
  taskData: Partial<Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>>;
}

// Define task filters interface
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}

// Async thunks for API operations
export const fetchTasks = createAsyncThunk<
  Task[],
  TaskFilters | undefined,
  { rejectValue: string }
>('tasks/fetchTasks', async (filters, { rejectWithValue }) => {
  try {
    // Construct query params
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.priority) queryParams.append('priority', filters.priority);
    if (filters?.assigneeId) queryParams.append('assigneeId', filters.assigneeId);
    
    // Replace with actual API call
    const response = await fetch(`/api/tasks?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to fetch tasks');
    }
    
    const data = await response.json();
    return data.tasks;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

export const fetchTaskById = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>('tasks/fetchTaskById', async (taskId, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch(`/api/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to fetch task');
    }
    
    const data = await response.json();
    return data.task;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

export const createTask = createAsyncThunk<
  Task,
  CreateTaskData,
  { rejectValue: string }
>('tasks/createTask', async (taskData, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to create task');
    }
    
    const data = await response.json();
    return data.task;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

export const updateTask = createAsyncThunk<
  Task,
  UpdateTaskData,
  { rejectValue: string }
>('tasks/updateTask', async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to update task');
    }
    
    const data = await response.json();
    return data.task;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('tasks/deleteTask', async (taskId, { rejectWithValue }) => {
  try {
    // Replace with actual API call
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue(errorData.message || 'Failed to delete task');
    }
    
    return taskId;
  } catch (error) {
    return rejectWithValue('Network error occurred');
  }
});

// Create tasks slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    clearTasksError: (state) => {
      state.error = null;
    },
    setTaskFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = action.payload;
    },
    clearTaskFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks cases
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });
    
    // Fetch task by ID cases
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch task';
      });
    
    // Create task cases
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create task';
      });
    
    // Update task cases
    builder
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update task in the tasks array
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        // Update selected task if it's the same as updated task
        if (state.selectedTask && state.selectedTask.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update task';
      });
    
    // Delete task cases
    builder
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove task from the tasks array
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        // Clear selected task if it's the same as deleted task
        if (state.selectedTask && state.selectedTask.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

// Export actions
export const {
  clearSelectedTask,
  clearTasksError,
  setTaskFilters,
  clearTaskFilters,
} = tasksSlice.actions;

// Export selectors
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectFilteredTasks = (state: RootState) => {
  const { tasks, filters } = state.tasks;
  
  return tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assigneeId && task.assigneeId !== filters.assigneeId) return false;
    return true;
  });
};
export const selectSelectedTask = (state: RootState) => state.tasks.selectedTask;
export const selectTasksLoading = (state: RootState) => state.tasks.isLoading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectTasksFilters = (state: RootState) => state.tasks.filters;

// Export reducer
export default tasksSlice.reducer; 