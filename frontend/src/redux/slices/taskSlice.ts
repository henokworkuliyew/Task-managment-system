import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '../../services';
import { TaskState, Task, Priority, TaskStatus } from '../../types';
import { getStoredState, setStoredState, STORAGE_KEYS } from '../../utils/localStorage';

export interface CreateTaskData {
  title: string;
  description: string;
  projectId: string;
  assignedTo?: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  projectId?: string;
  assignedTo?: string;
  deadline?: string;
  priority?: Priority;
  status?: TaskStatus;
  id?: string;
}

interface TaskQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: Priority;
  projectId?: string;
  assigneeId?: string;
  parentTaskId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

const initialState: TaskState = {
  tasks: getStoredState(STORAGE_KEYS.TASKS) || [],
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id: string, { rejectWithValue }) => {
    try {
      const task = await taskService.getTaskById(id);
      return task;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: CreateTaskData, { rejectWithValue }) => {
    try {
      const task = await taskService.createTask({
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assignedTo: data.assignedTo,
        deadline: data.deadline,
        priority: data.priority as 'low' | 'medium' | 'high',
        status: data.status as 'todo' | 'in_progress' | 'review' | 'done'
      });
      return task;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const updatePayload = {
        id,
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        assignedTo: data.assignedTo,
        deadline: data.deadline,
        priority: data.priority as 'low' | 'medium' | 'high' | undefined,
        status: data.status as 'todo' | 'in_progress' | 'review' | 'done' | undefined
      };
      const task = await taskService.updateTask(updatePayload);
      return task;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasksByProject(projectId);
      return tasks;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks for project';
      return rejectWithValue(errorMessage);
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
      // Only update if we actually received data
      if (action.payload.data && Array.isArray(action.payload.data)) {
        state.tasks = action.payload.data;
        state.totalCount = action.payload.totalCount;
        // Persist to localStorage
        setStoredState(STORAGE_KEYS.TASKS, action.payload.data);
      }
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
      // Ensure state.tasks is an array before adding new task
      if (Array.isArray(state.tasks)) {
        // Check if task already exists to avoid duplicates
        const existingTask = state.tasks.find(t => t.id === action.payload.id);
        if (!existingTask) {
          state.tasks.push(action.payload);
          state.totalCount += 1;
          // Persist to localStorage
          setStoredState(STORAGE_KEYS.TASKS, state.tasks);
        }
      } else {
        state.tasks = [action.payload];
        state.totalCount = 1;
        // Persist to localStorage
        setStoredState(STORAGE_KEYS.TASKS, state.tasks);
      }
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