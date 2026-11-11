import { useCallback, useState } from "react";
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

import BottomTabs from "../components/BottomTabs";
import ProfileMenuItem from "../components/ProfileMenuItem";

import { PROFILE_MENU } from "../constants/profileMenu";
import { carryColors as colors } from "../constants/theme";

import { getCurrentUser, logoutUser } from "../services/authStorage";

import { useWallet } from "../contexts/WalletContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { refreshWallet } = useWallet();

  const [user, setUser] = useState(null);

  // LOAD REGISTERED ACCOUNT DETAILS
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadProfile() {
        try {
          const current = await getCurrentUser();

          if (active) {
            setUser(current);
          }
        } catch (error) {
          console.warn("Failed to load profile:", error);
        }
      }

      loadProfile();

      return () => {
        active = false;
      };
    }, []),
  );

  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ");

  const displayName = fullName || user?.username || "Carry User";

  const username = user?.username ? `@${user.username}` : "No account";

  const initial = displayName.charAt(0).toUpperCase();

  // OPEN PROFILE DETAILS

  function openSection(section) {
    if (section === "app-settings") {
      router.push("/app-settings");
      return;
    }

    router.push({
      pathname: "/profile-details/[section]",
      params: { section },
    });
  }

  // LOG OUT OF CARRY
  function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out of Carry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();

            // Clear the previous user's wallet state.
            await refreshWallet();

            router.replace("/");
          } catch (error) {
            Alert.alert(
              "Logout Failed",
              "Unable to log out. Please try again.",
            );
          }
        },
      },
    ]);
  }

  // BOTTOM NAVIGATION
  function handleNavigation(tab) {
    switch (tab) {
      case "home":
        router.replace("/home");
        break;

      case "history":
        router.replace("/transactions");
        break;

      case "scan":
        router.push("/scan-qr");
        break;

      case "profile":
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/home")}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Profile & Settings</Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* PROFILE CARD */}
        <Pressable
          style={styles.profileCard}
          onPress={() => openSection("personal-information")}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>

            <Text style={styles.username}>{username}</Text>

            <Text style={styles.accountStatus}>Demo Account</Text>
          </View>

          <Ionicons name="chevron-forward" color={colors.muted} size={20} />
        </Pressable>

        {/* ACCOUNT MENU */}
        <Text style={styles.sectionLabel}>ACCOUNT & SETTINGS</Text>

        <View style={styles.menuCard}>
          {PROFILE_MENU.map((item, index) => (
            <ProfileMenuItem
              key={item.id}
              item={item}
              last={index === PROFILE_MENU.length - 1}
              onPress={() => openSection(item.id)}
            />
          ))}
        </View>

        {/* LOGOUT */}
        <Pressable
          onPress={handleLogout}
          style={styles.logoutButton}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={22} color="#FF707B" />

          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Carry v1.0.0 — Demo App</Text>
      </ScrollView>

      <BottomTabs active="profile" onNavigate={handleNavigation} />
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
    paddingVertical: 17,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 35,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 17,
    gap: 13,
    marginBottom: 30,
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#176348",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
  },

  profileInfo: {
    flex: 1,
    gap: 5,
  },

  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  username: {
    color: colors.muted,
    fontSize: 13,
  },

  accountStatus: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },

  sectionLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 14,
  },

  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 19,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#6B3438",
    borderRadius: 15,
    minHeight: 57,
    marginTop: 28,
  },

  logoutText: {
    color: "#FF707B",
    fontSize: 16,
    fontWeight: "700",
  },

  version: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 25,
  },
});
