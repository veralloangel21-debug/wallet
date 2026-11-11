import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { carryColors as colors } from "../constants/theme";
import { formatPeso } from "../utils/currency";

export default function HistoryTransactionItem({ transaction, onPress }) {
  const income = transaction.type === "income";

  const date = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleString("en-PH")
    : "Date unavailable";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.container, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={income ? "arrow-down-outline" : "arrow-up-outline"}
          size={23}
          color={colors.primary}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title}
        </Text>

        <Text style={styles.date}>{date}</Text>

        <Text style={styles.status}>{transaction.status || "completed"}</Text>
      </View>

      <Text style={[styles.amount, income && styles.income]}>
        {income ? "+" : "-"}
        {formatPeso(transaction.amountCents)}
      </Text>

      <Ionicons name="chevron-forward" size={17} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    flex: 1,
    gap: 5,
  },

  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  date: {
    color: colors.muted,
    fontSize: 11,
  },

  status: {
    color: colors.primary,
    fontSize: 11,
    textTransform: "capitalize",
  },

  amount: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  income: {
    color: colors.primary,
  },
});
