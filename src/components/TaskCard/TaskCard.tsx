import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/theme';
import type { Task } from '../../store/taskSlice';

interface TaskCardProps {
    task: Task;
    onPress: () => void;
    onToggleComplete: () => void;
    onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onPress,
    onToggleComplete,
    onDelete,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const menuButtonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

    const tagColor = task.tag === 'urgent' ? COLORS.light.urgent : COLORS.light.normal;

    const handleMenuPress = () => {
        menuButtonRef.current?.measure((fx, fy, width, height, px, py) => {
            setMenuPosition({
                top: py + height, // Position below the button
                right: Dimensions.get('window').width - px - width, // Align right edge
            });
            setMenuVisible(true);
        });
    };

    const closeMenu = () => {
        setMenuVisible(false);
    };

    const handleEdit = () => {
        closeMenu();
        onPress();
    };

    const handleDelete = () => {
        console.log('TaskCard: handleDelete called');
        setMenuVisible(false);
        // Add a small delay to allow the modal to close before triggering the alert
        // This prevents the alert from being blocked or dismissed by the modal unmounting
        setTimeout(() => {
            console.log('TaskCard: triggering onDelete prop');
            onDelete();
        }, 300);
    };

    const formatReminder = (date: Date) => {
        const now = new Date();
        const isToday = date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (isToday) {
            return 'Today — ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }

        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
            ' — ' +
            date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                style={[styles.card, task.completed && styles.cardCompleted]}
                onPress={onPress}
                activeOpacity={0.9}
            >
                {/* Header: Title + Menu */}
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.title,
                            task.completed && styles.titleCompleted,
                        ]}
                        numberOfLines={1}
                    >
                        {task.title}
                    </Text>
                    <TouchableOpacity
                        ref={menuButtonRef}
                        onPress={handleMenuPress}
                        style={styles.menuButton}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.light.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Date */}
                {task.remindAt ? (
                    <Text style={styles.dateText}>
                        {formatReminder(task.remindAt)}
                    </Text>
                ) : (
                    <Text style={styles.dateText}>No Date</Text>
                )}

                {/* Notes */}
                {task.notes ? (
                    <Text
                        style={[styles.notes, task.completed && styles.notesCompleted]}
                        numberOfLines={2}
                    >
                        {task.notes}
                    </Text>
                ) : null}

                {/* Tag */}
                <View style={styles.tagContainer}>
                    <View style={[styles.tag, { backgroundColor: tagColor }]}>
                        <Text style={styles.tagText}>
                            {task.tag.charAt(0).toUpperCase() + task.tag.slice(1)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Popup Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={closeMenu}
                >
                    <View style={[
                        styles.menuContainer,
                        {
                            position: 'absolute',
                            top: menuPosition.top,
                            right: menuPosition.right + SPACING.md, // Add some margin from edge
                        }
                    ]}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
                            <Text style={styles.menuText}>Edit Task</Text>
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                            <Text style={[styles.menuText, styles.deleteText]}>Delete Task</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: SPACING.md,
    },
    card: {
        // Removed background color and shadow
        padding: SPACING.lg,
        paddingBottom: SPACING.md,
    },
    cardCompleted: {
        opacity: 0.6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.light.text,
        flex: 1,
        marginRight: SPACING.sm,
    },
    titleCompleted: {
        textDecorationLine: 'line-through',
        color: COLORS.light.textSecondary,
    },
    menuButton: {
        padding: 4,
        marginTop: -4,
        marginRight: -4,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.sm,
    },
    notes: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.md,
        lineHeight: 20,
    },
    notesCompleted: {
        textDecorationLine: 'line-through',
        color: COLORS.light.textSecondary,
    },
    tagContainer: {
        flexDirection: 'row',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    // Menu Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent', // Transparent overlay
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 4,
        width: 150,
        ...SHADOWS.medium,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        fontSize: 14,
        color: COLORS.light.text,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 16,
    },
    deleteText: {
        color: COLORS.light.error,
    },
});

export default TaskCard;
