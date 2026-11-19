import {
  Image,
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

import { carryColors as colors } from "../constants/theme";

export default function AuthScreen({ title, subtitle, children }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

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
            <Image
              source={require("../../assets/carry-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
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
    backgroundColor: "#030908",
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
    marginTop: 18,
  },

  logoImage: {
    width: 220,
    height: 90,
  },

  headingContainer: {
    marginTop: 28,
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
    maxWidth: 300,
  },

  form: {
    width: "100%",
  },
});
