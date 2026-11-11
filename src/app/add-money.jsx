import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import CarryButton from "../components/CarryButton";
import { carryColors as colors } from "../constants/theme";
import { useWallet } from "../contexts/WalletContext";
import { formatPeso } from "../utils/currency";

const quickAmounts = [100, 500, 1000, 5000];

export default function AddMoneyScreen() {
  const router = useRouter();
  const { wallet, loading, addMoney } = useWallet();

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAddMoney() {
    if (saving || loading || !wallet) {
      if (!saving) {
        Alert.alert("Please wait", "Wallet is not ready.");
      }
      return;
    }

    setSaving(true);

    try {
      const updated = await addMoney(amount, source, note);

      Alert.alert(
        "Money Added!",
        `${formatPeso(Number(amount) * 100)} has been added to your demo wallet.\n\nNew Balance: ${formatPeso(updated.balanceCents)}`,
        [
          {
            text: "Back to Home",
            onPress: () => router.replace("/home"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Unable to Add Money",
        error.message || "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* BALANCE CARD */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Available Balance</Text>

            <Ionicons name="wallet-outline" size={24} color={colors.primary} />
          </View>

          <Text style={styles.balance}>
            {loading || !wallet
              ? "Loading..."
              : formatPeso(wallet.balanceCents)}
          </Text>

          <Text style={styles.demoText}>Carry Demo Wallet</Text>
        </View>

        {/* MONEY SOURCE */}
        <Text style={styles.label}>Money Source</Text>

        <View style={styles.inputBox}>
          <Ionicons name="business-outline" size={21} color={colors.primary} />

          <TextInput
            style={styles.input}
            placeholder="e.g. Savings, Allowance, Bank"
            placeholderTextColor={colors.muted}
            value={source}
            onChangeText={setSource}
          />
        </View>

        {/* AMOUNT */}
        <Text style={styles.label}>Enter Amount</Text>

        <View style={styles.amountBox}>
          <Text style={styles.peso}>₱</Text>

          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* QUICK AMOUNTS */}
        <View style={styles.quickAmounts}>
          {quickAmounts.map((value) => (
            <Pressable
              key={value}
              style={styles.amountChip}
              onPress={() => setAmount(String(value))}
            >
              <Text style={styles.chipText}>
                ₱{value.toLocaleString("en-PH")}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* NOTE */}
        <Text style={styles.label}>Note (Optional)</Text>

        <View style={styles.inputBox}>
          <Ionicons name="create-outline" size={21} color={colors.primary} />

          <TextInput
            style={styles.input}
            placeholder="Add a note"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <View style={styles.buttonContainer}>
          <CarryButton
            title={saving ? "Adding Money..." : "Add Money"}
            onPress={handleAddMoney}
            disabled={saving || loading || !wallet}
          />
        </View>

        {/* DISCLAIMER */}
        <Text style={styles.disclaimer}>
          Demo mode only. No real money is added.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  balanceCard: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 22,
    marginTop: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.border,
  },

  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  balanceLabel: {
    color: colors.muted,
    fontSize: 14,
  },

  balance: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 18,
  },

  demoText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 10,
  },

  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 16,
    minHeight: 58,
    gap: 12,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 12,
  },

  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 18,
    minHeight: 75,
  },

  peso: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "700",
  },

  amountInput: {
    flex: 1,
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    paddingLeft: 10,
  },

  quickAmounts: {
    flexDirection: "row",
    gap: 8,
    marginTop: 15,
  },

  amountChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  chipText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 12,
  },

  buttonContainer: {
    marginTop: 35,
  },

  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 22,
  },
});
