import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import { carryColors as colors } from "../../constants/theme";
import { getCurrentUser } from "../../services/authStorage";

// PROFILE SECTIONS
const sections = {
  "personal-information": {
    title: "Personal Information",
    icon: "person-outline",
    description: "View and manage your Carry account details.",
  },

  limits: {
    title: "Account Limits",
    icon: "speedometer-outline",
    description: "View your wallet transaction limits.",
  },

  security: {
    title: "Security",
    icon: "shield-checkmark-outline",
    description: "Manage your account security settings.",
  },

  settings: {
    title: "Settings",
    icon: "settings-outline",
    description: "Manage your account preferences.",
  },

  notifications: {
    title: "Notifications",
    icon: "notifications-outline",
    description: "Manage your notification preferences.",
  },

  "linked-accounts": {
    title: "Linked Accounts & Cards",
    icon: "card-outline",
    description: "Manage connected payment methods.",
  },

  help: {
    title: "Help & Support",
    icon: "help-circle-outline",
    description: "Get help with your Carry account.",
  },

  terms: {
    title: "Terms and Conditions",
    icon: "document-text-outline",
    description: "View Carry's terms and conditions.",
  },

  about: {
    title: "About Carry",
    icon: "information-circle-outline",
    description: "Carry — Your Wallet, Everywhere.",
  },
};

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const sectionId = Array.isArray(section) ? section[0] : section;

  const currentSection = sections[sectionId] || {
    title: "Profile Details",
    icon: "information-circle-outline",
    description: "Section not found.",
  };

  const isPersonal = sectionId === "personal-information";

  // REFRESH USER INFORMATION WHEN SCREEN OPENS
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadUser() {
        try {
          setLoading(true);

          const currentUser = await getCurrentUser();

          if (active) {
            setUser(currentUser);
          }
        } catch (error) {
          console.warn("Unable to load profile:", error);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadUser();

      return () => {
        active = false;
      };
    }, []),
  );

  // REGISTERED USER INFORMATION
  const fullName = [user?.firstname, user?.lastname].filter(Boolean).join(" ");

  const personalInfo = [
    {
      label: "Full Name",
      value: fullName || "Not provided",
    },
    {
      label: "Username",
      value: user?.username ? `@${user.username}` : "Not provided",
    },
    {
      label: "Email Address",
      value: user?.email || "Not provided",
    },
    {
      label: "Phone Number",
      value: user?.contactNumber || "Not provided",
    },
    {
      label: "Account Type",
      value: "Carry Demo Wallet",
    },
  ];

  // OTHER PROFILE INFORMATION
  const otherDetails = {
    limits: [
      { label: "Account Type", value: "Demo Wallet" },
      { label: "Daily Limit", value: "Not configured" },
      { label: "Monthly Limit", value: "Not configured" },
    ],

    security: [
      { label: "PIN Protection", value: "Not configured" },
      { label: "Biometric Login", value: "Not available yet" },
    ],

    settings: [
      { label: "App Theme", value: "Premium Dark" },
      { label: "Currency", value: "Philippine Peso (PHP)" },
    ],

    notifications: [
      { label: "Push Notifications", value: "Not enabled" },
      { label: "Transaction Alerts", value: "Not configured" },
    ],

    "linked-accounts": [
      { label: "Bank Accounts", value: "None connected" },
      { label: "Linked Cards", value: "None connected" },
    ],

    help: [
      { label: "Help Center", value: "Coming soon" },
      { label: "Customer Support", value: "Not configured" },
    ],

    about: [
      { label: "Application", value: "Carry E-Wallet" },
      { label: "Version", value: "1.0.0" },
      { label: "Mode", value: "Demo Application" },
    ],
  };

  const details = isPersonal ? personalInfo : otherDetails[sectionId] || [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentSection.title}
        </Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* SECTION ICON */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={currentSection.icon}
            size={38}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>{currentSection.title}</Text>

        <Text style={styles.description}>{currentSection.description}</Text>

        {/* DETAILS CARD */}
        <View style={styles.detailsCard}>
          {loading ? (
            <Text style={styles.loading}>Loading information...</Text>
          ) : (
            details.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.detailRow,
                  index < details.length - 1 && styles.divider,
                ]}
              >
                <Text style={styles.label}>{item.label}</Text>

                <Text style={styles.value}>{item.value}</Text>
              </View>
            ))
          )}

          {!loading && details.length === 0 && (
            <Text style={styles.loading}>
              No additional information available.
            </Text>
          )}
        </View>

        {/* EDIT PERSONAL INFORMATION */}
        {isPersonal && (
          <Pressable
            style={styles.editButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.background}
            />

            <Text style={styles.editButtonText}>Edit Personal Information</Text>
          </Pressable>
        )}

        {/* FOOTER */}
        <Text style={styles.footer}>
          {isPersonal
            ? "Your account details are stored locally on this device."
            : "Some features are not yet available in this demo."}
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
    gap: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 40,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },

  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  detailsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 20,
  },

  detailRow: {
    paddingVertical: 18,
    gap: 8,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  label: {
    color: colors.muted,
    fontSize: 12,
  },

  value: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  loading: {
    color: colors.muted,
    textAlign: "center",
    paddingVertical: 25,
  },

  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    minHeight: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 25,
  },

  editButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 28,
  },
});
