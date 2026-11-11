import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthInput from "../components/AuthInput";
import CarryButton from "../components/CarryButton";

import { carryColors as colors } from "../constants/theme";

import {
    getCurrentUser,
    updateCurrentUserProfile,
} from "../services/authStorage";

const initialForm = {
  firstname: "",
  lastname: "",
  email: "",
  contactNumber: "",
};

export default function EditProfileScreen() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // LOAD SAVED USER INFORMATION
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          Alert.alert("Session Expired", "Please log in again.", [
            {
              text: "Log In",
              onPress: () => router.replace("/login"),
            },
          ]);
          return;
        }

        if (active) {
          setUsername(user.username || "");

          setForm({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email || "",
            contactNumber: user.contactNumber || "",
          });
        }
      } catch (error) {
        Alert.alert("Error", "Unable to load your account information.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  // UPDATE INPUT VALUE
  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // SAVE UPDATED INFORMATION
  async function handleSave() {
    if (saving || loading) return;

    setSaving(true);

    try {
      await updateCurrentUserProfile(form);

      Alert.alert(
        "Profile Updated",
        "Your Carry personal information has been saved.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error.message || "Unable to save your changes.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} disabled={saving}>
            <Ionicons name="arrow-back" size={25} color={colors.text} />
          </Pressable>

          <Text style={styles.headerTitle}>Edit Personal Information</Text>

          <View style={{ width: 25 }} />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {/* PROFILE ICON */}
            <View style={styles.avatar}>
              <Ionicons
                name="person-outline"
                size={42}
                color={colors.primary}
              />
            </View>

            <Text style={styles.title}>Update Your Profile</Text>

            <Text style={styles.subtitle}>
              Keep your Carry account information up to date.
            </Text>

            {/* FIRST NAME */}
            <AuthInput
              label="First Name"
              placeholder="Enter your first name"
              icon="person-outline"
              value={form.firstname}
              onChangeText={(value) => updateField("firstname", value)}
              autoCapitalize="words"
              editable={!saving}
            />

            {/* LAST NAME */}
            <AuthInput
              label="Last Name"
              placeholder="Enter your last name"
              icon="person-outline"
              value={form.lastname}
              onChangeText={(value) => updateField("lastname", value)}
              autoCapitalize="words"
              editable={!saving}
            />

            {/* USERNAME - READ ONLY */}
            <Text style={styles.label}>Username</Text>

            <View style={styles.readOnlyBox}>
              <Ionicons name="at-outline" size={20} color={colors.muted} />

              <Text style={styles.readOnlyText}>@{username}</Text>

              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.muted}
              />
            </View>

            <Text style={styles.helper}>
              Your wallet username cannot be changed yet.
            </Text>

            {/* EMAIL */}
            <AuthInput
              label="Email Address"
              placeholder="Enter your email"
              icon="mail-outline"
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!saving}
            />

            {/* PHONE */}
            <AuthInput
              label="Phone Number"
              placeholder="09XXXXXXXXX"
              icon="call-outline"
              value={form.contactNumber}
              onChangeText={(value) => updateField("contactNumber", value)}
              keyboardType="phone-pad"
              editable={!saving}
            />

            {/* SAVE */}
            <View style={styles.buttonArea}>
              <CarryButton
                title={saving ? "Saving..." : "Save Changes"}
                onPress={handleSave}
                disabled={saving}
              />
            </View>

            <Text style={styles.disclaimer}>
              Demo account information is stored locally on this device.
            </Text>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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
    gap: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 45,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  avatar: {
    alignSelf: "center",
    height: 86,
    width: 86,
    borderRadius: 43,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 9,
    marginBottom: 35,
  },

  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  readOnlyBox: {
    minHeight: 56,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 12,
  },

  readOnlyText: {
    color: colors.muted,
    fontSize: 15,
    flex: 1,
  },

  helper: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 8,
    marginBottom: 20,
  },

  buttonArea: {
    marginTop: 24,
  },

  disclaimer: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 25,
  },
});
