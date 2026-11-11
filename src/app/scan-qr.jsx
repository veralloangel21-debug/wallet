import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import CarryButton from "../components/CarryButton";
import { carryColors as colors } from "../constants/theme";
import { findUserByUsername, getCurrentUser } from "../services/authStorage";
import { parseCarryQR } from "../utils/carryQR";

export default function ScanQRScreen() {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [manualId, setManualId] = useState("");
  const [scanned, setScanned] = useState(false);

  const scanningRef = useRef(false);

  // VALIDATE RECIPIENT AND OPEN SEND MONEY
  async function openRecipient(value, fromQR = false) {
    if (scanningRef.current) return;

    scanningRef.current = true;
    setScanned(true);

    try {
      const username = fromQR
        ? parseCarryQR(value)
        : String(value).trim().replace(/^@/, "");

      if (!username || !/^[a-zA-Z0-9_.-]{3,40}$/.test(username)) {
        throw new Error(
          fromQR
            ? "This is not a supported Carry wallet QR code."
            : "Enter a valid Carry username.",
        );
      }

      const recipient = await findUserByUsername(username);
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        throw new Error("Please log in first.");
      }

      if (!recipient) {
        throw new Error("This Carry account is not registered on this device.");
      }

      if (
        String(recipient.id) === String(currentUser.id) ||
        recipient.username.toLowerCase() === currentUser.username.toLowerCase()
      ) {
        throw new Error("You cannot send money to yourself.");
      }

      // SEND RECIPIENT TO EXISTING SEND MONEY SCREEN
      router.replace({
        pathname: "/send-money",
        params: {
          recipient: recipient.username,
        },
      });
    } catch (error) {
      Alert.alert(
        "Unable to Continue",
        error.message || "Invalid wallet information.",
        [
          {
            text: "Try Again",
            onPress: () => {
              scanningRef.current = false;
              setScanned(false);
            },
          },
        ],
      );
    }
  }

  function handleScan(result) {
    openRecipient(result.data, true);
  }

  function handleManual() {
    openRecipient(manualId, false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.title}>Scan to Pay</Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* INTRO */}
        <View style={styles.intro}>
          <View style={styles.iconCircle}>
            <Ionicons name="scan-outline" size={32} color={colors.primary} />
          </View>

          <Text style={styles.heading}>Scan a Carry QR Code</Text>

          <Text style={styles.subtitle}>
            Scan another user's Carry QR code to prepare a demo payment.
          </Text>
        </View>

        {/* CAMERA */}
        <View style={styles.cameraContainer}>
          {!permission ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : !permission.granted ? (
            <View style={styles.permissionBox}>
              <Ionicons
                name="camera-outline"
                size={38}
                color={colors.primary}
              />

              <Text style={styles.permissionText}>
                Camera permission is needed to scan wallet QR codes.
              </Text>

              <Pressable
                onPress={requestPermission}
                style={styles.permissionButton}
              >
                <Text style={styles.permissionButtonText}>Allow Camera</Text>
              </Pressable>
            </View>
          ) : (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scanned ? undefined : handleScan}
            />
          )}

          {/* SCANNER FRAME */}
          {permission?.granted && (
            <View pointerEvents="none" style={styles.scanFrame}>
              <Ionicons name="scan-outline" size={170} color={colors.primary} />
            </View>
          )}
        </View>

        <Text style={styles.scanHint}>
          Position the QR code inside the frame.
        </Text>

        {/* MANUAL ENTRY */}
        <View style={styles.manualSection}>
          <Text style={styles.sectionTitle}>Or enter a Wallet ID</Text>

          <Text style={styles.helper}>
            Useful when testing with your Android emulator.
          </Text>

          <View style={styles.inputBox}>
            <Ionicons name="at-outline" size={22} color={colors.primary} />

            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              value={manualId}
              onChangeText={setManualId}
            />
          </View>

          <View style={styles.buttonArea}>
            <CarryButton
              title="Continue to Payment"
              onPress={handleManual}
              disabled={scanned}
              showArrow
            />
          </View>
        </View>

        <Text style={styles.disclaimer}>
          Carry Demo Mode — This scanner does not process real payments.
        </Text>
      </ScrollView>
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
    padding: 20,
  },

  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  intro: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },

  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 17,
  },

  subtitle: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  cameraContainer: {
    height: 285,
    borderRadius: 22,
    backgroundColor: colors.surface,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  scanFrame: {
    position: "absolute",
    alignSelf: "center",
  },

  permissionBox: {
    padding: 20,
    alignItems: "center",
    gap: 15,
  },

  permissionText: {
    color: colors.muted,
    textAlign: "center",
    lineHeight: 21,
  },

  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  permissionButtonText: {
    color: colors.background,
    fontWeight: "700",
  },

  scanHint: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 12,
    marginTop: 15,
  },

  manualSection: {
    marginTop: 30,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },

  helper: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 7,
    marginBottom: 18,
  },

  inputBox: {
    minHeight: 58,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 12,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  buttonArea: {
    marginTop: 18,
  },

  disclaimer: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 28,
  },
});
