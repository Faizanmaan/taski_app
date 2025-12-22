import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser', 'tasks/setTasks', 'tasks/addTask', 'tasks/updateTask'],
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt', 'payload.remindAt'],
        ignoredPaths: ['tasks.tasks', 'auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
