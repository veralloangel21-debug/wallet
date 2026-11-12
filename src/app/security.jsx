import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";
import { useWallet } from "../contexts/WalletContext";
import { changeCurrentUserPassword, logoutUser } from "../services/authStorage";

// Keep this component OUTSIDE of SecurityScreen.
function PasswordField({ label, value, onChangeText, showPasswords }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={19} color={colors.muted} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={colors.muted}
          secureTextEntry={!showPasswords}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

export default function SecurityScreen() {
  const router = useRouter();
  const { refreshWallet } = useWallet();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Change the current demo account password.
  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Information", "Complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Password Mismatch", "The new passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Weak Password", "Use at least 8 characters.");
      return;
    }

    setSaving(true);
    try {
      await changeCurrentUserPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswords(false);
      Alert.alert("Password Updated", "Your Carry demo password was changed.");
    } catch (error) {
      Alert.alert(
        "Unable to Change Password",
        error?.message || "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Sign out, then return to Login.
  async function performLogout() {
    setSigningOut(true);
    try {
      await logoutUser();

      // Refresh the demo wallet state without blocking sign-out.
      try {
        await refreshWallet();
      } catch (refreshError) {
        console.warn("Unable to refresh wallet after sign-out:", refreshError);
      }

      router.replace("/login");
    } catch (error) {
      Alert.alert("Sign Out Failed", error?.message || "Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  function confirmLogout() {
    Alert.alert("Sign Out", "Sign out of your Carry account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: performLogout },
    ]);
  }

  const busy = saving || signingOut;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Account Security</Text>
        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroIcon}>
          <Ionicons
            name="shield-checkmark-outline"
            size={40}
            color={colors.primary}
          />
        </View>
        <Text style={styles.title}>Manage Your Account</Text>
        <Text style={styles.description}>
          Update your Carry demo account settings.
        </Text>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key-outline" size={22} color={colors.primary} />
            <Text style={styles.sectionTitle}>Change Password</Text>
          </View>

          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            showPasswords={showPasswords}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            showPasswords={showPasswords}
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPasswords={showPasswords}
          />

          <Pressable
            style={styles.showPasswordRow}
            onPress={() => setShowPasswords((previous) => !previous)}
          >
            <Ionicons
              name={showPasswords ? "eye-off-outline" : "eye-outline"}
              size={19}
              color={colors.primary}
            />
            <Text style={styles.showPasswordText}>
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.updateButton, busy && styles.disabled]}
            onPress={handleChangePassword}
            disabled={busy}
          >
            {saving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.background}
                />
                <Text style={styles.updateText}>Update Password</Text>
              </>
            )}
          </Pressable>
        </View>

        <Text style={styles.groupTitle}>MORE SECURITY OPTIONS</Text>
        <View style={styles.card}>
          <View style={styles.biometricRow}>
            <Ionicons
              name="finger-print-outline"
              size={24}
              color={colors.muted}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.biometricTitle}>Biometric Login</Text>
              <Text style={styles.biometricNote}>
                Not available in this demo
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={[styles.logoutButton, busy && styles.disabled]}
          onPress={confirmLogout}
          disabled={busy}
        >
          <Ionicons name="log-out-outline" size={21} color="#FF7777" />
          <Text style={styles.logoutText}>
            {signingOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          Carry is a demo e-wallet. Passwords stored in local AsyncStorage are
          not secure enough for a real financial application.
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
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 23,
    paddingTop: 20,
    paddingBottom: 45,
  },
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 25,
    backgroundColor: colors.card,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 28,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  field: {
    marginBottom: 18,
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 9,
  },
  inputRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.background,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  showPasswordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 20,
  },
  showPasswordText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  updateButton: {
    backgroundColor: colors.primary,
    minHeight: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  updateText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.6,
  },
  groupTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 30,
    marginBottom: 14,
  },
  biometricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  biometricTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  biometricNote: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 54,
    marginTop: 24,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#7F343C",
  },
  logoutText: {
    color: "#FF7777",
    fontSize: 15,
    fontWeight: "700",
  },
  footer: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 24,
  },
});
