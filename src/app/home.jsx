import { useCallback, useMemo, useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

// COMPONENTS
import BottomTabs from "../components/BottomTabs";
import QuickActions from "../components/QuickActions";
import RecentTransactions from "../components/RecentTransactions";
import WalletCard from "../components/WalletCard";

// THEME
import { carryColors as colors } from "../constants/theme";

// SERVICES
import { getCurrentUser } from "../services/authStorage";

// WALLET CONTEXT
import { useWallet } from "../contexts/WalletContext";

// UTILITIES
import { formatPeso } from "../utils/currency";

export default function HomeScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("Carry User");
  const [walletId, setWalletId] = useState("");

  const { wallet, refreshWallet } = useWallet();

  // LOAD DATA WHEN HOME OPENS
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadHomeData() {
        try {
          const user = await getCurrentUser();

          if (!active) return;

          if (user) {
            const fullName = [user.firstname, user.lastname]
              .filter(Boolean)
              .join(" ");

            setUserName(fullName || user.username || "Carry User");

            setWalletId(user.username ? `@${user.username}` : "");
          } else {
            setUserName("Carry User");
            setWalletId("");
          }

          await refreshWallet();
        } catch (error) {
          console.warn("Unable to load Home:", error);
        }
      }

      loadHomeData();

      return () => {
        active = false;
      };
    }, [refreshWallet]),
  );

  // RECENT SAVED TRANSACTIONS
  const recentTransactions = useMemo(() => {
    return (wallet?.transactions ?? []).slice(0, 3).map((item) => ({
      id: item.id,
      title: item.title,
      date: new Date(item.createdAt).toLocaleString("en-PH"),

      amount: `${
        item.type === "income" ? "+" : "-"
      }${formatPeso(item.amountCents)}`,

      icon:
        item.type === "income" ? "arrow-down-outline" : "paper-plane-outline",

      type: item.type,
    }));
  }, [wallet?.transactions]);

  // TEMPORARY MESSAGE FOR UPCOMING FEATURES
  function comingNext(feature) {
    Alert.alert(feature, `${feature} will be added in a future step.`);
  }

  // QUICK ACTIONS
  const quickActions = [
    {
      key: "add",
      label: "Add Money",
      icon: "add-circle-outline",
      onPress: () => router.push("/add-money"),
    },
    {
      key: "send",
      label: "Send",
      icon: "paper-plane-outline",
      onPress: () => router.push("/send-money"),
    },
    {
      key: "pay",
      label: "Pay",
      icon: "scan-outline",
      onPress: () => router.push("/scan-qr"),
    },
    {
      key: "receive",
      label: "Receive",
      icon: "download-outline",
      onPress: () => router.push("/receive-money"),
    },
  ];

  // BOTTOM NAVIGATION
  function handleNavigation(tab) {
    switch (tab) {
      case "home":
        break;

      case "history":
        router.push("/transactions");
        break;

      case "scan":
        router.push("/scan-qr");
        break;

      case "profile":
        router.push("/profile");
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* WELCOME HEADER */}
        <View style={styles.header}>
          <Pressable
            style={styles.userSection}
            onPress={() => router.push("/profile")}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Welcome back,</Text>

              <Text style={styles.userName} numberOfLines={1}>
                {userName}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => comingNext("Notifications")}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </Pressable>
        </View>

        {/* SHARED DEMO BALANCE */}
        <WalletCard
          balance={wallet ? formatPeso(wallet.balanceCents) : "Loading..."}
          walletId={walletId}
        />

        {/* QUICK ACTIONS */}
        <QuickActions actions={quickActions} />

        {/* RECENT TRANSACTIONS */}
        <RecentTransactions
          transactions={recentTransactions}
          onSeeAll={() => router.push("/transactions")}
        />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <BottomTabs active="home" onNavigate={handleNavigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },

  userSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  avatarText: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },

  userInfo: {
    flex: 1,
  },

  greeting: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },

  userName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  notificationButton: {
    padding: 10,
  },
});
