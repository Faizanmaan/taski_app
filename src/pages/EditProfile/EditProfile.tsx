import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
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
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseFirestore } from '../../config/firebase';
import { FirebaseError } from 'firebase/app';
import { setUser } from '../../store/authSlice';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { globalStyles } from '../../styles/globalStyles';
import type { RootState } from '../../store';

const EditProfile: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const [fullName, setFullName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const convertImageToBase64 = async (uri: string): Promise<string> => {
        try {
            console.log('Converting image to base64:', uri);
            const response = await fetch(uri);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    console.log('Base64 conversion successful, length:', base64.length);
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            throw error;
        }
    };

    const handleSaveChanges = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Full Name cannot be empty.');
            return;
        }

        setIsLoading(true);
        try {
            const authUser = firebaseAuth().currentUser;
            if (authUser) {
                let photoURL = user?.photoURL;

                if (image) {
                    photoURL = await convertImageToBase64(image);

                    const userDocRef = doc(firebaseFirestore(), 'users', authUser.uid);
                    await setDoc(userDocRef, {
                        displayName: fullName,
                        email: authUser.email,
                        photoURL: photoURL,
                    }, { merge: true });

                    console.log('Profile saved to Firestore');
                }

                await updateProfile(authUser, {
                    displayName: fullName,
                });

                const plainUser = JSON.parse(JSON.stringify(user));
                const updatedUser = {
                    ...plainUser,
                    displayName: fullName,
                    photoURL: photoURL,
                };
                dispatch(setUser(updatedUser));

                Alert.alert('Success', 'Profile updated successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', 'User not found.');
            }
        } catch (error: unknown) {
            console.error('Update profile error:', error);
            const message = error instanceof FirebaseError ? error.message : (error as Error).message;
            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={'#B7B7B7'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: image || user?.photoURL || 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editIconContainer} onPress={pickImage}>
                            <Ionicons name="pencil" size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                                placeholderTextColor={COLORS.light.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor={COLORS.light.textSecondary}
                                editable={false}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveChanges}
                        disabled={isLoading}
                    >
                        <Text style={styles.saveButtonText}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </TouchableOpacity>
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
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.xl,
        marginTop: SPACING.xs,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.light.surface,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.light.text,
        width: 24,
        height: 24,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.light.background,
    },
    formContainer: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 14,
        color: COLORS.light.text,
        marginBottom: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.light.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: 16,
        color: COLORS.light.text,
        backgroundColor: COLORS.light.background,
    },
    footer: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    saveButton: {
        backgroundColor: '#7EBB4F',
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditProfile;
