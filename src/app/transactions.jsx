import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../constants/theme';
import { transactions } from '../constants/transactions';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Money In' },
  { key: 'expense', label: 'Money Out' },
];

export default function TransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const visibleTransactions = transactions.filter(
    (transaction) => filter === 'all' || transaction.type === filter
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <FlatList
        data={visibleTransactions}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text accessibilityRole="header" style={styles.title}>Transactions</Text>
            <Text style={styles.subtitle}>Sample transaction history</Text>
            <View style={styles.filters}>
              {filters.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filter === item.key }}
                  onPress={() => setFilter(item.key)}
                  style={[styles.filter, filter === item.key && styles.selectedFilter]}
                >
                  <Text style={[styles.filterText, filter === item.key && styles.selectedText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionItem title={item.title} date={item.date} amount={item.amount} type={item.type} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No transactions to show.</Text>}
      />
      <View style={{ marginBottom: insets.bottom }}>
        <BottomNav items={[
          { key: 'home', label: 'Home', onPress: () => router.replace('/home') },
          { key: 'transactions', label: 'Transactions', active: true, onPress: () => {} },
          { key: 'logout', label: 'Log Out', onPress: () => router.replace('/') },
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  content: { padding: 24, paddingBottom: 110 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.darkText },
  subtitle: { color: colors.textMutedAlt, marginTop: 8 },
  filters: { flexDirection: 'row', gap: 8, marginVertical: 24 },
  filter: { flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: colors.white },
  selectedFilter: { backgroundColor: colors.accentBlue },
  filterText: { color: colors.darkText, fontWeight: '600' },
  selectedText: { color: colors.white },
  empty: { textAlign: 'center', color: colors.textMutedAlt, marginTop: 24 },
});
