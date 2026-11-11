import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { carryColors as colors } from "../constants/theme";

export default function ReceiveQRCard({ walletId, qrValue }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="qr-code-outline" size={27} color={colors.primary} />
      </View>

      <Text style={styles.title}>My Carry QR Code</Text>

      <Text style={styles.subtitle}>
        Share this QR code to identify your demo wallet.
      </Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={190}
          color="#081510"
          backgroundColor="#FFFFFF"
          quietZone={10}
          ecl="H"
        />
      </View>

      <Text style={styles.walletId}>{walletId}</Text>

      <Text style={styles.helper}>Demo wallet QR • Not for real payments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },

  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },

  qrContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    marginVertical: 25,
  },

  walletId: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  helper: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 9,
    textAlign: "center",
  },
});
