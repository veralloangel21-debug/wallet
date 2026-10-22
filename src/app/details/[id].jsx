import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TransactionItem from '../../components/TransactionItem';
import { transactions } from '../../constants/transactions';
import { colors } from '../../constants/theme';

export function generateStaticParams() {
  return transactions.map((transaction) => ({ id: transaction.key }));
}

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const transaction = transactions.find((item) => item.key === String(id));

  if (!transaction) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Transaction not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text accessibilityRole="header" style={styles.title}>Transaction Details</Text>
      <Text style={styles.id}>ID: {transaction.key}</Text>
      <View style={styles.card}>
        <TransactionItem {...transaction} />
        <Text style={styles.label}>Description</Text>
        <Text style={styles.description}>
          {transaction.type === 'income' ? 'Money added to your wallet.' : 'Payment made from your wallet.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 24, paddingTop: 55, backgroundColor: colors.screenBg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.screenBg },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.darkText, marginBottom: 8 },
  id: { color: colors.textMutedAlt, marginBottom: 24 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 8 },
  label: { color: colors.textMutedAlt, fontSize: 13, marginHorizontal: 8, marginTop: 12 },
  description: { color: colors.darkText, fontSize: 16, margin: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 4, marginBottom: 20 },
  backText: { color: colors.accentBlue, fontSize: 16, fontWeight: '600' },
});
