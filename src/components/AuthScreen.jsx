import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { carryColors as colors } from "../constants/theme";

export default function AuthScreen({ title, subtitle, children }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={["#10281E", colors.background, colors.background]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* BACK BUTTON */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          {/* CARRY LOGO */}
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons
                name="wallet-outline"
                size={28}
                color={colors.primary}
              />
            </View>

            <Text style={styles.brandText}>
              Carry
              <Text style={styles.dot}>.</Text>
            </Text>
          </View>

          {/* SCREEN TITLE */}
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>{title}</Text>

            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* SCREEN FORM */}
          <View style={styles.form}>{children}</View>
        </ScrollView>
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

  content: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },

  backButton: {
    width: 45,
    height: 45,
    justifyContent: "center",
  },

  brand: {
    alignItems: "center",
    marginTop: 22,
  },

  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  brandText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
    marginTop: 10,
  },

  dot: {
    color: colors.primary,
  },

  headingContainer: {
    marginTop: 34,
    marginBottom: 30,
    alignItems: "center",
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
  },

  form: {
    width: "100%",
  },
});
