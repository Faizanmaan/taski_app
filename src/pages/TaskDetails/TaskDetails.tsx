import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';
import { doc, setDoc, updateDoc, deleteDoc, Timestamp, collection, addDoc } from 'firebase/firestore';
import { firebaseFirestore, firebaseAuth } from '../../config/firebase';
import CustomDatePicker from '../../components/CustomDatePicker/CustomDatePicker';

import { RootStackParamList } from '../../navigation/types';

type TaskDetailsRouteProp = RouteProp<RootStackParamList, 'TaskDetails'>;

const TaskDetails = () => {
    const navigation = useNavigation();
    const route = useRoute<TaskDetailsRouteProp>();
    const { task, date } = route.params || {};

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [tag, setTag] = useState<'normal' | 'urgent'>('normal');
    const [remindAt, setRemindAt] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setNotes(task.notes || '');
            setTag(task.tag || 'normal');
            if (task.remindAt) {
                setRemindAt(new Date(task.remindAt));
            }
        } else if (date) {
            // If a date is passed from Calendar view, set it as default reminder
            const initialDate = new Date(date);
            initialDate.setHours(9, 0, 0, 0); // Default to 9 AM
            setRemindAt(initialDate);
        }
    }, [task, date]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        setLoading(true);
        try {
            const user = firebaseAuth().currentUser;
            if (!user) {
                Alert.alert('Error', 'You must be logged in to save tasks');
                return;
            }

            const taskData = {
                title,
                notes,
                tag,
                remindAt: remindAt ? Timestamp.fromDate(remindAt) : null,
                updatedAt: Timestamp.now(),
                userId: user.uid,
                completed: task ? task.completed : false,
            };

            if (task) {
                await updateDoc(doc(firebaseFirestore(), 'tasks', task.id), taskData);
            } else {
                await addDoc(collection(firebaseFirestore(), 'tasks'), {
                    ...taskData,
                    createdAt: Timestamp.now(),
                });
            }

            navigation.goBack();
        } catch (error: any) {
            console.error('Error saving task:', error);
            Alert.alert('Error', 'Failed to save task: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;

        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteDoc(doc(firebaseFirestore(), 'tasks', task.id));
                            navigation.goBack();
                        } catch (error: any) {
                            console.error('Error deleting task:', error);
                            Alert.alert('Error', 'Failed to delete task');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const formatReminderDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }) + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{task ? 'Edit Task' : 'Add New Task'}</Text>
                {task ? (
                    <TouchableOpacity onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={24} color={COLORS.light.error} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Title Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="What needs to be done?"
                        placeholderTextColor={COLORS.light.textSecondary}
                    />
                </View>

                {/* Notes Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Add some details..."
                        placeholderTextColor={COLORS.light.textSecondary}
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Tags */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tags</Text>
                    <View style={styles.tagsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tagButton,
                                tag === 'normal' && styles.tagButtonActive,
                                { marginRight: SPACING.md }
                            ]}
                            onPress={() => setTag('normal')}>
                            <Text style={[
                                styles.tagText,
                                tag === 'normal' && styles.tagTextActive
                            ]}>Normal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tagButton,
                                tag === 'urgent' && styles.tagButtonActive,
                                { backgroundColor: tag === 'urgent' ? '#FFEbee' : '#F5F5F5' }
                            ]}
                            onPress={() => setTag('urgent')}>
                            <Text style={[
                                styles.tagText,
                                tag === 'urgent' && { color: COLORS.light.error }
                            ]}>Urgent</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Remind Me */}
                <View style={styles.inputGroup}>
                    <Text style={styles.sectionHeader}>Remind Me</Text>
                    <View style={styles.reminderBox}>
                        <View>
                            <Text style={styles.reminderLabel}>Date & Time</Text>
                            <Text style={styles.reminderValue}>
                                {remindAt ? formatReminderDate(remindAt) : 'No reminder set'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                            <Ionicons name="create-outline" size={24} color={COLORS.light.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Task</Text>
                    )}
                </TouchableOpacity>
            </View>

            <CustomDatePicker
                visible={isDatePickerVisible}
                onClose={() => setDatePickerVisible(false)}
                onSelectDate={(date) => setRemindAt(date)}
                initialDate={remindAt}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.light.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light.border,
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
        flex: 1,
    },
    contentContainer: {
        padding: SPACING.lg,
    },
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.xs,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.light.border,
        borderRadius: BORDER_RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + 4,
        fontSize: 16,
        color: COLORS.light.text,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 120,
    },
    tagsContainer: {
        flexDirection: 'row',
    },
    tagButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tagButtonActive: {
        backgroundColor: '#E8F5E9',
        borderColor: COLORS.light.primary,
    },
    tagText: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
    },
    tagTextActive: {
        color: COLORS.light.primary,
        fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.light.text,
        marginBottom: SPACING.sm,
    },
    reminderBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.light.border,
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.md,
        backgroundColor: '#fff',
    },
    reminderLabel: {
        fontSize: 12,
        color: COLORS.light.textSecondary,
        marginBottom: 4,
    },
    reminderValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.light.text,
    },
    footer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.light.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.light.border,
    },
    saveButton: {
        backgroundColor: COLORS.light.primary,
        paddingVertical: 16,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TaskDetails;
