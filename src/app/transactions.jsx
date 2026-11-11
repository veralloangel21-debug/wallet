import { useCallback, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect, useRouter } from "expo-router";

import BottomTabs from "../components/BottomTabs";
import HistoryTransactionItem from "../components/HistoryTransactionItem";

import { carryColors as colors } from "../constants/theme";
import { useWallet } from "../contexts/WalletContext";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "income", label: "Money In" },
  { key: "expense", label: "Money Out" },
];

export default function TransactionsScreen() {
  const router = useRouter();

  const { wallet, loading, refreshWallet } = useWallet();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // REFRESH TRANSACTIONS WHEN THE SCREEN OPENS
  useFocusEffect(
    useCallback(() => {
      refreshWallet().catch((error) => {
        console.warn("Unable to refresh wallet:", error);
      });
    }, [refreshWallet]),
  );

  const transactions = wallet?.transactions ?? [];

  // SEARCH AND FILTER SAVED TRANSACTIONS
  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return transactions
      .filter((item) => {
        if (filter !== "all" && item.type !== filter) {
          return false;
        }

        const searchableText = [item.title, item.note, item.id, item.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(keyword);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [wallet, filter, search]);

  function openDetails(transaction) {
    router.push({
      pathname: "/transaction-details/[id]",
      params: {
        id: String(transaction.id),
      },
    });
  }

  // BOTTOM NAVIGATION
  function handleNavigation(tab) {
    switch (tab) {
      case "home":
        router.replace("/home");
        break;

      case "scan":
        router.push("/scan-qr");
        break;

      case "profile":
        router.replace("/profile");
        break;

      case "history":
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/home")}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Transaction History</Text>

        <View style={{ width: 25 }} />
      </View>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.muted} />

        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={21} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* FILTERS */}
      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const active = filter === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => setFilter(item.key)}
              style={[styles.filterButton, active && styles.activeFilter]}
            >
              <Text
                style={[styles.filterText, active && styles.activeFilterText]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* TRANSACTION LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={styles.listTitle}>
              {filteredTransactions.length}{" "}
              {filteredTransactions.length === 1
                ? "Transaction"
                : "Transactions"}
            </Text>
          }
          renderItem={({ item }) => (
            <HistoryTransactionItem
              transaction={item}
              onPress={() => openDetails(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="receipt-outline" size={50} color={colors.muted} />

              <Text style={styles.emptyTitle}>No transactions found</Text>

              <Text style={styles.emptyDescription}>
                {transactions.length === 0
                  ? "Your saved Carry transactions will appear here."
                  : "Try another search or filter."}
              </Text>
            </View>
          }
        />
      )}

      {/* BOTTOM NAVIGATION */}
      <BottomTabs active="history" onNavigate={handleNavigation} />
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
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    gap: 12,
    height: 56,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },

  filterRow: {
    flexDirection: "row",
    gap: 9,
    marginHorizontal: 20,
    marginTop: 19,
    marginBottom: 14,
  },

  filterButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  activeFilterText: {
    color: colors.background,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
    flexGrow: 1,
  },

  listTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 70,
    gap: 15,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  emptyDescription: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 21,
  },
});
