import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function BalanceCard({ label = 'Available Balance', balance, account }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.balance}>{balance}</Text>
      <Text style={styles.account}>{account}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accentBlue,
    borderRadius: 20,
    padding: 25,
    marginBottom: 28,
  },
  label: {
    color: colors.lightBlueText,
    fontSize: 14,
  },
  balance: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  account: {
    color: colors.lightBlueText,
    fontSize: 14,
  },
});