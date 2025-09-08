import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { projectService } from '../../services';
import { ProjectState, Project } from '../../types';
import { getStoredState, setStoredState, STORAGE_KEYS } from '../../utils/localStorage';

interface CreateProjectData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
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
  projects: getStoredState(STORAGE_KEYS.PROJECTS) || [],
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
      console.log('Fetched projects from API:', projects);
      return {
        data: Array.isArray(projects) ? projects : [],
        totalCount: Array.isArray(projects) ? projects.length : 0
      };
    } catch (error: unknown) {
      console.error('Error fetching projects:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch projects';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const project = await projectService.getProjectById(id);
      return project;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data: CreateProjectData, { rejectWithValue }) => {
    try {
      const project = await projectService.createProject(data);
      return project;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }: { id: string; data: UpdateProjectData }, { rejectWithValue }) => {
    try {
      const project = await projectService.updateProject({ id, ...data });
      return project;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addProjectMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId, role = 'member' }: { projectId: string; userId: string; role?: string }, { rejectWithValue }) => {
    try {
      await projectService.addUserToProject(projectId, userId, role);
      return { projectId, userId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeProjectMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }: { projectId: string; userId: string }, { rejectWithValue }) => {
    try {
      await projectService.removeUserFromProject(projectId, userId);
      return { projectId, userId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      return rejectWithValue(errorMessage);
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
      console.log('Projects fetch fulfilled with payload:', action.payload);
      // Always update state with the fetched data
      state.projects = Array.isArray(action.payload.data) ? action.payload.data : [];
      state.totalCount = action.payload.totalCount || 0;
      // Persist to localStorage
      setStoredState(STORAGE_KEYS.PROJECTS, state.projects);
      console.log('Updated projects state:', state.projects);
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
      if (Array.isArray(state.projects)) {
        // Check if project already exists to avoid duplicates
        const existingProject = state.projects.find(p => p.id === action.payload.id);
        if (!existingProject) {
          state.projects.push(action.payload);
          state.totalCount += 1;
          // Persist to localStorage
          setStoredState(STORAGE_KEYS.PROJECTS, state.projects);
        }
      } else {
        state.projects = [action.payload];
        state.totalCount = 1;
        // Persist to localStorage
        setStoredState(STORAGE_KEYS.PROJECTS, state.projects);
      }
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