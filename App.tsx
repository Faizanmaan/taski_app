import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import NotificationService from './src/services/NotificationService';

const App: React.FC = () => {
    useEffect(() => {
        NotificationService.requestPermissions();
    }, []);

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <AppNavigator />
            </SafeAreaProvider>
        </Provider>
    );
};

export default App;
