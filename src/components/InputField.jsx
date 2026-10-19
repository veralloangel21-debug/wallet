import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/theme';

// One reusable input for every field in the app (plain text, email, phone,
// password, etc). Pass `showIcon` to get the bordered icon+input layout
// used for the Login password field; leave it off for a plain field.
// `labelRight` lets you slot something next to the label, like "Forgot password?".
export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  showIcon,
  labelRight,
  inputStyle,
  containerStyle,
}) {
  return (
    <View style={[styles.field, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelRight}
      </View>

      {showIcon ? (
        <View style={styles.iconContainer}>
          <View style={styles.iconPlaceholder} />
          <TextInput
            style={styles.inputWithIcon}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
          />
        </View>
      ) : (
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBgAlt,
    borderWidth: 1,
    borderColor: colors.borderAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWithIcon: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    height: '100%',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: colors.iconPlaceholder,
    borderRadius: 4,
  },
});