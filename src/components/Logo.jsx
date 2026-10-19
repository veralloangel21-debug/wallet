import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Reusable logo badge (used with different colors/sizes on Register & Login screens)
export default function Logo({
  letter = 'E',
  backgroundColor,
  size = 55,
  borderRadius = 16,
  textStyle,
  style,
}) {
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, backgroundColor, borderRadius },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});