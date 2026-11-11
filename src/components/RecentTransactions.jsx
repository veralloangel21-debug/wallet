import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { carryColors as colors } from "../constants/theme";

export default function RecentTransactions({ transactions, onSeeAll }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Recent Transactions</Text>

        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      {transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions yet.</Text>
      ) : (
        transactions.map((item) => (
          <View key={item.id} style={styles.transaction}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={21} color={colors.primary} />
            </View>

            <View style={styles.details}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.date}>{item.date}</Text>
            </View>

            <Text
              style={[styles.amount, item.type === "income" && styles.income]}
            >
              {item.amount}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  heading: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  details: {
    flex: 1,
    gap: 5,
  },

  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  date: {
    color: colors.muted,
    fontSize: 11,
  },

  amount: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 13,
  },

  income: {
    color: colors.primary,
  },

  empty: {
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 30,
  },
});
