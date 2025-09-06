import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '../../services';
import { TaskState, Task, TaskStatus, Priority } from '../../types';

interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  assigneeId?: string;
  projectId: string;
  parentTaskId?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  progress?: number;
  dueDate?: string;
  startDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  assigneeId?: string;
}

interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: Priority;
  projectId?: string;
  assigneeId?: string;
  parentTaskId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

// Async thunks
export const fetchTasks = createAsyncThunk<{ data: Task[]; totalCount: number }, TaskQueryParams>(
  'tasks/fetchTasks',
  async (params: TaskQueryParams = {}, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getAllTasks();
      return {
        data: tasks,
        totalCount: tasks.length
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      const task = await taskService.getTaskById(id);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: CreateTaskData, { rejectWithValue }) => {
    try {
      const task = await taskService.createTask(data as any);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const task = await taskService.updateTask({ id, ...data as any });
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks for project');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action: PayloadAction<{ data: Task[]; totalCount: number }>) => {
      state.isLoading = false;
      state.tasks = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Task By Id
    builder.addCase(fetchTaskById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      state.currentTask = action.payload;
    });
    builder.addCase(fetchTaskById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch Tasks By Project
    builder.addCase(fetchTasksByProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTasksByProject.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasksByProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create, Update, Delete Task cases follow the same pattern
    builder.addCase(createTask.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      state.tasks = [...state.tasks, action.payload];
      state.totalCount += 1;
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateTask.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      state.tasks = state.tasks.map((task) => task.id === action.payload.id ? action.payload : task);
      if (state.currentTask?.id === action.payload.id) state.currentTask = action.payload;
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteTask.pending, (state) => { state.isLoading = true; state.error = null; });
    builder.addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.totalCount -= 1;
      if (state.currentTask?.id === action.payload) state.currentTask = null;
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearTaskError, clearCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;