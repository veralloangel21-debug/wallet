import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";

import { carryColors as colors } from "../constants/theme";
import { getCurrentUser } from "../services/authStorage";
import { loadPreferences } from "../services/preferencesStorage";

export default function WalletCard({ balance, walletId }) {
  const [showBalance, setShowBalance] = useState(false);

  // APPLY SAVED BALANCE VISIBILITY WHEN HOME OPENS
  useFocusEffect(
    useCallback(() => {
      let active = true;

      // Hide balance until the preference is loaded.
      setShowBalance(false);

      async function loadVisibility() {
        try {
          const user = await getCurrentUser();

          if (!user) return;

          const id = String(user.id || user.username);
          const preferences = await loadPreferences(id);

          if (active) {
            setShowBalance(!preferences.hideBalance);
          }
        } catch (error) {
          console.warn("Unable to load balance preference:", error);
        }
      }

      loadVisibility();

      return () => {
        active = false;
      };
    }, []),
  );

  function toggleBalance() {
    setShowBalance((previous) => !previous);
  }

  return (
    <LinearGradient
      colors={["#126D4B", "#0B4937", "#10251F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* TOP ROW */}
      <View style={styles.topRow}>
        <Text style={styles.label}>Available Balance</Text>

        <Pressable
          onPress={toggleBalance}
          accessibilityRole="button"
          accessibilityLabel={showBalance ? "Hide balance" : "Show balance"}
        >
          <Ionicons
            name={showBalance ? "eye-outline" : "eye-off-outline"}
            size={22}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* WALLET BALANCE */}
      <Text style={styles.balance}>{showBalance ? balance : "₱••••••"}</Text>

      {/* WALLET INFORMATION */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.walletLabel}>Carry Demo Wallet</Text>

          <Text style={styles.walletId}>{walletId}</Text>
        </View>

        <Ionicons name="wallet-outline" size={30} color={colors.primary} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: 22,
    minHeight: 180,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#21865F",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    color: "#D7F7E9",
    fontSize: 14,
  },

  balance: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    marginVertical: 18,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  walletLabel: {
    color: "#D7F7E9",
    fontSize: 12,
  },

  walletId: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
});
