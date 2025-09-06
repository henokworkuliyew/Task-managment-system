import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { projectService } from '../../services';
import { ProjectState, Project } from '../../types';

interface CreateProjectData {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  isActive?: boolean;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  totalCount: 0,
};

export const fetchProjects = createAsyncThunk<{ data: Project[]; totalCount: number }, PaginationParams>(
  'projects/fetchProjects',
  async (params: PaginationParams = {}, { rejectWithValue }) => {
    try {
      const projects = await projectService.getAllProjects();
      return {
        data: projects,
        totalCount: projects.length
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const project = await projectService.getProjectById(id);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data: CreateProjectData, { rejectWithValue }) => {
    try {
      const project = await projectService.createProject(data as any);
      return project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }: { id: string; data: UpdateProjectData }, { rejectWithValue }) => {
    try {
      const project = await projectService.updateProject({ id, ...data as any });
      return project;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

export const addProjectMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId, role = 'member' }: { projectId: string; userId: string; role?: string }, { rejectWithValue }) => {
    try {
      await projectService.addUserToProject(projectId, userId, role);
      return { projectId, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add member');
    }
  }
);

export const removeProjectMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }: { projectId: string; userId: string }, { rejectWithValue }) => {
    try {
      await projectService.removeUserFromProject(projectId, userId);
      return { projectId, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action: PayloadAction<{ data: Project[]; totalCount: number }>) => {
      state.isLoading = false;
      state.projects = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Project By Id
    builder.addCase(fetchProjectById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.currentProject = action.payload;
    });
    builder.addCase(fetchProjectById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Project
    builder.addCase(createProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.projects = [...state.projects, action.payload];
      state.totalCount += 1;
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Project
    builder.addCase(updateProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
      state.isLoading = false;
      state.projects = state.projects.map((project) =>
        project.id === action.payload.id ? action.payload : project
      );
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload;
      }
    });
    builder.addCase(updateProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Project
    builder.addCase(deleteProject.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.projects = state.projects.filter((project) => project.id !== action.payload);
      state.totalCount -= 1;
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
    });
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProjectError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;