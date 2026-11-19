import { useCallback, useRef, useState } from "react";
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
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";

// Carry QR format: carry:wallet:username
function usernameFromCarryQR(rawData) {
  const data = String(rawData || "").trim();
  const prefix = "carry:wallet:";

  if (!data.toLowerCase().startsWith(prefix)) {
    return null;
  }

  const username = data.slice(prefix.length).trim();

  return /^[a-zA-Z0-9._-]{1,40}$/.test(username) ? username : null;
}

export default function ScanQRScreen() {
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [walletId, setWalletId] = useState("");
  const [scanned, setScanned] = useState(false);
  const [picking, setPicking] = useState(false);

  const scanLockedRef = useRef(false);

  // RESET SCANNER WHEN RETURNING TO THE SCREEN
  useFocusEffect(
    useCallback(() => {
      scanLockedRef.current = false;
      setScanned(false);

      return () => {
        scanLockedRef.current = true;
      };
    }, []),
  );

  // OPEN SEND MONEY WITH THE RECIPIENT
  function continueToPayment(username) {
    router.push({
      pathname: "/send-money",
      params: {
        recipient: username,
      },
    });
  }

  function resetScanner() {
    scanLockedRef.current = false;
    setScanned(false);
  }

  // LIVE CAMERA QR SCANNER
  function handleLiveScan({ data }) {
    if (scanLockedRef.current || picking) return;

    scanLockedRef.current = true;
    setScanned(true);

    const username = usernameFromCarryQR(data);

    if (!username) {
      Alert.alert("Invalid Carry QR", "This is not a Carry wallet QR code.", [
        {
          text: "Scan Again",
          onPress: resetScanner,
        },
      ]);
      return;
    }

    continueToPayment(username);
  }

  // UPLOAD QR FROM GALLERY
  async function pickQRFromGallery() {
    if (picking) return;

    setPicking(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      // READ QR DATA FROM THE SELECTED IMAGE
      const imageUri = result.assets[0].uri;

      const foundCodes = await Camera.scanFromURLAsync(imageUri, ["qr"]);

      const username = foundCodes
        .map((code) => usernameFromCarryQR(code.data))
        .find(Boolean);

      if (!username) {
        Alert.alert(
          "QR Not Found",
          "No valid Carry wallet QR was detected. Try a clearer image and crop closely around the QR code.",
        );
        return;
      }

      // CONTINUE TO SEND MONEY
      continueToPayment(username);
    } catch (error) {
      console.warn("Gallery QR scan failed:", error);

      Alert.alert(
        "Unable to Read QR",
        "Try another QR image or enter the Wallet ID manually.",
      );
    } finally {
      setPicking(false);
    }
  }

  // MANUAL WALLET ID
  function handleManualContinue() {
    const username = walletId.trim().replace(/^@/, "");

    if (!/^[a-zA-Z0-9._-]{1,40}$/.test(username)) {
      Alert.alert(
        "Invalid Wallet ID",
        "Enter a valid Carry username, such as @verallo21.",
      );
      return;
    }

    continueToPayment(username);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={25} color={colors.text} />
          </Pressable>

          <Text style={styles.headerTitle}>Scan to Pay</Text>

          <View style={{ width: 25 }} />
        </View>

        {/* TITLE - SMALL SCAN ICON REMOVED */}
        <Text style={styles.title}>Scan a Carry QR Code</Text>

        <Text style={styles.subtitle}>
          Scan another user's Carry QR code or choose a saved QR image.
        </Text>

        {/* CAMERA SCANNER */}
        <View style={styles.cameraFrame}>
          {permission?.granted && !picking ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={scanned ? undefined : handleLiveScan}
              onMountError={(event) => console.warn("Camera:", event.message)}
            />
          ) : (
            <View style={styles.cameraFallback}>
              <Ionicons
                name="camera-outline"
                size={34}
                color={colors.primary}
              />

              <Text style={styles.cameraText}>
                {picking
                  ? "Opening your gallery..."
                  : "Allow camera access to scan QR codes live."}
              </Text>

              {!permission?.granted && !picking && (
                <Pressable
                  style={styles.permissionButton}
                  onPress={requestPermission}
                >
                  <Text style={styles.permissionText}>Enable Camera</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* SCANNING FRAME */}
          {permission?.granted && !picking && (
            <View pointerEvents="none" style={styles.scanOverlay}>
              <Ionicons name="scan-outline" size={140} color={colors.primary} />
            </View>
          )}
        </View>

        <Text style={styles.hint}>Position the QR code inside the frame.</Text>

        {/* NEW: UPLOAD QR FROM GALLERY */}
        <Pressable
          style={[styles.galleryButton, picking && styles.disabled]}
          onPress={pickQRFromGallery}
          disabled={picking}
        >
          {picking ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Ionicons name="images-outline" size={21} color={colors.primary} />
          )}

          <Text style={styles.galleryText}>
            {picking ? "Reading QR Image..." : "Upload QR from Gallery"}
          </Text>
        </Pressable>

        {/* MANUAL WALLET ID */}
        <Text style={styles.manualTitle}>Or enter a Wallet ID</Text>

        <Text style={styles.manualSubtitle}>
          Useful when testing with your Android emulator.
        </Text>

        <View style={styles.inputRow}>
          <Ionicons name="at-outline" size={21} color={colors.primary} />

          <TextInput
            value={walletId}
            onChangeText={setWalletId}
            style={styles.input}
            placeholder="@username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* CONTINUE BUTTON */}
        <Pressable style={styles.continueButton} onPress={handleManualContinue}>
          <Text style={styles.continueText}>Continue to Payment</Text>

          <Ionicons name="arrow-forward" size={20} color={colors.background} />
        </Pressable>

        <Text style={styles.disclaimer}>
          Carry QR payments are demo transfers. No real money is sent.
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

  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 28,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 4,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 24,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  cameraFrame: {
    height: 260,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 19,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  cameraFallback: {
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 12,
  },

  cameraText: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 12,
  },

  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.card,
  },

  permissionText: {
    color: colors.primary,
    fontWeight: "700",
  },

  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },

  hint: {
    color: colors.muted,
    textAlign: "center",
    fontSize: 11,
    marginTop: 11,
    marginBottom: 16,
  },

  galleryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  galleryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  disabled: {
    opacity: 0.6,
  },

  manualTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 29,
  },

  manualSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 8,
    marginBottom: 15,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 15,
    minHeight: 55,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },

  continueButton: {
    minHeight: 54,
    borderRadius: 13,
    marginTop: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  continueText: {
    color: colors.background,
    fontWeight: "800",
    fontSize: 14,
  },

  disclaimer: {
    marginTop: 17,
    textAlign: "center",
    fontSize: 11,
    lineHeight: 18,
    color: colors.muted,
  },
});
