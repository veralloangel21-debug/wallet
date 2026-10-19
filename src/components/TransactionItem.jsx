import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

// type: 'expense' | 'income' — controls the amount color and its sign
export default function TransactionItem({ title, date, amount, type = 'expense' }) {
  const isIncome = type === 'income';
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={isIncome ? styles.income : styles.expense}>
        {isIncome ? '+' : '-'}
        {amount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  date: {
    color: colors.mutedText,
    fontSize: 12,
    marginTop: 4,
  },
  expense: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  income: {
    color: colors.success,
    fontWeight: 'bold',
  },
});