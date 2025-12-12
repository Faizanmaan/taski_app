import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseAuth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, setLoading } from '../store/authSlice';
import type { RootState } from '../store';

// Import screens
import Splash from '../pages/Splash/Splash';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import TaskDetails from '../pages/TaskDetails/TaskDetails';
import Settings from '../pages/Settings/Settings';
import EditProfile from '../pages/EditProfile/EditProfile';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading } = useSelector(
        (state: RootState) => state.auth,
    );
    const [showSplash, setShowSplash] = useState(true);
    const wasAuthenticated = React.useRef(false);

    useEffect(() => {
        if (isAuthenticated) {
            wasAuthenticated.current = true;
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(firebaseAuth(), (user: any) => {
            dispatch(setUser(user));
            dispatch(setLoading(false));
        });

        return unsubscribe;
    }, [dispatch]);
    const handleSplashFinish = () => {
        setShowSplash(false);
    };

    // Show splash screen for 1 second on app launch
    if (showSplash) {
        return <Splash onFinish={handleSplashFinish} />;
    }

    // Show loading state after splash
    if (isLoading) {
        return null;
    }
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                {!isAuthenticated ? (
                    <Stack.Group screenOptions={{ headerShown: false }}>
                        {wasAuthenticated.current ? (
                            <>
                                <Stack.Screen name="Welcome" component={Welcome} />
                                <Stack.Screen name="Login" component={Login} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Welcome" component={Welcome} />
                                <Stack.Screen name="Login" component={Login} />
                            </>
                        )}
                    </Stack.Group>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={Home} />
                        <Stack.Screen name="Settings" component={Settings} />
                        <Stack.Screen name="EditProfile" component={EditProfile} />
                        <Stack.Screen
                            name="TaskDetails"
                            component={TaskDetails}
                            options={{
                                presentation: 'modal',
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
