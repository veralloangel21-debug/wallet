import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../constants/theme';

export default function WelcomeHeader({ name, initials, onProfilePress }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.smallText}>Welcome back,</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.profile} onPress={onProfilePress}>
        <Text style={styles.profileText}>{initials}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  smallText: {
    color: colors.subtleText,
    fontSize: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  profile: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: colors.accentBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});