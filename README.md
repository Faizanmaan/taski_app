# TaskiApp - React Native Todo Application

A feature-rich todo application built with React Native, Firebase, and Redux Toolkit.

## Features

- ✅ Google Authentication & Email/Password Login
- ✅ Real-time task synchronization with Firebase Firestore
- ✅ Create, edit, delete, and complete tasks
- ✅ Task categorization (Urgent/Normal tags)
- ✅ Task reminders
- ✅ Redux state management
- ✅ Clean, modular architecture
- ✅ TypeScript support

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (>= 18)
- npm or yarn
- React Native development environment setup
  - For Android: Android Studio, Android SDK
  - For iOS: Xcode (macOS only)
- Firebase account

## Project Structure

```
src/
├── assets/          # Images, icons
├── components/      # Reusable components
│   ├── Button/
│   ├── Input/
│   └── TaskCard/
├── pages/           # Screens/pages
│   ├── Login/
│   ├── Home/
│   └── TaskDetails/
├── hooks/           # Custom hooks
├── store/           # Redux store and slices
├── constants/       # Theme constants
├── styles/          # Global styles
├── config/          # Configuration files
└── navigation/      # Navigation setup
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-in
4. Create a Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. For Android:
   - Download `google-services.json`
   - Place it in `android/app/`
6. For iOS:
   - Download `GoogleService-Info.plist`
   - Add it to your Xcode project

### 3. Update Firebase Configuration

Edit `src/config/firebase.ts` and replace the placeholder values with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### 4. Firestore Security Rules

Set up the following security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Run the App

#### Android

```bash
npm run android
```

#### iOS (macOS only)

```bash
cd ios && pod install && cd ..
npm run ios
```

## Optional Enhancements

### Google Sign-In Setup

To enable Google Sign-In, you need to install additional packages:

```bash
npm install @react-native-google-signin/google-signin
```

Follow the setup instructions at: https://github.com/react-native-google-signin/google-signin

### Date Picker for Reminders

To enable the date picker for task reminders:

```bash
npm install @react-native-community/datetimepicker
```

Then update the `handleDatePicker` function in `src/pages/TaskDetails/TaskDetails.tsx`.

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Tech Stack

- **Framework**: React Native
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Backend**: Firebase (Authentication + Firestore)
- **Styling**: React Native StyleSheet

## Features Roadmap

- [ ] Push notifications for task reminders
- [ ] Dark/Light theme toggle
- [ ] Task categories and filters
- [ ] Task search functionality
- [ ] Export tasks to PDF/CSV
- [ ] Offline support with local storage

## Troubleshooting

### Android Build Issues

If you encounter build issues on Android:

1. Clean the build:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```
2. Clear Metro cache:
   ```bash
   npm start -- --reset-cache
   ```

### iOS Build Issues

If you encounter build issues on iOS:

1. Clean the build folder in Xcode
2. Reinstall pods:
   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

## License

MIT

## Author

Faizan
