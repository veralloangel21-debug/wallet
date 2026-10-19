import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import WelcomeHeader from "../components/WelcomeHeader.jsx";
import BalanceCard from "../components/BalanceCard.jsx";
import QuickActions from "../components/QuickActions.jsx";
import TransactionItem from "../components/TransactionItem.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { colors } from "../constants/theme";

const quickActions = [
  { key: "add", icon: "＋", label: "Add Money", onPress: () => {} },
  { key: "send", icon: "↗", label: "Send", onPress: () => {} },
  { key: "pay", icon: "▣", label: "Pay", onPress: () => {} },
  { key: "receive", icon: "↻", label: "Receive", onPress: () => {} },
];

const transactions = [
  { key: "1", title: "Coffee Shop", date: "Today, 10:30 AM", amount: "₱150.00", type: "expense" },
  { key: "2", title: "Money Received", date: "Yesterday", amount: "₱1,000.00", type: "income" },
];

export default function HomeScreen() {
  const router = useRouter();

  const navItems = [
    { key: "home", label: "Home", active: true, onPress: () => {} },
    { key: "transactions", label: "Transactions", onPress: () => {} },
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
          <TransactionItem
            key={t.key}
            title={t.title}
            date={t.date}
            amount={t.amount}
            type={t.type}
          />
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