import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../../components/Button/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { globalStyles } from '../../styles/globalStyles';
import type { RootStackParamList } from '../../navigation/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Welcome'
>;

const Welcome: React.FC = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    const handleLogin = () => {
        navigation.navigate('Login', { isSignUp: false });
    };

    const handleRegister = () => {
        navigation.navigate('Login', { isSignUp: true });
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../assets/welcome_illustration.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Start with taski</Text>
                    <Text style={styles.subtitle}>
                        Join us now and get your daily things right
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Login"
                        onPress={handleLogin}
                        style={styles.loginButton}
                    />
                    <Button
                        title="Register"
                        onPress={handleRegister}
                        variant="outline"
                        style={styles.registerButton}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: SPACING.lg,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    logo: {
        width: 120,
        height: 40,
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SPACING.xl,
    },
    illustration: {
        width: 285,
        height: 211,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: TYPOGRAPHY.fontSize.xxl,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.light.text,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
    },
    buttonContainer: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    loginButton: {
        width: '100%',
    },
    registerButton: {
        width: '100%',
    },
});

export default Welcome;
