import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCurrentUser } from "../services/authStorage";

import {
    loadPreferences,
    savePreferences,
} from "../services/preferencesStorage";

import { carryColors as colors } from "../constants/theme";

export default function AppSettingsScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [hideBalance, setHideBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD THE USER'S SAVED SETTINGS
  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const id = String(user.id || user.username);
        const preferences = await loadPreferences(id);

        if (active) {
          setUserId(id);
          setHideBalance(preferences.hideBalance);
        }
      } catch (error) {
        Alert.alert("Error", "Unable to load app settings.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, [router]);

  // SAVE THE PRIVACY PREFERENCE
  async function handleToggle(value) {
    if (saving || !userId) return;

    const previousValue = hideBalance;

    setHideBalance(value);
    setSaving(true);

    try {
      await savePreferences(userId, {
        hideBalance: value,
      });
    } catch (error) {
      setHideBalance(previousValue);

      Alert.alert("Unable to Save", "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>App Settings</Text>

        <View style={{ width: 25 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>PRIVACY</Text>

          {/* BALANCE VISIBILITY */}
          <View style={styles.settingCard}>
            <View style={styles.iconBox}>
              <Ionicons
                name="eye-off-outline"
                size={24}
                color={colors.primary}
              />
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Hide Wallet Balance</Text>

              <Text style={styles.settingDescription}>
                Automatically hide your balance when opening the Home Screen.
              </Text>
            </View>

            <Switch
              value={hideBalance}
              onValueChange={handleToggle}
              disabled={saving}
              trackColor={{
                false: colors.border,
                true: colors.primaryDark,
              }}
              thumbColor={hideBalance ? colors.primary : "#D1D5DB"}
            />
          </View>

          {/* BALANCE PREVIEW */}
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Balance Preview</Text>

            <Text style={styles.previewBalance}>
              {hideBalance ? "₱••••••" : "₱12,500.00"}
            </Text>

            <Text style={styles.previewNote}>
              Example amount only. Your real demo balance is not changed.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={colors.primary}
            />

            <Text style={styles.infoText}>
              You can still show or hide your balance using the eye icon on
              Home.
            </Text>
          </View>
        </View>
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
    fontSize: 20,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },

  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
  },

  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  settingDescription: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 18,
    marginTop: 6,
  },

  previewCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    marginTop: 24,
  },

  previewLabel: {
    color: colors.muted,
    fontSize: 13,
  },

  previewBalance: {
    color: colors.primary,
    fontSize: 29,
    fontWeight: "800",
    marginTop: 12,
  },

  previewNote: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 12,
    lineHeight: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 25,
  },

  infoText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
    flex: 1,
  },
});
