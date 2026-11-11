import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import CarryButton from "../components/CarryButton";
import ReceiveQRCard from "../components/ReceiveQRCard";
import RequestMoneyModal from "../components/RequestMoneyModal";

import { carryColors as colors } from "../constants/theme";
import { getCurrentUser } from "../services/authStorage";

export default function ReceiveMoneyScreen() {
  const router = useRouter();

  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestVisible, setRequestVisible] = useState(false);

  // GET THE CURRENT LOGGED-IN ACCOUNT
  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const user = await getCurrentUser();

        if (active) {
          setUsername(user?.username || null);
        }
      } catch (error) {
        console.warn("Unable to load account:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const walletId = username ? `@${username}` : "";
  const qrValue = username ? `carry:wallet:${username.toLowerCase()}` : "";

  // COPY WALLET ID
  async function handleCopy() {
    try {
      await Clipboard.setStringAsync(walletId);
      Alert.alert("Copied!", "Wallet ID copied to clipboard.");
    } catch (error) {
      Alert.alert("Error", "Unable to copy wallet ID.");
    }
  }

  // SHARE WALLET ID AS TEXT
  async function handleShare() {
    try {
      await Share.share({
        message:
          `My Carry Demo Wallet ID: ${walletId}\n\n` +
          "Carry — Your Wallet, Everywhere.\n" +
          "Demo only. No real payments supported.",
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share wallet ID.");
    }
  }

  // SHARE DEMO MONEY REQUEST
  async function handleRequest(amount, note) {
    const formatted = Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const message =
      `Carry Demo Payment Request\n\n` +
      `Wallet: ${walletId}\n` +
      `Amount: ₱${formatted}\n` +
      (note ? `Note: ${note}\n` : "") +
      "\nDemo request only. No payment is processed.";

    try {
      await Share.share({ message });
      setRequestVisible(false);
    } catch (error) {
      Alert.alert("Error", "Unable to share payment request.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Receive Money</Text>

        <View style={{ width: 25 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !username ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Please log in to view your Carry wallet.
          </Text>

          <CarryButton
            title="Go to Login"
            onPress={() => router.replace("/login")}
          />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* QR CODE */}
          <ReceiveQRCard walletId={walletId} qrValue={qrValue} />

          {/* WALLET ID */}
          <View style={styles.walletBox}>
            <View style={styles.walletIcon}>
              <Ionicons
                name="wallet-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>Wallet ID</Text>
              <Text style={styles.walletText}>{walletId}</Text>
            </View>

            <Pressable
              onPress={handleCopy}
              accessibilityLabel="Copy Wallet ID"
              accessibilityRole="button"
            >
              <Ionicons name="copy-outline" size={23} color={colors.primary} />
            </Pressable>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttons}>
            <CarryButton title="Share Wallet ID" onPress={handleShare} />

            <CarryButton
              title="Request Money"
              variant="outline"
              onPress={() => setRequestVisible(true)}
            />
          </View>

          <Text style={styles.disclaimer}>
            This is a demonstration wallet. QR codes and wallet IDs do not
            process real payments.
          </Text>
        </ScrollView>
      )}

      <RequestMoneyModal
        visible={requestVisible}
        onClose={() => setRequestVisible(false)}
        onShare={handleRequest}
      />
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
    paddingHorizontal: 23,
    paddingVertical: 17,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    gap: 20,
  },
  errorText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 15,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 35,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  walletBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginTop: 20,
    gap: 12,
  },
  walletIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  walletInfo: {
    flex: 1,
    gap: 5,
  },
  walletLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  walletText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  buttons: {
    marginTop: 30,
    gap: 14,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 24,
  },
});
