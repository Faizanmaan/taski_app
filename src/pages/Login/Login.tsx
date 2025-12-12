import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { firebaseAuth, firebaseFirestore } from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { setUser, setLoading, setError } from '../../store/authSlice';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';
import { globalStyles } from '../../styles/globalStyles';
import type { RootStackParamList } from '../../navigation/types';

type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute<LoginScreenRouteProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isSignUp, setIsSignUp] = useState(route.params?.isSignUp ?? false);
    const [loading, setLoadingState] = useState(false);

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        if (isSignUp && (!fullName || !phoneNumber)) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoadingState(true);
        dispatch(setLoading(true));

        try {
            let userCredential;
            if (isSignUp) {
                // Create user
                userCredential = await createUserWithEmailAndPassword(
                    firebaseAuth(),
                    email,
                    password,
                );

                // Save user data to Firestore
                try {
                    console.log('Saving user data to Firestore...', userCredential.user.uid);
                    await setDoc(doc(firebaseFirestore(), 'users', userCredential.user.uid), {
                        fullName,
                        phoneNumber,
                        email,
                        createdAt: Timestamp.fromDate(new Date()),
                    });
                    console.log('User data saved successfully!');

                    // Verify data was saved
                    console.log('Verifying data save...');
                    const docSnap = await getDoc(doc(firebaseFirestore(), 'users', userCredential.user.uid));
                    if (docSnap.exists()) {
                        console.log('Verification successful: Document found', docSnap.data());
                    } else {
                        console.error('Verification failed: Document not found!');
                        throw new Error('Data verification failed: Document not found after save.');
                    }
                } catch (firestoreError: any) {
                    console.error('Error saving user data to Firestore:', firestoreError);
                    Alert.alert('Warning', 'Account created but profile data could not be saved: ' + firestoreError.message);
                }

                // Sign out immediately to prevent auto-login
                await signOut(firebaseAuth());

                Alert.alert(
                    'Success',
                    'Account created successfully! Please login with your credentials.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setIsSignUp(false);
                                setPassword('');
                                // Optional: clear other fields if desired
                            },
                        },
                    ],
                );
                return; // Exit function, don't dispatch setUser
            } else {
                userCredential = await signInWithEmailAndPassword(
                    firebaseAuth(),
                    email,
                    password,
                );
            }
            dispatch(setUser(userCredential.user));
        } catch (error: any) {
            console.error('Auth error:', error);
            dispatch(setError(error.message));
            Alert.alert('Error', error.message);
        } finally {
            setLoadingState(false);
            dispatch(setLoading(false));
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled">

                    {/* Header with Back Button */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{isSignUp ? 'Register' : 'Login'}</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.title}>
                            {isSignUp ? 'Create Account' : 'Welcome Back.'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {isSignUp
                                ? 'Sign up to get started with Taski'
                                : 'It’s Nice too see you again, let’s get going'}
                        </Text>

                        <View style={styles.form}>
                            {isSignUp && (
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                    autoComplete="name"
                                />
                            )}

                            <Input
                                label="Email Address"
                                placeholder="yourname@email.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />

                            {isSignUp && (
                                <Input
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9+]/g, ''))}
                                    keyboardType="phone-pad"
                                    autoComplete="tel"
                                />
                            )}

                            <Input
                                label="Password"
                                placeholder="Input password here..."
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />

                            <Button
                                title={isSignUp ? 'Register' : 'Login'}
                                onPress={handleEmailAuth}
                                loading={loading}
                                style={styles.authButton}
                            />

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    {isSignUp ? 'Already have Account? ' : 'Don’t have an account? '}
                                </Text>
                                <TouchableOpacity onPress={toggleMode}>
                                    <Text style={styles.footerLink}>
                                        {isSignUp ? 'Login' : 'Register'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    backButton: {
        padding: SPACING.sm,
    },
    backButtonText: {
        fontSize: 24,
        color: COLORS.light.text,
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.light.text,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
        paddingTop: SPACING.xl,
    },
    title: {
        fontSize: 32, // Larger title as per image
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.light.text,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.xxl,
        lineHeight: 24,
    },
    form: {
        marginTop: SPACING.md,
    },
    authButton: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.light.primary, // Green
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.light.textSecondary,
    },
    footerLink: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.light.primary, // Green
    },
});

export default Login;
