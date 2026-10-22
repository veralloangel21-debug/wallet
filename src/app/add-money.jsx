import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import PrimaryButton from '../components/PrimaryButton';
import { colors, shadow } from '../constants/theme';

const initialDeposits = [
  { id: 'deposit-1', source: 'Salary', amount: '25000', note: 'Monthly salary' },
  { id: 'deposit-2', source: 'Bank transfer', amount: '1000', note: 'Emergency fund' },
];

const emptyForm = { source: '', amount: '', note: '' };

export default function AddMoneyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [deposits, setDeposits] = useState(initialDeposits);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const updateField = (field) => (value) => setForm((current) => ({ ...current, [field]: value }));

  const saveDeposit = () => {
    const amount = Number(form.amount);
    if (!form.source.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError('Enter a source and an amount greater than zero.');
      return;
    }

    const nextDeposit = {
      id: editingId || `deposit-${Date.now()}`,
      source: form.source.trim(),
      amount: amount.toFixed(2),
      note: form.note.trim(),
    };

    setDeposits((current) => editingId
      ? current.map((deposit) => (deposit.id === editingId ? nextDeposit : deposit))
      : [nextDeposit, ...current]);
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const editDeposit = (deposit) => {
    setForm({ source: deposit.source, amount: deposit.amount, note: deposit.note });
    setEditingId(deposit.id);
    setError('');
  };

  const deleteDeposit = (id) => {
    setDeposits((current) => current.filter((deposit) => deposit.id !== id));
    if (editingId === id) {
      setForm(emptyForm);
      setEditingId(null);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={deposits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>
            <Text accessibilityRole="header" style={styles.title}>Add Money</Text>
            <Text style={styles.subtitle}>Create and manage wallet deposits</Text>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{editingId ? 'Edit deposit' : 'New deposit'}</Text>
              <TextInput
                style={styles.input}
                placeholder="Source (e.g. Salary)"
                value={form.source}
                onChangeText={updateField('source')}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="decimal-pad"
                value={form.amount}
                onChangeText={updateField('amount')}
              />
              <TextInput
                style={styles.input}
                placeholder="Note (optional)"
                value={form.note}
                onChangeText={updateField('note')}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <PrimaryButton
                title={editingId ? 'UPDATE DEPOSIT' : 'ADD MONEY'}
                backgroundColor={colors.accentBlue}
                onPress={saveDeposit}
              />
              {editingId ? (
                <TouchableOpacity onPress={() => { setForm(emptyForm); setEditingId(null); }} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel edit</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <Text style={styles.sectionTitle}>Saved deposits</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.depositCard}>
            <View style={styles.depositInfo}>
              <Text style={styles.depositSource}>{item.source}</Text>
              <Text style={styles.depositNote}>{item.note || 'No note'}</Text>
              <Text style={styles.depositAmount}>+₱{item.amount}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => editDeposit(item)} style={styles.actionButton}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteDeposit(item.id)} style={styles.actionButton}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No deposits yet.</Text>}
      />
      <BottomNav items={[
        { key: 'home', label: 'Home', onPress: () => router.replace('/home') },
        { key: 'transactions', label: 'Transactions', onPress: () => router.replace('/transactions') },
        { key: 'logout', label: 'Log Out', onPress: () => router.replace('/') },
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  content: { padding: 24, paddingBottom: 110 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 4, marginBottom: 8 },
  backText: { color: colors.accentBlue, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.darkText },
  subtitle: { color: colors.textMutedAlt, marginTop: 8, marginBottom: 20 },
  formCard: { backgroundColor: colors.white, borderRadius: 16, padding: 16, ...shadow },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: colors.darkText, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: colors.borderAlt, borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 16, backgroundColor: colors.inputBgAlt },
  error: { color: colors.danger, marginBottom: 10 },
  cancelButton: { alignItems: 'center', padding: 12 },
  cancelText: { color: colors.textMutedAlt },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: colors.darkText, marginTop: 24, marginBottom: 12 },
  depositCard: { backgroundColor: colors.white, borderRadius: 14, padding: 16, marginBottom: 10, ...shadow },
  depositInfo: { marginBottom: 10 },
  depositSource: { fontSize: 16, fontWeight: 'bold', color: colors.darkText },
  depositNote: { color: colors.textMutedAlt, marginTop: 4 },
  depositAmount: { color: colors.success, fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  actions: { flexDirection: 'row', gap: 18 },
  actionButton: { paddingVertical: 6 },
  editText: { color: colors.accentBlue, fontWeight: '600' },
  deleteText: { color: colors.danger, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textMutedAlt, marginTop: 12 },
});
