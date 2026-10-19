import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/theme';

// actions: [{ key, icon, label, onPress }]
export default function QuickActions({ actions }) {
  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <TouchableOpacity key={action.key} style={styles.action} onPress={action.onPress}>
          <Text style={styles.icon}>{action.icon}</Text>
          <Text style={styles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  action: {
    backgroundColor: colors.white,
    width: '23%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  icon: {
    fontSize: 25,
    color: colors.accentBlue,
    marginBottom: 7,
  },
  actionText: {
    fontSize: 11,
    color: '#444444',
    textAlign: 'center',
  },
});