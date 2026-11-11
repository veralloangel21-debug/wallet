import { useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../../constants/theme";
import { useWallet } from "../../contexts/WalletContext";
import { formatPeso } from "../../utils/currency";

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { wallet, loading, refreshWallet } = useWallet();

  const transactionId = Array.isArray(id) ? id[0] : id;

  useFocusEffect(
    useCallback(() => {
      refreshWallet().catch(console.warn);
    }, [refreshWallet]),
  );

  const transaction = wallet?.transactions?.find(
    (item) => String(item.id) === String(transactionId),
  );

  const income = transaction?.type === "income";

  const date = transaction?.createdAt
    ? new Date(transaction.createdAt).toLocaleString("en-PH")
    : "Not available";

  const amount = transaction ? formatPeso(transaction.amountCents) : "₱0.00";

  async function shareReceipt() {
    if (!transaction) return;

    const receipt = [
      "CARRY - DEMO TRANSACTION RECEIPT",
      "",
      `Transaction: ${transaction.title}`,
      `Type: ${income ? "Money In" : "Money Out"}`,
      `Amount: ${income ? "+" : "-"}${amount}`,
      `Date: ${date}`,
      `Status: ${transaction.status || "completed"}`,
      `Reference: ${transaction.id}`,
      transaction.note ? `Note: ${transaction.note}` : null,
      "",
      "Carry - Your Wallet, Everywhere.",
      "Demo only. Not proof of a real payment.",
    ]
      .filter((line) => line !== null)
      .join("\n");

    try {
      await Share.share({ message: receipt });
    } catch (error) {
      Alert.alert("Error", "Unable to share receipt.");
    }
  }

  const DetailRow = ({ label, value }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Transaction Details</Text>

        <View style={{ width: 25 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !transaction ? (
        <View style={styles.center}>
          <Text style={styles.value}>Transaction not found.</Text>

          <Pressable onPress={() => router.replace("/transactions")}>
            <Text style={styles.link}>Back to History</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.successIcon}>
            <Ionicons
              name="checkmark-circle-outline"
              size={54}
              color={colors.primary}
            />
          </View>

          <Text style={styles.status}>Demo Transaction</Text>

          <Text style={styles.amount}>
            {income ? "+" : "-"}
            {amount}
          </Text>

          <Text style={styles.subtitle}>{transaction.title}</Text>

          {/* RECEIPT CARD */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Transaction Receipt</Text>

            <View style={styles.divider} />

            <DetailRow label="Type" value={income ? "Money In" : "Money Out"} />

            <DetailRow label="Amount" value={amount} />
            <DetailRow label="Date" value={date} />

            <DetailRow
              label="Status"
              value={transaction.status || "completed"}
            />

            <DetailRow
              label="Category"
              value={transaction.category || "Transfer"}
            />

            {transaction.note ? (
              <DetailRow label="Note" value={transaction.note} />
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.label}>Reference Number</Text>

            <Text style={styles.reference} selectable>
              {transaction.id}
            </Text>
          </View>

          {/* SHARE BUTTON */}
          <Pressable style={styles.shareButton} onPress={shareReceipt}>
            <Ionicons
              name="share-social-outline"
              size={20}
              color={colors.background}
            />

            <Text style={styles.shareText}>Share Demo Receipt</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            This receipt is for demonstration only. No real money was
            transferred.
          </Text>
        </ScrollView>
      )}
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
    padding: 22,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },

  successIcon: {
    alignSelf: "center",
    marginTop: 30,
  },

  status: {
    color: colors.primary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
  },

  amount: {
    color: colors.text,
    fontSize: 35,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 12,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    gap: 18,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },

  label: {
    color: colors.muted,
    fontSize: 13,
  },

  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },

  reference: {
    color: colors.primary,
    fontSize: 12,
  },

  link: {
    color: colors.primary,
    fontWeight: "700",
  },

  shareButton: {
    backgroundColor: colors.primary,
    minHeight: 56,
    borderRadius: 15,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  shareText: {
    color: colors.background,
    fontWeight: "700",
  },

  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 25,
  },
});
