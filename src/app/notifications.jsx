import { useCallback, useMemo, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect, useRouter } from "expo-router";

import { carryColors as colors } from "../constants/theme";
import { useWallet } from "../contexts/WalletContext";
import { getCurrentUser } from "../services/authStorage";
import { formatPeso } from "../utils/currency";

import {
    getReadNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../services/notificationsStorage";

export default function NotificationsScreen() {
  const router = useRouter();
  const { wallet, refreshWallet } = useWallet();

  const [userId, setUserId] = useState(null);
  const [readIds, setReadIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD SAVED NOTIFICATION STATUS
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadData() {
        setLoading(true);
        setUserId(null);
        setReadIds([]);

        try {
          const user = await getCurrentUser();

          if (!user) {
            if (active) router.replace("/login");
            return;
          }

          const id = String(user.id || user.username);

          await refreshWallet();

          const saved = await getReadNotifications(id);

          if (active) {
            setUserId(id);
            setReadIds(saved);
          }
        } catch (error) {
          console.warn("Notifications error:", error);

          if (active) {
            Alert.alert("Error", "Unable to load notifications.");
          }
        } finally {
          if (active) setLoading(false);
        }
      }

      loadData();

      return () => {
        active = false;
      };
    }, [refreshWallet, router]),
  );

  // GENERATE NOTIFICATIONS FROM WALLET TRANSACTIONS
  const notifications = useMemo(() => {
    return (wallet?.transactions ?? [])
      .filter((item) => item && item.id != null)
      .map((item) => {
        const income = item.type === "income";
        const topup = item.category === "topup";

        const amount = formatPeso(item.amountCents ?? 0);

        let title = "Money Sent";
        let message = `${amount} was sent from your wallet.`;
        let icon = "arrow-up-circle-outline";

        if (topup) {
          title = "Money Added";
          message = `${amount} was added to your wallet.`;
          icon = "add-circle-outline";
        } else if (income) {
          title = "Money Received";
          message = `${amount} was received in your wallet.`;
          icon = "arrow-down-circle-outline";
        }

        const date = new Date(item.createdAt);
        const validDate = !Number.isNaN(date.getTime());

        return {
          id: String(item.id),
          title,
          message,
          icon,
          timestamp: validDate ? date.getTime() : 0,
          date: validDate ? date.toLocaleString("en-PH") : "Date unavailable",
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [wallet?.transactions]);

  const readSet = useMemo(() => new Set(readIds), [readIds]);

  const unreadCount = notifications.filter(
    (item) => !readSet.has(item.id),
  ).length;

  // OPEN TRANSACTION RECEIPT
  async function handleNotificationPress(item) {
    if (!userId || saving) return;

    try {
      const updated = await markNotificationRead(userId, item.id);

      setReadIds(updated);
    } catch (error) {
      Alert.alert("Error", "Unable to update notification status.");
    }

    router.push({
      pathname: "/transaction-details/[id]",
      params: { id: item.id },
    });
  }

  // MARK ALL AS READ
  async function handleMarkAllRead() {
    if (!userId || saving || unreadCount === 0) {
      return;
    }

    setSaving(true);

    try {
      const ids = notifications.map((item) => item.id);

      const updated = await markAllNotificationsRead(userId, ids);

      setReadIds(updated);
    } catch (error) {
      Alert.alert("Error", "Unable to mark notifications as read.");
    } finally {
      setSaving(false);
    }
  }

  function renderNotification({ item }) {
    const unread = !readSet.has(item.id);

    return (
      <Pressable
        onPress={() => handleNotificationPress(item)}
        style={[styles.notificationCard, unread && styles.unreadCard]}
      >
        <View style={styles.iconBox}>
          <Ionicons name={item.icon} size={26} color={colors.primary} />
        </View>

        <View style={styles.notificationInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.notificationTitle}>{item.title}</Text>

            {unread && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.message}>{item.message}</Text>

          <Text style={styles.date}>{item.date}</Text>

          <Text style={styles.receiptLink}>View Receipt</Text>
        </View>

        <Ionicons name="chevron-forward" size={17} color={colors.muted} />
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={{ width: 25 }} />
      </View>

      {/* TOP SECTION */}
      <View style={styles.topSection}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>Wallet Activity</Text>

          <Text style={styles.subtitle}>
            {unreadCount === 0
              ? "You're all caught up"
              : `${unreadCount} unread notifications`}
          </Text>
        </View>

        {unreadCount > 0 && !loading && (
          <Pressable onPress={handleMarkAllRead} disabled={saving}>
            <Text style={styles.markRead}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* NOTIFICATIONS LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name="notifications-off-outline"
                size={53}
                color={colors.primary}
              />

              <Text style={styles.emptyTitle}>No Notifications Yet</Text>

              <Text style={styles.emptyText}>
                Your Carry wallet activity will appear here when you add, send,
                or receive demo money.
              </Text>
            </View>
          }
        />
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
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },

  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
    gap: 10,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 7,
  },

  markRead: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
    flexGrow: 1,
  },

  notificationCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  unreadCard: {
    borderColor: colors.primaryDark,
  },

  iconBox: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationInfo: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  message: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  date: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 8,
  },

  receiptLink: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 90,
    gap: 15,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },

  emptyText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },
});
