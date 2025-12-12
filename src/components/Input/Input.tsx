import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextInputProps,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    containerStyle,
    style,
    ...textInputProps
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    style,
                ]}
                placeholderTextColor={COLORS.light.textSecondary}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...textInputProps}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        color: COLORS.light.text,
        marginBottom: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.light.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.light.text,
        backgroundColor: COLORS.light.background,
        minHeight: 48,
    },
    inputFocused: {
        borderColor: COLORS.light.primary,
    },
    inputError: {
        borderColor: COLORS.light.error,
    },
    errorText: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.light.error,
        marginTop: SPACING.xs,
    },
});

export default Input;
