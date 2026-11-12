import { useState } from "react";

import {
    Alert,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";

// FREQUENTLY ASKED QUESTIONS
const FAQs = [
  {
    question: "How do I add money?",
    answer:
      "Open Home, tap Add Money, enter an amount, and confirm. This adds demo money to your local Carry wallet.",
  },
  {
    question: "How do I send money?",
    answer:
      "Tap Send on Home. Enter the username of another registered Carry demo account, provide an amount, and confirm the transfer.",
  },
  {
    question: "How do I receive money?",
    answer:
      "Open Receive Money to view your wallet ID and QR code. Another registered demo user can use your username to send money.",
  },
  {
    question: "Where can I see my transactions?",
    answer:
      "Open History from the bottom navigation. Tap any transaction to view its demo receipt.",
  },
  {
    question: "How can I change my password?",
    answer:
      "Open Profile, select Security, then enter your current password and a new password.",
  },
  {
    question: "Is Carry connected to a real bank?",
    answer:
      "No. Carry is a demonstration e-wallet. Its balances and transactions are simulated using local device storage.",
  },
  {
    question: "Can I use my account on another device?",
    answer:
      "Not with the current demo version. Accounts are stored locally and are not synchronized across devices.",
  },
];

export default function HelpScreen() {
  const router = useRouter();

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [issue, setIssue] = useState("");
  const [sharing, setSharing] = useState(false);

  function toggleFAQ(index) {
    setExpandedIndex((current) => (current === index ? null : index));
  }

  // SHARE ISSUE REPORT USING ANDROID SHARING
  async function shareIssue() {
    if (!issue.trim()) {
      Alert.alert("Missing Description", "Please describe the issue first.");
      return;
    }

    setSharing(true);

    try {
      await Share.share({
        message: [
          "CARRY - DEMO APP ISSUE REPORT",
          "",
          "Issue Description:",
          issue.trim(),
          "",
          "Application: Carry E-Wallet",
          "Platform: React Native / Expo",
        ].join("\n"),
      });
    } catch (error) {
      Alert.alert("Unable to Share", "Please try sharing the report again.");
    } finally {
      setSharing(false);
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

        <Text style={styles.headerTitle}>Help & Support</Text>

        <View style={{ width: 25 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* HELP INTRODUCTION */}
        <View style={styles.iconBox}>
          <Ionicons
            name="help-circle-outline"
            size={43}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>How Can We Help?</Text>

        <Text style={styles.description}>
          Find answers to common questions about using Carry.
        </Text>

        {/* FAQ SECTION */}
        <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>

        {FAQs.map((item, index) => {
          const expanded = expandedIndex === index;

          return (
            <View key={index} style={styles.faqCard}>
              <Pressable
                onPress={() => toggleFAQ(index)}
                style={styles.faqHeader}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
              >
                <Text style={styles.question}>{item.question}</Text>

                <Ionicons
                  name={expanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.primary}
                />
              </Pressable>

              {expanded && (
                <View style={styles.answerArea}>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* REPORT ISSUE SECTION */}
        <Text style={styles.sectionTitle}>REPORT AN ISSUE</Text>

        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={23}
              color={colors.primary}
            />

            <Text style={styles.reportTitle}>Describe Your Problem</Text>
          </View>

          <Text style={styles.reportDescription}>
            Tell us what happened while using Carry. You can share this report
            through another app.
          </Text>

          <TextInput
            style={styles.input}
            multiline
            textAlignVertical="top"
            placeholder="Describe the issue here..."
            placeholderTextColor={colors.muted}
            value={issue}
            onChangeText={setIssue}
            maxLength={1000}
          />

          <Text style={styles.characterCount}>{issue.length}/1000</Text>

          <Pressable
            style={[styles.shareButton, sharing && { opacity: 0.5 }]}
            onPress={shareIssue}
            disabled={sharing}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={colors.background}
            />

            <Text style={styles.shareButtonText}>Share Issue Report</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Carry is a student demonstration project. Sharing a report does not
          automatically submit it to a support server. Do not include passwords
          or PINs.
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
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 45,
  },

  iconBox: {
    height: 82,
    width: 82,
    borderRadius: 25,
    backgroundColor: colors.card,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
  },

  description: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 30,
  },

  sectionTitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 14,
  },

  faqCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    marginBottom: 12,
    overflow: "hidden",
  },

  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 17,
    gap: 12,
  },

  question: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },

  answerArea: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 17,
    paddingTop: 12,
  },

  answer: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
  },

  reportCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 19,
  },

  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  reportTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  reportDescription: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 18,
  },

  input: {
    minHeight: 130,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    padding: 14,
    color: colors.text,
    fontSize: 13,
  },

  characterCount: {
    textAlign: "right",
    color: colors.muted,
    fontSize: 11,
    marginTop: 8,
  },

  shareButton: {
    backgroundColor: colors.primary,
    borderRadius: 13,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 18,
  },

  shareButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: "700",
  },

  footer: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 24,
  },
});
