import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { issueService } from '../../services';
import { IssueState, Issue, Priority } from '../../types';

interface CreateIssueData {
  title: string;
  description?: string;
  priority?: Priority;
  projectId: string;
  taskId?: string;
  reporterId?: string;
  assigneeId?: string;
}

interface UpdateIssueData {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: string;
  assigneeId?: string;
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

const initialState: IssueState = {
  issues: [],
  currentIssue: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

export const fetchIssues = createAsyncThunk<{ data: Issue[]; totalCount: number }, IssueQueryParams>(
  'issues/fetchIssues',
  async (params: IssueQueryParams = {}, { rejectWithValue }) => {
    try {
      const issues = await issueService.getAllIssues();
      return {
        data: issues,
        totalCount: issues.length
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues');
    }
  }
);

export const fetchIssueById = createAsyncThunk(
  'issues/fetchIssueById',
  async (id: string, { rejectWithValue }) => {
    try {
      const issue = await issueService.getIssueById(id);
      return issue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue');
    }
  }
);

export const createIssue = createAsyncThunk(
  'issues/createIssue',
  async (data: CreateIssueData, { rejectWithValue }) => {
    try {
      const issue = await issueService.createIssue(data as any);
      return issue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create issue');
    }
  }
);

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ id, data }: { id: string; data: UpdateIssueData }, { rejectWithValue }) => {
    try {
      const issue = await issueService.updateIssue({ id, ...data as any });
      return issue;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue');
    }
  }
);

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (id: string, { rejectWithValue }) => {
    try {
      await issueService.deleteIssue(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete issue');
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
      state.issues = [...state.issues, action.payload];
      state.totalCount += 1;
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