import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { issueService } from '../../services';
import { IssueState, Issue, Priority } from '../../types';
import { getStoredState, setStoredState, STORAGE_KEYS } from '../../utils/localStorage';

interface CreateIssueData {
  title: string;
  description: string;
  projectId: string;
  taskId?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

interface UpdateIssueData {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  severity?: 'minor' | 'major' | 'critical';
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  projectId?: string;
}

interface IssueQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: Priority;
  projectId?: string;
  taskId?: string;
  assigneeId?: string;
  reporterId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface IssueApiResponse {
  data: Issue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const initialState: IssueState = {
  issues: getStoredState(STORAGE_KEYS.ISSUES) || [],
  currentIssue: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

export const fetchIssues = createAsyncThunk<{ data: Issue[]; totalCount: number }, IssueQueryParams>(
  'issues/fetchIssues',
  async (params: IssueQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await issueService.getAllIssues() as IssueApiResponse;
      
      if (response?.data && Array.isArray(response.data)) {
        return {
          data: response.data,
          totalCount: response.total || 0
        };
      }
      
      return {
        data: [],
        totalCount: 0
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch issues';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchIssueById = createAsyncThunk<Issue, string>(
  'issues/fetchIssueById',
  async (id: string, { rejectWithValue }) => {
    try {
      const issue = await issueService.getIssueById(id);
      return issue;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch issue';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createIssue = createAsyncThunk<Issue, CreateIssueData>(
  'issues/createIssue',
  async (data: CreateIssueData, { rejectWithValue }) => {
    try {
      const issue = await issueService.createIssue(data);
      return issue;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create issue';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateIssue = createAsyncThunk<Issue, { id: string; data: UpdateIssueData }>(
  'issues/updateIssue',
  async ({ id, data }: { id: string; data: UpdateIssueData }, { rejectWithValue }) => {
    try {
      const issue = await issueService.updateIssue({ ...data, id });
      return issue;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update issue';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteIssue = createAsyncThunk<string, string>(
  'issues/deleteIssue',
  async (id: string, { rejectWithValue }) => {
    try {
      await issueService.deleteIssue(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete issue';
      return rejectWithValue(errorMessage);
    }
  }
);

const issueSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    clearIssueError: (state) => {
      state.error = null;
    },
    clearCurrentIssue: (state) => {
      state.currentIssue = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Issues
    builder.addCase(fetchIssues.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchIssues.fulfilled, (state, action: PayloadAction<{ data: Issue[]; totalCount: number }>) => {
      state.isLoading = false;
      state.issues = action.payload.data;
      state.totalCount = action.payload.totalCount;
      setStoredState(STORAGE_KEYS.ISSUES, action.payload.data);
    });
    builder.addCase(fetchIssues.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Issue By Id
    builder.addCase(fetchIssueById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchIssueById.fulfilled, (state, action: PayloadAction<Issue>) => {
      state.isLoading = false;
      state.currentIssue = action.payload;
    });
    builder.addCase(fetchIssueById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Issue
    builder.addCase(createIssue.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createIssue.fulfilled, (state, action: PayloadAction<Issue>) => {
      state.isLoading = false;
      const existingIssue = state.issues.find(i => i.id === action.payload.id);
      if (!existingIssue) {
        state.issues.push(action.payload);
        state.totalCount += 1;
        setStoredState(STORAGE_KEYS.ISSUES, state.issues);
      }
    });
    builder.addCase(createIssue.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Issue
    builder.addCase(updateIssue.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateIssue.fulfilled, (state, action: PayloadAction<Issue>) => {
      state.isLoading = false;
      state.issues = state.issues.map((issue) =>
        issue.id === action.payload.id ? action.payload : issue
      );
      if (state.currentIssue?.id === action.payload.id) {
        state.currentIssue = action.payload;
      }
    });
    builder.addCase(updateIssue.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Issue
    builder.addCase(deleteIssue.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteIssue.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.issues = state.issues.filter((issue) => issue.id !== action.payload);
      state.totalCount -= 1;
      if (state.currentIssue?.id === action.payload) {
        state.currentIssue = null;
      }
    });
    builder.addCase(deleteIssue.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearIssueError, clearCurrentIssue } = issueSlice.actions;
export default issueSlice.reducer;