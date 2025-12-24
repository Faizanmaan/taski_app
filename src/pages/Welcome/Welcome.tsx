import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { firebaseAuth, firebaseFirestore, GoogleSignin } from '../../config/firebase';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { setUser } from '../../store/authSlice';
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
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        navigation.navigate('Login', { isSignUp: false });
    };

    const handleRegister = () => {
        navigation.navigate('Login', { isSignUp: true });
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();

            const idToken = response.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token found');
            }

            const credential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(firebaseAuth(), credential);
            const user = userCredential.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(firebaseFirestore(), 'users', user.uid));

            if (!userDoc.exists()) {
                // Create new user document
                await setDoc(doc(firebaseFirestore(), 'users', user.uid), {
                    fullName: user.displayName || 'Google User',
                    displayName: user.displayName || 'Google User',
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: Timestamp.fromDate(new Date()),
                });
            }

            dispatch(setUser(user));
        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
            let errorMessage = 'Google Sign-In failed.';
            if (error.code === '7' || error.code === '12501') {
                errorMessage = 'Sign-in cancelled.';
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
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
                        disabled={loading}
                    />
                    <Button
                        title="Register"
                        onPress={handleRegister}
                        variant="outline"
                        style={styles.registerButton}
                        disabled={loading}
                    />

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity
                        style={[styles.googleButton, loading && styles.disabledButton]}
                        onPress={handleGoogleLogin}
                        disabled={loading}
                    >
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.sm,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: COLORS.light.textSecondary,
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 4,
        paddingVertical: SPACING.md,
    },
    googleButtonText: {
        marginLeft: SPACING.sm,
        fontSize: TYPOGRAPHY.fontSize.md,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        color: COLORS.light.text,
    },
    disabledButton: {
        opacity: 0.6,
    },
});

export default Welcome;
