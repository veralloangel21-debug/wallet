import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { carryColors as colors } from "../constants/theme";

export default function SpendingCard({ summary }) {
  const { formatted, comparison, trend, lastSevenDays } = summary;

  const trendColor =
    trend === "up"
      ? "#FF707B"
      : trend === "down"
        ? colors.primary
        : colors.muted;

  const trendIcon =
    trend === "up"
      ? "trending-up-outline"
      : trend === "down"
        ? "trending-down-outline"
        : "remove-outline";

  return (
    <View style={styles.card}>
      {/* TITLE */}
      <View style={styles.header}>
        <Text style={styles.heading}>This Month's Spending</Text>

        <Ionicons name="stats-chart-outline" size={20} color={colors.primary} />
      </View>

      {/* MONTHLY AMOUNT */}
      <Text style={styles.amount}>{formatted}</Text>

      {/* MONTHLY COMPARISON */}
      <View style={styles.changeRow}>
        <Ionicons name={trendIcon} size={16} color={trendColor} />

        <Text style={[styles.change, { color: trendColor }]}>{comparison}</Text>
      </View>

      <View style={styles.separator} />

      {/* LAST SEVEN DAYS */}
      <Text style={styles.chartTitle}>Spending Activity</Text>

      <Text style={styles.chartSubtitle}>Last 7 days</Text>

      <View style={styles.chart}>
        {lastSevenDays.map((day) => (
          <View
            key={day.key}
            style={styles.barColumn}
            accessibilityLabel={`${day.label}: ${day.amountCents} centavos spent`}
          >
            <View style={styles.barArea}>
              <View
                style={[
                  styles.bar,
                  {
                    height: day.height,
                    backgroundColor:
                      day.amountCents > 0 ? colors.primary : colors.border,
                  },
                ]}
              />
            </View>

            <Text style={styles.dayLabel}>{day.label.slice(0, 2)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 26,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },

  amount: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "800",
    marginTop: 20,
  },

  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 10,
  },

  change: {
    fontSize: 12,
    flex: 1,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },

  chartTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  chartSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 5,
  },

  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 18,
  },

  barColumn: {
    flex: 1,
    alignItems: "center",
  },

  barArea: {
    height: 70,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },

  bar: {
    width: 13,
    maxWidth: "70%",
    borderRadius: 5,
  },

  dayLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 8,
  },
});
