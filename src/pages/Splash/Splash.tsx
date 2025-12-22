import React, { useEffect } from 'react';
import { View, Image, StyleSheet, useColorScheme } from 'react-native';
import { COLORS } from '../../constants/theme';

interface SplashProps {
    onFinish: () => void;
}

const Splash: React.FC<SplashProps> = ({ onFinish }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 1000);

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: '#FFFFFF',
                },
            ]}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default Splash;
