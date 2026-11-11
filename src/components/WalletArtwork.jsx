import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { carryColors as colors } from "../constants/theme";

export default function WalletArtwork() {
  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <LinearGradient colors={["#39EDAA", "#08734E"]} style={styles.backCard} />

      <LinearGradient
        colors={["#176348", "#0D3227", "#092018"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.frontCard}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="wallet-outline" size={30} color={colors.primary} />

          <Ionicons name="wifi-outline" size={24} color={colors.primary} />
        </View>

        <View>
          <Text style={styles.walletName}>Carry Wallet</Text>
          <Text style={styles.walletNumber}>•••• 2048</Text>
        </View>
      </LinearGradient>

      <View style={styles.badge}>
        <Ionicons name="checkmark" size={22} color={colors.background} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    width: 235,
    height: 235,
    borderRadius: 118,
    backgroundColor: "#123B2C",
  },

  backCard: {
    position: "absolute",
    width: 190,
    height: 125,
    borderRadius: 19,
    transform: [{ rotate: "-15deg" }, { translateX: -15 }, { translateY: -20 }],
  },

  frontCard: {
    width: 240,
    height: 155,
    borderRadius: 20,
    padding: 22,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.primary,
    transform: [{ rotate: "6deg" }],
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  walletName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  walletNumber: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },

  badge: {
    position: "absolute",
    right: 28,
    bottom: 29,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
