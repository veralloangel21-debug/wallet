import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import WelcomeHeader from "../components/WelcomeHeader.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import QuickActions from "../components/QuickActions.jsx";
import TransactionItem from "../components/TransactionItem.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { colors } from "../constants/theme";
import { transactions } from "../constants/transactions";

const quickActions = [
  { key: "add", icon: "＋", label: "Add Money", onPress: () => {} },
  { key: "send", icon: "↗", label: "Send", onPress: () => {} },
  { key: "pay", icon: "▣", label: "Pay", onPress: () => {} },
  { key: "receive", icon: "↻", label: "Receive", onPress: () => {} },
];

export default function HomeScreen() {
  const router = useRouter();

  const navItems = [
    { key: "home", label: "Home", active: true, onPress: () => {} },
    { key: "transactions", label: "Transactions", onPress: () => router.push('/transactions') },
    { key: "logout", label: "Log Out", onPress: () => router.replace('/') },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader
          name="John Doe"
          initials="JD"
          onProfilePress={() => router.replace('/')}
        />

        <BalanceCard balance="₱12,500.00" account="•••• 4582" />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickActions actions={quickActions} />

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((t) => (
          <TouchableOpacity
            key={t.key}
            accessibilityRole="button"
            accessibilityLabel={`View details for ${t.title}`}
            onPress={() => router.push(`/details/${t.key}`)}
            activeOpacity={0.7}
          >
            <TransactionItem title={t.title} date={t.date} amount={t.amount} type={t.type} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav items={navItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 55,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: colors.darkText,
    marginBottom: 15,
  },
});
