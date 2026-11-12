
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";

const FEATURES = [
  {
    icon: "wallet-outline",
    title: "Digital Wallet",
    description: "Manage your simulated wallet balance.",
  },
  {
    icon: "swap-horizontal-outline",
    title: "Money Transfers",
    description: "Send and receive money between local demo accounts.",
  },
  {
    icon: "qr-code-outline",
    title: "QR Transactions",
    description: "Share or scan Carry wallet QR codes.",
  },
  {
    icon: "receipt-outline",
    title: "Transaction History",
    description: "Review your saved demo transactions and receipts.",
  },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>About Carry</Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* APP BRANDING */}
        <View style={styles.logoBox}>
          <Ionicons name="wallet-outline" size={48} color={colors.primary} />
        </View>

        <Text style={styles.appName}>Carry</Text>

        <Text style={styles.tagline}>Your Wallet, Everywhere.</Text>

        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>Demo Application</Text>
        </View>

        {/* ABOUT DESCRIPTION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About the App</Text>

          <Text style={styles.description}>
            Carry is a demonstration e-wallet application developed using React
            Native and Expo.
            {"\n\n"}
            It allows users to explore common digital wallet features in a
            simulated environment.
            {"\n\n"}
            Carry is intended for learning, development, and testing purposes.
          </Text>
        </View>

        {/* FEATURES */}
        <Text style={styles.sectionTitle}>APP FEATURES</Text>

        <View style={styles.card}>
          {FEATURES.map((feature, index) => (
            <View
              key={feature.title}
              style={[
                styles.featureRow,
                index < FEATURES.length - 1 && styles.featureDivider,
              ]}
            >
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon}
                  size={23}
                  color={colors.primary}
                />
              </View>

              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>

                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* TECHNOLOGY */}
        <Text style={styles.sectionTitle}>APPLICATION INFORMATION</Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Application</Text>
            <Text style={styles.infoValue}>Carry E-Wallet</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Framework</Text>
            <Text style={styles.infoValue}>React Native / Expo</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Type</Text>
            <Text style={styles.infoValue}>Local Demo</Text>
          </View>
        </View>

        {/* DISCLAIMER */}
        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={colors.primary}
          />

          <Text style={styles.noticeText}>
            Carry does not process real payments or connect to actual bank
            accounts. All wallet transactions are simulated.
          </Text>
        </View>

        <Text style={styles.footer}>Carry — Your Wallet, Everywhere.</Text>
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
    paddingTop: 25,
    paddingBottom: 45,
  },

  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  appName: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 18,
  },

  tagline: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },

  versionBadge: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignSelf: "center",
    marginTop: 18,
    marginBottom: 28,
  },

  versionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 19,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 13,
  },

  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 22,
  },

  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 27,
    marginBottom: 14,
  },

  featureRow: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 15,
  },

  featureDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  featureIcon: {
    backgroundColor: colors.card,
    width: 43,
    height: 43,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    flex: 1,
  },

  featureTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  featureDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    gap: 14,
  },

  infoLabel: {
    color: colors.muted,
    fontSize: 12,
  },

  infoValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },

  notice: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 17,
    gap: 12,
    marginTop: 25,
  },

  noticeText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
    flex: 1,
  },

  footer: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 30,
  },
});
