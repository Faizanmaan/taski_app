import { Task } from '../store/taskSlice';

export type RootStackParamList = {
  Welcome: undefined;
  Login: {
    isSignUp?: boolean;
  };
  Home: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  TaskDetails: {
    mode?: 'create' | 'edit' | 'view';
    taskId?: string;
    task?: Task;
    date?: string;
  };
};
