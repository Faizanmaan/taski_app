import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants/theme';

interface CustomDatePickerProps {
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: Date) => void;
    initialDate?: Date | null;
}

type PickerMode = 'date' | 'time';
type AmPm = 'AM' | 'PM';

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    visible,
    onClose,
    onSelectDate,
    initialDate,
}) => {
    const insets = useSafeAreaInsets();
    const [mode, setMode] = useState<PickerMode>('date');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);

    // Time state
    const [selectedHour, setSelectedHour] = useState(9);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedAmPm, setSelectedAmPm] = useState<AmPm>('AM');

    useEffect(() => {
        if (visible) {
            setMode('date');
            const dateToUse = initialDate || new Date();
            setSelectedDate(initialDate || null);
            setCurrentDate(dateToUse);

            // Initialize time from initialDate or default to 9:00 AM
            if (initialDate) {
                let hours = initialDate.getHours();
                const minutes = initialDate.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                setSelectedHour(hours);
                setSelectedMinute(minutes);
                setSelectedAmPm(ampm);
            } else {
                setSelectedHour(9);
                setSelectedMinute(0);
                setSelectedAmPm('AM');
            }
        }
    }, [visible, initialDate]);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        // Adjust to make Monday 0, Sunday 6
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const handleDayPress = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const handleTimeChange = (type: 'hour' | 'minute', increment: number) => {
        if (type === 'hour') {
            let newHour = selectedHour + increment;
            if (newHour > 12) newHour = 1;
            if (newHour < 1) newHour = 12;
            setSelectedHour(newHour);
        } else {
            let newMinute = selectedMinute + increment;
            if (newMinute > 59) newMinute = 0;
            if (newMinute < 0) newMinute = 55; // Step is 5, so wrap to 55
            setSelectedMinute(newMinute);
        }
    };

    const toggleAmPm = () => {
        setSelectedAmPm(prev => prev === 'AM' ? 'PM' : 'AM');
    };

    const handleNext = () => {
        if (selectedDate) {
            setMode('time');
        }
    };

    const handleBack = () => {
        setMode('date');
    };

    const handleConfirm = () => {
        if (selectedDate) {
            const finalDate = new Date(selectedDate);
            let hours = selectedHour;
            if (selectedAmPm === 'PM' && hours !== 12) hours += 12;
            if (selectedAmPm === 'AM' && hours === 12) hours = 0;

            finalDate.setHours(hours);
            finalDate.setMinutes(selectedMinute);
            finalDate.setSeconds(0);

            onSelectDate(finalDate);
            onClose();
        }
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = selectedDate &&
                selectedDate.getDate() === i &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            days.push(
                <TouchableOpacity
                    key={`day-${i}`}
                    style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                    onPress={() => handleDayPress(i)}>
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                        {i}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
    };

    const renderTimePicker = () => (
        <View style={styles.timePickerContainer}>
            <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>Hour</Text>
                <TouchableOpacity onPress={() => handleTimeChange('hour', 1)}>
                    <Ionicons name="chevron-up" size={30} color={COLORS.light.primary} />
                </TouchableOpacity>
                <Text style={styles.timeValue}>{selectedHour.toString().padStart(2, '0')}</Text>
                <TouchableOpacity onPress={() => handleTimeChange('hour', -1)}>
                    <Ionicons name="chevron-down" size={30} color={COLORS.light.primary} />
                </TouchableOpacity>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>Minute</Text>
                <TouchableOpacity onPress={() => handleTimeChange('minute', 5)}>
                    <Ionicons name="chevron-up" size={30} color={COLORS.light.primary} />
                </TouchableOpacity>
                <Text style={styles.timeValue}>{selectedMinute.toString().padStart(2, '0')}</Text>
                <TouchableOpacity onPress={() => handleTimeChange('minute', -5)}>
                    <Ionicons name="chevron-down" size={30} color={COLORS.light.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>AM/PM</Text>
                <TouchableOpacity onPress={toggleAmPm} style={styles.ampmButton}>
                    <Text style={[styles.ampmText, selectedAmPm === 'AM' && styles.activeAmPm]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleAmPm} style={styles.ampmButton}>
                    <Text style={[styles.ampmText, selectedAmPm === 'PM' && styles.activeAmPm]}>PM</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={[
                        styles.modalContainer,
                        { paddingBottom: Math.max(insets.bottom, SPACING.lg) }
                    ]}>
                        <View style={styles.handleBar} />

                        <View style={styles.headerRow}>
                            {mode === 'time' && (
                                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={24} color={COLORS.light.text} />
                                </TouchableOpacity>
                            )}
                            <Text style={styles.title}>
                                {mode === 'date' ? 'Select Date' : 'Select Time'}
                            </Text>
                            {mode === 'time' && <View style={{ width: 24 }} />}
                        </View>

                        {mode === 'date' ? (
                            <>
                                {/* Month Navigation */}
                                <View style={styles.monthNav}>
                                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                                        <Ionicons name="chevron-back" size={20} color={COLORS.light.textSecondary} />
                                    </TouchableOpacity>
                                    <Text style={styles.monthText}>
                                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </Text>
                                    <TouchableOpacity onPress={() => changeMonth(1)}>
                                        <Ionicons name="chevron-forward" size={20} color={COLORS.light.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                {/* Week Days Header */}
                                <View style={styles.weekDaysRow}>
                                    {weekDays.map((day, index) => (
                                        <Text key={index} style={styles.weekDayText}>{day}</Text>
                                    ))}
                                </View>

                                {/* Calendar Grid */}
                                <View style={styles.calendarGrid}>
                                    {renderCalendarDays()}
                                </View>
                            </>
                        ) : (
                            renderTimePicker()
                        )}

                        {/* Selected Date Display */}
                        <Text style={styles.selectedDateDisplay}>
                            {selectedDate
                                ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                : 'Select a date'}
                            {mode === 'time' && ` at ${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedAmPm}`}
                        </Text>

                        {/* Action Buttons */}
                        {mode === 'date' ? (
                            <TouchableOpacity
                                style={[styles.confirmButton, !selectedDate && styles.confirmButtonDisabled]}
                                onPress={handleNext}
                                disabled={!selectedDate}>
                                <Text style={styles.confirmButtonText}>Next</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirm}>
                                <Text style={styles.confirmButtonText}>Set Date & Time</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
        minHeight: 480,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: SPACING.md,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center title, back button absolute or flex
        marginBottom: SPACING.lg,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        zIndex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.light.text,
        textAlign: 'center',
        flex: 1,
    },
    monthNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    monthText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.light.text,
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.sm,
    },
    weekDayText: {
        fontSize: 12,
        color: COLORS.light.textSecondary,
        width: 32,
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: SPACING.lg,
    },
    dayCell: {
        width: (Dimensions.get('window').width - SPACING.lg * 2) / 7,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    selectedDayCell: {
        backgroundColor: '#8BC34A', // Light Green
        borderRadius: 8,
    },
    dayText: {
        fontSize: 14,
        color: COLORS.light.text,
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    selectedDateDisplay: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.light.text,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        marginTop: SPACING.sm,
    },
    confirmButton: {
        backgroundColor: '#8BC34A', // Light Green
        paddingVertical: 16,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        opacity: 0.5,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Time Picker Styles
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        paddingVertical: SPACING.lg,
    },
    timeColumn: {
        alignItems: 'center',
        marginHorizontal: SPACING.md,
    },
    timeLabel: {
        fontSize: 12,
        color: COLORS.light.textSecondary,
        marginBottom: SPACING.sm,
    },
    timeValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.light.text,
        marginVertical: SPACING.sm,
    },
    timeSeparator: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.light.text,
        marginTop: 10, // Adjust for alignment
    },
    ampmButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginVertical: 2,
    },
    ampmText: {
        fontSize: 16,
        color: COLORS.light.textSecondary,
        fontWeight: 'bold',
    },
    activeAmPm: {
        color: COLORS.light.primary,
        fontSize: 20,
    },
});

export default CustomDatePicker;
