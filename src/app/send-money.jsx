import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import CarryButton from "../components/CarryButton";
import SendMoneyForm from "../components/SendMoneyForm";

import { carryColors as colors } from "../constants/theme";
import { useWallet } from "../contexts/WalletContext";
import { formatPeso } from "../utils/currency";
import { validateTransfer } from "../utils/validateTransfer";

export default function SendMoneyScreen() {
  const { recipient: scannedRecipient } = useLocalSearchParams();

  const router = useRouter();

  const { wallet, loading, sendMoney } = useWallet();

  const [recipient, setRecipient] = useState(
    typeof scannedRecipient === "string" ? scannedRecipient : "",
  );

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [sending, setSending] = useState(false);

  const balanceCents = wallet?.balanceCents ?? 0;
  const transferCents = Math.round(Number(amount || 0) * 100);

  function handleBack() {
    if (sending) return;

    if (reviewing) {
      setReviewing(false);
    } else {
      router.back();
    }
  }

  function handleContinue() {
    if (loading || !wallet) {
      Alert.alert("Please wait", "Wallet is still loading.");
      return;
    }

    const error = validateTransfer(recipient, amount, balanceCents / 100);

    if (error) {
      Alert.alert("Invalid Transfer", error);
      return;
    }

    setReviewing(true);
  }

  async function handleConfirm() {
    if (sending) return;

    setSending(true);

    try {
      const result = await sendMoney(recipient, amount, note);

      Alert.alert(
        "Demo Transfer Successful",
        `${formatPeso(transferCents)} was transferred to ` +
          `@${result.recipientUsername} in Carry's local demo.`,
        [
          {
            text: "Back to Home",
            onPress: () => router.replace("/home"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Transfer Failed",
        error.message || "Unable to complete transfer.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBack}
          disabled={sending}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" color={colors.text} size={25} />
        </Pressable>

        <Text style={styles.title}>
          {reviewing ? "Review Transfer" : "Send Money"}
        </Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!reviewing ? (
          <>
            {/* BALANCE */}
            <View style={styles.balanceCard}>
              <Text style={styles.muted}>Available Demo Balance</Text>

              <Text style={styles.balance}>
                {loading ? "Loading..." : formatPeso(balanceCents)}
              </Text>
            </View>

            {/* INPUT FORM */}
            <SendMoneyForm
              recipient={recipient}
              amount={amount}
              note={note}
              onRecipientChange={setRecipient}
              onAmountChange={setAmount}
              onNoteChange={setNote}
            />

            <View style={styles.buttonArea}>
              <CarryButton
                title="Continue"
                showArrow
                onPress={handleContinue}
              />
            </View>
          </>
        ) : (
          <>
            {/* REVIEW */}
            <View style={styles.reviewHeader}>
              <Ionicons
                name="shield-checkmark-outline"
                color={colors.primary}
                size={45}
              />

              <Text style={styles.reviewTitle}>Confirm Your Transfer</Text>

              <Text style={styles.muted}>
                Review the details before proceeding.
              </Text>
            </View>

            <View style={styles.reviewCard}>
              <View style={styles.row}>
                <Text style={styles.muted}>Recipient</Text>
                <Text style={styles.value}>
                  @{recipient.trim().replace(/^@/, "")}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.muted}>Amount</Text>
                <Text style={styles.value}>{formatPeso(transferCents)}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.muted}>Demo Fee</Text>
                <Text style={styles.value}>₱0.00</Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <Text style={styles.muted}>Total</Text>
                <Text style={styles.total}>{formatPeso(transferCents)}</Text>
              </View>

              {note.trim() ? (
                <View style={styles.row}>
                  <Text style={styles.muted}>Note</Text>
                  <Text style={styles.value}>{note.trim()}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.buttonArea}>
              <CarryButton
                title={sending ? "Processing..." : "Confirm Demo Transfer"}
                onPress={handleConfirm}
                disabled={sending}
              />

              <Pressable
                onPress={() => setReviewing(false)}
                disabled={sending}
                style={styles.editButton}
              >
                <Text style={styles.editText}>Edit Transfer</Text>
              </Pressable>
            </View>
          </>
        )}

        <Text style={styles.disclaimer}>
          Carry Demo Mode — Transfers work only between registered test accounts
          on this device. No real money is transferred.
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginVertical: 16,
  },

  balance: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
  },

  muted: {
    color: colors.muted,
    fontSize: 13,
  },

  buttonArea: {
    marginTop: 30,
    gap: 15,
  },

  reviewHeader: {
    alignItems: "center",
    gap: 12,
    marginTop: 35,
    marginBottom: 28,
  },

  reviewTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },

  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    gap: 22,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  value: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },

  total: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "800",
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
  },

  editButton: {
    alignItems: "center",
    padding: 13,
  },

  editText: {
    color: colors.primary,
    fontWeight: "700",
  },

  disclaimer: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 28,
  },
});
