Product Requirements Document (PRD)

Project Name: Todo App Platform: Android (React Native) Backend: Firebase (Authentication + Realtime Database / Firestore) Author: Faizan

---

1. Overview The Todo App is a mobile application for Android that allows users to manage their daily tasks efficiently. Users can create, edit, complete, and delete tasks. The app uses React Native for Android and Firebase for backend services including Google Authentication and task storage.

---

2. Objectives

- Provide a simple, intuitive interface for task management.
- Enable secure login using Google Authentication.
- Ensure one-time login: once logged in, the app remembers the user and opens directly to the task list on subsequent launches.
- Store tasks in Firebase database with real-time sync.
- Maintain compatibility Android.
- Implement a modular, maintainable code structure.

---

3. Features

3.1 Authentication

- User Registration: Users can create an account using email and password (optional in addition to Google login).
- Google Login: Users can sign in with their Google account.
- Email/Password Login: Users can log in using their registered email and password.
- One-time login: Users remain logged in until they explicitly log out.
- Change Password: Users can change their password from account settings (email/password authentication).
- Forgot Password: Users can reset their password through the "Forgot Password" option on the login screen (email/password authentication).
- Logout: Users can securely log out.

3.2 Task Management

- Add Task: Users can add new tasks with the following fields:
  - **Task Title**: Required title of the task.
  - **Notes**: Optional description or additional details.
  - **Tags**: Two tag options to categorize tasks — **Urgent** or **Normal**.
  - **Remind Me**: User can select a reminder date.
- Edit Task: Users can modify all task fields including title, notes, tag, and reminder date.
- Delete Task: Users can remove tasks permanently.
- Mark Complete / Incomplete: Toggle task completion status.
- Task List: Display all tasks in a clean list format.

3.3 Data Management

- Firebase Realtime Database / Firestore: Store tasks per user.
- Real-time Sync: Changes update instantly across devices.

3.4 UI/UX Features

- Clean, minimalist design.
- Responsive layouts for all screen sizes.
- Use icons and images from src/assets.
- Support for light and dark themes.

---

4. Technical Requirements

4.1 Frontend

- Framework: React Native
- Navigation: React Navigation
- State Management: Redux / Redux Toolkit
- Styling: Global styles in src/styles, theme constants in src/constants

4.2 Backend

- Authentication: Firebase Authentication (Google Sign-in)
- Database: Firebase Realtime Database or Firestore
- Storage: Firebase Storage for any media (optional)

4.3 Folder & File Structure

src/
├─ assets/          # Images, icons
│   ├─ logo.png
│   └─ icons/
├─ components/      # Reusable components
│   ├─ Button/Button.tsx
│   ├─ Input/Input.tsx
│   └─ TaskCard/TaskCard.tsx
├─ pages/           # Screens/pages
│   ├─ Login/Login.tsx
│   ├─ Home/Home.tsx
│   └─ TaskDetails/TaskDetails.tsx
├─ hooks/           # Custom hooks
│   └─ useTasks.ts
├─ store/           # Redux store config and slices
│   ├─ index.ts
│   └─ taskSlice.ts
├─ constants/       # Constants like colors, fonts
│   └─ theme.ts
├─ styles/          # Global styles
│   └─ globalStyles.ts
└─ App.tsx          # App entry point

---

5. User Flow

1. User opens the app → sees startup page for 2 seconds, which then routes based on login status.
2. If user is already logged in → open Home Page directly with the task list. If the app is reinstalled or the user has signed out, login will be required again.
3. If user is not logged in → Login Page appears for Google Authentication with the option for Forgot Password (if using email authentication).
4. After login → Home Page with a list of tasks.
5. User can Add / Edit / Delete / Complete tasks.
6. All changes sync with Firebase in real-time.
7. User can Logout anytime.

---

6. Key Features (Highlight)

- Android React Native App
- Google Authentication with Firebase
- One-time login feature (persistent session; login required only if app is reinstalled or user signs out)
- Real-time task management
- Redux state management for predictable UI updates
- Reusable component architecture for maintainability
- Global styling and constants for consistent design

---

7. Challenges & Considerations

- Authentication edge cases: Handling failed login attempts, offline login attempts.
- Offline data management: Syncing tasks when the device goes offline.
- Real-time updates: Ensuring real-time updates are efficient and do not overload Firebase reads/writes.
- UI consistency: Across multiple screen sizes and platforms.
- Security: Securely storing user information and Firebase credentials.

---

8. Additional Features (Future Scope)

- Push Notifications: Notify users of tasks at their specified reminder date and time.
- Task Categorization: Organize tasks into categories such as Work, Personal, or Custom Tags.
- Task Deadlines & Reminders: Allow users to set deadlines and receive timely reminders for tasks.
- Dark/Light Theme Toggle: Enable users to switch between dark mode and light mode for better usability.
- Export Tasks: Provide options to export tasks in PDF or CSV format for offline access or sharing.

---

9. Dependencies

- react-native
- react-navigation
- @react-native-firebase/app
- @react-native-firebase/auth
- @react-native-firebase/firestore
- redux / @reduxjs/toolkit
- react-redux

