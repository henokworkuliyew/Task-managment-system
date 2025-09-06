import { configureAppStore } from './storeConfig';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import issueReducer from './slices/issueSlice';
import notificationReducer from './slices/notificationSlice';

// Configure the store with reducers
export const store = configureAppStore({
  auth: authReducer,
  projects: projectReducer,
  tasks: taskReducer,
  issues: issueReducer,
  notifications: notificationReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;