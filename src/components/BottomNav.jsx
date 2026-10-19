import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, shadow } from '../constants/theme';

// items: [{ key, label, active, onPress }]
export default function BottomNav({ items }) {
  return (
    <View style={styles.nav}>
      {items.map((item) => (
        <TouchableOpacity key={item.key} onPress={item.onPress}>
          <Text style={item.active ? styles.navActive : styles.navItem}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 5,
    ...shadow,
    shadowOpacity: 0.1,
  },
  navActive: {
    color: colors.accentBlue,
    fontWeight: 'bold',
  },
  navItem: {
    color: colors.mutedText,
  },
});