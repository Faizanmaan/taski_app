import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseAuth, firebaseFirestore } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { setUser, setLoading } from '../store/authSlice';
import type { RootState } from '../store';
import Splash from '../pages/Splash/Splash';
import Welcome from '../pages/Welcome/Welcome';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import TaskDetails from '../pages/TaskDetails/TaskDetails';
import Settings from '../pages/Settings/Settings';
import EditProfile from '../pages/EditProfile/EditProfile';
import ChangePassword from '../pages/ChangePassword/ChangePassword';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, isLoading, isRegistering } = useSelector(
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
        const unsubscribe = onAuthStateChanged(firebaseAuth(), async (user: any) => {
            if (user) {
                try {
                    const userDocRef = doc(firebaseFirestore(), 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const firestoreData = userDoc.data();
                        const plainUser = JSON.parse(JSON.stringify(user));
                        const mergedUser = {
                            ...plainUser,
                            photoURL: firestoreData.photoURL || plainUser.photoURL,
                            displayName: firestoreData.displayName || plainUser.displayName,
                        };
                        dispatch(setUser(mergedUser));
                    } else {
                        dispatch(setUser(user));
                    }
                } catch (error) {
                    console.error('Error loading profile from Firestore:', error);
                    dispatch(setUser(user));
                }
            } else {
                dispatch(setUser(null));
            }
            dispatch(setLoading(false));
        });

        return unsubscribe;
    }, [dispatch]);
    const handleSplashFinish = () => {
        setShowSplash(false);
    };

    if (showSplash || isLoading) {
        return <Splash onFinish={handleSplashFinish} />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}>
                {!isAuthenticated || isRegistering ? (
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
                        <Stack.Screen name="ChangePassword" component={ChangePassword} />
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
