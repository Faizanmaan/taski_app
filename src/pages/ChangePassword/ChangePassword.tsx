import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { firebaseAuth } from '../../config/firebase';
import { FirebaseError } from 'firebase/app';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { globalStyles } from '../../styles/globalStyles';

const ChangePassword: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password should be at least 6 characters');
            return;
        }

        if (oldPassword === newPassword) {
            Alert.alert('Error', 'New password must be different from old password');
            return;
        }

        setIsLoading(true);
        try {
            const user = firebaseAuth().currentUser;
            if (!user || !user.email) {
                Alert.alert('Error', 'User not found');
                return;
            }

            // Re-authenticate user with old password
            const credential = EmailAuthProvider.credential(user.email, oldPassword);
            await reauthenticateWithCredential(user, credential);

            // Update to new password
            await updatePassword(user, newPassword);

            Alert.alert('Success', 'Password changed successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: unknown) {
            console.error('Change password error:', error);
            let errorMessage = 'Failed to change password. Please try again.';
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    errorMessage = 'Old password is incorrect';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'New password is too weak';
                } else if (error.code === 'auth/requires-recent-login') {
                    errorMessage = 'Please log out and log in again before changing password';
                }
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.light.textSecondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change Password</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.description}>
                        Enter your current password and choose a new password
                    </Text>

                    <View style={styles.form}>
                        <Input
                            label="Current Password"
                            placeholder="Enter your current password"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        <Input
                            label="Re-type New Password"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        title="Save Changes"
                        onPress={handleChangePassword}
                        loading={isLoading}
                        style={styles.saveButton}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.light.text,
    },
    content: {
        padding: SPACING.lg,
    },
    description: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.xl,
        lineHeight: 20,
    },
    form: {
        gap: SPACING.md,
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    saveButton: {
        backgroundColor: COLORS.light.primary,
    },
});

export default ChangePassword;
