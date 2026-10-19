import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function PrimaryButton({ title, onPress, backgroundColor, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, backgroundColor && { backgroundColor }, style]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});