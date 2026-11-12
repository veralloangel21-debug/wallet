import { useMemo } from "react";

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";
import { useWallet } from "../contexts/WalletContext";
import { formatPeso } from "../utils/currency";

const DAILY_LIMIT = 1000000; // ₱10,000 in centavos
const MONTHLY_LIMIT = 5000000; // ₱50,000 in centavos

function calculateUsage(transactions) {
  const today = new Date();

  let dailyUsed = 0;
  let monthlyUsed = 0;

  for (const transaction of transactions) {
    // Count only outgoing wallet transactions.
    if (transaction.type !== "expense") continue;

    const date = new Date(transaction.createdAt);
    const amount = Number(transaction.amountCents);

    if (
      Number.isNaN(date.getTime()) ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      date > today
    ) {
      continue;
    }

    const sameMonth =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth();

    const sameDay = sameMonth && date.getDate() === today.getDate();

    if (sameMonth) {
      monthlyUsed += amount;
    }

    if (sameDay) {
      dailyUsed += amount;
    }
  }

  return { dailyUsed, monthlyUsed };
}

function LimitCard({ title, used, limit, icon }) {
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, Math.round((used / limit) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={23} color={colors.primary} />
        </View>

        <Text style={styles.cardTitle}>{title}</Text>
      </View>

      <Text style={styles.amount}>{formatPeso(used)}</Text>

      <Text style={styles.limitText}>
        of {formatPeso(limit)} demo reference limit
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.remainingLabel}>Remaining</Text>

        <Text style={styles.remainingValue}>{formatPeso(remaining)}</Text>
      </View>
    </View>
  );
}

export default function LimitsScreen() {
  const router = useRouter();
  const { wallet } = useWallet();

  const usage = useMemo(() => {
    return calculateUsage(wallet?.transactions ?? []);
  }, [wallet?.transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Account Limits</Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.mainIcon}>
          <Ionicons
            name="speedometer-outline"
            size={39}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>Account Limits</Text>

        <Text style={styles.description}>
          Monitor your outgoing Carry demo wallet transactions.
        </Text>

        <LimitCard
          title="Daily Outgoing Limit"
          used={usage.dailyUsed}
          limit={DAILY_LIMIT}
          icon="today-outline"
        />

        <LimitCard
          title="Monthly Outgoing Limit"
          used={usage.monthlyUsed}
          limit={MONTHLY_LIMIT}
          icon="calendar-outline"
        />

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={colors.primary}
          />

          <Text style={styles.noticeText}>
            These are demonstration reference limits. They display your usage
            but do not currently restrict transfers. Actual limits must be
            checked in the wallet transfer logic.
          </Text>
        </View>
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
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 40,
  },

  mainIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },

  description: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  amount: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 20,
  },

  limitText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 7,
  },

  progressTrack: {
    height: 9,
    backgroundColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 21,
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
  },

  remainingLabel: {
    color: colors.muted,
    fontSize: 12,
  },

  remainingValue: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  notice: {
    backgroundColor: colors.card,
    padding: 17,
    borderRadius: 15,
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  noticeText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
    flex: 1,
  },
});
